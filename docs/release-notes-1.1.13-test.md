# open-code-review-enhanced 1.1.13-test

发布日期：2026-10-02

## 变更明细

- 修复部署在 `/code-audit/` 等反向代理子路径时提交地址丢失前缀的问题。
- 提交表单、静态资源和成功跳转均使用当前页面前缀。
- 保留中文错误对话框和中文表单校验提示。
- 主 npm 包及六个平台包升级为 1.1.13-test。

## 安装

```sh
npm install -g open-code-review-enhanced@1.1.13-test --tag test --allow-scripts=open-code-review-enhanced
```

基于 codex/web-review-submissions，对比 v1.1.12-test 整理。