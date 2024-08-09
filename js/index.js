/**
 * @type {HTMLIFrameElement}
 */
let gameIframe;

let quizId = "";

const loadingHTML = "<center style='width: 100%; padding-top: 10px;'><h2 style='font-size: 17px;'>Loading...</h2></center>";
function searchKahoot() {
    const results = document.querySelector("#search-results");
    results.innerHTML = loadingHTML;
    
    const query = document.querySelector("#search-container input").value;
    chrome.runtime.sendMessage({
        type: "searchKahoot",
        query: query,
    }, (data) => {
        results.innerHTML = "";
        for (let card of data) {
            console.log(card)
            card = card.card;
            if (card.type === "quiz") {
                const coverUrlSplit = card.cover.split("/");
                const coverId = coverUrlSplit[coverUrlSplit.length - 1];
                const cardDiv = document.createElement("div");
                cardDiv.classList.add("card");
                cardDiv.style.cursor = "pointer";
                cardDiv.innerHTML = `
                    <img src="https://images-cdn.kahoot.it/${coverId}?auto=webp&width=350" style="border-radius: 10px;">
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
    });
}

function chooseKahoot(id) {
    quizId = id;
    console.log(id);

    if (typeof window.onKahootChoice == "function") {
        window.onKahootChoice(id);
    }
}
