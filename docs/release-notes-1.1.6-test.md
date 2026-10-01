# open-code-review-enhanced 1.1.6-test

发布日期：2026-10-01

## 变更明细

### Web 评审提交代理兼容

- 修复未完整转发公开 Host、协议或端口时，反向代理下提交审核被错误拒绝的问题。
- 支持标准 `Forwarded`、`X-Forwarded-Proto`、`X-Forwarded-Host` 和 `X-Forwarded-Port` 头。
- 当代理隐藏公开地址时，使用浏览器 `Origin` 与 `Referer` 的一致性作为同源回退校验；跨来源请求仍被拒绝。
- 增加代理来源校验回归测试，覆盖转发端口、标准 Forwarded 头、Referer 回退和跨来源拒绝。

### 版本与发布资源

- 主 npm 包以及 Linux、macOS、Windows 的 x64/arm64 平台包统一升级为 `1.1.6-test`。
- 这是基于 `codex/web-review-submissions` 的测试版修正版。

## 安装

```sh
npm install -g open-code-review-enhanced@1.1.6-test --allow-scripts=open-code-review-enhanced
```

## 兼容性与来源

基于 `codex/web-review-submissions`，对比 `v1.1.5-test` 整理。

本次发布准备使用 OpenAI Codex（GPT-6）。

[完整变更对比](https://github.com/buggen-null/open-code-review-enhanced/compare/v1.1.5-test...v1.1.6-test)
