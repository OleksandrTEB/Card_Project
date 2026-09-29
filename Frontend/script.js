const cont = document.querySelector(".container");

const basePath = "./src/images/my_cards/";

const masty = ["serdeczko/", "rombik/", "mogila/", "pika/"]

const cards = [
    `${basePath}${masty[0]}6`,
    `${basePath}${masty[0]}7`,
    `${basePath}${masty[0]}8`,
    `${basePath}${masty[0]}9`,
    `${basePath}${masty[0]}10`,
    `${basePath}${masty[0]}b`,
    `${basePath}${masty[0]}d`,
    `${basePath}${masty[0]}k`,
    `${basePath}${masty[0]}t`,

    `${basePath}${masty[1]}6`,
    `${basePath}${masty[1]}7`,
    `${basePath}${masty[1]}8`,
    `${basePath}${masty[1]}9`,
    `${basePath}${masty[1]}10`,
    `${basePath}${masty[1]}b`,
    `${basePath}${masty[1]}d`,
    `${basePath}${masty[1]}k`,
    `${basePath}${masty[1]}t`,

    `${basePath}${masty[2]}6`,
    `${basePath}${masty[2]}7`,
    `${basePath}${masty[2]}8`,
    `${basePath}${masty[2]}9`,
    `${basePath}${masty[2]}10`,
    `${basePath}${masty[2]}b`,
    `${basePath}${masty[2]}d`,
    `${basePath}${masty[2]}k`,
    `${basePath}${masty[2]}t`,

    `${basePath}${masty[3]}6`,
    `${basePath}${masty[3]}7`,
    `${basePath}${masty[3]}8`,
    `${basePath}${masty[3]}9`,
    `${basePath}${masty[3]}10`,
    `${basePath}${masty[3]}b`,
    `${basePath}${masty[3]}d`,
    `${basePath}${masty[3]}k`,
    `${basePath}${masty[3]}t`,
]

cards.forEach(card => {
    const img = document.createElement('img')
    img.src = `${card}.png`

    cont.appendChild(img)
})