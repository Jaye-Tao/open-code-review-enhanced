// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 alibaba/open-code-review Contributors

(() => {
    const table = document.getElementById("sessions-table");
    const pager = document.getElementById("sessions-pagination");
    const numbers = document.getElementById("sessions-page-numbers");
    if (!table || !pager || !numbers) return;

    const input = document.querySelector('[data-session-search]');
    const empty = document.querySelector('[data-session-empty]');
    let query = '';
    const api = ocrPager({ table, pager, numbers, filter: row => row.textContent.toLowerCase().includes(query), onRender: rows => { if (empty) empty.hidden = rows.length !== 0; } });
    if (input) input.addEventListener('input', () => { query = input.value.trim().toLowerCase(); api.refresh(); });
    const form = document.querySelector('.compare-form');
    if (form) form.addEventListener('submit', event => {
        const before = form.elements.before, after = form.elements.after;
        after.setCustomValidity(before.value === after.value ? ocrT('请选择两个不同的会话') : '');
        if (!form.reportValidity()) event.preventDefault();
    });
    if (form) form.addEventListener('change', () => form.elements.after.setCustomValidity(''));
    ocrArrowScroll(document.querySelector(".sessions-page .table-scroll"));
})();
