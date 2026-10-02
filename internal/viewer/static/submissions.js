// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 alibaba/open-code-review Contributors

(() => {
    const form = document.querySelector('.submission-form');
    if (!form || typeof window.fetch !== 'function') return;

    form.addEventListener('submit', async event => {
        event.preventDefault();
        const button = form.querySelector('button[type="submit"]');
        if (button) button.disabled = true;
        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                credentials: 'same-origin',
                redirect: 'follow'
            });
            if (!response.ok) {
                const message = (await response.text()).trim() || '提交审核失败，请检查表单内容后重试。';
                throw new Error(message);
            }
            window.location.assign('/tasks');
        } catch (error) {
            window.alert(error instanceof Error ? error.message : '提交审核失败，请稍后重试。');
            if (button) button.disabled = false;
        }
    });
})();
