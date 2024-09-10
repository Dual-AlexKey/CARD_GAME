document.addEventListener('DOMContentLoaded', function () {
    const errorMessage = document.getElementById('error-message');
    const correctMessage = document.getElementById('correct-message');
    const modalGameOver = document.getElementById('gameOverModal');
    const hearts = document.querySelectorAll('.heart');
    const cards = document.querySelectorAll('.card');
    const reintentarBtn = document.getElementById('reintentarBtn');
    const salirBtn = document.getElementById('salirBtn');
    const completedMessage = document.getElementById('completed');
    const audio = document.querySelector('#audioElement');
    const muteIcon = document.querySelector('#mute-icon');
    const soundIcon = document.querySelector('#sound-icon');

    const audioCorrecto = new Audio('audio/correcto.mp3');
    const audioIncorrecto = new Audio("audio/incorrecto.mp3");
    const audioGameOver = new Audio('audio/gameover.mp3');
    audio.volume = 0.03;
    audioGameOver.volume = 0.5;


let isMuted = false;
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;
let lives = 4; // Número inicial de vidas
let attempts = 0;
const totalPairs = 6;
const maxAttempts = 4;

soundIcon.addEventListener('click', toggleSound);
muteIcon.addEventListener('click', toggleSound);

cards.forEach(card => {
    card.addEventListener('click', selectCard);
});

reintentarBtn.addEventListener('click', () => window.location.reload());
salirBtn.addEventListener('click', () => window.location.href = '../index.html');

function toggleSound() {
    audio.volume = isMuted ? 0.03 : 0;
    isMuted = !isMuted;
    soundIcon.style.display = isMuted ? 'none' : 'block';
    muteIcon.style.display = isMuted ? 'block' : 'none';
}


function selectCard() {
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

    isMatch ? correctMatch() : unflipCards();
}

function correctMatch() {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    matchedPairs++;
    resetBoard();
    showMessage(correctMessage, audioCorrecto);
    if (matchedPairs === totalPairs) {
        completedMessage.style.display = 'block';
    }
    const allDisabled = Array.from(cards).every(card => card.classList.contains('matched'));
    
        if (allDisabled) {
            // Todas las cartas están deshabilitadas, mostrar la flecha
            const arrowIcon = document.getElementById('arrow-icon');
            const modal = document.getElementById("modal");
            if (modal) {  // Verificación adicional
                modal.style.display = "flex";
                modal.classList.add("show");
                arrowIcon.style.display = 'inline-block';
                arrowIcon.addEventListener('click', function() {
                    window.location.href = 'game2.html';
                });
    
                // Ocultar el modal después de 10 segundos
                setTimeout(() => {
                    modal.classList.remove("show");
                    modal.classList.add("hide");
                    setTimeout(() => {
                        modal.style.display = "none";
                        modal.classList.remove("hide");
                    }, 500); 
                }, 1000); // 10000 milisegundos = 10 segundos
            } else {
                console.error('El elemento con el ID "modal" no existe en el DOM.');
            }
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
cards.forEach(card => card.addEventListener('click', selectCard));
});
