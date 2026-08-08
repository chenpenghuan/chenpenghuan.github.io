---
tags:
  - macOS
  - 工具
---
# macos

## app

```
adrive
applite
bilibili
charles
clash-verge-rev
douyin
drawio
font-maple-mono
font-maple-mono-nf
font-maple-mono-nf-cn
fsnotes
google-chrome
handbrake-app
iina
imageoptim
iterm2
jordanbaird-ice
keka
logseq
losslesscut
markedit
onyx
qq
rectangle
sequel-ace
snipaste
sourcetree
squirrel-app
switchhosts
tencent-lemon
tencent-meeting
thunder
wechat
zed
```

## alfred

[ip-address.alfredworkflow](/assets/files/ip-address.alfredworkflow)

[sourcetree.alfredworkflow](/assets/files/sourcetree.alfredworkflow)

[TerminalFinder.alfredworkflow](/assets/files/TerminalFinder.alfredworkflow)

## 截图

### qq截图

[QQ截图20260710_6.9.98-51102.dmg](https://www.dropbox.com/scl/fi/d8i5vx1syxbdeifffc5ui/QQ-20260710_6.9.98-51102.dmg?rlkey=4d7dnldzwucq94t9j0wsdn5ir&st=g50wdp5m&dl=0)

```
# 去除 macOS 的隔离标记，否则 Gatekeeper 会拒绝启动 ad-hoc 签名的 app
xattr -cr ~/Desktop/QQ\ ScreenCapture\ plugin.app

# 配置独立运行模式，否则检测不到 QQ 进程后 app 会自动退出
defaults write "$HOME/Library/Preferences/FN2V63AD2J.com.tencent.ScreenCapture3" settingkeyrunalone -bool YES
```

### flameshot

直接github下载或者homebrew安装

### snowshot

直接github下载或者homebrew安装

## sublime text 4200

### 注册

```bash
cd "/Applications/Sublime Text.app/Contents/MacOS/" || exit
md5 -q sublime_text | grep -i "B07FDB3A228A46DF1CC178FE60B64D3B" || exit
echo 01060C90: E0 03 1F AA C0 03 5F D6 | xxd -r - sublime_text
echo 00FEAD18: 1F 20 03 D5             | xxd -r - sublime_text
echo 00FEAD2C: 1F 20 03 D5             | xxd -r - sublime_text
echo 01061F28: C0 03 5F D6             | xxd -r - sublime_text
echo 01060908: C0 03 5F D6             | xxd -r - sublime_text
echo 00FE5780: C0 03 5F D6             | xxd -r - sublime_text

codesign --force --deep --sign - "/Applications/Sublime Text.app"
```

[Sublime_Text_4200.dmg](https://www.dropbox.com/scl/fi/kdp6ykupr6cjcgt3ovwha/Sublime_Text_4200.dmg?rlkey=qjxqbsyv62143sl94diqkd8ku&st=13dg0th8&dl=0)

### 插件

pretty json
rest client

## vscodium

```json
{
    "editor.fontSize": 16,
    "rest-client.enableTelemetry": false,
    "rest-client.previewOption": "exchange",
    "rest-client.environmentVariables": {
        "$shared": {},
        "dev":{
            "host":"http://127.0.0.1:8080"
        }
    },
    "diffEditor.renderSideBySide": false,
    "git.confirmSync": false,
    "git.autofetch": true,
    "markdown-editor.imageSaveFolder": "${projectRoot}/docs/assets/images"
}
```

## 开发工具

操作系统,最稳定版本推荐,选择逻辑
macOS 15 (Sequoia),2024.2.6,属于该系统生命周期内的“完全体”，Bug 最少，插件最稳。
macOS 26 (Tahoe),2024.3.7,属于针对新系统的“救火版”，修复了新系统特有的黑屏和卡顿。

## 屏蔽macOS更新

锁定最大系统版本

```bash
sudo defaults write /Library/Preferences/com.apple.SoftwareUpdate \
    TargetReleaseVersion -int 15
```

## mac自启动设置

以nginx为例

### 1.编辑启动配置文件

sudo vim /Library/LaunchDaemons/com.nginx.plist加入

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple Computer//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
        <key>Label</key>
        <string>com.nginx.plist</string>
        <key>ProgramArguments</key>
        <array>
                <string>/usr/local/nginx/sbin/nginx</string>
        </array>
        <key>KeepAlive</key>
        <false/>
        <key>RunAtLoad</key>
        <true/>
        <key>StandardErrorPath</key>
        <string>/usr/local/nginx/logs/error.log</string>
        <key>StandardOutPath</key>
        <string>/usr/local/nginx/logs/access.log</string>
</dict>
</plist>
```

### 2.修改权限

`sudo chmod 644 /Library/LaunchDaemons/com.nginx.plist`

### 3.注册为系统服务

sudo launchctl load -w /Library/LaunchDaemons/com.nginx.plist

卸载为sudo launchctl unload -w /Library/LaunchDaemons/com.nginx.plist

## 软件询问是否接入网络的解决办法

对于Mac下程序始终询问是否接入网络问题的解决办法

1. 关闭程序；
2. 修改防火墙，把相关程序从防火墙的白名单中删除；
3. 删除~/Library/Preferences/com.该程序名.plist文件。
   到次即可，重启程序后会新建相关文件并自动修改防火墙中相关内容，该问题已解决。

## homebrew

```
# show a list of all your installed Homebrew packages
brew list
# It will pin the formula to the current version
brew pin <formula>
```

### 换源

```
export HOMEBREW_BREW_GIT_REMOTE="https://mirrors.ustc.edu.cn/brew.git"
export HOMEBREW_CORE_GIT_REMOTE="https://mirrors.ustc.edu.cn/homebrew-core.git"
export HOMEBREW_BOTTLE_DOMAIN="https://mirrors.ustc.edu.cn/homebrew-bottles"
export HOMEBREW_API_DOMAIN="https://mirrors.ustc.edu.cn/homebrew-bottles/api"
```

## maven报错

`The JAVA_HOME environment variable is not defined correctly`

解决办法：

```
# On macOS 10.15 Catalina and later, the default Terminal shell is zsh. For the zsh shell, we can put the environment variables at ~/.zshenv or ~/.zshrc.
export JAVA_HOME=$(/usr/libexec/java_home)
# Before macOS 10.15 Catalina, the default Termina shell is bash. For the bash shell, we can put the environment variables at ~/.bash_profile or ~/.bashrc.
export JAVA_HOME=$(/usr/libexec/java_home)
```

## 飞塔vpn开源替代方案

安装openfortivpn

```
brew install openfortivpn
```

编辑config文件 `/usr/local/etc/openfortivpn/openfortivpn/config`

```
host = xxx
username = xxx
password = xxx
trusted-cert = xxx
```

登录vpn

```
sudo openfortivpn
```

## charles抓包配置

1. 安装charles
2. 电脑上安装证书 `help>SSL Proxying>Install Charles root Certificate`
3. 手机上安装证书 `help>SSL Proxying>install charles ...................browser`
4. 设置抓包域名点击proxy>SSL Proxying Settings打开如下弹框，勾选ssl代理开关，左侧inclide为需要抓取的代理，填写需要抓取https的host，port里填写443即可，也可以用\*号代替

> ios安装证书和安卓大致不差，只是比安卓多出了一步，在安装下载完证书时，需要认证：设置—>通用—> 关于本机—>证书信任设置，信任该证书后安装便可抓https请求了。

## 打包app

```shell

create-dmg \
  --volname "app名" \
  --window-pos 200 120 \
  --window-size 600 400 \
  --app-drop-link 450 200 \
  ~/Desktop/dmg名.dmg \
  ~/Desktop/app名.app
```

## next-ai-draw.io

### next-ai-draw.io ai配置

![next-ai-draw.io](/assets/images/next-draw-io-ai.png)

### next-ai-draw.io 代理配置

![next-ai-draw.io](/assets/images/next-draw-io-proxy.png)


## 新建文件

```applescript
on run {input, parameters}
	tell application "Finder"
		try
			-- 强制获取当前访达最前端窗口的文件夹路径（完美支持空白处右键）
			set currentPath to (folder of the front window) as alias
		on error
			-- 如果没有打开任何访达窗口（比如在纯桌面上），则定位到桌面
			set currentPath to (path to desktop folder) as alias
		end try
		
		-- 设置默认文件名
		set newFileName to "未命名.txt"
		set newFile to currentPath & newFileName as string
		
		-- 如果文件已存在，自动递增数字命名（如：未命名 1.txt）
		set i to 1
		repeat while (POSIX file newFile as string) exists
			set newFileName to "未命名 " & i & ".txt"
			set newFile to currentPath & newFileName as string
			set i to i + 1
		end repeat
		
		-- 在当前路径下创建新文件
		make new file at currentPath with properties {name:newFileName}
	end tell
	return input
end run
```
![新建文本文件.png](/assets/images/新建文件-快速操作.png)
[新建文本文件.workflow.zip](/assets/files/新建文本文件.workflow.zip)
