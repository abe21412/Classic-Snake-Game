//set up screen and necessary variables
let canvas = document.getElementById('screen');
let ctx = canvas.getContext('2d');
const length_width = 15;
let myTimeout;
let foodX;
let foodY;
//define food object
const food = {
  x: foodX, 
  y: foodY
};
//define snake object and coordinates
let snake = [
  {x:300,y:150},
  {x:315,y:150},
  {x:330,y:150},
  {x:345,y:150},
  {x:360,y:150},
  {x:375,y:150}
]; 
//draw one body part of the snake
function drawSnakePart(snakePart) {
  ctx.fillStyle = '#008000';
  ctx.strokeStyle = '#006400';
  ctx.beginPath();
  ctx.fillRect(snakePart.x,snakePart.y,length_width,length_width);
  ctx.strokeRect(snakePart.x,snakePart.y,length_width,length_width);
  ctx.closePath();
}
//draw the whole snake
function drawSnake() {
  snake.forEach(drawSnakePart);
}
//draw a new piece of food in a random location
function drawNewFood(){
  food.x = Math.floor(Math.random()*40)*length_width;
  food.y = Math.floor(Math.random()*20)*length_width;
  ctx.fillStyle = "#FF0000";
  ctx.strokeStyle = "#8B0000";
  ctx.beginPath();
  ctx.fillRect(food.x,food.y,length_width,length_width);
  ctx.strokeRect(food.x,food.y,length_width,length_width);
  ctx.closePath();
}

function drawFood(){
  ctx.fillStyle = "#FF0000";
  ctx.strokeStyle = "#8B0000";
  ctx.beginPath();
  ctx.fillRect(food.x,food.y,length_width,length_width);
  ctx.strokeRect(food.x,food.y,length_width,length_width);
  ctx.closePath();
}
//controls the snake's movement depending on which arrow key is pressed
function moveSnake(dx,dy) {
  const head = {x: snake[0].x + dx, y: snake[0].y + dy};
  snake.unshift(head);
  snake.pop();
  //wraps the snake in case it goes off-screen
  if(snake[0].x < 0){
    snake[0].x = 585;
  }
  else if(snake[0].x > canvas.width){
    snake[0].x = 0;
  }
  else if(snake[0].y < 0){
    snake[0].y = 285;
  }
  else if(snake[0].y > canvas.height){
    snake[0].y = 0;
  }
  //clears the context to simulate movement each time the snake moves 
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawSnake();
  //draws the same piece of food created by the drawNewFood function each time the context is cleared
  drawFood();
  //moveSnake function calls itself recursively every 60 ms to give the snake momentum
  clearTimeout(myTimeout);
  myTimeout = setTimeout(function(){
  moveSnake(dx,dy) }, 60);
    }
//handles which direction the snake moves in depending on which arrow key is pressed
function keyPress(e){
  let key = e.key;
  if(key == "ArrowUp") { 
    if(snake[0].y - length_width !== snake[1].y) {
      moveSnake(0,-length_width);
    }
  }
  else if(key == "ArrowDown") {
    if(snake[0].y + length_width !== snake[1].y) {
      moveSnake(0,length_width);
    }
  }
  else if(key == "ArrowLeft") { 
    if(snake[0].x - length_width !== snake[1].x) {
      moveSnake(-length_width,0);
    }
  }
  else if(key == "ArrowRight") { 
    if(snake[0].x + length_width !== snake[1].x) {
      moveSnake(length_width,0);
    }
  }  
} 
//checks if the snake has eaten the food
//if so, the function adds a square to the snake and draws a new food in a new random location
function checkEaten(){
  if(snake[0].x == food.x && snake[0].y == food.y){
    snake.push({x:snake[snake.length-1].x+15,y:snake[snake.length-1].y})
    drawNewFood();
  }
}
//checks if the snake has run into itself and died
//if so, it prints a game over screen
function checkAlive(){
  for(let i = 1; i<snake.length; i++){
    if(snake[0].x == snake[i].x && snake[0].y == snake[i].y){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle = '#008000';
      ctx.font = "italic small-caps bold 30px arial";
      ctx.fillText("Game Over",225,150);
      snake = null;
      food = null;
    }
  } 
}
//main game loop
//draws initial snake and food, adds the event listener to detect key presses
//runs functions to check if the snake ate the food and if the snake is alive every 60ms
//i.e. every time the snake moves
function mainGame(){
drawSnake();
drawNewFood();
document.addEventListener("keydown",keyPress);
let checkFood = setInterval(function(){checkEaten()},60);
let checkLife = setInterval(function(){checkAlive()},60);
}

mainGame();

