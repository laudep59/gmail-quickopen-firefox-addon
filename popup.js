document.addEventListener('DOMContentLoaded', () => {

    const checkboxMaximize = document.getElementById('maximizeCheckbox');
    const checkboxHideAlerts = document.getElementById('hideAlertsCheckbox');
    const applyButton = document.getElementById('applyButton');

    // Charger la préférence enregistrée
    browser.storage.local.get('autoMaximize').then(result => {
        checkboxMaximize.checked = result.autoMaximize || false;
    });
    browser.storage.local.get('hideAlerts').then(result => {
        checkboxHideAlerts.checked = result.hideAlerts || false;
    });

    // Afficher le bouton "Appliquer" lorsque l'utilisateur change la valeur
    checkboxMaximize.addEventListener('change', () => {
        applyButton.disabled = false;
    });
    checkboxHideAlerts.addEventListener('change', () => {
        applyButton.disabled = false;
    });

    // Sauvegarder l'état des options lorsque l'utilisateur clique sur "Appliquer"
    applyButton.addEventListener('click', () => {
        browser.storage.local.set({ hideAlerts: checkboxHideAlerts.checked, autoMaximize: checkboxMaximize.checked }).then(() => {
            applyButton.disabled = true;

            browser.tabs.query({ url: "*://mail.google.com/*" }).then(tabs => {
                tabs.forEach(tab => {
                    // Actualiser l'onglet
                    browser.tabs.reload(tab.id, { bypassCache: true });
                });

                // Afficher un message d'avertissement
                const warning = document.getElementById('warning');
                warning.style.display = 'block';
                setTimeout(() => {
                    warning.style.display = 'none';
                }, 3000);

            });

        });
    });

    // Traduction des éléments
    document.querySelectorAll('[data-i18n]').forEach(elem => {
        const key = elem.getAttribute('data-i18n');
        const message = browser.i18n.getMessage(key);
        if (message) {
            elem.textContent = message;
        }
    });

});