// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 alibaba/open-code-review Contributors

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../internal/viewer/static/session.js', import.meta.url), 'utf8');
const pagerSource = readFileSync(new URL('../internal/viewer/static/pager.js', import.meta.url), 'utf8');
const template = readFileSync(new URL('../internal/viewer/templates/session.html', import.meta.url), 'utf8');
const languageSource = readFileSync(new URL('../internal/viewer/static/language.js', import.meta.url), 'utf8');

test('template places all mark states below category filters and above mark actions', () => {
    const category = template.indexOf('data-filter-kind="category"');
    const mark = template.indexOf('data-filter-kind="mark"');
    const actions = template.indexOf('class="marks-row"');
    assert.ok(category > 0 && mark > category && actions > mark);
    for (const state of ['all', 'fixed', 'ignored', 'unmarked']) {
        assert.ok(template.includes(`data-filter-kind="mark" data-filter-value="${state}"`));
        assert.ok(template.includes(`data-mark-filter-count="${state}"`));
    }
});

test('mark status labels translate without translating or replacing count elements', () => {
    let locale = 'en';
    const context = { document: { querySelector: () => null, title: '' }, window: {}, localStorage: { getItem: () => locale } };
    runInNewContext(languageSource, context);
    const labels = [
        ['\u6807\u8bb0\u72b6\u6001', 'Mark status'],
        ['\u6309\u6807\u8bb0\u72b6\u6001\u7b5b\u9009', 'Filter by mark state'],
        ['\u672a\u6807\u8bb0', 'Unmarked'],
        ['\u5df2\u4fee\u590d', 'Fixed'],
        ['\u5df2\u5ffd\u7565', 'Ignored'],
    ];
    for (const [source, expected] of labels) assert.equal(context.window.ocrT(source), expected);
    locale = 'zh-CN';
    for (const [source] of labels) assert.equal(context.window.ocrT(source), source);
});

// Minimal DOM surface for executing the production session script and pager.
function element(dataset = {}) {
    const handlers = {};
    const attrs = {};
    return {
        dataset, hidden: false, textContent: '', children: [],
        classList: { toggle() {} },
        addEventListener(type, handler) { handlers[type] = handler; },
        fire(type = 'click') { handlers[type]?.(); },
        setAttribute(name, value) { attrs[name] = value; },
        getAttribute(name) { return attrs[name]; },
        contains() { return false; },
        append(child) { this.children.push(child); },
        replaceChildren() { this.children = []; },
        querySelector() { return null; },
        querySelectorAll() { return []; },
    };
}

function page({ storage = new Map(), path = '/r/repo/s1', total = 3, unavailable = false } = {}) {
    const filters = [];
    for (const [kind, values] of Object.entries({ severity: ['all', 'high', 'low'], category: ['all', 'bug', 'security'], mark: ['all', 'fixed', 'ignored', 'unmarked'] })) {
        for (const value of values) filters.push(element({ filterKind: kind, filterValue: value }));
    }
    const group = element();
    const groupCount = element();
    const cards = Array.from({ length: total }, (_, i) => {
        const card = element({ markId: String(i), category: i === 1 ? 'security' : 'bug', severity: i === 1 ? 'low' : 'high' });
        card.textContent = `Finding ${i}`;
        card.chip = element();
        card.querySelector = () => card.chip;
        card.closest = () => group;
        return card;
    });
    group.querySelectorAll = () => cards;
    group.querySelector = selector => selector === '[data-copy-path]' ? element({ copyPath: 'src/main.go' }) : groupCount;
    const buttons = cards.flatMap(card => ['fixed', 'ignored', ''].map(state => {
        const button = element({ setMark: state });
        button.closest = () => card;
        return button;
    }));
    const controls = Object.fromEntries(['hide-marked', 'marks-count', 'clear-all-marks', 'comment-search', 'comment-filter-empty'].map(key => [`[data-${key}]`, element()]));
    const counts = Object.fromEntries(['all', 'fixed', 'ignored', 'unmarked'].map(key => [key, element()]));
    const pager = element();
    const numbers = element();
    const document = {
        documentElement: { lang: 'en' },
        createElement: () => element(),
        getElementById: id => id === 'findings-pagination' ? pager : numbers,
        querySelectorAll: selector => ({
            '.comment-filter-chip[data-filter-kind]': filters, '.comment-file-group': [group],
            '[data-comment-card]': cards, '[data-set-mark]': buttons,
        })[selector] || [],
        querySelector: selector => controls[selector] || counts[/data-mark-filter-count="(.*?)"/.exec(selector)?.[1]] || null,
    };
    const context = { document, console: { error() {} }, ocrArrowScroll() {}, ocrT: text => text, ocrFormatPage: () => '', window: { location: { pathname: path } }, localStorage: {
        getItem(key) { if (unavailable) throw Error('storage disabled'); return storage.get(key) ?? null; },
        setItem(key, value) { if (unavailable) throw Error('storage disabled'); storage.set(key, value); },
        removeItem(key) { if (unavailable) throw Error('storage disabled'); storage.delete(key); },
    } };
    runInNewContext(pagerSource, context);
    context.ocrPager = context.window.ocrPager;
    runInNewContext(source, context);
    return {
        cards, counts, controls, storage, group, groupCount, numbers,
        filter(kind, value) { const button = filters.find(f => f.dataset.filterKind === kind && f.dataset.filterValue === value); button.fire(); return button; },
        mark(index, value) { buttons.find(b => b.closest() === cards[index] && b.dataset.setMark === value).fire(); },
        visible() { return cards.filter(c => !c.hidden).map(c => c.dataset.markId); },
    };
}

