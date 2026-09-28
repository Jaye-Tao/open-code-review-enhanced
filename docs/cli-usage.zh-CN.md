# 安装后常用命令

本文以一个名为 `order-service` 的 Go 服务为例。命令均给出了可参考的完整值；执行前请按自己的项目、分支、提交和 API key 修改对应值。

| 示例项 | 示例值 | 请替换为 |
| --- | --- | --- |
| 项目目录（Linux/macOS） | `~/projects/order-service` | 你的 Git 仓库目录 |
| 项目目录（Windows） | `C:\Projects\order-service` | 你的 Git 仓库目录 |
| 主分支 | `origin/develop` | 你的主分支，如 `master` |
| 功能分支 | `origin/feature/order-discount` | 你的待评审分支 |
| 提交 ID | `b7e4f21` | `git log --oneline` 中的实际提交 ID |
| 会话 ID | `20260923-143000-b7e4f21` | `ocr session list` 中的实际会话 ID |
| 中转站地址 | `https://api.example-gateway.com/v1` | 中转站提供的 OpenAI 兼容 Base URL |
| 中转站密钥 | `sk-gateway-example-key-replace-before-use` | 中转站提供的 API key |

## 1. 检查安装

```bash
ocr version
ocr --help
ocr review --help
```

Windows PowerShell 使用相同的 `ocr` 命令。

## 2. 配置 LLM 中转站（推荐）

使用 OpenAI 兼容的自定义 provider 配置中转站。下面的地址和 API key 是示例值，请替换为中转站实际提供的信息；模型示例为 `gpt-5.6-sol`。

Windows PowerShell：

```powershell
ocr.cmd config set provider ai-gateway
ocr.cmd config set custom_providers.ai-gateway.protocol openai
ocr.cmd config set custom_providers.ai-gateway.url https://api.example-gateway.com/v1
ocr.cmd config set custom_providers.ai-gateway.model gpt-5.6-sol
ocr.cmd config set custom_providers.ai-gateway.api_key sk-gateway-example-key-replace-before-use
ocr.cmd llm test
```

macOS：

```bash
ocr config set provider ai-gateway
ocr config set custom_providers.ai-gateway.protocol openai
ocr config set custom_providers.ai-gateway.url https://api.example-gateway.com/v1
ocr config set custom_providers.ai-gateway.model gpt-5.6-sol
ocr config set custom_providers.ai-gateway.api_key sk-gateway-example-key-replace-before-use
ocr llm test
```

Linux：

```bash
ocr config set provider ai-gateway
ocr config set custom_providers.ai-gateway.protocol openai
ocr config set custom_providers.ai-gateway.url https://api.example-gateway.com/v1
ocr config set custom_providers.ai-gateway.model gpt-5.6-sol
ocr config set custom_providers.ai-gateway.api_key sk-gateway-example-key-replace-before-use
ocr llm test
```

## 3. 评审当前工作区

在 Git 仓库目录执行。默认会检查 staged、unstaged 和 untracked 变更：

```bash
cd ~/projects/order-service
ocr review
```

先查看会评审哪些文件（不调用 LLM）：

```bash
ocr review --preview
```

指定业务背景，帮助模型理解需求：

```bash
ocr review --background "检查登录流程的权限校验和错误处理"
```

使用 npm 包内置的审查背景提示词。`ocr.cmd background-path` 会输出该提示词文件的实际路径；该文件要求使用简体中文输出，并约束审查重点、证据标准、风险等级和问题输出格式。

也可以直接使用内置提示词，无需获取文件路径：

```bash
ocr review --commit b7e4f21 --resume 20260923-143000-b7e4f21 --default-prompt
```

`--default-prompt` 可以和 `--background` 一起使用，追加本次评审的业务背景；它不能与 `--background-file` 同时使用。

Linux 使用 `ocr background-path` 获取内置提示词路径：

```bash
BG="$(ocr background-path)"
```

在指定仓库中评审 `origin/feature/order-discount` 相对 `origin/develop` 的变更：

```bash
ocr review \
  --repo "/opt/dims-code/crm-mall-server" \
  --from "origin/develop" \
  --to "origin/feature/order-discount" \
  --background-file "$BG"
```

Windows PowerShell 可以先保存路径变量，再执行评审：

```powershell
$background = ocr.cmd background-path
ocr.cmd review --background-file $background
```

也可以在一条命令中取得路径并执行评审：

```powershell
ocr.cmd review --background-file "$(ocr.cmd background-path)"
```

评审 `origin/feature/order-discount` 分支时，同时使用内置提示词和本次需求背景：

```powershell
ocr.cmd review --from origin/develop --to origin/feature/order-discount --background-file "$(ocr.cmd background-path)" --background "本次修改新增登录接口、短信验证码登录和用户会话管理；重点检查权限校验、重复提交和异常处理。"
```

评审提交 `b7e4f21` 时使用内置提示词，并将 JSON 结果写入文件：

