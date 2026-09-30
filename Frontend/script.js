const userId = getOrCreateId();

function getOrCreateId() {
    const id = +localStorage.getItem("user_id")
    if(!id) {
        const newId = new Date().getTime();

        localStorage.setItem("user_id", `${newId}`)

        return newId;
    }

    return id;
}

const userName = getOrCreateUserName();

function getOrCreateUserName() {
    const username = localStorage.getItem("username")
    if(!username) {
        const newUsername = prompt("Please enter Nick Name:");

        localStorage.setItem("username", newUsername)

        return newUsername;
    }

    return username;
}


const cont = document.querySelector(".container");
const createNewGameBtn = document.querySelector(".create_game");
const game_list = document.querySelector(".game_list")
const games = document.querySelector(".games")

const suitOrder = {
    'clubs': 1,
    'diamonds': 2,
    'hearts': 3,
    'spades': 4
};

const ws = new WebSocket("http://78.88.142.214:8080")

function sendData(data) {
    ws.send(JSON.stringify(data));
}

ws.onopen = () => {
    const data = {
        type: "user_data",
        user_id: userId,
        username: userName
    }

    sendData(data);
}

ws.onmessage = (e) => {
    const data = JSON.parse(e.data)

    switch (data.type) {
        case "new_game":
            addNewGame(data.title, data.amount)
            break;
        case "start_game":
            sortUserDeck(data.user_deck)
            renderUserDeck(data.user_deck)
            hideElement(games)
            break;
    }
}

function hideElement(element) {
    element.style.display = "none";
}

createNewGameBtn.addEventListener('click', () => {
    const data = {
        type: "create_game",
        amount_users: +prompt("Input amount users:"),
        title: prompt("Input game title:")
    }

    sendData(data);
})

function addNewGame(title, amount) {
    const div = document.createElement('div')
    div.classList.add('game')

    const span = document.createElement('span')
    span.classList.add('title')
    span.textContent = title
    div.appendChild(span)

    const btn = document.createElement('button')
    btn.classList.add('join')
    btn.textContent = "Join"
    btn.dataset.key = title
    div.appendChild(btn)

    const span1 = document.createElement('span')
    span1.classList.add('amount')
    span1.textContent = `1/${amount}`
    div.appendChild(span1)

    game_list.appendChild(div)
}

game_list.addEventListener('click', (e) => {
    const key = e.target.dataset.key
    if (key) {
        sendData({
            type: "join_game",
            room: key
        })
    }
})

function renderUserDeck(arr) {
    arr.forEach(card => {
        const img = document.createElement('img')
        img.src = card.src

        cont.appendChild(img)
    })
}

function sortUserDeck(deck) {
    deck.sort((a, b) => {
        const suitDiff = suitOrder[a.suit] - suitOrder[b.suit];

        if (suitDiff !== 0) {
            return suitDiff;
        }

        return a.rank - b.rank;
    });

    console.log(deck)
}