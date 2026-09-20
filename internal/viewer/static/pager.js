// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 alibaba/open-code-review Contributors

// Shared client-side pager for the viewer's list pages. The page script
// looks up its own elements and hands them to ocrPager, which hides every
// row, reveals the current page slice, and renders the page-number buttons.
// `filter` narrows the row list (the repositories search); when its external
// state changes, call refresh() to re-apply it from page 1.
(() => {
    const NEIGHBOURS = 2;

    // Pages [1, total] plus a window of NEIGHBOURS pages around the
    // current one; a gap wider than 2 collapses into an ellipsis.
    const pageList = (total, current) => {
        if (total <= 5) {
            return Array.from({ length: total }, (_, index) => index + 1);
        }
        const wanted = [1, total];
        for (let page = current - NEIGHBOURS; page <= current + NEIGHBOURS; page++) {
            wanted.push(page);
        }
        const pages = wanted
            .filter((page) => page >= 1 && page <= total)
            .filter((page, index, all) => all.indexOf(page) === index)
            .sort((a, b) => a - b);
        const items = [];
        let previous = 0;
        for (const page of pages) {
            if (page - previous > 2) items.push(null);
            if (page - previous === 2) items.push(page - 1);
            items.push(page);
            previous = page;
        }
        return items;
    };

    window.ocrPager = ({ table, pager, numbers, pageSize = 10, filter, rows: suppliedRows, onRender }) => {
        const rows = suppliedRows || Array.from(table.querySelectorAll("tbody tr"));
        const sizeControl = pager.querySelector("[data-page-size]");
        if (sizeControl) sizeControl.value = String(pageSize);
        const steps = Array.from(pager.querySelectorAll("[data-page-step]"));
        const matches = filter || (() => true);
        let current = 1;

        const render = (page) => {
            if (page !== undefined) {
                current = page;
            }
            // Filter once; both the page count and the visibility loop read
            // the same filtered list.
            const filtered = rows.filter(matches);
            const total = Math.max(1, Math.ceil(filtered.length / (pageSize || Math.max(1, filtered.length))));
            current = Math.min(Math.max(current, 1), total);
            for (const row of rows) {
                row.hidden = true;
            }
            const size = pageSize || Math.max(1, filtered.length);
            for (const row of filtered.slice((current - 1) * size, current * size)) {
                row.hidden = false;
            }

            const hadFocus = numbers.contains(document.activeElement);
            numbers.replaceChildren();
            for (const item of pageList(total, current)) {
                if (item === null) {
                    const gap = document.createElement("span");
                    gap.className = "page-gap";
                    gap.setAttribute("aria-hidden", "true");
                    gap.textContent = "…";
                    numbers.append(gap);
                    continue;
                }
                const button = document.createElement("button");
                button.type = "button";
                button.className = "page-number";
                button.textContent = String(item);
                button.setAttribute("aria-label", `第 ${item} 页`);
                if (item === current) {
                    button.setAttribute("aria-current", "page");
                }
                button.addEventListener("click", () => render(item));
                numbers.append(button);
            }
            if (hadFocus) {
                const active = numbers.querySelector('[aria-current="page"]');
                if (active) active.focus({ preventScroll: true });
            }

            const focused = steps.find((step) => document.activeElement === step);
            for (const step of steps) {
                const delta = Number(step.dataset.pageStep);
                step.disabled = delta < 0 ? current === 1 : current === total;
            }
            if (focused && focused.disabled) {
                const fallback = steps.find((step) => !step.disabled);
                if (fallback) fallback.focus({ preventScroll: true });
            }

            pager.hidden = false;
            const summary = pager.querySelector("[data-pagination-summary]");
            if (summary) summary.textContent = `${filtered.length} 条记录 · 第 ${current}/${total} 页`;
            if (onRender) onRender(filtered);
        };

        for (const step of steps) {
            step.addEventListener("click", () => render(current + Number(step.dataset.pageStep)));
        }

        if (sizeControl) sizeControl.addEventListener("change", () => { pageSize = Number(sizeControl.value); render(1); });
        render();

        return { refresh: () => render(1) };
    };
})();