```powershell
ocr.cmd review --commit b7e4f21 --background-file "$(ocr.cmd background-path)" --format json --audience agent --output order-service-login-review.json
```

## 4. 评审分支或单个提交

评审功能分支相对 `origin/develop` 的变更（Windows、macOS、Linux 的完整命令见第 9 节）：

```bash
BG="$(ocr background-path)"
ocr review --from origin/develop --to origin/feature/order-discount --background-file "$BG"
```

评审远程主分支相对当前分支的变更：

```bash
BG="$(ocr background-path)"
ocr review --from origin/develop --to HEAD --background-file "$BG"
```

评审单个提交：

```bash
BG="$(ocr background-path)"
ocr review --commit b7e4f21 --background-file "$BG"
```

也可以使用简写：

```bash
BG="$(ocr background-path)"
ocr review -c b7e4f21 --background-file "$BG"
```

## 5. 输出 JSON 或保存结果

保存机器可读结果，适合 CI 或后续脚本处理：

```bash
BG="$(ocr background-path)"
ocr review --background-file "$BG" --format json --audience agent --output order-service-review.json
```

输出到标准输出并保存到文件：

```bash
BG="$(ocr background-path)"
ocr review --background-file "$BG" --format json --audience agent > order-service-review.json
```

Linux/macOS 使用 `jq` 查看摘要：

```bash
jq '.summary' order-service-review.json
```

## 6. 扫描完整文件

`ocr scan` 不依赖 Git diff，适合审计整个仓库或指定目录：

```bash
# 扫描整个仓库
BG="$(ocr background-path)"
ocr scan --background-file "$BG"

# 只扫描一个目录
ocr scan --path src/api --background-file "$BG"

# 扫描多个目录或文件
ocr scan --path src/api,internal/config/config.go --background-file "$BG"

# 排除生成文件
ocr scan --exclude '**/generated/*,*.pb.go' --background-file "$BG"
```

先预览扫描范围：

```bash
ocr scan --preview
```

## 7. 查看和恢复会话

列出最近的评审会话：

```bash
ocr session list
```

查看指定会话：

```bash
ocr session show 20260923-143000-b7e4f21
```

查看会话中的评论：

```bash
ocr session comments 20260923-143000-b7e4f21
```

恢复被中断的分支评审：

```bash
BG="$(ocr background-path)"
ocr review --from origin/develop --to origin/feature/order-discount --resume 20260923-143000-b7e4f21 --background-file "$BG"
```

恢复被中断的提交评审：

```bash
BG="$(ocr background-path)"
ocr review --commit b7e4f21 --resume 20260923-143000-b7e4f21 --background-file "$BG"
```

注意：工作区模式不能使用 `--resume`；恢复时评审目标、规则和输入应与原会话一致。

## 8. 查看器和导出

启动本地 Web 查看器：

```bash
ocr viewer
```

默认访问地址为 `http://localhost:5483`。停止查看器时按 `Ctrl+C`。

### Linux 后台启动

临时后台运行（关闭 SSH 会话后仍继续运行）：

```bash
nohup ocr viewer --open=never > ~/ocr-viewer.log 2>&1 &
echo $! > ~/.ocr-viewer.pid
```

本机访问 `http://127.0.0.1:5483`。查看日志和停止进程：

```bash
tail -f ~/ocr-viewer.log
kill "$(cat ~/.ocr-viewer.pid)"
```

如果要从其他电脑访问服务器，请监听服务器网卡地址：

```bash
nohup ocr viewer --addr 0.0.0.0:5483 --open=never > ~/ocr-viewer.log 2>&1 &
```

然后访问 `http://服务器IP:5483`。更安全的方式是保持 `localhost` 监听，通过 SSH 隧道访问：

```bash
ssh -N -L 5483:127.0.0.1:5483 user@服务器IP
```

再在本地浏览器打开 `http://127.0.0.1:5483`。

### Linux 使用 systemd 长期运行

创建服务文件：

```bash
sudo tee /etc/systemd/system/ocr-viewer.service > /dev/null <<'EOF'
[Unit]
Description=OpenCodeReview Web Viewer
After=network.target

[Service]
Type=simple
User=reviewer
ExecStart=/usr/bin/ocr viewer --addr 127.0.0.1:5483 --open=never
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF
```

将 `User=reviewer` 改为实际 Linux 用户，并确认 `ocr` 路径：

```bash
command -v ocr
```

如果输出不是 `/usr/bin/ocr`，将 `ExecStart` 中的路径替换为实际路径，然后启动服务：

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now ocr-viewer
sudo systemctl status ocr-viewer
```

查看服务日志或停止服务：

```bash
journalctl -u ocr-viewer -f
sudo systemctl stop ocr-viewer
```

导出会话为独立 HTML 文件：

```bash
ocr session export 20260923-143000-b7e4f21 --output review.html
```

## 9. 按操作系统完整示例

本节把常见评审场景按 Windows、macOS、Linux 分开列出。分支评审、提交评审和恢复评审都显式指定内置提示词文件。

### Windows PowerShell

```powershell
Set-Location C:\Projects\order-service
$BG = ocr.cmd background-path

