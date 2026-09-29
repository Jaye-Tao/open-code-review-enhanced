# open-code-review-enhanced 1.1.0

发布日期：2026-09-29

## 变更明细

### 审核结果与归因

- 在审核结果中保留 Git 作者信息，帮助定位发现对应的代码贡献者。
- 新增 diff 归因逻辑和模型数据结构，支持按行解析作者信息并展示在查看器和 Markdown 导出中。
- 改进分组审核、会话清单和结果输出，使归因数据贯穿审核流程。

### 稳定性与部署

- 增强审核超时恢复和重试处理，减少临时模型或网络错误导致的中断。
- 完善查看器代理前缀支持，确保部署在反向代理子路径时链接和静态资源可用。
- 更新 CLI、GitHub Actions 和多语言文档，反映新的输出与配置行为。

### 版本与发布资源

- 主 npm 包以及 Linux、macOS、Windows 的 x64/arm64 平台包统一升级为 `1.1.0`。
- 继承 1.0.8 的 Nginx 子路径资源支持、会话 ID 复制和查看器交互改进。

## 升级

```sh
npm install -g open-code-review-enhanced@1.1.0 --allow-scripts=open-code-review-enhanced
```

## 兼容性与来源

基于 `dev`，对比 `v1.0.8` 整理。

发布准备使用 OpenAI Codex（GPT-6）。

## 验证记录

- 已执行提交前 OCR 代码审查。
- 已构建 Linux、macOS、Windows 的 x64/arm64 六个平台二进制，并生成 SHA256 校验和。
- npm 启动器、版本判断、安装和 viewer JavaScript 测试按发布环境执行。

## 提交记录

- `f496d30` — 合并 Git 作者归因功能。
- `8bc9c9c` — 合并审核超时恢复改进。
- `12905d0` — 合并查看器代理子路径支持。

[完整变更对比](https://github.com/Jaye-Tao/open-code-review-enhanced/compare/v1.0.8...v1.1.0)
