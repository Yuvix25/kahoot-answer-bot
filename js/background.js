chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
        if (tab.url.indexOf('kahoot.it') > -1) {
            attachScript(tabId, ['./js/explorer.js', './js/content.js', './js/index.js']);
            attachStyle(tabId, ['./css/index.css']);
        }
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'getAnswers') {
        getAnswers(request.uuid).then(sendResponse);
    } else if (request.type === 'searchKahoot') {
        searchKahoot(request.query).then(sendResponse);
    } else {
        return false;
    }
    return true;
});


async function searchKahoot(query) {
    return (await (await fetch(`https://create.kahoot.it/rest/kahoots/?query=${query}&limit=100&cursor=0&searchCluster=1&includeExtendedCounters=false&inventoryItemId=NONE`)).json()).entities;
}


async function getAnswers(uuid) {
    const response = await (await fetch(`https://create.kahoot.it/rest/kahoots/${uuid}/card/?includeKahoot=true`)).json();
    const questions = response.kahoot.questions;

    const res = [];
    for (const q of questions) {
        for (let i = 0; i < q.choices.length; i++) {
            if (q.choices[i].correct) {
                res.push(i);
            }
        }
    }
    return res;
}

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

function attachStyle(tabId, styles) {
    chrome.scripting.insertCSS({
        target: {tabId: tabId},
        files: styles
    });
}
