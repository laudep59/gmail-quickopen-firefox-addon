// When opening a link in a new tab, check if it's a link to a Gmail popout
// If it is and we asked to open maximized, maximize the window
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