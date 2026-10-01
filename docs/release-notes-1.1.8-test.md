# open-code-review-enhanced 1.1.8-test

发布日期：2026-10-01

## 变更明细

- 修复反向代理剥离浏览器来源头后，正常同源 Web 表单提交被误判为跨来源的问题。
- 明确不一致的 `Origin`、`Referer` 或 `Via` 仍然拒绝；来源头全部缺失时允许正常应用请求。
- 保持对 `Forwarded`、`X-Forwarded-*` 和 `Via` 代理来源头的支持。
- 增加来源头缺失场景回归测试。
- 主 npm 包及六个平台包升级为 `1.1.8-test`。

## 安装

```sh
npm install -g open-code-review-enhanced@1.1.8-test --allow-scripts=open-code-review-enhanced
```

基于 `codex/web-review-submissions`，对比 `v1.1.7-test` 整理。

本次发布准备使用 OpenAI Codex（GPT-6）。
