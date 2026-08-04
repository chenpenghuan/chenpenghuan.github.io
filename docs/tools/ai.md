# ai工具
1.fogsight：科普动画生成器；2.flourish studio：做数据图表；3.3Dlogolab：把logo变得逼真3D化；4.pngimg：拥有众多免费透明底png素材图片的网站；5.i校对：找文章中的错误；6.convertio：文件格式免费转换；7.napkin：把语段内容总结为可视化图表；8.class central：超万种不同类别的在线课程可免费学习。

## ccswitch 配置

### Gemini
```json
{
  "env": {
    "ANTHROPIC_API_KEY": "xxx",
    "ANTHROPIC_BASE_URL": "https://generativelanguage.googleapis.com/v1beta",
    "ANTHROPIC_DEFAULT_FABLE_MODEL": "gemini-3.5-flash",
    "ANTHROPIC_DEFAULT_FABLE_MODEL_NAME": "claude-3-5-sonnet-20241022",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "gemini-3.5-flash-lite",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL_NAME": "claude-3-5-sonnet-20241022",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "gemini-3.5-flash",
    "ANTHROPIC_DEFAULT_OPUS_MODEL_NAME": "claude-3-5-sonnet-20241022",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "gemini-3.5-flash",
    "ANTHROPIC_DEFAULT_SONNET_MODEL_NAME": "claude-3-5-sonnet-20241022",
    "ANTHROPIC_MODEL": "gemini-3.1-flash-lite",
    "CLAUDE_CODE_SUBAGENT_MODEL": "gemini-3.5-flash-lite",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1"
  },
  "model": "opus"
}
```

### Zhipu GLM
```json
{
  "env": {
    "ANTHROPIC_API_KEY": "xxx",
    "ANTHROPIC_BASE_URL": "https://open.bigmodel.cn/api/anthropic",
    "ANTHROPIC_DEFAULT_FABLE_MODEL": "glm-4.7-flash",
    "ANTHROPIC_DEFAULT_FABLE_MODEL_NAME": "claude-3-5-fable-20241022",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "glm-4.7-flash",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL_NAME": "claude-3-5-haiku-20241022",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "glm-4.7-flash",
    "ANTHROPIC_DEFAULT_OPUS_MODEL_NAME": "claude-3-opus-20240229",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "glm-4.7-flash",
    "ANTHROPIC_DEFAULT_SONNET_MODEL_NAME": "claude-3-5-sonnet-20241022",
    "ANTHROPIC_MODEL": "glm-4.7-flash",
    "CLAUDE_CODE_SUBAGENT_MODEL": "glm-4.7-flash",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1"
  },
  "model": "opus"
}
```

### Ollama
```json
{
  "env": {
    "ANTHROPIC_API_KEY": "ollama",
    "ANTHROPIC_BASE_URL": "http://127.0.0.1:11434",
    "ANTHROPIC_DEFAULT_FABLE_MODEL": "qwen2.5-coder:0.5b",
    "ANTHROPIC_DEFAULT_FABLE_MODEL_NAME": "Qwen 2.5 Coder",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "qwen2.5-coder:0.5b",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL_NAME": "Qwen 2.5 Coder",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "qwen2.5-coder:0.5b",
    "ANTHROPIC_DEFAULT_OPUS_MODEL_NAME": "Qwen 2.5 Coder",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "qwen2.5-coder:0.5b",
    "ANTHROPIC_DEFAULT_SONNET_MODEL_NAME": "Qwen 2.5 Coder",
    "ANTHROPIC_MODEL": "qwen2.5-coder:0.5b",
    "CLAUDE_CODE_SUBAGENT_MODEL": "qwen2.5-coder:0.5b"
  },
  "model": "qwen2.5-coder:0.5b",
  "hasCompletedOnboarding": true
}
```

### 硅基流动 (SiliconFlow)
```json
{
  "env": {
    "ANTHROPIC_API_KEY": "xxx",
    "ANTHROPIC_BASE_URL": "https://api.siliconflow.cn",
    "ANTHROPIC_DEFAULT_FABLE_MODEL": "Qwen/Qwen3.5-4B",
    "ANTHROPIC_DEFAULT_FABLE_MODEL_NAME": "Qwen 3.5 4B",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "Qwen/Qwen3.5-4B",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL_NAME": "Qwen 3.5 4B",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "Qwen/Qwen3.5-4B",
    "ANTHROPIC_DEFAULT_OPUS_MODEL_NAME": "Qwen 3.5 4B",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "Qwen/Qwen3.5-4B",
    "ANTHROPIC_DEFAULT_SONNET_MODEL_NAME": "Qwen 3.5 4B",
    "ANTHROPIC_DEFAULT_FABLE_MODEL_NAME": "Qwen/Qwen3.5-4B",
    "CLAUDE_CODE_SUBAGENT_MODEL": "Qwen/Qwen3.5-4B",
    "ANTHROPIC_API_KEY": "xxx",
    "ENABLE_TOOL_SEARCH": "true",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1"
  },
  "model": "opus"
}
```

### 字段详细说明

`ccswitch` 配置的核心原理是通过自定义环境变量 (`env`) 将原本发送给 Anthropic API 的请求，重定向并伪装到其他第三方接口（如 Google Gemini API 或本地的 Ollama），从而让 Claude Code 客户端运行在其他低成本、高性能或离线的开源模型上。

各字段的具体作用如下：

| 字段名称 | 类型 | 作用说明 |
| :--- | :--- | :--- |
| `model` | String | 切换到该配置后，客户端首选/默认激活的抽象模型等级名（例如 `opus`、`sonnet`、`haiku`，或者具体物理模型名 `qwen2.5-coder:0.5b`）。 |
| `hasCompletedOnboarding` | Boolean | 标记是否已完成新手指引。设为 `true` 可以直接跳过每次启动时的 onboarding 提示。 |
| **`env` 内部环境变量** | | |
| `ANTHROPIC_API_KEY` | String | API 访问凭证密钥。使用 Gemini 时填写对应的 Google API Key ；使用本地 Ollama 时由于不需要鉴权，填写任意非空占位符（如 `"ollama"`）即可。 |
| `ANTHROPIC_BASE_URL` | String | 重定向的 API 基础请求地址。将原本访问 Anthropic 官方的请求代理并转发至 Gemini 的 API 接口或 Ollama 的本地端口（如 `http://127.0.0.1:11434`）。 |
| `ANTHROPIC_MODEL` | String | 交互时客户端使用的主要底层物理模型。 |
| `CLAUDE_CODE_SUBAGENT_MODEL`| String | 当 Claude Code 启动后台子代理（Subagent）执行复杂拆解任务时，底层调用的物理模型。 |
| `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` | String | 设置为 `"1"` 表示禁用所有非必要外部流量（如遥测 Telemetry 数据和后台多余升级校验等），能够显著加快启动速度并节省网络资源。 |
| `ANTHROPIC_DEFAULT_XXX_MODEL` | String | 当客户端请求特定等级 `XXX` 的模型时（`XXX` 包含 `FABLE`、`HAIKU`、`OPUS`、`SONNET`），底层重定向映射到的真实物理模型名（如 `gemini-3.5-flash` 或 `qwen2.5-coder:0.5b`）。 |
| `ANTHROPIC_DEFAULT_XXX_MODEL_NAME` | String | 模型名称的“伪装别名”。为了避免客户端对返回结果中的模型名称校验报错，通常统一将别名设置为合法的官方模型名（如 `"claude-3-5-sonnet-20241022"`）或者具体的物理模型展示名。 |
