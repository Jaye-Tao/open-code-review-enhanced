# open-code-review-enhanced 1.1.10-test

发布日期：2026-10-01

## 变更明细

- Git 仓库地址校验新增 `http://` 支持，适用于内网 Git 服务。
- 保留 `https://`、`ssh://` 和 `user@host:path` 格式支持。
- 增加 Git URL 格式回归测试。
- 主 npm 包及六个平台包升级为 `1.1.10-test`。

## 安装

```sh
npm install -g open-code-review-enhanced@1.1.10-test --allow-scripts=open-code-review-enhanced
```

基于 `codex/web-review-submissions`，对比 `v1.1.9-test` 整理。
