# macos输入法

## 原生输入法

终端输入法配置默认ABC

```shell
# 命令执行完回到提示符时自动切到 ABC 输入法
autoload -Uz add-zsh-hook
_switch_to_abc() { macism com.apple.keylayout.ABC }
add-zsh-hook precmd _switch_to_abc
```
## 鼠须管配置

### 只保留鼠须管输入法

```bash
# 读取配置
cp ~/Library/Preferences/com.apple.HIToolbox.plist ~/Desktop/HIToolbox_backup.plist
# 按索引删除配置项
sudo plutil -remove AppleEnabledInputSources.1 ~/Library/Preferences/com.apple.HIToolbox.plist
# 上锁
sudo chflags uchg ~/Library/Preferences/com.apple.HIToolbox.plist
```

最终配置文件内容

```bash
# defaults read com.apple.HIToolbox AppleEnabledInputSources
(
        {
        "Bundle ID" = "com.apple.inputmethod.SCIM";
        "Input Mode" = "com.apple.inputmethod.SCIM.ITABC";
        InputSourceKind = "Input Mode";
    },
        {
        "Bundle ID" = "com.apple.CharacterPaletteIM";
        InputSourceKind = "Non Keyboard Input Method";
    }
)
```

### 雾凇拼音

```yaml
# squirrel.custom.yaml
patch:
  # --- 1. 核心视觉逻辑 ---
  "style/color_scheme": macos_light           # 指定系统【浅色模式】下的皮肤方案
  "style/color_scheme_dark": macos_dark      # 指定系统【深色模式】下的皮肤方案（0.15+版本自动切换）
  "style/candidate_list_layout": linear      # 现代线性布局：相比 horizontal，间距控制更自然
  "style/font_face": "SF Pro, PingFang SC"   # 字体：SF Pro 渲染数字英文字符，平方渲染汉字，最强原生感
  "style/font_point": 24                     # 候选词字号大小
  "style/label_font_point": 15               # 序号字号大小：略小于候选词，视觉重心更突出

  # --- 2. 原生质感微调 ---
  "style/corner_radius": 10                  # 整个输入框的外圆角半径
  "style/hilited_corner_radius": 6           # 选中项（蓝色胶囊）的内圆角半径
  "style/hilited_padding": 4                 # 选中项文字与高亮背景块之间的留白（呼吸感关键）
  "style/border_height": 6                   # 输入框上下内边距
  "style/border_width": 10                   # 输入框左右内边距
  "style/line_spacing": 6                    # 多行候选时的行间距（linear布局下影响不大）
  "style/spacing": 12                        # 编码区（拼音）与候选词区之间的间距

  # --- 3. 皮肤方案具体定义 ---
  preset_color_schemes:
    # 浅色原生方案
    macos_light:
      name: "原生浅色"
      back_color: 0xF2F2F2                   # 背景色：BGR格式的浅灰色
      text_color: 0x424242                   # 输入码（拼音）颜色：深灰，区分于候选词
      candidate_text_color: 0x000000         # 候选项文字颜色：纯黑
      hilited_text_color: 0xFFFFFF           # 选中项文字颜色：纯白
      hilited_back_color: 0xD77800           # 选中项背景色：苹果标志性蓝色
      border_color: 0xFFFFFF                 # 边框颜色：白色边框在浅色下更有质感

    # 深色原生方案
    macos_dark:
      name: "原生深色"
      back_color: 0x2D2D2D                   # 背景色：深灰色
      text_color: 0x999999                   # 输入码（拼音）颜色：淡灰
      candidate_text_color: 0xFFFFFF         # 候选项文字颜色：纯白
      hilited_text_color: 0xFFFFFF           # 选中项文字颜色：纯白
      hilited_back_color: 0xD77800           # 选中项背景色：苹果蓝
      border_color: 0x000000                 # 边框颜色：纯黑，与深色模式融为一体
```

```yaml
# rime_ice.custom.yaml
__include: octagram   #启用语法模型
# 语法模型
octagram:
  __patch:
    grammar:
      language: wanxiang-lts-zh-hans
      collocation_max_length: 6
      collocation_min_length: 3
      collocation_penalty: -10
      non_collocation_penalty: -20
      weak_collocation_penalty: -45
      rear_penalty: -12
    translator/contextual_suggestions: false
    translator/max_homophones: 5
    translator/max_homographs: 5
```

### 薄荷拼音

```yaml
# squirrel.custom.yaml
patch:
  # --- 1. 核心交互行为 ---
  "style/inline_ascii": true                    # 输入框内直接预览英文，不弹状态栏
  "menu/page_size": 5                           # 候选词个数固定为 5 个


  # --- 2. 皮肤指定与系统级深浅跟随 ---
  "style/color_scheme": native                  # 浅色模式
  "style/color_scheme_dark": native             # 深色模式
  "style/app_color_schemes": { 暗黑模式: native, 默认: native }


  # --- 3. 字体与大小（对 native 依然生效） ---
  "style/font_face": "PingFang SC"              # native 主题下系统自动处理彩色 Emoji，无需留空
  "style/font_point": 24                        # 候选字大小
  "style/label_font_face": "PingFang SC"        # 序号字体
  "style/label_font_point": 18                  # 序号大小
  "style/comment_font_face": "PingFang SC"      # 提示/注音字体
  "style/comment_font_point": 16                # 提示/注音大小


  # --- 4. 拼音显示位置调整 ---
  "style/inline_preedit": false                 # 编码回落到候选框顶部
  "style/inline_candidate": false               # 候选项不嵌入输入框
  "style/ascii_composer_delay": 300             # 优化中英切换键延迟


  # --- 5. 应用特权过滤（进入以下 App 自动切纯英文） ---
  app_options:
    com.apple.Terminal:
      ascii_mode: true
    com.googlecode.iterm2:
      ascii_mode: true
    com.apple.dt.Xcode:
      ascii_mode: true
    com.runningwithcrayons.Alfred:
      ascii_mode: true

```

