const cont = document.querySelector(".container");

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

const yourCards = [];

const ws = new WebSocket("http://78.88.142.214:8080")

ws.onopen = () => {
}

ws.onmessage = (e) => {
    const data = JSON.parse(e.data)

    renderUserDeck(data.deck)
    console.log(data)
}

function renderUserDeck(arr) {
    console.log(arr)
    arr.forEach(card => {
        const img = document.createElement('img')
        img.src = card.src

        cont.appendChild(img)
    })
}