document.addEventListener('DOMContentLoaded', function () {
    const errorMessage = document.getElementById('error-message');
const modalGameOver = document.getElementById('gameOverModal');
const hearts = document.querySelectorAll('.heart');
const cards = document.querySelectorAll('.card');
const reintentarBtn = document.getElementById('reintentarBtn');
const salirBtn = document.getElementById('salirBtn');

const audioIncorrecto = new Audio('/audio/incorrecto.mp3');
let firstCard = null;
let secondCard = null;
let lockBoard = false;

let selectedCard = null;
let matchedPairs = 0;
let lives = 3; // Número inicial de vidas
let attempts = 0;
const maxAttempts = 3;

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
        attempts++;
        showMessage(errorMessage, audioIncorrecto);
            lives--;
        if (lives >= 0) {
            animateHeartDisappearance(hearts[lives]);
        }

        if (attempts === maxAttempts) {
            setTimeout(mostrarGameOver, 500);
            lockBoard = true; // Deshabilitar el juego
        cards.forEach(card => card.removeEventListener('click', flipCard)); // Desactivar eventos de clic  
        }
        
        
    }, 1000);
}

reintentarBtn.addEventListener('click', () => window.location.reload());
    salirBtn.addEventListener('click', () => window.location.href = '../index.html');


function mostrarGameOver() {
    modalGameOver.style.display = 'block';
    audioGameOver.play();
}
function toggleSound() {
    audio.volume = isMuted ? 0.03 : 0;
    isMuted = !isMuted;
    soundIcon.style.display = isMuted ? 'none' : 'block';
    muteIcon.style.display = isMuted ? 'block' : 'none';
}

function animateHeartDisappearance(heart) {
    heart.style.transition = 'opacity 0.5s ease-out';
    heart.style.opacity = '0';
    setTimeout(() => {
        heart.style.display = 'none';
    }, 500);
}
function showMessage(messageElement, audio) {
    messageElement.style.display = 'block';
    playAudio(audio);
    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 1000);
}

function playAudio(audio) {
    audio.currentTime = 0;
    audio.play();
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
});
