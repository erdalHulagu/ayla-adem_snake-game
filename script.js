const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "rgb(214, 164, 205)";
const snakeColor = "rgba(70, 240, 252, 0.8)";
const snakeBorder = "gray";
const foodColor = "hsla(309, 72%, 79%, 1.00)";
const foodBorder = "purple";
const unitSize = 25;
let snakeSpeed = 250;
let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;
let snake = [
    {x:unitSize * 4, y:0},
    {x:unitSize * 3, y:0},
    {x:unitSize * 2, y:0},
    {x:unitSize, y:0},
    {x:0, y:0}
];

const img = new Image();
// img.src = "./img/ayla-adem.jpeg";
img.src ="https://i.etsystatic.com/26056260/r/il/06e468/5379971060/il_1080xN.5379971060_kjk7.jpg";
window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);

img.onload = function() {
    gameStart();
};

function gameStart(){
    running= true;
    scoreText.textContent = score;
    createFood();
    drawFood();
    nextTick();
};

function nextTick(){
    if(running){
        setTimeout(()=>{
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, snakeSpeed);
    }
    else{
        displayGameOver();
    }
};

function clearBoard(){
    ctx.drawImage(img, 0, 0, gameBoard.width, gameBoard.height);
};

function createFood(){
    function randomFood(min, max){
        const randNum = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
        return randNum;
    }
    foodX = randomFood(0, gameWidth - unitSize);
    foodY = randomFood(0, gameHeight - unitSize);
};

function drawFood(){
    // gradientli food (mevcut foodColor kullanılıyor)
    const gradient = ctx.createRadialGradient(
        foodX + unitSize/2, foodY + unitSize/2, unitSize/6, 
        foodX + unitSize/2, foodY + unitSize/2, unitSize/2
    );
    gradient.addColorStop(0, "white"); // merkezde ışık
    gradient.addColorStop(0.3, foodColor); 
    gradient.addColorStop(1, foodBorder); 

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(foodX, foodY, unitSize, unitSize, 6); // köşeler yuvarlatılmış
    ctx.fill();
    ctx.closePath();

    // parlama efekti
    ctx.shadowColor = "rgba(255, 251, 251, 1)";
    ctx.shadowBlur = 10
    ctx.shadowOffsetX= 2;
    ctx.shadowOffsetY = 2;
    ctx.fill();
    
    // shadow reset
    ctx.shadowBlur = 0;
}

function moveSnake(){
    const head = {x: snake[0].x + xVelocity,
                  y: snake[0].y + yVelocity};
    
    snake.unshift(head);
    //if food is eaten
    if(snake[0].x == foodX && snake[0].y == foodY){
        score+=1;
        scoreText.textContent = score;
        createFood();
          if(score % 5 === 0){
            snakeSpeed = Math.max(30, snakeSpeed - 10); 
            // 30 ms’den daha hızlı olmasın diye limit
        }
    }
    else{
        snake.pop();
    }     
};

function drawSnake(){
    snake.forEach((snakePart, index) => {
        // gradientli snake parçası
        const gradient = ctx.createRadialGradient(
            snakePart.x + unitSize/2, snakePart.y + unitSize/2, unitSize/6,
            snakePart.x + unitSize/2, snakePart.y + unitSize/2, unitSize/1.2
        );
        gradient.addColorStop(0, "white"); 
        gradient.addColorStop(0.3, snakeColor);
        gradient.addColorStop(1, snakeBorder);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(snakePart.x, snakePart.y, unitSize, unitSize, 6);
        ctx.fill();
        ctx.closePath();

        // hafif parlama
        ctx.shadowColor = "rgba(234, 245, 246, 0.97)";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
    });
}

function changeDirection(event){
    const keyPressed = event.keyCode;
    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;

    const goingUp = (yVelocity == -unitSize);
    const goingDown = (yVelocity == unitSize);
    const goingRight = (xVelocity == unitSize);
    const goingLeft = (xVelocity == -unitSize);

    switch(true){
        case(keyPressed == LEFT && !goingRight):
            xVelocity = -unitSize;
            yVelocity = 0;
            break;
        case(keyPressed == UP && !goingDown):
            xVelocity = 0;
            yVelocity = -unitSize;
            break;
        case(keyPressed == RIGHT && !goingLeft):
            xVelocity = unitSize;
            yVelocity = 0;
            break;
        case(keyPressed == DOWN && !goingUp):
            xVelocity = 0;
            yVelocity = unitSize;
            break;
    }
};

function checkGameOver(){
    switch(true){
        case (snake[0].x < 0):
            running = false;
            break;
        case (snake[0].x >= gameWidth):
            running = false;
            break;
        case (snake[0].y < 0):
            running = false;
            break;
        case (snake[0].y >= gameHeight):
            running = false;
            break;
    }
    for(let i = 1; i < snake.length; i+=1){
        if(snake[i].x == snake[0].x && snake[i].y == snake[0].y){
            running = false;
        }
    }
};

function displayGameOver(){
    ctx.font = "50px MV Boli";
    ctx.fillStyle = "rgba(0, 200, 255, 0.6";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER!", gameWidth / 2, gameHeight / 2);
    running = false;
};

function resetGame(){
    score = 0;
    xVelocity = unitSize;
    yVelocity = 0;
    snakeSpeed = 220;
    snake = [
        {x:unitSize * 4, y:0},
        {x:unitSize * 3, y:0},
        {x:unitSize * 2, y:0},
        {x:unitSize, y:0},
        {x:0, y:0}
    ];
    gameStart();
};
