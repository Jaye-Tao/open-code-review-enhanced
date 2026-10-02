# open-code-review-enhanced 1.1.12-test

发布日期：2026-10-02

## 变更明细

- 提交失败改为页面内中文错误对话框，替代浏览器原生英文弹窗。
- 提交表单增加中文必填校验和友好的错误说明。
- Git 仓库地址、审核分支、对比分支、提交人和恢复会话校验提示统一为中文。
- 保留提交成功后直接进入审核任务列表的行为。
- 主 npm 包及六个平台包升级为 1.1.12-test。

## 安装

```sh
npm install -g open-code-review-enhanced@1.1.12-test --tag test --allow-scripts=open-code-review-enhanced
```

基于 codex/web-review-submissions，对比 v1.1.11-test 整理。