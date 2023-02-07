const resetDisplay = document.querySelector('.reset-popup-container');
const reset = document.querySelector('.reset-icon');
const start = document.querySelector('.start');
const gameBoard = document.getElementById('game-board');
const snakeDoc = document.getElementsByClassName('snake');
const foodDoc = document.getElementsByClassName('food');
const score = document.getElementById('score');

let lastRender = 0;
const SNAKE_SPEED = 8;  // can change the speed
const gameBoardBoxes = 21;

let snake = [
    { x: 1, y: 1 },
    { x: 2, y: 1 },
    { x: 3, y: 1 }
]
let newSegment = undefined;
let currentSnakeSegments = 3;
let directionX = 1;
let directionY = 0;

let lastKey = 'ArrowRight'; //default

const foodLocation = { x: undefined, y: undefined };

/* ||**********main*************|| */

function main(timeStamp) {
    diffCurrentLastRender = (timeStamp - lastRender) / 1000;

    const id = requestAnimationFrame(main);

    if (diffCurrentLastRender < 1 / SNAKE_SPEED) return;

    // console.log(diffCurrentLastRender);
    lastRender = timeStamp;
    // console.log(directionX, directionY);



    if (gameOver()) {
        for (let segment of snakeDoc) {
            segment.style.backgroundColor = 'red';

        }
        resetDisplay.style.display = 'flex';
        cancelAnimationFrame(id);
        return;

    }

    if (hasEaten()) {
        score.innerText = Number(score.innerText) + 1;
        snakeUpdate();
        foodSpawn();
        foodDraw();
        foodDoc[0].remove();
    }

    draw();
    update();



}

/* ||**********Initialize*************|| */

window.addEventListener('click', () => {
    foodSpawn()
    foodDraw()
    start.style.display = 'none';
    window.requestAnimationFrame(main);
}, {once: true});


/* ||************Reset***********|| */

reset.addEventListener('click', () => {
    score.innerText = '0';
    snake = [
        { x: 1, y: 1 },
        { x: 2, y: 1 },
        { x: 3, y: 1 }
    ]
    currentSnakeSegments = 3;
    directionX = 1;
    directionY = 0;

    lastKey = 'ArrowRight'; //default

    foodDoc[0].remove();
    foodSpawn()
    foodDraw()

    window.requestAnimationFrame(main);

    resetDisplay.style.display = 'none';
})


/* ||*********Events**************|| */



window.addEventListener('keydown', evt => {
    const key = evt.key;
    switch (key) {
        case 'ArrowUp':
            if (lastKey === 'ArrowDown') break;
            directionX = 0;
            directionY = -1;
            lastKey = key;
            break;

        case 'ArrowDown':
            if (lastKey === 'ArrowUp') break;
            directionX = 0;
            directionY = 1;
            lastKey = key;
            break;

        case 'ArrowRight':
            if (lastKey === 'ArrowLeft') break;
            directionY = 0;
            directionX = 1;
            lastKey = key;
            break;

        case 'ArrowLeft':
            if (lastKey === 'ArrowRight') break;
            directionY = 0;
            directionX = -1;
            lastKey = key;
            break;
    }
})


/* ||**********functions*************|| */

function update() {

    for (let i = 0; i < snake.length - 1; i++) {
        snake[i] = { ...snake[i + 1] };
    }
    for (let i = 0; i < snakeDoc.length - currentSnakeSegments; i++) {
        gameBoard.removeChild(snakeDoc[i]);
        i--
    }

    snake[snake.length - 1].x += directionX;
    snake[snake.length - 1].y += directionY;
}

function draw() {
    // gameBoard.innerHTML = '';
    for (let segment of snake) {
        newSegment = document.createElement('div');

        newSegment.classList.add('snake');
        newSegment.style.gridRowStart = segment.y;
        newSegment.style.gridColumnStart = segment.x;

        gameBoard.appendChild(newSegment);

    }

}

function snakeUpdate() {
    snake.unshift({ x: snake[0].x, y: snake[0].y });
    currentSnakeSegments++;
}

function foodDraw() {
    let food = document.createElement('div');
    gameBoard.appendChild(food);
    food.classList.add('food');
    food.style.gridRowStart = foodLocation.y;
    food.style.gridColumnStart = foodLocation.x;
}

function foodSpawn() {
    foodLocation.x = Math.floor(Math.random() * 21) + 1;
    foodLocation.y = Math.floor(Math.random() * 21) + 1;
}

function hasEaten() {
    return snake[snake.length - 1].x === foodLocation.x && snake[snake.length - 1].y === foodLocation.y;
}


function gameOver() {
    if (snake[snake.length - 1].x === gameBoardBoxes + 1 || snake[snake.length - 1].y === gameBoardBoxes + 1 || snake[snake.length - 1].x === 0 || snake[snake.length - 1].y === 0) {
        return true;
    }
    for (let i = 0; i < snake.length - 1; i++) {
        if (snake[i].x === snake[snake.length - 1].x && snake[i].y === snake[snake.length - 1].y) {
            return true;
        }
    }
    return false;
}