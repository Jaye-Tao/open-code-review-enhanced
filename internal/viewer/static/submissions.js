// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 alibaba/open-code-review Contributors

(() => {
    const form = document.querySelector('.submission-form');
    if (!form || typeof window.fetch !== 'function') return;
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
            const required = [['git_url', '请填写 Git 仓库地址。'], ['target_branch', '请填写审核分支。'], ['base_branch', '请填写对比分支。'], ['submitted_by', '请填写提交人。']];
            for (const [name, text] of required) {
                const field = form.elements.namedItem(name);
                if (!field || !field.value.trim()) throw new Error(text);
            }
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
            window.location.assign('tasks');
        } catch (error) {
            showError(error instanceof Error ? error.message : '提交审核失败，请稍后重试。');
            if (button) button.disabled = false;
        }
    });
})();
