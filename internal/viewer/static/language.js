// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 alibaba/open-code-review Contributors

(() => {
    const select = document.querySelector('[data-language-switch]');
    if (!select) return;
    const dictionary = {
        '代码审核工作台': 'Code Review Workbench', '审核工作台': 'Review Workspace', '代码仓库': 'Repositories', '审核会话': 'Review Sessions',
        '返回仓库': 'Back to repositories', '返回会话': 'Back to sessions', '搜索仓库名称': 'Search repositories', '搜索会话、分支或模型': 'Search sessions, branches or models',
        '对比两个会话': 'Compare two sessions', '审核前': 'Before review', '审核后': 'After review', '开始对比': 'Compare', '会话对比': 'Session Comparison',
        '导出': 'Export', '导出 Markdown': 'Export Markdown', '删除': 'Delete', '删除会话': 'Delete session', '操作': 'Actions', '状态': 'Status',
        '仓库': 'Repository', '会话': 'Session', '分支': 'Branch', '起点分支': 'Base branch', '目标分支': 'Target branch', '审核类型': 'Review type', '审核方式': 'Review mode', '模型': 'Model', '文件': 'Files', '问题': 'Findings', '耗时': 'Duration', '开始时间': 'Started', '最近修改': 'Last modified', '会话数': 'Sessions',
        '新增问题': 'New findings', '未修复问题': 'Unresolved findings', '疑似已修复': 'Apparently resolved', '尚未复查': 'Not reviewed', '筛选结果': 'Filter results', '全部': 'All', '新增': 'New', '未修复': 'Unresolved', '处理建议': 'Recommendation', '优先修复': 'Fix first', '建议修复': 'Recommended fix', '评估后排期': 'Review and schedule', '现有代码': 'Existing code', '建议修改': 'Suggested change',
        '删除这条会话？': 'Delete this session?', '删除这个仓库？': 'Delete this repository?', '取消': 'Cancel', '确认删除': 'Confirm delete', '删除后无法恢复。仅删除审核记录，不影响项目源码。': 'This cannot be undone. Only review records are removed; source files are not affected.', '还没有审核数据': 'No review data yet', '暂无会话': 'No sessions', '没有符合条件的会话，请尝试其他关键词。': 'No matching sessions.', '中文': 'Chinese', 'English': 'English'
    };
    const original = new WeakMap();
    const textNodes = () => { const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); const nodes=[]; while(walker.nextNode()) nodes.push(walker.currentNode); return nodes; };
    function setLanguage(lang) {
        document.documentElement.lang = lang;
        for (const node of textNodes()) {
            if (!original.has(node)) original.set(node, node.nodeValue);
            const value = original.get(node);
            if (lang === 'en') node.nodeValue = value.replace(/代码审核工作台|代码仓库|审核会话|返回仓库|搜索仓库名称|搜索会话、分支或模型|对比两个会话|审核前|审核后|开始对比|导出|删除会话|删除|操作|状态|暂无会话|没有符合条件的会话，请尝试其他关键词。/g, key => dictionary[key] || key);
            else node.nodeValue = value;
        }
        localStorage.setItem('ocr-viewer-language', lang);
        select.value = lang;
    }
    const saved = localStorage.getItem('ocr-viewer-language') || 'zh-CN';
    select.addEventListener('change', () => setLanguage(select.value));
    setLanguage(saved);
})();