# 当前工作区
ocr.cmd review --background-file $BG

# origin/feature/order-discount 相对 origin/develop
ocr.cmd review --repo "C:\Projects\order-service" --from "origin/develop" --to "origin/feature/order-discount" --background-file $BG

# 单个提交
ocr.cmd review --commit b7e4f21 --background-file $BG

# JSON 输出
ocr.cmd review --from "origin/develop" --to "origin/feature/order-discount" --background-file $BG --format json --audience agent --output order-service-review.json

# 扫描指定目录
ocr.cmd scan --path src\api --background-file $BG

# 恢复中断的分支评审
ocr.cmd review --from "origin/develop" --to "origin/feature/order-discount" --resume 20260923-143000-b7e4f21 --background-file $BG
```

### macOS

```bash
cd ~/Projects/order-service
BG="$(ocr background-path)"

# 当前工作区
ocr review --background-file "$BG"

# origin/feature/order-discount 相对 origin/develop
ocr review --repo "$HOME/Projects/order-service" --from "origin/develop" --to "origin/feature/order-discount" --background-file "$BG"

# 单个提交
ocr review --commit b7e4f21 --background-file "$BG"

# JSON 输出
ocr review --from "origin/develop" --to "origin/feature/order-discount" --background-file "$BG" --format json --audience agent --output order-service-review.json
jq '.summary' order-service-review.json

# 扫描指定目录
ocr scan --path src/api --background-file "$BG"

# 恢复中断的分支评审
ocr review --from "origin/develop" --to "origin/feature/order-discount" --resume 20260923-143000-b7e4f21 --background-file "$BG"
```

### Linux

```bash
cd /opt/projects/order-service
BG="$(ocr background-path)"

# 当前工作区
ocr review --background-file "$BG"

# origin/feature/order-discount 相对 origin/develop
ocr review --repo "/opt/projects/order-service" --from "origin/develop" --to "origin/feature/order-discount" --background-file "$BG"

# 单个提交
ocr review --commit b7e4f21 --background-file "$BG"

# JSON 输出
ocr review --from "origin/develop" --to "origin/feature/order-discount" --background-file "$BG" --format json --audience agent --output order-service-review.json
jq '.summary' order-service-review.json

# 扫描指定目录
ocr scan --path src/api --background-file "$BG"

# 恢复中断的分支评审
ocr review --from "origin/develop" --to "origin/feature/order-discount" --resume 20260923-143000-b7e4f21 --background-file "$BG"
```

会话查看命令：Windows 使用 `ocr.cmd session list/show/comments`，macOS/Linux 使用 `ocr session list/show/comments`。Linux 查看器后台运行：

```bash
nohup ocr viewer --open=never > ~/ocr-viewer.log 2>&1 &
echo $! > ~/.ocr-viewer.pid
```

会话和查看器命令按系统区分：

Windows PowerShell：

```powershell
ocr.cmd session list
ocr.cmd session show 20260923-143000-b7e4f21
ocr.cmd session comments 20260923-143000-b7e4f21
ocr.cmd viewer --open=never
ocr.cmd rules check src\api\login_handler.go
```

macOS：

```bash
ocr session list
ocr session show 20260923-143000-b7e4f21
ocr session comments 20260923-143000-b7e4f21
ocr viewer --open=never
ocr rules check src/api/login_handler.go
```

Linux：

```bash
ocr session list
ocr session show 20260923-143000-b7e4f21
ocr session comments 20260923-143000-b7e4f21
ocr viewer --open=never
ocr rules check src/api/login_handler.go
```

## 10. 规则和运行参数

查看某个文件匹配到的规则：

```bash
ocr rules check src/api/login_handler.go
```

限制并发任务数量：

```bash
ocr review --concurrency 4
```

设置本次评审的投入档位：

```bash
ocr review --effort low
ocr review --effort medium
ocr review --effort high
```

排除特定路径：

```bash
ocr review --exclude '**/generated/*,vendor/**'
```

指定本次运行使用的 provider 和 model：

```bash
ocr review --provider ai-gateway --model gpt-5.6-sol
```

## 11. 常见问题

### `ocr` 不是命令

确认 npm 全局 bin 目录已加入 `PATH`，并重新打开终端：

```bash
npm prefix --global
ocr version
```

### npm 11 安装后提示 postinstall 被阻止

重新安装并允许本包的安装脚本：

```bash
npm i -g open-code-review-enhanced --allow-scripts=open-code-review-enhanced
```

### 没有配置 LLM

按第 2 节配置中转站，并执行连通性测试：

```text
Windows: ocr.cmd llm test
macOS:   ocr llm test
Linux:   ocr llm test
```

### 想查看完整参数

```bash
ocr review --help
ocr scan --help
ocr session --help
ocr config --help
```
