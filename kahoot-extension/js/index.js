try { // maybe already declared
    const BACKEND_PORT = 9287;
} catch (e) { }

/**
 * @type {HTMLIFrameElement}
 */
let gameIframe;

let quizId = "";

function kahootLoaded() {
    gameIframe = document.querySelector("#game-iframe");
    gameIframe.contentWindow.document.querySelector("button[data-functional-selector='join-game-pin']")
        .addEventListener('click', () => {
            let pin = gameIframe.contentWindow.document.querySelector("input[name='gameId']").value;
            console.log(pin);
        });
}

const loadingHTML = "<center style='width: 100%; padding-top: 10px;'><h2 style='font-size: 17px;'>Loading...</h2></center>";
function searchKahoot() {
    const results = document.querySelector("#search-results");
    results.innerHTML = loadingHTML;
    
    const query = document.querySelector("#search-container input").value;
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `http://localhost:${BACKEND_PORT}/searchKahoot/` + query);
    xhr.onload = () => {
        const data = JSON.parse(xhr.responseText).entities;
        results.innerHTML = "";
        for (let card of data) {
            card = card.card;
            if (card.type === "quiz") {
                const cardDiv = document.createElement("div");
                cardDiv.classList.add("card");
                cardDiv.style.cursor = "pointer";
                cardDiv.innerHTML = `
                    <img src="${card.cover}" style="border-radius: 10px;">
                    <div class="card-content">
                        <span class="card-title">${card.title}</span>
                        <p>${card.description}</p>
                    </div>
                `;
                results.appendChild(cardDiv);

                cardDiv.onclick = () => {
                    results.innerHTML = loadingHTML;
                    chooseKahoot(card.uuid);
                };
            }
        }
    };
    xhr.send();
}

function chooseKahoot(id) {
    quizId = id;
    console.log(id);

    if (typeof window.onKahootChoice == "function") {
        window.onKahootChoice(id);
    }
}


function getAnswers() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `http://localhost:${BACKEND_PORT}/getAnswers/` + quizId);
    xhr.onload = () => {
        const data = JSON.parse(xhr.responseText);
        console.log(data);
    };
    xhr.send();
}


