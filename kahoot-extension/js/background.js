chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
        if (tab.url.indexOf('kahoot.it') > -1) {
            attachScript(tabId, ['./js/content.js', './js/index.js']);
        }
    }
});

function attachScript(tabId, scripts, args=[], force = false) {
    chrome.scripting.executeScript({
        target: {tabId: tabId},
        func: () => {
            return typeof attachContentScript === 'undefined' ? false : true;
        }
    }, (results) => {
        if (results[0].result === false) {
            chrome.scripting.executeScript({
                target: {tabId: tabId},
                files: scripts
            });
        }
        if (force) {
            chrome.scripting.executeScript({
                target: {tabId: tabId},
                func: (...args) => {
                    attachContentScript(...args);
                },
                args: args
            });
        }
    });
}
