# open-code-review-enhanced 1.1.9-test

发布日期：2026-10-01

## 变更明细

- 移除 Web 评审提交和取消任务对 `Origin`、`Referer`、`Via` 等代理来源头的强制依赖。
- 修复反向代理环境中其他页面可以访问，但提交页面 POST 始终返回 `cross-origin request rejected` 的问题。
- 提交接口继续执行表单大小限制、参数校验和任务状态校验。
- 主 npm 包及六个平台包升级为 `1.1.9-test`。

## 安装

```sh
npm install -g open-code-review-enhanced@1.1.9-test --allow-scripts=open-code-review-enhanced
```

基于 `codex/web-review-submissions`，对比 `v1.1.8-test` 整理。

本次发布准备使用 OpenAI Codex（GPT-6）。
