const { WebSocketServer } = require('ws');

// Запускаем WebSocket-сервер на порту 8080
const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
    // 1. IP-адрес клиента
    console.log('Подключился клиент с IP:', ws._socket.remoteAddress);

    // 2. Статус подключения (1 = OPEN)
    console.log('Статус подключения:', ws.readyState);

    // 3. Добавление и вывод своих данных
    ws.id;
    console.log('Назначен ID клиенту:', ws.id);
});