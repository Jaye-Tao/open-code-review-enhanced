# open-code-review-enhanced 1.1.7-test

发布日期：2026-10-01

## 变更明细

- 修复现有 Nginx 配置通过 `proxy_set_header via $http_origin` 传递来源时，Web 评审提交仍被拒绝的问题。
- 支持使用代理传来的 `Via` 公开来源与浏览器 `Origin` 或 `Referer` 做同源校验。
- 保留 `Forwarded`、`X-Forwarded-*` 和浏览器同源回退校验，跨来源请求仍会被拒绝。
- 增加 `Via` 来源回归测试。
- 主 npm 包以及六个平台包统一升级为 `1.1.7-test`。

## 安装

```sh
npm install -g open-code-review-enhanced@1.1.7-test --allow-scripts=open-code-review-enhanced
```

基于 `codex/web-review-submissions`，对比 `v1.1.6-test` 整理。

本次发布准备使用 OpenAI Codex（GPT-6）。
