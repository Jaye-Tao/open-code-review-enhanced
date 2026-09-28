// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 alibaba/open-code-review Contributors

// The viewer renders data on the server and also creates controls in several
// browser scripts.  Keep one locale registry at the document boundary so both
// paths use the same source keys instead of maintaining page-specific switchers.
(() => {
    const selector = '[data-language-switch]';
    const select = document.querySelector(selector);

    const messages = {
        '代码审核工作台': 'Code Review Workbench', '审核工作台': 'Review Workspace', '代码仓库': 'Repositories', '审核会话': 'Review Sessions', '审核会话详情': 'Review session details', '审核分析': 'Review analysis',
        '查看审核结果，或选择两个会话进行问题变化对比。': 'Review results or compare changes between two sessions.', '选择仓库查看审核会话、问题明细和历史对比。': 'Choose a repository to view sessions, findings and history.',
        '返回仓库': 'Back to repositories', '返回会话': 'Back to sessions', '查看会话': 'View sessions', '搜索仓库': 'Search repositories', '搜索仓库名称': 'Search repository names', '搜索会话': 'Search sessions', '搜索会话、分支或模型': 'Search sessions, branches, or models', '搜索问题': 'Search findings', '文件路径或问题描述': 'File path or finding description',
        '对比两个会话': 'Compare two sessions', '建议选择较早的会话作为“审核前”，较新的会话作为“审核后”。': 'Choose the older session as “Before review” and the newer one as “After review”.', '审核前': 'Before review', '审核后': 'After review', '开始对比': 'Compare', '对比': 'Compare', '会话对比': 'Session comparison', '对比两次审核的问题变化，确认哪些问题已消失、仍然存在，或尚未复查。': 'Compare findings between reviews to see what was fixed, remains, or was not reviewed.',
        '导出': 'Export', '导出 HTML': 'Export HTML', '导出 Markdown': 'Export Markdown', '选择导出格式': 'Select export format', '删除': 'Delete', '删除会话': 'Delete session', '操作': 'Actions', '状态': 'Status', '需要注意': 'Notice', '筛选结果': 'Filter results', '问题多时可按状态筛选': 'Filter by status when there are many findings',
        '仓库': 'Repository', '会话': 'Session', '审核分支': 'Review branch', '分支': 'Branch', '起点分支': 'Base branch', '目标分支': 'Target branch', '审核类型': 'Review type', '审核方式': 'Review mode', '方式': 'Mode', '起点': 'Base', '终点': 'Target', '提交': 'Commit', '目录': 'Directory', '模型': 'Model', '文件': 'Files', '问题': 'Findings', '审核问题': 'Review findings', '耗时': 'Duration', '开始时间': 'Started', '最近修改': 'Last modified', '会话数': 'Sessions', '进度': 'Progress', '数据按最近修改时间排序': 'Sorted by last modified time',
        '提交对比': 'Commit comparison', '范围对比': 'Range comparison', '工作区': 'Working tree', '暂存区': 'Staging area', '分支类型': 'Branch review', 'Merge 类型': 'Merge review', '未设置': 'Not set', '未知': 'Unknown',
        '新增问题': 'New findings', '未修复问题': 'Unresolved findings', '仍未修复': 'Still unresolved', '疑似已修复': 'Apparently resolved', '尚未复查': 'Not reviewed', '全部': 'All', '新增': 'New', '未修复': 'Unresolved', '待处理': 'Action needed', '待确认': 'Needs confirmation', '处理建议': 'Recommendation', '优先修复': 'Fix first', '建议修复': 'Recommended fix', '评估后排期': 'Review and schedule', '现有代码': 'Existing code', '建议修改': 'Suggested change', '审核后新发现的问题，建议纳入当前修复计划。': 'Findings first seen after the review; add them to the current fix plan.', '两次审核都发现的问题，优先处理高风险项。': 'Findings present in both reviews; prioritize high-risk items.', '审核后未再发现的问题，仍建议结合测试和变更内容确认。': 'Findings no longer detected; confirm with tests and the changes.', '审核后没有成功复查的问题，不能直接视为已修复。': 'Findings that were not successfully reviewed cannot be considered fixed.', '当前分类没有问题。': 'No findings in this category.',
        '结果概览': 'Results overview', '按问题状态查看本次对比结果。': 'View comparison results by finding status.', '仅在审核后出现': 'Present only after the review', '两次审核均存在': 'Present in both reviews', '已复查文件中消失': 'No longer found in reviewed files', '无法判断修复状态': 'Fix status cannot be determined',
        '审核覆盖': 'Review coverage', '选中文件': 'Selected files', '已完成': 'Completed', '复用': 'Reused', '复用结果': 'Reused results', '未变更文件 · 复用结果': 'Unchanged file · reused result', '失败': 'Failed', '跳过': 'Skipped', '请求失败': 'Request failures', 'Token 用量': 'Token usage', '输入 Token': 'Input tokens', '输出 Token': 'Output tokens', 'Token 总量': 'Total tokens', '模型请求': 'Model requests', '缓存读取': 'Cache reads', '缓存写入': 'Cache writes', '按文件统计': 'By file', '文件用量统计': 'File token usage', '合计': 'Total',
        '严重程度': 'Severity', '按严重程度筛选': 'Filter by severity', '严重': 'Critical', '高': 'High', '中': 'Medium', '低': 'Low', '未标注': 'Unspecified', '问题类型': 'Finding type', '按类型筛选': 'Filter by type', 'BUG': 'BUG', '安全': 'Security', '性能': 'Performance', '可维护性': 'Maintainability', '测试': 'Tests', '代码风格': 'Code style', '文档': 'Documentation', '其他': 'Other', '隐藏已标记': 'Hide marked', '清除全部标记': 'Clear all marks', '已修复': 'Fixed', '已忽略': 'Ignored', '清除标记': 'Clear mark', '问题唯一 ID': 'Unique finding ID',
        '审核文件': 'Reviewed files', '会话任务': 'Session tasks', '审核过程': 'Review process', '审核规划': 'Review planning', '代码审核': 'Code review', '文件分组': 'File grouping', '上下文整理': 'Context consolidation', '问题定位': 'Finding location', '请求': 'Request', '错误': 'Error', '错误详情': 'Error details', '推理过程': 'Reasoning', '模型原始响应': 'Raw model response', '工具调用': 'Tool calls', '查看详情': 'View details', '参数': 'Arguments', '结果': 'Result',
        '审核中': 'In review', '已中止': 'Aborted', '旧版会话': 'Legacy session', '部分完成': 'Partially complete', '已跳过': 'Skipped',
        '删除这条会话？': 'Delete this session?', '删除这个仓库？': 'Delete this repository?', '取消': 'Cancel', '关闭': 'Close', '确认删除': 'Confirm delete', '正在删除…': 'Deleting…', '重试删除': 'Retry deletion', '删除后无法恢复。仅删除审核记录，不影响项目源码。': 'This cannot be undone. Only review records are removed; source files are not affected.', '将删除该仓库的全部审核会话记录，不会影响项目源码。': 'All review sessions for this repository will be deleted. Source files are not affected.', '无法连接服务，请检查连接后重试。': 'Unable to connect. Check the connection and try again.', '请求未通过验证，请刷新页面后重试。': 'Request was rejected. Refresh the page and try again.', '删除失败，请稍后重试。': 'Deletion failed. Try again later.', '删除仓库失败，请稍后重试。': 'Repository deletion failed. Try again later.', '复制': 'Copy', '复制完整路径': 'Copy full path', '完整路径已复制': 'Full path copied', '完整路径': 'Full path', '复制路径': 'Copy path', '浏览器暂时无法写入剪贴板，请选中后手动复制。': 'The browser cannot write to the clipboard. Select and copy the path manually.',
        '还没有审核数据': 'No review data yet', '完成一次代码审核后，会话会自动出现在这里。': 'Sessions appear here after a review is completed.', '暂无会话': 'No sessions', '这个仓库还没有可展示的审核会话。': 'This repository has no review sessions yet.', '没有符合条件的会话，请尝试其他关键词。': 'No matching sessions. Try another search.', '没有符合筛选条件的问题。': 'No findings match the selected filters.', '符合条件的问题已被标记隐藏，可关闭“隐藏已标记”查看。': 'Matching findings are hidden by marks. Turn off “Hide marked” to view them.', '浏览器存储不可用，标记尚未保存': 'Browser storage is unavailable; marks have not been saved.',
        '选择语言': 'Select language', '中文': 'Chinese', '每页': 'Per page', '每页条数': 'Items per page', '上一页': 'Previous page', '下一页': 'Next page', '仓库列表': 'Repository list', '审核会话列表': 'Review session list', '仓库分页': 'Repository pagination', '会话分页': 'Session pagination', '问题分页': 'Finding pagination', '请选择两个不同的会话': 'Select two different sessions',
        '个文件': 'files', '条问题': 'findings', '项任务': 'tasks', '次请求': 'requests', '第': 'Page ', '页': '', '行': 'line', '共': 'Total'
    };
    const sortedKeys = Object.keys(messages).sort((a, b) => b.length - a.length);
    const sourceText = new WeakMap();
    const sourceAttributes = new WeakMap();
    const sourceTitle = document.title;
    const excluded = 'pre, code, .response-text, .finding-content, .comment-content, [data-i18n-skip]';
    const language = () => localStorage.getItem('ocr-viewer-language') || 'zh-CN';
    const translate = (value, locale = language()) => {
        if (locale !== 'en' || !value) return value;
        return sortedKeys.reduce((text, key) => text.split(key).join(messages[key]), value);
    };
    window.ocrT = translate;
    window.ocrFormatCount = (count, noun = 'items') => language() === 'en' ? `${count} ${noun}` : `${count} 条`;
    window.ocrFormatPage = (current, total, count) => language() === 'en' ? `${count} items · Page ${current} of ${total}` : `${count} 条记录 · 第 ${current}/${total} 页`;
    if (!select) return;
    const translatableNode = node => node.parentElement && !node.parentElement.closest(excluded);
    function render(locale) {
        document.documentElement.lang = locale;
        document.title = translate(sourceTitle, locale);
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) {
            const node = walker.currentNode;
            if (!translatableNode(node)) continue;
            if (!sourceText.has(node)) sourceText.set(node, node.nodeValue);
            node.nodeValue = translate(sourceText.get(node), locale);
        }
        document.querySelectorAll('*').forEach(element => {
            if (element.closest(excluded)) return;
            const attrs = ['title', 'placeholder', 'aria-label'];
            if (!sourceAttributes.has(element)) sourceAttributes.set(element, new Map());
            const original = sourceAttributes.get(element);
            attrs.forEach(name => {
                if (!element.hasAttribute(name)) return;
                if (!original.has(name)) original.set(name, element.getAttribute(name));
                element.setAttribute(name, translate(original.get(name), locale));
            });
        });
        select.value = locale;
        select.setAttribute('aria-label', locale === 'en' ? 'Select language' : '选择语言');
        localStorage.setItem('ocr-viewer-language', locale);
    }
    select.addEventListener('change', () => render(select.value));
    document.addEventListener('submit', event => {
        const form = event.target.closest && event.target.closest('form.export-form');
        if (!form) return;
        const url = new URL(form.action, window.location.href);
        url.searchParams.set('lang', localStorage.getItem('ocr-viewer-language') || 'zh-CN');
        form.action = url.toString();
    });
    render(language());
    let queued = false;
    new MutationObserver(() => {
        if (queued) return;
        queued = true;
        queueMicrotask(() => { queued = false; render(language()); });
    }).observe(document.body, { childList: true, subtree: true });
})();
