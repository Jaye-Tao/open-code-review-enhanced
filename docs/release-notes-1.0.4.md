# open-code-review-enhanced 1.0.4

发布日期：2026-09-25

## 变更明细

### 查看器进度恢复

- 修复旧会话缺少 coverage manifest 时无法恢复活动进度的问题。
- 查看器现在可以从已有的会话记录和当前文件状态推导活动进度，避免历史会话显示停滞或错误的零进度。
- 补充 handler 和 store 回归测试，覆盖旧会话恢复场景。

### 版本与发布资源

- 主 npm 包以及 Linux、macOS、Windows 的 x64/arm64 平台包统一升级为 `1.0.4`。
- 保留 1.0.3 中的 `--default-prompt` 内置审查提示词和查看器实时进度功能。

## 升级

```sh
npm install -g open-code-review-enhanced@1.0.4 --allow-scripts=open-code-review-enhanced
```

## 兼容性与来源

基于 `feat/review-dashboard-integrated`，对比 `v1.0.3` 整理。

发布准备使用 OpenAI Codex（GPT-6）。

## 验证记录与已知限制

- 许可证检查、依赖整理、Go 静态检查和 npm 打包预览通过。
- npm 启动器、版本判断及查看器 JavaScript 测试通过；Windows 环境跳过 POSIX 安装权限测试。
- 已执行全部 Go 包测试（`CGO_ENABLED=0`）；若存在仓库既有查看器模板/导出测试失败，将在发布前记录，不将其伪装为通过。
- 本机检查会明确记录英文检查、race 检查和 GitHub Actions runner 的限制。
- Linux、macOS、Windows 的 x64/arm64 六个平台二进制构建成功，并生成 SHA256 校验和。
- 提交前使用构建出的 OCR CLI 执行代码审查，并记录结果。

## 提交记录

- `a7f006d` — 修复旧会话缺少 coverage manifest 时的活动进度恢复。

[完整变更对比](https://github.com/Jaye-Tao/open-code-review-enhanced/compare/v1.0.3...v1.0.4)
