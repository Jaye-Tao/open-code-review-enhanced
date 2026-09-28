# open-code-review-enhanced 1.0.6

发布日期：2026-09-28

## 变更明细

### 查看器体验与安全

- 增加查看器安全响应头，改善浏览器端的安全默认值。
- 改进会话、对比和审核操作的交互反馈，包括完整会话 ID、失败文件和进行中状态展示。
- 优化查看器页面的响应式布局、样式和状态操作。
- 更新默认审查提示词，统一审核输出要求。

### 文档与安装

- 新增中文 CLI 使用指南 `docs/cli-usage.zh-CN.md`。
- 新增中文 npm 安装指南 `docs/npm-installation.zh-CN.md`。
- 主 npm 包以及 Linux、macOS、Windows 的 x64/arm64 平台包统一升级为 `1.0.6`。

## 升级

```sh
npm install -g open-code-review-enhanced@1.0.6 --allow-scripts=open-code-review-enhanced
```

## 兼容性与来源

基于 `dev`，对比 `v1.0.5` 整理。

发布准备使用 OpenAI Codex（GPT-6）。

## 验证记录

- 已执行提交前 OCR 代码审查。
- 已构建 Linux、macOS、Windows 的 x64/arm64 六个平台二进制，并生成 SHA256 校验和。
- npm 启动器、版本判断、安装和 viewer JavaScript 测试按发布环境执行。

## 提交记录

- `814c040` — 合并中文文档指南。
- `0bad693` — 合并查看器集成变更。

[完整变更对比](https://github.com/Jaye-Tao/open-code-review-enhanced/compare/v1.0.5...v1.0.6)
