# 审核页面增强功能

本地启动：

```powershell
.\dist\ocr.exe viewer
```

当前源码构建出的程序在 `dist/ocr.exe`。系统中原来安装的 `ocr.cmd` 不会自动使用这个版本。

## Markdown 导出

会话列表点击 **Markdown**，详情页点击 **Export Markdown**。
命令行也可以导出指定会话或当前仓库最新会话：

```powershell
.\dist\ocr.exe session export --format md -o review.md
.\dist\ocr.exe session export <session-id> --format md -o review.md
```

报告包括会话信息、审核覆盖、Token 用量、全部问题、完整路径、行号、原代码和建议代码。
页面筛选及浏览器中的 Fixed/Ignored 标记不影响导出内容。

## 会话对比

在会话列表顶部选择 **Before**（修改前）和 **After**（修改后），点击 **Compare sessions**。
页面和 `ocr.cmd session compare` 使用同一个问题匹配算法。

- **New**：新增加的问题。
- **Persisting**：两次审核都发现的问题，即未修复问题。
- **Resolved**：重新审核后不再出现的问题，可视为待确认的已修复问题。
- **Not reviewed**：未成功重新审核的文件，不能判断问题是否已修复。

未修复和新增问题会给出 **Fix first**（优先修复）、**Recommended fix**（建议修复）、
**Review and schedule**（人工确认并排期）。优先级来自严重程度和问题类型，不是额外一次 AI 审核。
页面还显示问题数量、建议修复数量、会话时间、分支、模型和审核覆盖情况。
旧版会话缺少覆盖信息时会警告；文件改名或问题描述变化可能显示为“已消失 + 新增”。

## 删除与完整路径

列表的 **Delete** 或详情的 **Delete session** 会先弹出确认框，取消不会删除。
确认后永久删除该会话的 JSONL 记录，不删除源码和其他会话；失败会显示错误。

文件路径过长时保留省略展示，鼠标悬停显示完整路径，**Copy** 复制未截断路径。
浏览器拒绝剪贴板操作时会弹出可手动复制的完整路径。
