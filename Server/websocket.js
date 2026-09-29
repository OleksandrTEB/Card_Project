const {WebSocketServer} = require('ws');


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
const deck = [];

const firstPlayer = []

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

for(let i = 0; i < 6; i++) {
    firstPlayer.push(deck[Math.floor(Math.random() * deck.length)])
}


const wss = new WebSocketServer(
    {
        port: 8080
    }
);

wss.on('connection', (ws) => {
    const data = JSON.stringify({
        deck: firstPlayer
    })

    ws.send(data)
});