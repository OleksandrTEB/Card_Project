const {WebSocketServer} = require('ws');

const rooms = new Map();
const deck = [];
createDeck()

function createDeck() {
    const suits = ["spades", "hearts", "diamonds", "clubs"];
    const cardsNames = [
        {
            name: '6'
        },
        {
            name: '7'
        },
        {
            name: '8'
        },
        {
            name: '9'
        },
        {
            name: '10'
        },
        {
            name: 'J'
        },
        {
            name: 'Q'
        },
        {
            name: 'K'
        },
        {
            name: 'A'
        }
    ]

    suits.forEach(suit => {
        let i = 6;

        cardsNames.forEach(item => {
            const name = item.name
            const card = {
                name: name,
                suit: suit,
                value: i,
                src: `./src/assets/cards/${suit}/${name}.png`
            }

            i++;
            deck.push(card);
        })
    })
}

const wss = new WebSocketServer({port: 8080});

function broadcast(data) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

wss.on('connection', (ws) => {
    ws.on('message', (e) => {
        const data = JSON.parse(e)

        switch (data.type) {
            case "user_data": {
                ws.id = data.user_id;
                ws.username = data.username;



                if (rooms.size > 0) {
                    rooms.forEach(room => {
                        if (room.players.has(ws.id)) {
                            ws.send(JSON.stringify({
                                type: "start_game",
                                user_deck: room.players.get(ws.id).get("player_deck"),
                                amount_all_deck: room.deck.length
                            }))
                        }
                    })
                }
            }
            break;

            case "create_game": {
                const result = createRoom(data.title, data.amount_users)
                if (result === true) {
                    ws.room = data.title;

                    const idForGame = new Date().getTime();

                    broadcast({
                        id: idForGame,
                        type: "new_game",
                        title: data.title,
                        amount: data.amount_users
                    })

                    const player = new Map();
                    player.set("username", ws.username)
                    player.set("ws", ws)

                    rooms.get(ws.room).players.set(ws.id, player)
                    rooms.get(ws.room).id = idForGame;
                }
            }
            break;

            case "join_game": {
                ws.room = data.room;

                const currentRoom = rooms.get(ws.room);
                if (!currentRoom) break;

                const currentDeck = currentRoom.deck;

                const player = new Map();
                player.set("username", ws.username)
                player.set("ws", ws)

                currentRoom.players.set(ws.id, player)

                if (checkToPalay(data.room)) {
                    currentRoom.players.forEach((p) => {
                        giveCards(currentDeck, p);
                    });

                    currentRoom.players.forEach(p => {
                        const playerSocket = p.get("ws");
                        const userDeck = p.get("player_deck")

                        if (playerSocket && playerSocket.readyState === 1) {
                            playerSocket.send(JSON.stringify({
                                type: "start_game",
                                user_deck: userDeck,
                                amount_all_deck: currentRoom.deck.length
                            }))
                        }
                    })

                    broadcast({
                        id: currentRoom.id,
                        type: "delete_game"
                    })
                }

                broadcast({
                    id: currentRoom.id,
                    type: "player_join",
                    players: currentRoom.players.size
                })
            }
            break;

            case "exit": {
                const currentRoom = rooms.get(ws.room);

                currentRoom.players.forEach(p => {
                    p.get("ws").send(JSON.stringify({
                        type: "stop_game"
                    }))
                })

                rooms.delete(ws.room);
            }
            break;

            default:
                break;
        }
    })
});

function createRoom(key, amountUsers) {
    if (amountUsers > 1 && amountUsers < 7) {
        rooms.set(key, {
            max_players: amountUsers,
            players: new Map(),
            deck: shuffle(deck)
        })

        return true;
    }

    return false;
}

function shuffle(array) {
    const newDeck = [...array];

    for (let i = newDeck.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }
    return newDeck;
}

function giveCards(deck, player) {
    const playerDeck = []

    for (let i = 0; i < 6; i++) {
        playerDeck.push(deck.pop());
    }

    player.set("player_deck", playerDeck)
}

function checkToPalay(room) {
    const maxPayers = rooms.get(room).max_players

    return maxPayers === rooms.get(room).players.size;
}