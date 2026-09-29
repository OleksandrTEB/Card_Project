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

// 1. Создаем подключение
const socket = new WebSocket('ws://78.88.142.214:8080');

socket.onopen = () => {
    console.log('Подключение к серверу установлено');

    // Отправляем что-то на сервер
    socket.send('Привет!');
};

socket.onmessage = (event) => {
    // Парсим входящую JSON-строку в объект
    const data = JSON.parse(event.data);

    // Доступ к полям сообщения
    console.log('Текст от сервера:', data.message);

    if (data.client_message) {
        console.log('Сервер получил от нас:', data.client_message);
    }
};