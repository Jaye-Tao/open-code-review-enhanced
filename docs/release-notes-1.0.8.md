# open-code-review-enhanced 1.0.8

发布日期：2026-09-29

## 变更明细

### 查看器交互与部署

- 增加会话 ID 悬停复制入口，复制完整 ID 时保留原有会话导航行为。
- 修复复制按钮与会话链接之间的交互边界，并更新 viewer JavaScript 回归测试。
- 支持查看器静态资源部署在 Nginx 子路径下，修正资源 URL 生成和页面配置。
- 更新页面部署说明，补充反向代理子路径配置示例。

### 版本与发布资源

- 主 npm 包以及 Linux、macOS、Windows 的 x64/arm64 平台包统一升级为 `1.0.8`。
- 继承 1.0.7 的会话 ID 导航修复和复制操作边界改进。

## 升级

```sh
npm install -g open-code-review-enhanced@1.0.8 --allow-scripts=open-code-review-enhanced
```

## 兼容性与来源

基于 `dev`，对比 `v1.0.7` 整理。

发布准备使用 OpenAI Codex（GPT-6）。

## 验证记录

- 已执行提交前 OCR 代码审查。
- 已构建 Linux、macOS、Windows 的 x64/arm64 六个平台二进制，并生成 SHA256 校验和。
- npm 启动器、版本判断、安装和 viewer JavaScript 测试按发布环境执行。

## 提交记录

- `8b937c0` — 合并会话 ID 悬停复制功能。
- `b84e15e` — 增加会话 ID 悬停复制。
- `840fdf1` — 合并 Nginx 子路径资源支持。
- `9473644` — 支持 Nginx 子路径下的静态资源。

[完整变更对比](https://github.com/Jaye-Tao/open-code-review-enhanced/compare/v1.0.7...v1.0.8)
