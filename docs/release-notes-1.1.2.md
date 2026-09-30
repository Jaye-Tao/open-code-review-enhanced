# open-code-review-enhanced 1.1.2

发布日期：2026-09-30

## 变更明细

### 查看器

- 新增按全部、已修复、已忽略和未标记状态筛选评审发现，并显示各状态数量。
- 标记状态可与严重级别、问题类型和搜索条件组合；选择明确的标记状态时，会暂时优先于“隐藏已标记”偏好。
- 查看器文档补充了标记筛选和计数行为。

### 评审结果与归因

- 修正代码段 Git 作者归属的重复展示，并改进无法获取 blame 信息时的回退行为。
- 在程序侧统一清除模型输出的归属行，确保归属信息来自 Git 数据。
- 移除评审正文中重复的问题编号标题，由界面负责显示编号。
- 更新默认评审提示，说明问题编号和归属字段的输出规则。

### 版本与发布资源

- 主 npm 包以及 Linux、macOS、Windows 的 x64/arm64 平台包统一升级为 `1.1.2`。

## 升级

```sh
npm install -g open-code-review-enhanced@1.1.2 --allow-scripts=open-code-review-enhanced
```

## 兼容性与来源

基于 `dev`，对比 `v1.1.0` 整理。

本次发布准备使用 OpenAI Codex（GPT-6）。

## 验证记录

- 发布前检查、自动化测试、六个平台二进制构建与 SHA256 校验结果将在发布完成后补充。

[完整变更对比](https://github.com/Jaye-Tao/open-code-review-enhanced/compare/v1.1.0...v1.1.2)
