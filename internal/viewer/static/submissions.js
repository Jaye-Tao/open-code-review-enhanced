// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 alibaba/open-code-review Contributors

(() => {
    const form = document.querySelector('.submission-form');
    if (!form || typeof window.fetch !== 'function') return;
    const pageURL = new URL(window.location.href);
    const submitURL = new URL(form.getAttribute('action') || pageURL.pathname, pageURL);
    const pageDirectory = pageURL.pathname.endsWith('/') ? pageURL.pathname : pageURL.pathname.replace(/[^/]*$/, '');
    const tasksURL = new URL('tasks', new URL(pageDirectory, pageURL)).toString();
    const modal = document.querySelector('[data-submission-error]');
    const message = modal && modal.querySelector('[data-submission-error-message]');
    const closeModal = () => { if (modal) modal.hidden = true; };
    const showError = text => {
        if (!modal || !message) return window.alert(text);
        message.textContent = text;
        modal.hidden = false;
        const button = modal.querySelector('[data-submission-error-close]');
        if (button) button.focus();
    };
    modal?.querySelectorAll('[data-submission-error-close]').forEach(element => element.addEventListener('click', closeModal));

    form.addEventListener('submit', async event => {
        event.preventDefault();
        const button = form.querySelector('button[type="submit"]');
        if (button) button.disabled = true;
        try {
            const data = new FormData(form);
            const required = [['git_url', '请填写 Git 仓库地址。'], ['target_branch', '请填写审核分支。'], ['base_branch', '请填写对比分支。'], ['submitted_by', '请填写提交人。']];
            for (const [name, text] of required) {
                if (!String(data.get(name) || '').trim()) throw new Error(text);
            }
            const encoded = new URLSearchParams();
            for (const [name, value] of data.entries()) {
                encoded.append(name, String(value));
            }
            const response = await fetch(submitURL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
                body: encoded.toString(),
                credentials: 'same-origin',
                redirect: 'follow'
            });
            if (!response.ok) {
                const message = (await response.text()).trim() || '提交审核失败，请检查表单内容后重试。';
                throw new Error(message);
            }
            window.location.assign(tasksURL);
        } catch (error) {
            showError(error instanceof Error ? error.message : '提交审核失败，请稍后重试。');
            if (button) button.disabled = false;
        }
    });
})();