test('mark filters override hiding, combine with category/severity/search, and report actual hidden count', () => {
    const p = page();
    p.mark(0, 'fixed');
    p.mark(1, 'ignored');
    assert.deepEqual(p.visible(), ['2']);
    assert.deepEqual(Object.fromEntries(Object.entries(p.counts).map(([k, v]) => [k, Number(v.textContent)])), { all: 3, fixed: 1, ignored: 1, unmarked: 1 });
    assert.equal(p.filter('mark', 'ignored').getAttribute('aria-pressed'), 'true');
    assert.deepEqual(p.visible(), ['1']);
    assert.match(p.controls['[data-marks-count]'].textContent, /Hidden 0/);
    p.filter('category', 'bug');
    assert.deepEqual(p.visible(), []);
    assert.equal(p.controls['[data-comment-filter-empty]'].textContent, '\u6ca1\u6709\u7b26\u5408\u7b5b\u9009\u6761\u4ef6\u7684\u95ee\u9898\u3002');
    p.filter('category', 'all');
    p.filter('severity', 'high');
    assert.deepEqual(p.visible(), []);
    p.filter('severity', 'all');
    p.controls['[data-comment-search]'].value = 'Finding 0';
    p.controls['[data-comment-search]'].fire('input');
    assert.deepEqual(p.visible(), []);
    p.controls['[data-comment-search]'].value = 'src/main.go';
    p.controls['[data-comment-search]'].fire('input');
    assert.deepEqual(p.visible(), ['1']);
    p.filter('mark', 'fixed');
    assert.deepEqual(p.visible(), ['0']);
    p.filter('mark', 'unmarked');
    assert.deepEqual(p.visible(), ['2']);
    p.filter('mark', 'all');
    assert.deepEqual(p.visible(), ['2']);
    assert.equal(p.controls['[data-hide-marked]'].checked, true);
    assert.equal(p.storage.has('ocr-viewer-hide-marked'), false);
});

test('mark changes and clear-all update counts and the active filter immediately', () => {
    const p = page();
    p.mark(0, 'ignored');
    p.filter('mark', 'ignored');
    p.mark(0, 'fixed');
    assert.deepEqual(p.visible(), []);
    assert.equal(Number(p.counts.ignored.textContent), 0);
    assert.equal(Number(p.counts.fixed.textContent), 1);
    p.filter('mark', 'fixed');
    p.mark(0, '');
    assert.deepEqual(p.visible(), []);
    assert.equal(Number(p.counts.unmarked.textContent), 3);
    p.mark(1, 'ignored');
    p.controls['[data-clear-all-marks]'].fire();
    assert.equal(p.storage.has('ocr-viewer-marks:/r/repo/s1'), false);
    p.filter('mark', 'unmarked');
    assert.deepEqual(p.visible(), ['0', '1', '2']);
});

test('marks reload within one session and never migrate to another session', () => {
    const storage = new Map();
    page({ storage }).mark(0, 'ignored');
    const restored = page({ storage });
    assert.equal(Number(restored.counts.ignored.textContent), 1);
    restored.filter('mark', 'ignored');
    assert.deepEqual(restored.visible(), ['0']);
    assert.equal(Number(page({ storage, path: '/r/repo/s2' }).counts.ignored.textContent), 0);
});

test('mark filters refresh the production pager and file-group counts', () => {
    const p = page({ total: 13 });
    p.controls['[data-hide-marked]'].checked = false;
    p.controls['[data-hide-marked]'].fire('change');
    p.numbers.children[1].fire();
    assert.deepEqual(p.visible(), ['10', '11', '12']);
    p.mark(12, 'ignored');
    p.filter('mark', 'ignored');
    assert.deepEqual(p.visible(), ['12']);
    assert.equal(p.numbers.children.length, 1);
    assert.equal(p.groupCount.textContent, '1 findings');
    p.mark(12, '');
    assert.equal(p.group.hidden, true);
    assert.equal(p.controls['[data-comment-filter-empty]'].hidden, false);
});

test('unavailable or corrupt storage does not break filtering', () => {
    const p = page({ unavailable: true });
    p.mark(0, 'ignored');
    p.filter('mark', 'ignored');
    assert.deepEqual(p.visible(), ['0']);
    assert.match(p.controls['[data-marks-count]'].textContent, /\u672a\u4fdd\u5b58/);
    const invalid = page({ storage: new Map([['ocr-viewer-marks:/r/repo/s1', '{invalid']]) });
    assert.equal(Number(invalid.counts.unmarked.textContent), 3);
});
