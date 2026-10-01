# open-code-review-enhanced 1.1.3-test

发布日期：2026-10-01

## 变更明细

### Web 评审提交

- 新增 `/submissions` Web 页面，可提交 Git 仓库、目标分支、对比分支和提交人信息。
- 新增持久化评审队列，记录排队、准备仓库、更新分支、审核中、成功、失败和取消状态。
- 增加可配置的并发审核上限，默认同时运行 2 个任务，可通过 `OCR_VIEWER_MAX_RUNNING_REVIEWS` 调整。
- 支持取消排队中或运行中的任务，并在查看器重启后将未完成任务标记为失败。
- 提交前自动准备本地仓库并执行 `git fetch origin`，审核使用更新后的远程分支引用，不执行 checkout 或 pull。
- 仓库列表新增“提交审核”入口，补充提交表单和移动端布局样式。

### 版本与发布资源

- 主 npm 包以及 Linux、macOS、Windows 的 x64/arm64 平台包统一升级为 `1.1.3-test`。
- 这是基于 `codex/web-review-submissions` 的测试版预发布版本。

## 安装

```sh
npm install -g open-code-review-enhanced@1.1.3-test --allow-scripts=open-code-review-enhanced
```

## 兼容性与来源

基于 `codex/web-review-submissions`，对比 `v1.1.2` 整理。

本次发布准备使用 OpenAI Codex（GPT-6）。

## 验证记录

- 已执行版本、安装器、启动器和 viewer JavaScript 测试。
- 六个平台二进制和 SHA256 校验将在发布构建阶段生成。

[完整变更对比](https://github.com/buggen-null/open-code-review-enhanced/compare/v1.1.2...v1.1.3-test)
