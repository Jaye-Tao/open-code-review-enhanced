# open-code-review-enhanced 1.0.3

发布日期：2026-09-24

## 变更明细

### 内置默认审查提示词

- 新增 `ocr review --default-prompt`，直接使用随二进制发布的默认中文审查提示词，无需解析提示词文件路径。
- `--default-prompt` 可以与 `--background` 叠加本次任务上下文，但不能与 `--background-file` 同时使用；命令行帮助、技能文档和多语言 CLI 文档已同步更新。
- 默认提示词继续要求基于代码证据输出问题，并保留接口信息、影响分析、修复方案、验证方式和待确认事项等结构化字段。

### 查看器实时审查进度

- 会话列表会轮询正在运行的审查，并在文件集合冻结后显示选中文件数。
- 每个文件完成、复用或失败时写入终态记录，页面按终态记录计算进度百分比，审查过程中的进度会逐步更新。
- 会话历史、持久化存储、查看器接口和页面脚本同步支持实时进度数据；英文和中文查看器文档已补充说明。

### 版本与发布资源

- 主 npm 包以及 Linux、macOS、Windows 的 x64/arm64 平台包统一升级为 `1.0.3`。
- 本版本基于 `feat/review-dashboard-integrated`，包含 `v1.0.2` 之后的实时进度和默认提示词功能。

## 升级

```sh
npm install -g open-code-review-enhanced@1.0.3 --allow-scripts=open-code-review-enhanced
```

## 兼容性与来源

基于 `feat/review-dashboard-integrated`，对比 `v1.0.2` 整理。内置中文背景提示词仍需显式通过 `--default-prompt` 启用；默认命令不会自动加载它。

发布准备使用 OpenAI Codex（GPT-6）。

## 验证记录与已知限制

- 许可证检查、依赖整理、Go 静态检查和 npm 打包预览通过。
- npm 启动器、版本判断及查看器 JavaScript 测试通过；Windows 环境跳过 POSIX 安装权限测试。
- 已执行全部 Go 包测试（`CGO_ENABLED=0`）；22 个包通过，CLI 会话 HTML 导出及查看器文案、模板结构相关测试仍失败。这些失败涉及已有面板功能，不属于本次版本元数据修改。
- 英文检查仍报告查看器源码/测试中 50 处未豁免的非英文文本；现有进度接口还有一处 Go 格式对齐差异。
- 本地未找到 `make` 和 GCC，未能完成标准 `make check` / `make test` 及 race 检查；GitHub Actions shell 合约测试在 Windows 下失败。未宣称全量测试或 90% 覆盖率门槛通过。
- Linux、macOS、Windows 的 x64/arm64 六个平台二进制构建成功，Windows x64 的版本输出已验证；生成 SHA256 校验和。
- 提交前使用构建出的 OCR CLI 执行代码审查，7 个选中项未报告问题。

## 提交记录

- `0922ee5` — 新增直接启用内置默认审查提示词的参数。
- `2de9ee8` — 修复查看器审查进度未实时更新的问题。

[完整变更对比](https://github.com/Jaye-Tao/open-code-review-enhanced/compare/v1.0.2...v1.0.3)
