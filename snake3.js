const gameBoard= document.querySelector("#gameBoard");
const ctx=gameBoard.getContext("2d");
const scoreText= document.querySelector("#scoreText");
const resetBtn=document.querySelector("#resetBtn");
const gameWidth= gameBoard.width;
const gameHeight= gameBoard.height;
// const boardBackground="white";
// const snakeColor="lightgreen";
// const snakeBorder="black";
// const foodColor="red";

const snakeEat = new Audio("./image/snakeEat.mp4");
const snakeDie= new Audio("./image/deadSound.mp4");


const unitSize=25;
let running = false;
let xVelocity=0;
let yVelocity=0;
let foodX;
let foodY;
let score=0;
// const highscore=document.getElementById("highscore") || 0;
const highscore=document.getElementById("highscore");


let gameStarted=false;
const img= new Image();
img.src="./image/bg1.jpg";
img.onload=function(){
    ctx.drawImage(img,0,0,gameWidth,gameHeight);
}

let snake=[
    // {  x:unitSize*4,y:0},  chiều dài ban đầu của rắnrắn
    // {  x:unitSize*3,y:0},
    // {  x:unitSize*2,y:0},
    // {  x:unitSize,y:0},
    {x:0,y:0}  
];

window.addEventListener("keydown",changeDirection);
resetBtn.addEventListener("click",resetGame);

gameStart();



function gameStart(){
    if (!gameStarted) return;
    running=true;
    scoreText.textContent=score;
    creatFood();
    drawFood();
    drawSnake();
    nextTick();

};
function nextTick(){
     if(running){
        setTimeout(()=>{
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameover();
            nextTick();

        },300);
     }

    else{
        displayGameover();
    }
};
function clearBoard(){
    // ctx.fillStyle=boardBackground;
    // ctx.fillRect(0,0,gameWidth,gameHeight);
    ctx.drawImage(img,0,0,gameWidth,gameHeight);
    if (!gameStarted) {
        drawSnake(); 
        creatFood();
        drawFood(); 

    }
};
function creatFood(){
    function randomFood(min,max){
const randNum=Math.round((Math.random()*(max-min)+min)/unitSize)*unitSize;
return randNum;
}
   foodX=randomFood(0,gameWidth-unitSize);
   foodY=randomFood(0,gameWidth-unitSize);

};

const foodImg=new Image();
foodImg.src="./image/food.png";
foodImg.onload=function(){
    drawFood();
}
function drawFood(){
// ctx.fillStyle=foodColor;
ctx.drawImage(foodImg,foodX,foodY,unitSize,unitSize)
// ctx.fillRect(foodX,foodY,unitSize,unitSize);
};
window.addEventListener("DOMContentLoaded", () => {
    const storedHighScore = localStorage.getItem("highscore");
    if (storedHighScore) {
        highscore.textContent = "Highscore:"+storedHighScore; // Hiển thị highscore đã lưu
    } else {
        highscore.textContent ="Highscore:0"; // Nếu không có highscore, hiển thị 0
    }
    creatFood(); // Tạo vị trí thức ăn
    drawFood();  // Vẽ thức ăn
    drawSnake();
});

function moveSnake(){
     const head={
        x:snake[0].x+xVelocity,
        y:snake[0].y+yVelocity};

        snake.unshift(head);
        if(snake[0].x==foodX && snake[0].y==foodY){
               score+=1;
               scoreText.textContent=score;
               updateHighScore();
               creatFood();
               snakeEat.play();
        }
     else{
        snake.pop();
     }
};
const snakeImage=new Image();
snakeImage.src="./image/Worm2.png";
snakeImage.onload=function(){
    drawSnake();
}
function drawSnake(){

snake.forEach(snakePart => {
    ctx.drawImage(snakeImage, snakePart.x, snakePart.y, unitSize, unitSize);
});
};

function changeDirection(event){
     const keyPressed=event.keyCode;
     const LEFT=37;
     const RIGHT=39;
     const UP=38;
     const DOWN=40;

     // Bắt đầu trò chơi khi nhấn phím lên hoặc xuống
    if (!gameStarted) {
        if (keyPressed === UP) {
            yVelocity = -unitSize; // Di chuyển lên
            xVelocity = 0;
        } else if (keyPressed === DOWN) {
            yVelocity = unitSize; // Di chuyển xuống
            xVelocity = 0;
        } else {
            return; // Không làm gì nếu không nhấn phím hợp lệ
        }
        gameStarted = true; // Đánh dấu trò chơi đã bắt đầu
        running = true; // Kích hoạt trạng thái chạy
        gameStart(); // Bắt đầu trò chơi
        drawFood();
        drawSnake();
        return;
    }

   
     const goingUp=(yVelocity == -unitSize);
     const goingDown=(yVelocity == unitSize);
     const goingRight=(xVelocity == unitSize);
     const goingLeft=(xVelocity == -unitSize);

   switch(true){
    case(keyPressed==LEFT && !goingRight):
    xVelocity = -unitSize;
    yVelocity = 0;
    break;

    case(keyPressed == UP && !goingDown):
    xVelocity=0;
    yVelocity=-unitSize;
    break;

    case(keyPressed==RIGHT && !goingLeft):
    xVelocity=unitSize;
    yVelocity=0;
    break;

    case(keyPressed == DOWN && !goingUp):
    xVelocity=0;
    yVelocity=unitSize;
    break;

   }

};
function checkGameover(){
          // Nếu rắn đi qua biên, đưa nó sang phía đối diện
    if (snake[0].x < 0) {
        snake[0].x = gameWidth - unitSize; // Xuất hiện ở bên phải
    } else if (snake[0].x >= gameWidth) {
        snake[0].x = 0; // Xuất hiện ở bên trái
    }

    if (snake[0].y < 0) {
        snake[0].y = gameHeight - unitSize; // Xuất hiện ở phía dưới
    } else if (snake[0].y >= gameHeight) {
        snake[0].y = 0; // Xuất hiện ở phía trên
    }

    // Kiểm tra xem rắn có cắn chính mình hay không
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
            running = false; // Dừng trò chơi nếu rắn tự cắn
            snakeDie.play();
            
        }
    }
};
function displayGameover(){
    ctx.font="50px MV Boli";
    ctx.fillStyle="black";
    ctx.textAlign="center";
    ctx.fillText("GAME OVER!",gameWidth/2,gameHeight/2);
    running=false;
};

function updateHighScore() {

    const storedHighScore = localStorage.getItem("highscore"); // Lấy highscore đã lưu
    if (!storedHighScore || score > parseInt(storedHighScore)) {
        localStorage.setItem("highscore", score); // Cập nhật highscore nếu điểm hiện tại cao hơn
        highscore.textContent = "Highscore:"+score; // Hiển thị highscore đã lưu

 // Hiển thị highscore mới lên giao diện
    }
}
function resetGame(){
    score=0;
    xVelocity= unitSize;
    yVelocity= 0;
    gameStarted = false; // Đặt lại trạng thái khởi động
    running = false; 
    
snake=[
    // {  x:unitSize*4,y:0},
    // {  x:unitSize*3,y:0},
    // {  x:unitSize*2,y:0},
    // {  x:unitSize,y:0},
    {x:0,y:0}  
];
    // Cập nhật bảng và điểm số
    scoreText.textContent = score;

    creatFood(); // Tạo lại thức ăn
    clearBoard(); // Xóa bảng
    drawSnake(); // Vẽ rắn
    drawFood(); // Vẽ thức ăn
    updateHighScore();
gameStart();
};






