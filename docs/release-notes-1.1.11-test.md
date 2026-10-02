# open-code-review-enhanced 1.1.11-test

发布日期：2026-10-02

## 变更明细

- 提交审核改为后台提交，成功后直接进入审核任务列表，不再弹出成功窗口。
- 提交失败时弹窗显示服务端返回的具体错误信息。
- 优化目标分支和对比分支校验错误，明确显示输入值及允许的分支名称格式。
- 修复提交页面脚本未被嵌入发布资源的问题。
- 主 npm 包及六个平台包升级为 1.1.11-test。

## 安装

```sh
npm install -g open-code-review-enhanced@1.1.11-test --tag test --allow-scripts=open-code-review-enhanced
```

基于 codex/web-review-submissions，对比 v1.1.10-test 整理。