const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points")
    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type")
    },
    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card")
    },
    playerSides: {
        player: "player-cards",
        playerBox: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBox: document.querySelector("#computer-cards")
    },
    actions: {
        button: document.getElementById("next-duel")
    }
};
const pathImages = "./src/assets/icons/";
const cardData = [
    {
        id: 0,
        name: "Dragão Branco de Olhos Azuis",
        type: "Papel",
        img: `${pathImages}dragon.png`,
        WinOf:[1],
        LoseOf:[2],
    },
    {
        id: 1,
        name: "Mago Negro",
        type: "Pedra",
        img: `${pathImages}magician.png`,
        WinOf:[2],
        LoseOf:[0],
    },
    {
        id: 2,
        name: "Exodia",
        type: "Tesoura",
        img: `${pathImages}exodia.png`,
        WinOf:[0],
        LoseOf:[1],
    }
];

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);

    return cardData[randomIndex].id;
}

async function removeAllCardsImages() {
    let { computerBox, playerBox } = state.playerSides;
    let imgElements = computerBox.querySelectorAll("img");

    imgElements.forEach((img) => img.remove() );

    imgElements = playerBox.querySelectorAll("img");

    imgElements.forEach((img) => img.remove() );
}

async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);

    try {
        audio.play();
    } catch {}
}

async function checkDuelResults(playerCardId, computerCardId) {
    let duelResults = "Empate";
    let playerCard = cardData[playerCardId];

    if (playerCard.WinOf.includes(computerCardId)) {
        duelResults = "Vitória";
        state.score.playerScore++;

        await playAudio("win");
    } else if (playerCard.LoseOf.includes(computerCardId)) {
        duelResults = "Derrota";
        state.score.computerScore++;

        await playAudio("lose");
    }

    return duelResults;
}

async function updateScore() {
    state.score.scoreBox.innerText = `Vitória: ${state.score.playerScore} Derrota: ${state.score.computerScore}`;
}

async function resetDuel() {
    state.actions.button.style.display = "none";
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";
    
    await clearSelectCard();

    init();
}

async function drawButton(duelResult) {
    state.actions.button.innerText = duelResult;
    state.actions.button.style.display = "block";
    state.actions.button.addEventListener("click", resetDuel);
}

async function drawCardsInField(playerCardId, computerCardId) {
    state.fieldCards.player.style.display = "block";
    state.fieldCards.player.src = cardData[playerCardId].img;
    state.fieldCards.computer.style.display = "block";
    state.fieldCards.computer.src = cardData[computerCardId].img;
}

async function setCardsField(playerCardId) {
    let computerCardId = await getRandomCardId();
    let duelResult = await checkDuelResults(playerCardId, computerCardId);
    
    await removeAllCardsImages();
    await drawCardsInField(playerCardId, computerCardId);
    await updateScore();
    await drawButton(duelResult);
}

async function drawSelectCard(cardId) {
    state.cardSprites.avatar.src = cardData[cardId].img;
    state.cardSprites.name.innerText = cardData[cardId].name;
    state.cardSprites.type.innerText = "Tipo: " + cardData[cardId].type;
}

async function clearSelectCard() {
    state.cardSprites.avatar.src = `${pathImages}card-back.png`;
    state.cardSprites.name.innerText = "Selecione";
    state.cardSprites.type.innerText = "uma carta";
}

async function createCardImage(cardId, fieldSide) {
    const cardImage = document.createElement("img");

    cardImage.setAttribute("src", `${pathImages}card-back.png`);
    cardImage.setAttribute("data-id", cardId);
    cardImage.classList.add("card");

    if (fieldSide === state.playerSides.player) {
        cardImage.classList.add("card-player");
        cardImage.addEventListener("mouseover", () => drawSelectCard(cardId));
        cardImage.addEventListener("mouseleave", () => clearSelectCard());
        cardImage.addEventListener("click", () =>  setCardsField(cardId));
    }

    return cardImage;
}

async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {        
        const cardId = await getRandomCardId();
        const cardImage = await createCardImage(cardId, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

async function playBgm() {
    const bgm = document.getElementById("bgm");    
    const resp = bgm.play();

    if (resp!== undefined) {
        resp.then(_ => {
        }).catch(error => {
        });
    }
}

function init() {
    drawCards(5, state.playerSides.player);
    drawCards(5, state.playerSides.computer);
}

init();

document.body.addEventListener("mousemove", function () {
    playBgm(); 
})
