/*----------------------------------------------------------------------------
 * Variables
 * ---------------------------------------------------------------------------
 */

var snake;
var snakeLength;
var snakeSize;
var snakeDirection;

var food;

var context;
var screenWidth;
var screenHeight;

var gameState;
var gameOverMenu;
var startMenu;
var restartButton;
var startButton;
var playHUD;
var scoreboard;

/*----------------------------------------------------------------------------
 * Executing Game Code
 * ---------------------------------------------------------------------------
 */

gameInitialize();
snakeInitialize();
foodInitialize();
setInterval(gameLoop, 1500/30);

/*---------------------------------------------------------------------------
 * Game Functions
 * --------------------------------------------------------------------------
 */

function gameInitialize() {
    var canvas = document.getElementById("game-screen");
    context = canvas.getContext("2d");

    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
    canvas.width = screenWidth;
    canvas.height = screenHeight;
    
    document.addEventListener("keydown", keyboardHandler);
    
    gameOverMenu = document.getElementById("gameOver");
    centerMenuPosition(gameOverMenu);
    
    startMenu = document.getElementById("start");
    centerMenuPosition(startMenu);
    
    restartButton = document.getElementById("restartButton");
    restartButton.addEventListener("click", gameRestart);
    
    startButton= document.getElementById("startButton");
    startButton.addEventListener("click", gameStart);
    
    
    playHUD = document.getElementById("playHUD");
    scoreboard = document.getElementById("scoreboard");
    
    setState("SNAKE!!!");
}

function gameLoop() {
    gameDraw();
    drawScoreboard();
    if(gameState == "PLAY"){
    snakeUpdate();
    snakeDraw();
    foodDraw();
    }
}

function gameDraw() {
    context.fillStyle = "rgb(243, 255, 15)";
    context.fillRect(0, 0, screenWidth, screenHeight);
}

function gameStart(){
    snakeInitialize();
    foodInitialize();
    hideMenu(startMenu);
    setState("PLAY");
}

function gameRestart(){
    snakeInitialize();
    foodInitialize();
    hideMenu(gameOverMenu);
    setState("PLAY");
}


/*---------------------------------------------------------------------------
 * Snake Functions
 * --------------------------------------------------------------------------
 */


function snakeInitialize() {
    snake = [];
    snakeLength = 10;
    snakeSize = 20;
    snakeDirection = "down";

    for (var index = snakeLength - 1; index  >= 0; index--) {
        snake.push( {
            x: index,
            y: 0
        });   
    }
}
    
function snakeDraw() {
    for (var index = 0; index < snake.length; index++) {
        context.fillStyle = "white";
        context.fillRect(snake[index].x * snakeSize, snake[index].y * snakeSize, snakeSize, snakeSize);
        context.strokeStyle = "black";
        context.strokeRect(snake[index].x * snakeSize, snake[index].y * snakeSize, snakeSize, snakeSize);
    }
}

function snakeUpdate() {
    var snakeHeadX = snake[0].x;
    var snakeHeadY = snake[0].y;

    if(snakeDirection == "down") {
        snakeHeadY++;
    }
    else if(snakeDirection == "right") {
        snakeHeadX++;
    }
    if(snakeDirection == "up") {
        snakeHeadY--;
    }
    else if(snakeDirection == "left"){
      snakeHeadX--;
    }
    
    checkFoodCollision(snakeHeadX , snakeHeadY);
    checkWallCollision(snakeHeadX , snakeHeadY);
    checkSnakeCollision(snakeHeadX , snakeHeadY);

    var snakeTail = snake.pop();
    snakeTail.x = snakeHeadX;
    snakeTail.y = snakeHeadY;
    snake.unshift(snakeTail);
}

/*---------------------------------------------------------------------------
 * Food Functions
 * --------------------------------------------------------------------------
 */


function foodInitialize() {
    food = {
        x: 0,
        y: 0
    };
    setFoodPosition();
}

function foodDraw() {
    context.fillStyle = "white";
    context.fillRect(food.x * snakeSize, food.y * snakeSize, snakeSize, snakeSize); 
}

function setFoodPosition()  {
    var randomX = Math.floor(Math.random() * screenWidth);
    var randomY = Math.floor(Math.random() * screenHeight);
    
    food.x = Math.floor(randomX/ snakeSize);
    food.y = Math.floor(randomY/snakeSize);
    
}
/*---------------------------------------------------------------------------
 * input function
 * --------------------------------------------------------------------------
 */

function keyboardHandler(event){
    console.log(event);
    if(event.keyCode == "39" && snakeDirection != "left") {
        snakeDirection = "right";
    }
    else if(event.keyCode == "40" && snakeDirection != "up") {
        snakeDirection = "down";
    }
    if(event.keyCode == "37" && snakeDirection != "right") {
        snakeDirection = "left";
    }
    else if(event.keyCode == "38" && snakeDirection != "down") {
        snakeDirection = "up";
    }
}

/*---------------------------------------------------------------------------
 * Collision Handling
 * --------------------------------------------------------------------------
 */

function checkFoodCollision(snakeHeadX, snakeHeadY){
    if(snakeHeadX == food.x && snakeHeadY == food.y){
        setFoodPosition();
        snake.push({
            x:0,
            y:0
        });
       snakeLength++; 
    }
}
function checkWallCollision(snakeHeadx, snakeHeadY){
    if(snakeHeadx * snakeSize >= screenWidth || snakeHeadx < 0 ){
      setState("GAME OVER");
      
          }
    if(snakeHeadY * snakeSize >= screenHeight || snakeHeadY < 0 ){
      setState("GAME OVER");
      
          }
      }
      function checkSnakeCollision (snakeHeadX, snakeHeadY ) {
          for(var index = 1; index < snake.length; index++) {
              if(snakeHeadX == snake[index].x && snakeHeadY == snake[index].y){
                  setState("GAME OVER");
                  return;
              }
          }
      }   
   
   


/*---------------------------------------------------------------------------
 * Game state Handling
 * --------------------------------------------------------------------------
 */

function setState(state){
    gameState = state;
    showMenu(state);
}

/*---------------------------------------------------------------------------
 * Menu Functions
 * --------------------------------------------------------------------------
 */
function displayMenu(menu) {
    menu.style.visibility = "visible";
}

function hideMenu (menu){
    menu.style.visibility = "hidden";
}

function showMenu(state) {
    if(state == "GAME OVER") {
        displayMenu(gameOverMenu);
    }
    else if( state=="PLAY") {
        displayMenu(playHUD);
    }
}



function centerMenuPosition(menu) {
    menu.style.top = (screenHeight / 2) - (menu.offsetHeight / 2) + "px";
    menu.style.left = (screenWidth / 2) - (menu.offsetWidth / 2) + "px";
}

function drawScoreboard(){
    scoreboard.innerHTML =  "Length:" + snakeLength;
}