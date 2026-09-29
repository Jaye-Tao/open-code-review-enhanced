# open-code-review-enhanced 1.0.7

发布日期：2026-09-29

## 变更明细

### 查看器交互

- 修复会话 ID 链接被复制操作拦截的问题，保留完整会话导航行为。
- 将复制操作限制在明确标记的路径元素上，避免影响会话链接和其他交互。
- 更新 viewer JavaScript 回归测试，覆盖会话 ID 导航与路径复制边界。

### 版本与发布资源

- 主 npm 包以及 Linux、macOS、Windows 的 x64/arm64 平台包统一升级为 `1.0.7`。
- 继承 1.0.6 的安全响应头、查看器体验改进和中文 CLI/npm 安装指南。

## 升级

```sh
npm install -g open-code-review-enhanced@1.0.7 --allow-scripts=open-code-review-enhanced
```

## 兼容性与来源

基于 `dev`，对比 `v1.0.6` 整理。

发布准备使用 OpenAI Codex（GPT-6）。

## 验证记录

- 已执行提交前 OCR 代码审查。
- 已构建 Linux、macOS、Windows 的 x64/arm64 六个平台二进制，并生成 SHA256 校验和。
- npm 启动器、版本判断、安装和 viewer JavaScript 测试按发布环境执行。

## 提交记录

- `01beb3b` — 合并会话 ID 导航修复。
- `dde72ce` — 修复会话 ID 导航保持行为。

[完整变更对比](https://github.com/Jaye-Tao/open-code-review-enhanced/compare/v1.0.6...v1.0.7)
