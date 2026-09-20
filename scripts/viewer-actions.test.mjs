// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 alibaba/open-code-review Contributors

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const source = readFileSync(new URL('../internal/viewer/static/actions.js', import.meta.url), 'utf8');

test('delete action uses an accessible confirmation dialog', () => {
    assert.match(source, /createElement\('dialog'\)/);
    assert.match(source, /dialog\.className = 'action-dialog'/);
    assert.match(source, /确认删除/);
    assert.match(source, /event\.key === 'Escape'/);
    assert.match(source, /X-OCR-Confirm/);
    assert.match(source, /method: 'DELETE'/);
});

test('delete action reports failures without navigating', () => {
    assert.match(source, /无法连接服务/);
    assert.match(source, /删除失败，请稍后重试/);
    assert.match(source, /button\.dataset\.returnUrl/);
});

test('path copy exposes the complete path and a manual fallback', () => {
    assert.match(source, /复制完整路径/);
    assert.match(source, /copy-path-input/);
    assert.match(source, /navigator\.clipboard/);
});
