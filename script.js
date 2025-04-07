const gameArea = document.querySelector('.game-area');
const playerCar = document.querySelector('.player-car');
const startBtn = document.getElementById('startBtn');
const scoreElement = document.getElementById('score');
const roadLines = document.querySelectorAll('.road-line');

let score = 0;
let speed = 5;
let gameIsRunning = false;
let animationId;
let obstacles = [];

// Car controls
let playerX = 50;
const keys = {
    ArrowLeft: false,
    ArrowRight: false
};

function moveLines() {
    roadLines.forEach(line => {
        let pos = line.offsetTop;
        if (pos >= 600) {
            pos = -60;
        }
        line.style.top = pos + speed + 'px';
    });
}

function createObstacle() {
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    obstacle.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
    obstacle.style.top = '-70px';
    gameArea.appendChild(obstacle);
    obstacles.push(obstacle);
}

function moveObstacles() {
    obstacles.forEach((obstacle, index) => {
        let pos = obstacle.offsetTop;
        if (pos > 600) {
            obstacle.remove();
            obstacles.splice(index, 1);
            score++;
            scoreElement.textContent = score;
        } else {
            obstacle.style.top = pos + speed + 'px';
            checkCollision(obstacle);
        }
    });
}

function checkCollision(obstacle) {
    const carRect = playerCar.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();
    
    if (carRect.left < obstacleRect.right &&
        carRect.right > obstacleRect.left &&
        carRect.top < obstacleRect.bottom &&
        carRect.bottom > obstacleRect.top) {
        gameOver();
    }
}

function gameOver() {
    gameIsRunning = false;
    cancelAnimationFrame(animationId);
    startBtn.textContent = 'Restart';
    alert('Game Over! Score: ' + score);
}

function gameLoop() {
    if (gameIsRunning) {
        moveLines();
        moveObstacles();
        
        if (keys.ArrowLeft && playerX > 10) playerX -= 5;
        if (keys.ArrowRight && playerX < 90) playerX += 5;
        
        playerCar.style.left = playerX + '%';
        
        if (Math.random() < 0.02) createObstacle();
        
        animationId = requestAnimationFrame(gameLoop);
    }
}

document.addEventListener('keydown', (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = false;
    }
});

startBtn.addEventListener('click', () => {
    if (!gameIsRunning) {
        gameIsRunning = true;
        score = 0;
        scoreElement.textContent = score;
        obstacles.forEach(obs => obs.remove());
        obstacles = [];
        startBtn.textContent = 'Running';
        gameLoop();
    }
});
