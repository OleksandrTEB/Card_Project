function renderUserDeck(cards) {
    const container = document.querySelector('.container_for_user_deck');
    container.innerHTML = '';

    const n = cards.length;

    cards.forEach((cardData, i) => {
        const offset = i - (n - 1) / 2;

        const rot = offset * Math.min(3.4, 26 / Math.max(n, 1));

        const y = offset * offset * (n > 8 ? 0.5 : 1.05);

        const cardEl = document.createElement('div');
        cardEl.classList.add('player_card');
        cardEl.style.setProperty('--r', `${rot.toFixed(2)}deg`);
        cardEl.style.setProperty('--y', `${y.toFixed(1)}px`);
        cardEl.innerHTML = `<img src="${cardData.src}" alt="Deck"/>`;

        container.appendChild(cardEl);
    });
}

function renderOpponentInfo(players, username) {
    const opponentInfo = document.querySelector('.opponent_info');

    opponentInfo.innerHTML = '';

    players.forEach(p => {
        if(p.username !== username) {
            const span = document.createElement('span')
            span.textContent = p.username;
            opponentInfo.appendChild(span)

            const div = document.createElement('div')
            div.classList.add('opponent_deck')
            opponentInfo.appendChild(div)

            const n = p.deck_size;

            for(let i = 0; i < n; i++) {
                const offset = i - (n - 1) / 2;

                const rot = offset * Math.min(3.4, 26 / Math.max(n, 1));

                const y = offset * offset * (n > 8 ? 0.5 : 1.05);

                const cardEl = document.createElement('div');
                cardEl.classList.add('player_card');
                cardEl.style.setProperty('--r', `${-rot.toFixed(2)}deg`);
                cardEl.style.setProperty('--y', `${-y.toFixed(1)}px`);
                cardEl.innerHTML = `<img src="./src/assets/logotip/logo.png" alt="Deck"/>`;

                div.appendChild(cardEl);
            }
        }
    })
}

export { renderUserDeck, renderOpponentInfo };