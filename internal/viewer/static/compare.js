// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 alibaba/open-code-review Contributors

(() => {
    const sections = [...document.querySelectorAll('[data-compare-section]')];
    const filters = [...document.querySelectorAll('[data-compare-filter]')];
    const pageSize = 6;
    let filter = 'all';
    const render = () => {
        filters.forEach(button => button.classList.toggle('is-active', button.dataset.compareFilter === filter));
        sections.forEach(section => {
            const visibleSection = filter === 'all' || section.dataset.compareSection === filter;
            section.hidden = !visibleSection;
            const items = [...section.querySelectorAll('[data-compare-item]')];
            const pager = section.querySelector('[data-compare-pager]');
            if (!visibleSection || items.length <= pageSize) {
                items.forEach(item => item.hidden = false);
                if (pager) pager.hidden = true;
                return;
            }
            let page = Number(section.dataset.page || 1);
            const total = Math.ceil(items.length / pageSize);
            page = Math.min(Math.max(page, 1), total);
            section.dataset.page = page;
            items.forEach((item, index) => item.hidden = index < (page - 1) * pageSize || index >= page * pageSize);
            if (pager) {
                pager.hidden = false;
                pager.innerHTML = `<button type="button" data-page="-1" ${page === 1 ? 'disabled' : ''}>${ocrT('上一页')}</button><span>${ocrFormatPage(page, total, items.length)}</span><button type="button" data-page="1" ${page === total ? 'disabled' : ''}>${ocrT('下一页')}</button>`;
                pager.querySelectorAll('[data-page]').forEach(button => button.addEventListener('click', () => { section.dataset.page = page + Number(button.dataset.page); render(); }));
            }
        });
    };
    filters.forEach(button => button.addEventListener('click', () => { filter = button.dataset.compareFilter; render(); }));
    render();
})();