```yaml
# rime_mint.custom.yaml

schema_list:
  - schema: rime_mint            # 薄荷拼音
# =============================================================================
# Rime Squirrel Custom Configuration Patch
# Profile: 薄荷拼音 (rime_mint) 生产环境全功能定制补丁
# Features: Octagram 语义模型 / 动态造词网络 / 英文融合动态补全 / 误输词组清理
# =============================================================================


patch:
  # ---------------------------------------------------------------------------
  # 0. 基础交互与音节切分优化
  # ---------------------------------------------------------------------------
  "menu/page_size": 5                        # 限制每页候选词数量为 5，提升视线聚焦度
  "speller/delimiter": " '"                  # 用 ' 作为隔音符号（如 xi'an → 西安）
  "speller/algebra/+":
    - derive/v/u/                            # 音节容错追加：允许全拼/双拼模式下通过 u 输入 ü


  # ---------------------------------------------------------------------------
  # 1. 语言模型引擎 (Octagram Language Model)
  # 💡 启用前置条件：请确保 ~/Library/Rime/ 目录下存在二进制语料模型文件
  # ---------------------------------------------------------------------------
  "grammar/language": wanxiang-lts-zh-hans  # 挂载万象中文长期维护版语言模型
  "grammar/collocation_max_length": 6        # 算力内最优短语搭配最大切分长度
  "grammar/collocation_min_length": 3        # 短语搭配触发的最小字数阈值


  # ---------------------------------------------------------------------------
  # 2. 语义权重矩阵微调 (基于万象与雾凇语料库的最佳实践参数)
  # ---------------------------------------------------------------------------
  "grammar/collocation_penalty": -10         # 标准词语搭配惩罚系数
  "grammar/non_collocation_penalty": -20     # 非标准词语搭配惩罚系数
  "grammar/weak_collocation_penalty": -45    # 弱关联语义组合惩罚系数（防止弱特征长句霸屏）
  "grammar/rear_penalty": -12                # 逆向语序关联判定惩罚系数


  # ---------------------------------------------------------------------------
  # 3. 中文用户词典灵敏度与自适应造词策略
  # ---------------------------------------------------------------------------
  "translator/enable_sentence": true         # 开启整句输入，允许连续拼音匹配长句子
  "codeLengthLimit_processor": 50           # 最大输入码长度（默认 25 会在长句时卡住）
  "translator/initial_quality": 1000        # 中文核心翻译器基础权重评分
  "translator/user_dict_seed": 150          # 新录入用户词条的初始加权分值
  "translator/user_dict_threshold": 1       # 用户词典最低触发门槛（降低新词记忆周期）
  "translator/enable_encoder": true         # 开启 Rime 核心自适应造词记忆
  "translator/encode_commit_history": true  # 联动上屏历史，提取并固化高频词组
  "translator/max_phrase_length": 10        # 允许动态记忆并造出长词组的最大跨度
  "translator/contextual_suggestions": true # 激活上下文语义联想建议


  # ---------------------------------------------------------------------------
  # 4. 中英混输融合与英文动态补全引擎
  # ---------------------------------------------------------------------------
  "reduce_english_filter/mode": all          # 降频所有内置短英文干扰词，保留中文优先顺位


  # 调校说明：1.1 为中英平衡的极限甜点值。
  # 既保障了中文高频单字（如 da->大）的首选顺位，又赋予长英文前缀极强的越级补全能力。
  "melt_eng/initial_quality": 1.1           # 动态英文补全器权重（浮点倍率体系）
  "melt_eng/enable_completion": true         # 开启前缀动态匹配补全机制（如打 spri 自动联想 spring）
  "melt_eng/enable_sentence": false          # 禁用英文整句自动连缀，防止干扰中文语义长句
  "melt_eng/max_homophones": 7               # 同音/同码英文候选词最大展出量


  # ---------------------------------------------------------------------------
  # 5. 辅助输出控制与冲突词清理
  # ---------------------------------------------------------------------------
  "translator/max_homophones": 7            # 中文同音词单页最大检索呈现数
  "translator/max_homographs": 7            # 中文同形异义词最大容纳数
  
  # 冲突词清理映射：使用标准 delete_candidate 动作
  # 交互行为：在输入候选框激活状态下，通过 [Control + Delete] 组合键彻底销毁误输入的错词记录
  "key_binder/bindings/@before 0": { when: has_menu, accept: "Control+Delete", functional: delete_candidate }

  # 移除三个反查模块（五笔98、笔画、拆字），减少字典加载
  "engine/segmentors":
    - ascii_segmentor
    - matcher
    - abc_segmentor
    - punct_segmentor
    - fallback_segmentor
  "engine/translators":
    - punct_translator
    - script_translator
    - lua_translator@*shijian
    - lua_translator@*number_translator
    - lua_translator@*chineseLunarCalendar_translator
    - lua_translator@*mint_calculator_translator
    - table_translator@melt_eng
    - table_translator@cn_en
    - lua_translator@*force_gc
  "force_gc/interval": 32
  "recognizer/patterns/wubi98_mint": ""
  "recognizer/patterns/stroke": ""
  "recognizer/patterns/radical_lookup": ""

```

