# open-code-review-enhanced 1.1.5-test

发布日期：2026-10-01

## 变更明细

### Web 评审提交安全与代理兼容

- 修复反向代理终止 TLS 或重写 Host 时的评审提交来源校验。
- 同源请求优先使用 `X-Forwarded-Proto` 和 `X-Forwarded-Host` 判断来源，兼容多级代理的逗号分隔值。
- 当浏览器未发送 `Origin` 时，支持使用同源 `Referer` 校验；跨来源请求仍会被拒绝。

### 版本与发布资源

- 主 npm 包以及 Linux、macOS、Windows 的 x64/arm64 平台包统一升级为 `1.1.5-test`。
- 这是基于 `codex/web-review-submissions` 的测试版预发布版本。

## 安装

```sh
npm install -g open-code-review-enhanced@1.1.5-test --allow-scripts=open-code-review-enhanced
```

## 兼容性与来源

基于 `codex/web-review-submissions`，对比 `v1.1.4-test` 整理。

本次发布准备使用 OpenAI Codex（GPT-6）。

## 验证记录

- 已执行版本、安装器、启动器、viewer JavaScript 测试和 `go vet`。
- 六个平台二进制和 SHA256 校验将在发布构建阶段生成。

[完整变更对比](https://github.com/buggen-null/open-code-review-enhanced/compare/v1.1.4-test...v1.1.5-test)
