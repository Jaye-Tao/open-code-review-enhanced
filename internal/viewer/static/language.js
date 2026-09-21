// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 alibaba/open-code-review Contributors

(() => {
    const select = document.querySelector('[data-language-switch]');
    if (!select) return;
    const dictionary = {
        '代码审核工作台':'Code Review Workbench','审核工作台':'Review Workspace','代码仓库':'Repositories','审核会话':'Review Sessions','审核分析':'Review analysis',
        '查看审核结果，或选择两个会话进行问题变化对比。':'Review results or compare changes between two sessions.','选择仓库查看审核会话、问题明细和历史对比。':'Choose a repository to view sessions, findings and history.',
        '返回仓库':'Back to repositories','返回会话':'Back to sessions','搜索仓库':'Search repositories','搜索仓库名称':'Search repository names','搜索会话':'Search sessions','搜索会话、分支或模型':'Search sessions, branches or models',
        '对比两个会话':'Compare two sessions','建议选择较早的会话作为“审核前”，较新的会话作为“审核后”。':'Choose the older session as “Before” and the newer one as “After”.','审核前':'Before review','审核后':'After review','开始对比':'Compare','会话对比':'Session comparison','对比两次审核的问题变化，确认哪些问题已消失、仍然存在，或尚未复查。':'Compare findings between reviews to see what was fixed, remains, or was not reviewed.',
        '导出':'Export','导出 HTML':'Export HTML','导出 Markdown':'Export Markdown','删除':'Delete','删除会话':'Delete session','操作':'Actions','状态':'Status','需要注意':'注意','筛选结果':'Filter results','问题多时可按状态筛选':'Filter by status when there are many findings',
        '仓库':'Repository','会话':'Session','分支':'Branch','起点分支':'Base branch','目标分支':'Target branch','审核类型':'Review type','审核方式':'Review mode','模型':'Model','文件':'Files','问题':'Findings','耗时':'Duration','开始时间':'Started','最近修改':'Last modified','会话数':'Sessions','数据按最近修改时间排序':'Sorted by last modified time',
        '新增问题':'New findings','未修复问题':'Unresolved findings','疑似已修复':'Apparently resolved','尚未复查':'Not reviewed','全部':'All','新增':'New','未修复':'Unresolved','处理建议':'Recommendation','优先修复':'Fix first','建议修复':'Recommended fix','评估后排期':'Review and schedule','现有代码':'Existing code','建议修改':'Suggested change','审核后新发现的问题，建议纳入当前修复计划。':'Findings first seen after the review; add them to the current fix plan.','两次审核都发现的问题，优先处理高风险项。':'Findings present in both reviews; prioritize high-risk items.','审核后未再发现的问题，仍建议结合测试和变更内容确认。':'Findings no longer detected; confirm with tests and the changes.','审核后没有成功复查的问题，不能直接视为已修复。':'Findings that were not successfully reviewed cannot be considered fixed.',
        '结果概览':'Results overview','按问题状态查看本次对比结果。':'View comparison results by finding status.','复查':'reviewed','已完成':'completed','复用':'reused','审核覆盖':'Review coverage','选中文件':'Selected files','复用结果':'Reused results','失败':'Failed','跳过':'Skipped','Token 用量':'Token usage','输入 Token':'Input tokens','输出 Token':'Output tokens','Token 总量':'Total tokens','模型请求':'Model requests','按文件统计':'By file','个文件':'files',
        '删除这条会话？':'Delete this session?','删除这个仓库？':'Delete this repository?','取消':'Cancel','确认删除':'Confirm delete','删除后无法恢复。仅删除审核记录，不影响项目源码。':'This cannot be undone. Only review records are removed; source files are not affected.','还没有审核数据':'No review data yet','完成一次代码审核后，会话会自动出现在这里。':'Sessions appear here after a review is completed.','暂无会话':'No sessions','这个仓库还没有可展示的审核会话。':'This repository has no review sessions yet.','没有符合条件的会话，请尝试其他关键词。':'No matching sessions.','当前分类没有问题。':'No findings in this category.','中文':'Chinese','每页':'Per page','条':'items','全部':'All','上一页':'Previous page','下一页':'Next page','仓库分页':'Repository pagination','会话分页':'Session pagination','选择语言':'Select language'
    };
    const original = new Map();
    const textNodes = () => { const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); const nodes=[]; while(walker.nextNode()) nodes.push(walker.currentNode); return nodes; };
    const attributes = ['title', 'placeholder', 'aria-label'];
    function translateValue(value, lang) {
        if (lang !== 'en') return value;
        return Object.keys(dictionary).sort((a, b) => b.length - a.length).reduce((text, key) => text.split(key).join(dictionary[key]), value);
    }
    function setLanguage(lang) {
        document.documentElement.lang = lang;
        for (const node of textNodes()) {
            if (!original.has(node)) original.set(node, node.nodeValue);
            node.nodeValue = translateValue(original.get(node), lang);
        }
        document.querySelectorAll('*').forEach(element => attributes.forEach(attribute => {
            if (!element.hasAttribute(attribute)) return;
            const key = attribute + ':' + element.getAttribute(attribute);
            if (!original.has(key)) original.set(key, element.getAttribute(attribute));
            element.setAttribute(attribute, translateValue(original.get(key), lang));
        }));
        if (select) {
            select.setAttribute('aria-label', lang === 'en' ? 'Select language' : '选择语言');
            select.value = lang;
        }
        localStorage.setItem('ocr-viewer-language', lang);
    }
    const saved = localStorage.getItem('ocr-viewer-language') || 'zh-CN';
    select.addEventListener('change', () => setLanguage(select.value));
    setLanguage(saved);
    new MutationObserver(() => setLanguage(localStorage.getItem('ocr-viewer-language') || 'zh-CN')).observe(document.body, { childList: true, subtree: true });
})();
