import { renderUserDeck, renderOpponentInfo } from "./src/scripts/style_and_animation.js";

const userId = getOrCreateId();

function getOrCreateId() {
    const id = +localStorage.getItem("user_id")
    if (!id) {
        const newId = new Date().getTime();

        localStorage.setItem("user_id", `${newId}`)

        return newId;
    }

    return id;
}

const userName = getOrCreateUserName();

function getOrCreateUserName() {
    const username = localStorage.getItem("username")
    if (!username) {
        const newUsername = prompt("Please enter Nick Name:");

        localStorage.setItem("username", newUsername)

        return newUsername;
    }

    return username;
}


const createNewGameBtn = document.querySelector(".create_game");
const game_list = document.querySelector(".game_list")
const games = document.querySelector(".games")
const players_select = document.querySelector(".players_select")
const select_container = document.querySelector(".select_container")
const exit_btn = document.querySelector(".exit_btn")
const game_zone = document.querySelector(".game_zone")
const countCards = document.querySelector(".countCards")
const opponentInfo = document.querySelector(".opponent_info")
const step = document.querySelector(".step")


const suitOrder = {
    'clubs': 1,
    'diamonds': 2,
    'hearts': 3,
    'spades': 4
};

const gamesToJoin = new Map();

let amountPlayers = 0;

const players = new Map();

const ws = new WebSocket("http://78.88.142.214:8080")

function sendData(socket, data) {
    if (socket && socket.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(data));
    }
}

exit_btn.addEventListener('click', () => {
    const data = {
        type: "exit"
    };

    sendData(ws, data);
})

ws.onopen = () => {
    const data = {
        type: "user_data",
        user_id: userId,
        username: userName
    }

    sendData(ws, data);
}

ws.onmessage = (e) => {
    const data = JSON.parse(e.data)

    switch (data.type) {
        case "new_game":
            const newGame = {
                title: data.title,
                max_players: data.amount,
                current_players_amount: 1
            }

            gamesToJoin.set(data.id, newGame);

            drawGamesToJoin()
            break;
        case "start_game":
            renderOpponentInfo(data.players, userName)
            sortUserDeck(data.user_deck)
            renderUserDeck(data.user_deck)
            startGame(data.amount_all_deck)
            break;
        case "player_join":
            if(gamesToJoin.get(data.id)) {
                gamesToJoin.get(data.id).current_players_amount = data.players;
                drawGamesToJoin()
            }
            break;
        case "stop_game":
            stopGame()
            break;
        case "delete_game":
            gamesToJoin.delete(data.id);
            drawGamesToJoin()
            break;
        case "send_games":
            data.games.forEach(g => {
                const dataForArr = {
                    title: g.title,
                    max_players: g.max_players,
                    current_players_amount: g.current_players
                }

                gamesToJoin.set(g.id, dataForArr);
            })

            drawGamesToJoin()
            break;
    }
}


function startGame(number) {
    hideElement(games)
    hideElement(createNewGameBtn)
    showElement(game_zone)
    showElement(opponentInfo)

    countCards.textContent = `Cards in deck: ${number}`
}

function stopGame() {
    showElement(games)
    showElement(createNewGameBtn)
    hideElement(game_zone)
    hideElement(opponentInfo)
}

function hideElement(element) {
    element.style.display = "none";
}

function showElement(element) {
    element.style.display = "flex";
}

select_container.addEventListener('click', (e) => {
    const players = +e.target.dataset.players;

    if (players) {
        amountPlayers = players;

        let title = "";

        do {
            title = prompt("Input game title:");

            if (title === null) {
                return;
            }
        } while (title.trim() === "")

        const data = {
            type: "create_game",
            amount_users: amountPlayers,
            title: title
        }

        sendData(ws, data);
        hideElement(players_select)
    }
})

createNewGameBtn.addEventListener('click', () => {
    showElement(players_select)
})

function drawGamesToJoin() {
    game_list.textContent = "";

    if(gamesToJoin.size < 1) return;

    gamesToJoin.forEach(item => {
        const div = document.createElement('div')
        div.classList.add('game')

        const span = document.createElement('span')
        span.classList.add('title')
        span.textContent = item.title
        div.appendChild(span)

        const btn = document.createElement('button')
        btn.classList.add('join')
        btn.textContent = "Join"
        btn.dataset.key = item.title
        div.appendChild(btn)

        const span1 = document.createElement('span')
        span1.classList.add('amount')
        span1.textContent = `${item.current_players_amount}/${item.max_players}`
        div.appendChild(span1)

        game_list.appendChild(div)
    })
}

game_list.addEventListener('click', (e) => {
    const key = e.target.dataset.key
    if (key) {
        sendData(ws, {
            type: "join_game",
            room: key
        })
    }
})

function sortUserDeck(deck) {
    deck.sort((a, b) => {
        const suitDiff = suitOrder[a.suit] - suitOrder[b.suit];

        if (suitDiff !== 0) {
            return suitDiff;
        }

        return a.value - b.value;
    });
}

function init() {
    hideElement(game_zone)
}

init()