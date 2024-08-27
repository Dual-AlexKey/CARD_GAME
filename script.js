const cards = document.querySelectorAll('.card');
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;
let lives = 3; // Número inicial de vidas

const livesDisplay = document.getElementById('lives');

function flipCard() {
    if (lockBoard || this === firstCard || this.classList.contains('matched')) return;

    this.classList.remove('hidden');
    this.classList.add('revealed');

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    lockBoard = true;

    checkForMatch();
}

function checkForMatch() {
    const isMatch = firstCard.dataset.country === secondCard.dataset.country;

    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    matchedPairs++;
    resetBoard();
    if (matchedPairs === 6) {
        document.getElementById('message').textContent = '¡Ganaste! Has encontrado todas las parejas.';
    }
}

function unflipCards() {
    setTimeout(() => {
        firstCard.classList.add('hidden');
        firstCard.classList.remove('revealed');
        secondCard.classList.add('hidden');
        secondCard.classList.remove('revealed');
        resetBoard();
        updateLives(-1); // Descontar una vida
    }, 1000);
}

function updateLives(change) {
    lives += change;
    livesDisplay.textContent = lives;

    if (lives <= 0) {
        document.getElementById('message').textContent = '¡Perdiste! No tienes más vidas.';
        lockBoard = true; // Deshabilitar el juego
        cards.forEach(card => card.removeEventListener('click', flipCard)); // Desactivar eventos de clic
    }
}

function resetBoard() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

function shuffleCards() {
    const cardArray = Array.from(cards);
    for (let i = cardArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cardArray[i], cardArray[j]] = [cardArray[j], cardArray[i]];
    }
    const container = document.querySelector('.container');
    cardArray.forEach(card => container.appendChild(card));
}

// Initialize game
shuffleCards();
cards.forEach(card => card.addEventListener('click', flipCard));
