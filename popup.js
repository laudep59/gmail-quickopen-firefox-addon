document.addEventListener('DOMContentLoaded', () => {

    const checkboxMaximize = document.getElementById('maximizeCheckbox');
    const checkboxHideAlerts = document.getElementById('hideAlertsCheckbox');
    const applyButton = document.getElementById('applyButton');

    // Load the options
    browser.storage.local.get('autoMaximize').then(result => {
        checkboxMaximize.checked = result.autoMaximize || false;
    });
    browser.storage.local.get('hideAlerts').then(result => {
        checkboxHideAlerts.checked = result.hideAlerts || false;
    });

    // Disable the apply button if the options are changed
    checkboxMaximize.addEventListener('change', () => {
        applyButton.disabled = false;
    });
    checkboxHideAlerts.addEventListener('change', () => {
        applyButton.disabled = false;
    });

    // Save the options and reload the Gmail tabs (try to)
    applyButton.addEventListener('click', () => {
        browser.storage.local.set({ hideAlerts: checkboxHideAlerts.checked, autoMaximize: checkboxMaximize.checked }).then(() => {
            applyButton.disabled = true;

            browser.tabs.query({ url: "*://mail.google.com/*" }).then(tabs => {
                tabs.forEach(tab => {
                    // Refresh the Gmail tabs
                    browser.tabs.reload(tab.id, { bypassCache: true });
                });

                // Sometimes the tabs are not reloaded, show a warning
                const warning = document.getElementById('warning');
                warning.style.display = 'block';
                setTimeout(() => {
                    warning.style.display = 'none';
                }, 3000);

            });

        });
    });

    // Translate the page
    document.querySelectorAll('[data-i18n]').forEach(elem => {
        const key = elem.getAttribute('data-i18n');
        const message = browser.i18n.getMessage(key);
        if (message) {
            elem.textContent = message;
        }
    });

});