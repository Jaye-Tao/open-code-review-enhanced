# open-code-review-enhanced 1.0.1

发布日期：2026-09-23

## 本次更新

- `--background-file` 与 `--background` 现在可以同时使用：文件内容作为基础审查规则，命令行内容追加为本次任务的上下文。
- 未提供任何背景参数时，继续使用官方默认审查提示词，现有用户无需修改命令。
- npm 包继续内置 `prompts/open-code-review-background.md`，通过 `ocr background-path` 获取安装路径，并使用 `--background-file` 显式启用。
- 主包和 Linux、macOS、Windows 的 x64/arm64 平台包统一升级到 `1.0.1`。

## 升级

```sh
npm install -g open-code-review-enhanced@1.0.1 --allow-scripts=open-code-review-enhanced
```

启用内置中文审查背景：

```sh
ocr review --background-file "$(ocr background-path)"
```

同时追加本次任务上下文：

```sh
ocr review --background-file "$(ocr background-path)" --background "重点检查权限和重复提交。"
```