```yaml
# default.custom.yaml
# 只保留薄荷全拼，其余方案全部关闭以节省资源
patch:
  schema_list:
    - schema: rime_mint


  # Control+k 删除到行尾（覆盖 default.yaml 中无效的 Shift+Delete send 目标）
  "key_binder/bindings/@before 0": { when: composing, accept: Control+k, send: Delete }
```

模型下载[wanxiang-lts-zh-hans.gram](https://www.dropbox.com/scl/fi/m69pd5m67g5g76mrx0135/wanxiang-lts-zh-hans.gram?rlkey=1lc1s7swivgc8cj0j4is1vikg&st=x4tmr6y0&dl=0)

## 微信输入法
### 精简包&隐私屏蔽
```shell
#!/bin/bash
# WeType 输入法隐私加固 + 精简脚本
#
# ── 隐私风险对比：开不开单机模式 ─────────────────────────
#
#   不开单机模式（默认，本脚本处理后的状态）：
#     ✓ 无后台行为上报（六路上报通道全部 patch）
#     ✓ 无自动更新检查（Sparkle patch）
#     ✓ 无崩溃上报（Sentry patch）
#     ✓ 无统计 SDK / P2P 传输（flurry / WXP2PTransferDyn 空壳）
#     ~ 打字时输入的拼音会发到腾讯服务器换取云端候选词
#       （140.207.55.20，中国联通上海，腾讯机房）
#     ~ AI 助手、翻译、语音输入等功能可用，使用时发送对应内容
#     结论：无偷偷上报，但打字内容会经过腾讯服务器
#
#   开单机模式（设置 → 单机模式）：
#     ✓ 打字零流量，输入内容完全本地处理
#     ✗ 云端候选词不可用（候选词质量略降）
#     ✗ AI 助手、翻译、语音输入不可用
#     结论：完全离线，候选词仅靠本地模型
#
# ── 封堵的后台上报通道 ───────────────────────────────────
#   ReportApi          instant_report 上报模块（C++）
#                      → ret patch：Report、InstantReport、StartAutoReportCache、
#                        ReportTaskFailLog、Flush（普通调用链，入口直接返回安全）
#                      → tbnz→b patch：ReportLocalCacheLogInQueue、
#                        ReportTaskFailLogInQueue、ReportLocalCacheLog
#                        （注册为网络回调函数指针，入口 ret 会破坏调用约定
#                         导致 SIGSEGV；改为把 guard check 变成无条件跳到 ret 序列）
#                      注：Init 不 patch，否则对象未初始化网络回调时 SIGSEGV
#   CronetNetworkApi   C++ 统计上报（585 个 WtStat*Report 统计类 + 按键记录
#                      SessionKeystrokeReporter + 剪贴板上报 + 设备码校验
#                      + 网络请求记录 + 异常事件 protobuf 上报）
#                      → ret patch：DoReportNetWorkRequest、ReportClipboardPush、
#                        DoReportDeivceCodeDisMatch、ReportRecordRequestStart、
#                        ReportRecordRequestEnd、ReportCleanRequest
#                      走 wcwss→wetype.weixin.qq.com，wcwss 保留供云端候选词使用
#   BIZ.reportBaseMsg  Swift 统计上报通道（67 个 BIZ.report* 方法 + 36 个调用点
#                      + emoji/kaomoji/AIQuest/voice input 等行为上报）
#                      → mov x0,#0; ret（调用者用 cbz x0 检查返回值，
#                        返回 nil 安全走"不处理"分支）
#                      走 Business.requestWithCmd→net_start_task→StartTask
#                      （StartTask 是统一入口，承载功能请求，不能 patch）
#   CloudReportEmitInput C++ 云端输入内容上报（每次选词触发）
#                      → ret patch：OnEmitInput、FlushToCloudEx
#                      走 wxime::network::Network::DoRequest（独立第三通道）
#                      CloudSearchByInput（云端候选词）也走 DoRequest，
#                      但独立类，patch 不影响搜词功能
#   NetworkAppender    C++ 网络日志上报 → Network::DoRequest(LogReportReq)
#                      → ret patch：Append、Flush
#   InfluxDbAppender   C++ InfluxDB 时序数据上报 → cpp-httplib HTTP
#                      → ret patch：Append、Flush
#                      覆盖 CAPILoggerAppender（同一 InfluxDBClient 通道）
#   flurry             统计 SDK                → 空壳替换
#   WXP2PTransferDyn   P2P 文件传输           → 空壳替换
#   Sparkle            自动更新 + appcast 轮询 → 8个更新函数 ret patch
#                      注：不能空壳，主程序强引用 ObjC 类符号，空壳会崩
#   SentrySDKWrapper   主程序崩溃上报         → +load ret patch
#   WeTypeSettings      Sentry 设置面板崩溃上报 → DSN 字符串首字节清零
#
# ── 审查确认无后台上报风险的组件 ────────────────────────
#   wcwss              长连接保留，是云端候选词/AI/翻译/语音的传输通道
#                      上报已由六路 patch 切断
#   BIZWrapper/DeviceSync/DictsUpdateChecker/COSHandler
#                      均走 wcwss，属于用户主动触发的功能性请求
#   Alamofire          只被词典下载调用，依赖服务端 push 触发，不主动发起
#   Kingfisher         图片缓存库，本地表情包渲染，无上报
#   MarsReachability   只检测网络连通状态，不发送数据
#   WeTypeAccessibilityChecker  只检查麦克风权限，无网络代码
#   WeTypeSettings CMS 打开设置面板时加载公告/文章，属主动操作
#
# ── 其他精简 ─────────────────────────────────────────────
#   删除 WeTypeUpdater（自动更新程序）、WeTypeFeedback.app（反馈工具）
#   删除 bwcjpmac_jianpin.bin（日文模型）
#   保留 stt.bin / tts.bin（语音识别/合成模型，语音输入可用）
#   Apple Silicon：剥除所有 fat binary 的 x86_64 架构（节省约 100MB）
#   WeTypeRelaunch 保留（崩溃自动重启）
#
# ── 使用方法 ─────────────────────────────────────────────
#   每台新电脑都需单独执行，不要跨机器复制裁剪后的 app（codesign 与机器绑定）
#   1. 从官网下载安装微信输入法，确认 ~/Library/Input Methods/WeType.app 存在
#   2. bash ~/Desktop/wetype_trim.sh
#   3. 系统设置 → 键盘 → 输入法，关闭再开启微信输入法
#   可重复执行，已处理的步骤自动跳过（幂等）

set -e

APP="$HOME/Library/Input Methods/WeType.app"
ARCH=$(uname -m)
MAIN_BIN="$APP/Contents/MacOS/WeType"
BASE=4294967296  # 0x100000000，arm64 mach-o image base

# ── 检查 ──────────────────────────────────────────────
if [ ! -d "$APP" ]; then
    echo "错误：找不到 $APP" >&2
    exit 1
fi

if ! command -v clang &>/dev/null; then
    echo "错误：需要 Xcode Command Line Tools，运行 xcode-select --install" >&2
    exit 1
fi

# ── 检测是否已处理过 ─────────────────────────────────
# 用主程序大小判断：原始 fat binary >100MB，瘦身后约一半
ALREADY_DONE=false
if [ -f "$MAIN_BIN" ] && [ "$(du -m "$MAIN_BIN" | cut -f1)" -lt 80 ]; then
    ALREADY_DONE=true
fi

# ── 备份（仅首次）────────────────────────────────────
if [ "$ALREADY_DONE" = false ]; then
    BACKUP_DIR="$HOME/Desktop/WeType_backup_$(date +%Y%m%d_%H%M%S)"
    echo "==> 备份到 $BACKUP_DIR ..."
    mkdir -p "$BACKUP_DIR"
    cp -R "$APP/Contents/Frameworks" "$BACKUP_DIR/Frameworks"
    [ -f "$APP/Contents/MacOS/WeTypeUpdater" ] && \
        cp "$APP/Contents/MacOS/WeTypeUpdater" "$BACKUP_DIR/WeTypeUpdater"
    [ -d "$APP/Contents/MacOS/WeTypeFeedback.app" ] && \
        cp -R "$APP/Contents/MacOS/WeTypeFeedback.app" "$BACKUP_DIR/WeTypeFeedback.app"
else
    echo "==> 检测到已处理过，跳过备份"
fi

# ── 终止输入法进程 ────────────────────────────────────
echo "==> 终止 WeType 进程..."
killall WeType WeTypeSettings 2>/dev/null || true
sleep 1

# ══════════════════════════════════════════════════════════════
# 通用工具函数
# ══════════════════════════════════════════════════════════════

# 获取 arm64 slice 在 fat binary 中的文件偏移
# 无 fat binary 时返回 0（整个文件即 arm64 slice）
get_slice_offset() {
    lipo -detailed_info "$1" 2>/dev/null | \
        awk '/architecture arm64/{found=1} found && /offset/{print $2; exit}'
}

# 查找符号的虚拟地址（hex，不含 0x 前缀）
# $1=binary, $2=grep pattern, $3=可选：过滤符号类型（如 [tT]）
sym_addr() {
    local bin="$1" pat="$2" ftype="${3:-}"
    if [ -n "$ftype" ]; then
        nm "$bin" 2>/dev/null | grep "$pat" | grep -E " $ftype " | awk '{print $1; exit}'
    else
        nm "$bin" 2>/dev/null | grep "$pat" | awk '{print $1; exit}'
    fi
}

# 读取指定文件偏移处的字节（hex）
# $1=file, $2=offset, $3=count
read_bytes() {
    dd if="$1" bs=1 skip="$2" count="$3" 2>/dev/null | xxd -p
}

# 在指定文件偏移写入字节序列（不截断文件）
# $1=file, $2=offset, $3=bytes(hex, 如 c0035fd6)
write_bytes() {
    # 把 hex 字符串转成 \xNN 转义序列写
    local hex="$3"
    local escaped=$(printf '%s' "$hex" | sed 's/../\\x&/g')
    printf "$escaped" | dd of="$1" bs=1 seek="$2" conv=notrunc 2>/dev/null
}

# 符号虚拟地址 → 文件偏移
# $1=slice_offset, $2=vaddr_hex
# 主程序符号地址 >= 0x100000000（带 image base），需减去 BASE
# framework 符号地址 < 0x100000000（文件内偏移），不减
vaddr_to_offset() {
    local vaddr=$(( 16#$2 ))
    if [ "$vaddr" -ge "$BASE" ]; then
        echo $(( $1 + vaddr - BASE ))
    else
        echo $(( $1 + vaddr ))
    fi
}

# ARM64 ret 指令 = c0035fd6（小端）
RET_HEX='c0035fd6'
# ARM64 mov x0,#0; ret = 000080d2 c0035fd6（8 字节）
NIL_RET_HEX='000080d2c0035fd6'

# ══════════════════════════════════════════════════════════════
# patch 框架：ret patch（入口直接返回）
#
# 对普通调用链函数（text 段 t/T 符号），把入口第一条指令改为 ret
# 对 Swift 返回 Optional 的函数，用 mov x0,#0; ret 返回 nil
#
# 参数以全局数组形式声明，patch_ret 遍历处理
# ══════════════════════════════════════════════════════════════
#
# 每个 patch 组声明格式：
#   patch_name        — 显示名（用于日志）
#   check_sym         — 幂等检测符号（grep pattern）
#   check_ftype       — 检测符号类型过滤（可空）
#   ret_syms[]        — 要 ret patch 的符号列表（grep pattern）
#   ret_ftype         — ret 符号类型过滤（可空，默认不过滤）
#   use_nil_ret       — true=用 mov x0,#0; ret，false=用 ret
#   idem_bytes        — 幂等检测字节数（4 或 8）

patch_ret() {
    local bin="$1"
    [ -f "$bin" ] || return

    local label="$PATCH_NAME"
    local slice_off
    slice_off=$(get_slice_offset "$bin")
    [ -z "$slice_off" ] && { echo "  $label 跳过（非 arm64）"; return; }

    # 幂等检测
    local check_addr
    check_addr=$(sym_addr "$bin" "$CHECK_SYM" "$CHECK_FTYPE")
    [ -z "$check_addr" ] && { echo "  $label 跳过（未找到符号，版本不符）"; return; }

    local check_off
    check_off=$(vaddr_to_offset "$slice_off" "$check_addr")
    local idem_n="${IDEM_BYTES:-4}"
    local cur
    cur=$(read_bytes "$bin" "$check_off" "$idem_n")

    local expect="$IDEM_EXPECT"
    if [ -n "$expect" ] && [ "$cur" = "$expect" ]; then
        echo "  $label 跳过（已 patch）"
        return
    fi

    # 确定写入字节
    local wbytes
    if [ "$USE_NIL_RET" = "true" ]; then
        wbytes="$NIL_RET_HEX"
    else
        wbytes="$RET_HEX"
    fi

    # 遍历所有目标符号
    local sym addr off
    for sym in "${RET_SYMS[@]}"; do
        addr=$(sym_addr "$bin" "$sym" "$RET_FTYPE")
        [ -z "$addr" ] && continue
        off=$(vaddr_to_offset "$slice_off" "$addr")
        write_bytes "$bin" "$off" "$wbytes"
        echo "  $label ret patch: $sym"
    done

    codesign --force --sign - "$bin"
}

# ══════════════════════════════════════════════════════════════
# patch 框架：tbnz→b patch（网络回调函数指针专用）
#
# 被注册为网络回调的函数不能直接 ret（破坏调用约定 → SIGSEGV）
# 把入口 guard check 的条件跳转（tbnz）改为无条件跳转（b）到 ret 序列
# 函数正常建帧/拆帧，只是永远走空路径
#
# 全局数组 TBNZ_SYMS[]，每项格式：符号|tbnz相对偏移(十进制)|ret序列相对偏移(十进制)
# ══════════════════════════════════════════════════════════════
patch_tbnz() {
    local bin="$1" label="$PATCH_NAME"
    local slice_off
    slice_off=$(get_slice_offset "$bin")
    [ -z "$slice_off" ] && return

    local entry sym tbnz_rel ret_rel addr fn_off tbnz_off tgt_off delta enc
    for entry in "${TBNZ_SYMS[@]}"; do
        sym=${entry%%|*}
        tbnz_rel=${entry#*|}; tbnz_rel=${tbnz_rel%|*}
        ret_rel=${entry##*|}

        addr=$(sym_addr "$bin" "$sym" "")
        [ -z "$addr" ] && continue

        fn_off=$(vaddr_to_offset "$slice_off" "$addr")
        tbnz_off=$(( fn_off + tbnz_rel ))
        tgt_off=$(( fn_off + ret_rel ))

        # ARM64 b 指令 encoding = 0x14000000 | ((tgt-pc)/4 & 0x3FFFFFF)
        delta=$(( (tgt_off - tbnz_off) / 4 ))
        enc=$(( 0x14000000 | (delta & 0x3FFFFFF) ))

        # 转小端 4 字节 hex
        local h
        h=$(printf '%02x%02x%02x%02x' \
            $(( enc & 0xFF )) $(( (enc >> 8) & 0xFF )) \
            $(( (enc >> 16) & 0xFF )) $(( (enc >> 24) & 0xFF )))

        write_bytes "$bin" "$tbnz_off" "$h"
        echo "  $label tbnz→b patch: $sym"
    done
}

# ══════════════════════════════════════════════════════════════
# 空壳替换 + 架构精简
# ══════════════════════════════════════════════════════════════
echo "==> 编译空壳 dylib..."
TMPDIR=$(mktemp -d)
echo 'void stub_init(void) {}' > "$TMPDIR/_stub.c"
clang -arch arm64  -dynamiclib -o "$TMPDIR/_stub_arm64.dylib"  "$TMPDIR/_stub.c"
clang -arch x86_64 -dynamiclib -o "$TMPDIR/_stub_x86_64.dylib" "$TMPDIR/_stub.c"

stub_replace() {
    local target="$1"
    [ -f "$target" ] || { echo "  跳过（不存在）: $target"; return; }
    if [ "$ARCH" = "arm64" ]; then
        cp "$TMPDIR/_stub_arm64.dylib" "$target"
    else
        lipo -create "$TMPDIR/_stub_arm64.dylib" "$TMPDIR/_stub_x86_64.dylib" -output "$target"
    fi
    codesign --force --sign - "$target"
    echo "  空壳替换: $(basename "$target")"
}

thin_binary() {
    local target="$1"
    [ -f "$target" ] || return
    if lipo -info "$target" 2>/dev/null | grep -q 'x86_64'; then
        lipo -remove x86_64 "$target" -output "$target"
        codesign --force --sign - "$target"
        echo "  去除 x86_64: ${target#$APP/}"
    fi
}

echo "==> 替换 framework 二进制..."
stub_replace "$APP/Contents/Frameworks/flurry.framework/Versions/A/flurry"
stub_replace "$APP/Contents/Frameworks/WXP2PTransferDyn.framework/Versions/A/WXP2PTransferDyn"
echo "  wcwss 保留（云端候选词/AI/翻译/语音通道，上报由 patch 切断）"

# ══════════════════════════════════════════════════════════════
# Sparkle：8 个更新检查入口 ret patch
# 不能空壳（主程序引用 ObjC 类符号），patch 入口为 ret
# ══════════════════════════════════════════════════════════════
echo "==> patch Sparkle（自动更新）..."
SPARKLE_BIN="$APP/Contents/Frameworks/Sparkle.framework/Versions/B/Sparkle"
PATCH_NAME="Sparkle"
CHECK_SYM='SPUUpdater.*checkForUpdatesInBackground\]'
CHECK_FTYPE=''
IDEM_BYTES=4
IDEM_EXPECT="$RET_HEX"
USE_NIL_RET=false
RET_SYMS=(
    'SPUUpdater.*checkForUpdatesInBackground\]'
    'SPUUpdater.*scheduleNextUpdateCheckFiringImmediately'
    'SPUAutomaticUpdateDriver.*checkForUpdatesAtAppcastURL'
    'SPUBasicUpdateDriver.*checkForUpdatesAtAppcastURL'
    'SPUCoreBasedUpdateDriver.*checkForUpdatesAtAppcastURL'
    'SPUProbingUpdateDriver.*checkForUpdatesAtAppcastURL'
    'SPUScheduledUpdateDriver.*checkForUpdatesAtAppcastURL'
    'SPUUIBasedUpdateDriver.*checkForUpdatesAtAppcastURL'
    'SPUUserInitiatedUpdateDriver.*checkForUpdatesAtAppcastURL'
)
RET_FTYPE=''
patch_ret "$SPARKLE_BIN"

# ══════════════════════════════════════════════════════════════
# 主程序上报通道 patch（全部针对 $MAIN_BIN）
# ══════════════════════════════════════════════════════════════
echo "==> patch 主程序上报通道..."

# ── ReportApi：ret patch（5 个普通函数）+ tbnz→b patch（3 个回调函数）──
PATCH_NAME="ReportApi"
CHECK_SYM='__ZN9ReportApi6Report'
CHECK_FTYPE=''
IDEM_BYTES=4
IDEM_EXPECT="$RET_HEX"
USE_NIL_RET=false
RET_SYMS=(
    '__ZN9ReportApi6Report'
    '__ZN9ReportApi13InstantReport'
    '__ZN9ReportApi20StartAutoReportCache'
    '__ZN9ReportApi17ReportTaskFailLog'
    '__ZN9ReportApi5Flush'
)
RET_FTYPE=''
patch_ret "$MAIN_BIN"

TBNZ_SYMS=(
    '__ZN9ReportApi26ReportLocalCacheLogInQueue|104|108'
    '__ZN9ReportApi24ReportTaskFailLogInQueue|104|108'
    '__ZN9ReportApi19ReportLocalCacheLog|32|172'
)
patch_tbnz "$MAIN_BIN"
codesign --force --sign - "$MAIN_BIN"

# ── CronetNetworkApi：6 个统计上报入口 ret patch ──
PATCH_NAME="CronetNetworkApi"
CHECK_SYM='CronetNetworkApi22DoReportNetWorkRequest'
CHECK_FTYPE='[tT]'
IDEM_BYTES=4
IDEM_EXPECT="$RET_HEX"
USE_NIL_RET=false
RET_SYMS=(
    'CronetNetworkApi22DoReportNetWorkRequest'
    'CronetNetworkApi19ReportClipboardPush'
    'CronetNetworkApi26DoReportDeivceCodeDisMatch'
    'CronetNetworkApi24ReportRecordRequestStart'
    'CronetNetworkApi22ReportRecordRequestEnd'
    'CronetNetworkApi18ReportCleanRequest'
)
RET_FTYPE='[tT]'
patch_ret "$MAIN_BIN"

# ── BIZ.reportBaseMsg：Swift 统计上报，mov x0,#0; ret 返回 nil ──
PATCH_NAME="BIZ.reportBaseMsg"
CHECK_SYM='BIZC13reportBaseMsg'
CHECK_FTYPE='[tT]'
IDEM_BYTES=8
IDEM_EXPECT="$NIL_RET_HEX"
USE_NIL_RET=true
RET_SYMS=('BIZC13reportBaseMsg')
RET_FTYPE='[tT]'
patch_ret "$MAIN_BIN"

# ── CloudReportEmitInput：选词内容上报 ──
# pattern 加 __ZN5wxime6engine7session 前缀，排除 async/asio 模板实例化符号
PATCH_NAME="CloudReportEmitInput"
CHECK_SYM='__ZN5wxime6engine7session20CloudReportEmitInput4Impl11OnEmitInputE'
CHECK_FTYPE='[tT]'
IDEM_BYTES=4
IDEM_EXPECT="$RET_HEX"
USE_NIL_RET=false
RET_SYMS=(
    '__ZN5wxime6engine7session20CloudReportEmitInput4Impl11OnEmitInputE'
    '__ZN5wxime6engine7session20CloudReportEmitInput4Impl12FlushToCloudEx'
)
RET_FTYPE='[tT]'
patch_ret "$MAIN_BIN"

# ── NetworkAppender + InfluxDbAppender：日志上报 ──
PATCH_NAME="LogAppenders"
CHECK_SYM='logging15NetworkAppender6Append'
CHECK_FTYPE='[tT]'
IDEM_BYTES=4
IDEM_EXPECT="$RET_HEX"
USE_NIL_RET=false
RET_SYMS=(
    'logging15NetworkAppender6Append'
    'logging15NetworkAppender5Flush'
    'logging16InfluxDbAppender6Append'
    'logging16InfluxDbAppender5Flush'
)
RET_FTYPE='[tT]'
patch_ret "$MAIN_BIN"

# ── Sentry 主程序：+[SentrySDKWrapper load] ret patch ──
PATCH_NAME="Sentry(主程序)"
CHECK_SYM='SentrySDKWrapper load\]'
CHECK_FTYPE=''
IDEM_BYTES=4
IDEM_EXPECT="$RET_HEX"
USE_NIL_RET=false
RET_SYMS=('SentrySDKWrapper load\]')
RET_FTYPE=''
patch_ret "$MAIN_BIN"

# ══════════════════════════════════════════════════════════════
# 剥除 fat binary 中的 x86_64（仅 Apple Silicon）
# 注意：lipo -remove 会重写文件，必须在所有字节 patch 之后执行
# Sentry Settings DSN patch 在 thin 之后单独处理
# ══════════════════════════════════════════════════════════════
if [ "$ARCH" = "arm64" ]; then
    echo "==> 剥除 x86_64 架构..."
    while IFS= read -r f; do
        thin_binary "$f"
    done < <(find "$APP" -type f \( -perm +0111 -o -name '*.dylib' \))
fi

# ══════════════════════════════════════════════════════════════
# Sentry Settings DSN patch
# WeTypeSettings 是 Flutter/Dart AOT，symbol 全 strip
# 将 DSN 首字节置 0，Sentry 解析到空字符串后跳过初始化
# 必须在 thin 之后（lipo -remove 会覆盖 patch 字节）
# ══════════════════════════════════════════════════════════════
echo "==> patch Sentry(Settings) DSN..."
SETTINGS_APP="$APP/Contents/MacOS/WeTypeSettings.app/Contents/Frameworks/App.framework/Versions/A/App"
if [ -f "$SETTINGS_APP" ]; then
    dsn_offset=$(grep -boa 'https://7134d7bc361044e0a3b1a1a71382418d@wetype' "$SETTINGS_APP" 2>/dev/null | awk -F: '{print $1; exit}')
    if [ -n "$dsn_offset" ]; then
        first1=$(read_bytes "$SETTINGS_APP" "$dsn_offset" 1)
        if [ "$first1" = "00" ]; then
            echo "  Sentry(Settings) 跳过（已 patch）"
        else
            write_bytes "$SETTINGS_APP" "$dsn_offset" "00"
            codesign --force --sign - "$SETTINGS_APP"
            echo "  Sentry(Settings) patched: DSN 字符串已清零"
        fi
    else
        echo "  Sentry(Settings) 跳过（未找到 DSN 或已 patch）"
    fi
fi

# ══════════════════════════════════════════════════════════════
# 删除不需要的组件
# ══════════════════════════════════════════════════════════════
IMEDATA="$APP/Contents/Resources/imeData.bundle"
echo "==> 删除日文模型..."
for f in bwcjpmac_jianpin.bin; do
    if [ -f "$IMEDATA/$f" ]; then
        rm -f "$IMEDATA/$f"
        echo "  删除: $f"
    fi
done

echo "==> 删除 WeTypeUpdater、WeTypeFeedback.app..."
rm -f  "$APP/Contents/MacOS/WeTypeUpdater"
rm -rf "$APP/Contents/MacOS/WeTypeFeedback.app"

# ══════════════════════════════════════════════════════════════
# 重新签名 + 清理
# ══════════════════════════════════════════════════════════════
echo "==> 重新签名..."
codesign --force --deep --sign - "$APP"
codesign --verify --deep --strict "$APP" && echo "  签名验证通过"

rm -rf "$TMPDIR"

echo ""
if [ "$ALREADY_DONE" = false ]; then
    echo "完成。备份位于: $BACKUP_DIR"
else
    echo "完成。"
fi
echo "在系统设置 → 键盘 → 输入法 中关闭再开启微信输入法使其重新加载。"

```

### 词库&模型更新脚本

```shell
#!/bin/bash
# WeType 词库/模型更新脚本
# 从指定版本的 app 包中提取 imeData 组件，替换到当前安装版本
# 只替换 support_update=true 且版本号更新的文件，主程序二进制不动
#
# 用法：
#   bash ~/Desktop/wetype_update_models.sh /path/to/NewWeType.app
#
# 注意：替换后不需要重新跑 wetype_trim.sh，主程序未改动无需重新 patch

set -e

DST_APP="$HOME/Library/Input Methods/WeType.app"
SRC_APP="$1"

# ── 检查参数 ──────────────────────────────────────────
if [ -z "$SRC_APP" ]; then
    echo "用法: bash $0 /path/to/NewWeType.app" >&2
    exit 1
fi
if [ ! -d "$SRC_APP" ]; then
    echo "错误：找不到 $SRC_APP" >&2
    exit 1
fi
if [ ! -d "$DST_APP" ]; then
    echo "错误：找不到已安装的 $DST_APP" >&2
    exit 1
fi

SRC_BUNDLE=$(find "$SRC_APP" -name 'index.json' -path '*/imeData.bundle/*' | head -1 | xargs dirname)
DST_BUNDLE="$DST_APP/Contents/Resources/imeData.bundle"

if [ -z "$SRC_BUNDLE" ]; then
    echo "错误：在 $SRC_APP 中找不到 imeData.bundle" >&2
    exit 1
fi

echo "==> 来源: $SRC_BUNDLE"
echo "==> 目标: $DST_BUNDLE"

# ── 不替换的文件（和主程序版本强绑定，或用不到）────────
# stt.bin   语音识别（已删除）
# tts.bin   语音合成（已删除）
# bwcjpmac_jianpin.bin  日文模型（已删除）
# prism_v2.bin  拼音方案内部格式，版本绑定风险高
# cell_dict.*.zh  格式可能版本相关
SKIP_FILES="stt.bin tts.bin bwcjpmac_jianpin.bin prism_v2.bin cell_dict.hf.zh cell_dict.sc.zh cell_dict.ssrc.zh"

# ── 解析两个版本的 index.json ─────────────────────────
echo "==> 对比版本..."
UPDATED=0
SKIPPED=0
NEWER=0

python3 - "$SRC_BUNDLE/index.json" "$DST_BUNDLE/index.json" "$SKIP_FILES" << 'PYEOF'
import json, sys

src_path, dst_path, skip_str = sys.argv[1], sys.argv[2], sys.argv[3]
skip = set(skip_str.split())

with open(src_path) as f:
    src = {x['name']: x for x in json.load(f)}
with open(dst_path) as f:
    dst = {x['name']: x for x in json.load(f)}

to_update = []
for name, sitem in src.items():
    if name in skip:
        print(f"  跳过（黑名单）: {name}")
        continue
    if not sitem.get('support_update', False):
        print(f"  跳过（不支持更新）: {name}")
        continue
    ditem = dst.get(name)
    if ditem is None:
        print(f"  跳过（当前版本无此文件）: {name}")
        continue
    sv, dv = sitem.get('version', 0), ditem.get('version', 0)
    if sv > dv:
        print(f"  待更新: {name}  {dv} -> {sv}")
        to_update.append(name)
    elif sv < dv:
        print(f"  当前更新（跳过）: {name}  cur={dv} src={sv}")
    else:
        print(f"  已是最新: {name}  v{dv}")

print("__TO_UPDATE__:" + ",".join(to_update))
PYEOF

# 捕获待更新列表
TO_UPDATE=$(python3 - "$SRC_BUNDLE/index.json" "$DST_BUNDLE/index.json" "$SKIP_FILES" 2>/dev/null << 'PYEOF'
import json, sys
src_path, dst_path, skip_str = sys.argv[1], sys.argv[2], sys.argv[3]
skip = set(skip_str.split())
with open(src_path) as f:
    src = {x['name']: x for x in json.load(f)}
with open(dst_path) as f:
    dst = {x['name']: x for x in json.load(f)}
result = []
for name, sitem in src.items():
    if name in skip or not sitem.get('support_update', False):
        continue
    ditem = dst.get(name)
    if ditem and sitem.get('version', 0) > ditem.get('version', 0):
        result.append(name)
print(",".join(result))
PYEOF
)

if [ -z "$TO_UPDATE" ]; then
    echo ""
    echo "没有需要更新的文件，已是最新。"
    exit 0
fi

# ── 终止输入法进程 ────────────────────────────────────
echo ""
echo "==> 终止 WeType 进程..."
killall WeType WeTypeSettings 2>/dev/null || true
sleep 1

# ── 备份当前 imeData.bundle ───────────────────────────
BACKUP_DIR="$HOME/Desktop/WeType_imeData_backup_$(date +%Y%m%d_%H%M%S)"
echo "==> 备份当前词库到 $BACKUP_DIR ..."
mkdir -p "$BACKUP_DIR"
cp "$DST_BUNDLE/index.json" "$BACKUP_DIR/index.json"
IFS=',' read -ra FILES <<< "$TO_UPDATE"
for f in "${FILES[@]}"; do
    [ -f "$DST_BUNDLE/$f" ] && cp "$DST_BUNDLE/$f" "$BACKUP_DIR/$f"
done

# ── 复制新版文件 ──────────────────────────────────────
echo "==> 替换模型文件..."
for f in "${FILES[@]}"; do
    if [ -f "$SRC_BUNDLE/$f" ]; then
        cp "$SRC_BUNDLE/$f" "$DST_BUNDLE/$f"
        echo "  更新: $f"
    fi
done

# ── 更新 index.json ───────────────────────────────────
echo "==> 更新 index.json..."
python3 - "$SRC_BUNDLE/index.json" "$DST_BUNDLE/index.json" "$TO_UPDATE" << 'PYEOF'
import json, sys
src_path, dst_path, update_str = sys.argv[1], sys.argv[2], sys.argv[3]
to_update = set(update_str.split(","))

with open(src_path) as f:
    src = {x['name']: x for x in json.load(f)}
with open(dst_path) as f:
    dst_list = json.load(f)

for item in dst_list:
    if item['name'] in to_update and item['name'] in src:
        item['version'] = src[item['name']]['version']
        item['md5'] = src[item['name']]['md5']
        item['timestamp'] = src[item['name']].get('timestamp', item.get('timestamp'))

with open(dst_path, 'w') as f:
    json.dump(dst_list, f, separators=(',', ':'))
print("  index.json 已更新")
PYEOF

# ── 重新签名 ──────────────────────────────────────────
echo "==> 重新签名..."
codesign --force --deep --sign - "$DST_APP"
codesign --verify --deep --strict "$DST_APP" && echo "  签名验证通过"

echo ""
echo "完成。共更新 ${#FILES[@]} 个文件，备份位于: $BACKUP_DIR"
echo "在系统设置 → 键盘 → 输入法 中关闭再开启微信输入法使其重新加载。"

```
