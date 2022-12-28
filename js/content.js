const DELAY_LOW = 400;
const DELAY_HIGH = 1000;

let kahootId = null;
let answers = null;
let enabled = true;

const doneHTML = "<center style='width: 100%; padding-top: 10px;'><h2 style='font-size: 17px;'>Done!</h2></center>";
const enableHTML = `<div id="search-enable">
<h2 style="font-size: 25px; width: 111.5px; text-align: right;">Enabled</h2>
<label class="switch">
  <input type="checkbox" checked>
  <span class="slider round"></span>
</label></div>`;

function enableDisable(event) {
    enabled = event.target.checked;
    if (enabled) {
        document.querySelector("#search-enable h2").innerText = "Enabled";
    } else {
        document.querySelector("#search-enable h2").innerText = "Disabled";
    }
}

async function loadKahoot(id) {
    kahootId = id;

    chrome.runtime.sendMessage({
        type: "getAnswers",
        uuid: id,
    }, (response) => {
        answers = response;

        document.querySelector("#search-results").innerHTML = doneHTML;
        setTimeout(() => {
            // document.querySelector("#search-container").parentElement.style.display = "none";
            document.querySelector("#search-results").innerHTML = enableHTML;
            document.querySelector("#search-results .switch input").addEventListener("change", enableDisable);
        }, 1500);

        const interval = setInterval(() => {
            if (!enabled) return;
            if (location.pathname != "/gameblock") return;
            if (answers === null) return;

            let qIndex = document.querySelector("div[data-functional-selector='question-index-counter']");
            if (qIndex === null) return;

            qIndex = parseInt(qIndex.innerText.split(" ")[0]) - 1;

            const answer = document.querySelector(`button[data-functional-selector='answer-${answers[qIndex]}'`);
            if (answer === null) return;

            setTimeout(() => {
                answer.click();
            }, Math.round(Math.random() * (DELAY_HIGH - DELAY_LOW) + DELAY_LOW));
        }, 5);
    });
}

let explorerShown = false;
async function openExplorerPrompt() {
    // const container = document.createElement("div");
    // container.innerHTML = explorerHTML;
    // container.style.position = "fixed";
    // container.style.top = "0";
    // container.style.right = "0";
    // container.style.width = "400px";
    // container.style.height = "100%";
    // container.style.border = "none";
    // container.style.zIndex = "1000";

    // document.body.appendChild(container);
    document.body.insertAdjacentHTML("beforeend", explorerHTML);
    explorerShown = true;

    document.getElementById("search-input").onkeyup = (e) => {
        if (e.key === "Enter") {
            searchKahoot();
        }
    };
    document.getElementById("search-button").onclick = () => {
        searchKahoot();
    };

    document.querySelector(".closebutton").onclick = () => {
        explorerShown = false;
        document.querySelector("#search-container").style.right = "-400px";
        document.querySelector(".openbutton").style.setProperty("display", "block", "important");
        setTimeout(() => {
            document.querySelector(".openbutton").style.opacity = "1";
        }, 100);
    };

    document.querySelector(".openbutton").onclick = () => {
        explorerShown = true;
        document.querySelector("#search-container").style.right = "0";
        document.querySelector(".openbutton").style.opacity = "0";
        setTimeout(() => {
            document.querySelector(".openbutton").style.setProperty("display", "none", "important");
        }, 500);
    }
}

function attachContentScript() {
    // / - game pin page
    // /join - nickname page
    // /start - player list start page
    // /getready - question countdown page
    // /gameblock - choose answer page
    // /answer/result - answer right/wrong page
    if (location.host === "kahoot.it") {
        if (kahootId === null) {
            openExplorerPrompt();
        }
    }
}
attachContentScript();


window.onKahootChoice = (id) => {
    loadKahoot(id);
}
