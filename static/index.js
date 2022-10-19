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


function searchKahoot() {
    const query = document.querySelector("#search-container input").value;
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/searchKahoot/" + query);
    xhr.onload = () => {
        const data = JSON.parse(xhr.responseText).entities;
        const results = document.querySelector("#search-results");
        for (let card of data) {
            card = card.card;
            if (card.type === "quiz") {
                const cardDiv = document.createElement("div");
                cardDiv.classList.add("card");
                cardDiv.innerHTML = `
                    <img src="${card.cover}">
                    <div class="card-content">
                        <span class="card-title">${card.title}</span>
                        <p>${card.description}</p>
                    </div>
                    <div class="card-action">
                        <a href="#" onclick="chooseKahoot('${card.uuid}')">Join</a>
                    </div>
                `;
                results.appendChild(cardDiv);
            }
        }
    };
    xhr.send();
}

function chooseKahoot(id) {
    document.querySelector("#search-container").style.display = "none";
    quizId = id;
    console.log(id);
    getAnswers();
}


function getAnswers() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/getAnswers/" + quizId);
    xhr.onload = () => {
        const data = JSON.parse(xhr.responseText);
        console.log(data);
    };
    xhr.send();
}


