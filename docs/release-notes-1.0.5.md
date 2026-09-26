# open-code-review-enhanced 1.0.5

发布日期：2026-09-26

## 变更明细

### 查看器进度跟踪

- 修复查看器在审核文件仍处于处理中时进度显示不足的问题。
- 统计正在执行的审核文件，并在会话重新加载后保留活动审核状态。
- 改进会话持久化和历史记录，使进行中的文件对进度计算可见，同时避免将未完成文件误判为已完成。
- 补充 store、handler 和持久化回归测试，覆盖活动项目及进度恢复场景。

### 版本与发布资源

- 主 npm 包以及 Linux、macOS、Windows 的 x64/arm64 平台包统一升级为 `1.0.5`。
- 继承 1.0.4 的旧会话进度恢复、内置审查提示词和查看器实时进度能力。

## 升级

```sh
npm install -g open-code-review-enhanced@1.0.5 --allow-scripts=open-code-review-enhanced
```

## 兼容性与来源

基于 `feat/review-dashboard-integrated`，对比 `v1.0.4` 整理。

发布准备使用 OpenAI Codex（GPT-6）。

## 验证记录

- 已执行提交前 OCR 代码审查。
- 已构建 Linux、macOS、Windows 的 x64/arm64 六个平台二进制，并生成 SHA256 校验和。
- npm 启动器、版本判断、安装和 viewer JavaScript 测试按发布环境执行。

## 提交记录

- `9e0b509` — 修复查看器对审核中文件的进度统计。

[完整变更对比](https://github.com/Jaye-Tao/open-code-review-enhanced/compare/v1.0.4...v1.0.5)
