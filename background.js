// Quand on ouvre un lien dans un nouvel onglet, on vérifie si c'est un lien vers un popout Gmail
// Si c'est le cas et qu'on a demandé à ouvrir maximisé, on maximise la fenêtre
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

    const urlPattern = /^https:\/\/mail\.google\.com\/mail\/u\/\d+\/popout/;
    if (changeInfo.url && urlPattern.test(changeInfo.url)) {
        browser.storage.local.get('autoMaximize').then(result => {
            if (result.autoMaximize) {
                browser.windows.get(tab.windowId).then(window => {
                    browser.windows.update(window.id, { state: 'maximized' });
                });
            }
        });
    }

});