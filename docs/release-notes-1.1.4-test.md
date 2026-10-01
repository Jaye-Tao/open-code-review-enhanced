# open-code-review-enhanced 1.1.4-test

发布日期：2026-10-01

## 变更明细

### Web 评审工作台

- 将 Web 评审提交流程拆分为“提交审核”和“审核任务”页面，提供统一的工作台导航。
- 新增 `/submit`、`/tasks` 和 `/repos` 路由，并保留旧提交入口的兼容跳转。
- 任务页面增加全部、排队中、审核中、成功和失败统计，以及查看结果、重新提交和取消操作。
- 允许通过同源远程访问提交和取消审核任务，同时继续拒绝跨来源请求。
- 优化仓库名称展示、提交表单分组、任务表格和移动端样式。

### 版本与发布资源

- 主 npm 包以及 Linux、macOS、Windows 的 x64/arm64 平台包统一升级为 `1.1.4-test`。
- 这是基于 `codex/web-review-submissions` 的测试版预发布版本。

## 安装

```sh
npm install -g open-code-review-enhanced@1.1.4-test --allow-scripts=open-code-review-enhanced
```

## 兼容性与来源

基于 `codex/web-review-submissions`，对比 `v1.1.3-test` 整理。

本次发布准备使用 OpenAI Codex（GPT-6）。

## 验证记录

- 已执行版本、安装器、启动器、viewer JavaScript 测试和 `go vet`。
- 六个平台二进制和 SHA256 校验将在发布构建阶段生成。

[完整变更对比](https://github.com/buggen-null/open-code-review-enhanced/compare/v1.1.3-test...v1.1.4-test)
