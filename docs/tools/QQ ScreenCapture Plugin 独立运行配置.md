# QQ ScreenCapture Plugin 独立运行配置指南

## 问题背景

`QQ ScreenCapture plugin.app` 是 QQ 的截图录屏插件，默认作为 QQ 的子进程运行。直接双击启动时有两个问题：

1. 录制开始时因缺少 `NSMicrophoneUsageDescription` 被 TCC 强制 SIGKILL
2. 检测不到 QQ 主进程后触发 `checkQQExist` 逻辑，3 次检测失败后自动退出

---

## 操作步骤

### 第一步：复制 app 到桌面

`/Applications` 目录受 SIP 保护，无法直接修改签名，需先复制出来。

```bash
cp -r "/Applications/QQ ScreenCapture plugin.app" ~/Desktop/
```

### 第二步：添加麦克风权限描述

```bash
sudo plutil -insert NSMicrophoneUsageDescription \
  -string "需要麦克风权限以在录屏时录制音频" \
  ~/Desktop/QQ\ ScreenCapture\ plugin.app/Contents/Info.plist
```

### 第三步：重签名（去掉 App Sandbox）

原签名包含 `com.apple.security.app-sandbox = true`，ad-hoc 重签名时必须显式设为 `false`，否则 macOS 会在 dyld 初始化阶段直接 SIGKILL。

分两步签，先签 Frameworks，再签主 bundle：

```bash
# 1. 签所有 framework 二进制
for fw in ~/Desktop/QQ\ ScreenCapture\ plugin.app/Contents/Frameworks/*.framework; do
    name=$(basename "$fw" .framework)
    codesign --force --sign - "$fw/Versions/A/$name"
done

# 2. 创建 entitlements 文件（sandbox = false）
cat > /tmp/entitlements_nosandbox.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>com.apple.security.app-sandbox</key>
    <false/>
    <key>com.apple.security.cs.allow-jit</key>
    <true/>
    <key>com.apple.security.device.audio-input</key>
    <true/>
    <key>com.apple.security.device.camera</key>
    <true/>
    <key>com.apple.security.files.downloads.read-write</key>
    <true/>
    <key>com.apple.security.files.user-selected.read-write</key>
    <true/>
    <key>com.apple.security.network.client</key>
    <true/>
    <key>com.apple.security.network.server</key>
    <true/>
</dict>
</plist>
EOF

# 3. 签主 bundle
```
codesign --force --sign - \
  --entitlements /tmp/entitlements_nosandbox.plist \
  ~/Desktop/QQ\ ScreenCapture\ plugin.app
```

### 第四步：去除隔离标记

```bash
xattr -cr ~/Desktop/QQ\ ScreenCapture\ plugin.app
```

### 第五步：配置独立运行模式

去掉 sandbox 后，app 读取的是 `~/Library/Preferences/` 而非沙盒容器，需要重新写入 runalone 配置：

```bash
defaults write "$HOME/Library/Preferences/FN2V63AD2J.com.tencent.ScreenCapture3" \
  settingkeyrunalone -bool YES
```

### 第六步：系统隐私权限

在「系统设置 → 隐私与安全性」中确认以下权限已授权给该 app：

- 屏幕录制
- 麦克风

### 第七步：启动

```bash
~/Desktop/QQ\ ScreenCapture\ plugin.app/Contents/MacOS/QQ\ ScreenCapture\ plugin
```

启动日志中出现 `run without QQ` 即为正常。

### 分发给他人使用

收到 app 后，对方需执行以下两条命令：

```bash
# 去除 macOS 的隔离标记，否则 Gatekeeper 会拒绝启动 ad-hoc 签名的 app
xattr -cr ~/Desktop/QQ\ ScreenCapture\ plugin.app

# 配置独立运行模式，否则检测不到 QQ 进程后 app 会自动退出
defaults write "$HOME/Library/Preferences/FN2V63AD2J.com.tencent.ScreenCapture3" settingkeyrunalone -bool YES
```

然后在「系统设置 → 隐私与安全性」中手动授权**屏幕录制**和**麦克风**权限。

---

### 可选
删除ocr按钮，因为ocr需要qq框架不可用
`QQ\ ScreenCapture\ plugin.app/Contents/Frameworks/JietuFramework.framework/Resources/ThemeResources/QQ-theme/themeConfigue.json`
```
# 修改W和H，直接改为0
#"JTToolbarFunctionButtonTypeOCR_frame" : {"X" : 410, "Y" : 10, "W" : 24, "H" : 24},
"JTToolbarFunctionButtonTypeOCR_frame" : {"X" : 410, "Y" : 10, "W" : 0, "H" : 0},
```

## 原因总结

| 现象 | 根因 |
|------|------|
| 双击闪退（录制瞬间）| Info.plist 缺少 `NSMicrophoneUsageDescription`，TCC 强制 kill |
| 修改 plist 后启动不了 | 修改破坏了代码签名，需要重签名 |
| 重签名后仍闪退 | ad-hoc 签名 + App Sandbox 在 macOS 15+ 启动时被拒绝 |
| 启动后自动退出 | `checkQQExist` 检测不到 QQ 主进程，`settingkeyrunalone` 未写入正确路径 |
| 终端启动正常但双击不行 | 终端继承 iTerm2 的 TCC 权限上下文，双击以独立 app 身份严格校验 |
