# Release v1.1.15-test

- 修复提交审核表单在反向代理环境下 Git 仓库地址未传到服务端的问题。
- 使用标准 `application/x-www-form-urlencoded` 提交，兼容 Nginx、旧浏览器和代理转发。
- 保留子路径部署下的动态提交地址与任务列表跳转。

> 本版本的代码与发布内容由 AI/LLM 辅助生成，并由维护者审阅。