const board=document.querySelector('.board');
const startbutton=document.querySelector(".btn-start")
const modal=document.querySelector(".modal")
const startGamemodal=document.querySelector("#Start-Game")
const GameOvermodal=document.querySelector(".game-over")
const restartbutton=document.querySelector(".btn-restart")
const highscoreelement=document.querySelector("#high-score")
const scoreelement=document.querySelector("#score")
const timeelement=document.querySelector("#time")

const blockHeight=50
const blockWidth=50

let highscore = parseInt(localStorage.getItem("highscore")) || 0
let score=0
let time=`00-00`

highscoreelement.innerText=highscore

const cols=Math.floor(board.clientWidth  /  blockWidth);
const rows=Math.floor(board.clientHeight   /   blockHeight);
let intervalid=null;
let timerintervalid=null;

let food={x:Math.floor(Math.random()* rows), y : Math.floor(Math.random()*cols)}


const blocks=[]
let snake=[
    {
    x:1 ,y:3
}]

let direction='down'


// for(let i =  0;  i <rows * cols ;  i++){
//     const block=document.createElement('div');
//     block.classList.add("block")
//     board.appendChild(block);
// }

for(let row=0; row<rows; row++){
    for(let col=0; col<cols; col++){
        const block=document.createElement('div');
    block.classList.add("block")
    board.appendChild(block);
    blocks[`${row}-${col}`]= block
    }
}
// to visible snake and food
function render() {


     
let head=null

blocks[`${food.x}-${food.y}`].classList.add("food");
if(direction==="left"){
    head={x:snake[0].x,y: snake[0].y-1}
}
else if(direction==="right"){
     head={x:snake[0].x,y: snake[0].y+1}
}
else if(direction==="down"){
     head={x:snake[0].x+1,y: snake[0].y}
}
else if(direction==="up"){
     head={x:snake[0].x-1,y: snake[0].y}
}
//wall collision logic
if(head.x<0|| head.x>=rows|| head.y<0||head.y>=cols){
    clearInterval(intervalid)
    modal.style.display="flex"
    startGamemodal.style.display="none"
    GameOvermodal.style.display="flex"
    return;
}
//food consume logic
if(head.x==food.x && head.y==food.y){
    blocks[`${food.x}-${food.y}`].classList.remove("food")
    food={
        x:Math.floor(Math.random()* rows), y : Math.floor(Math.random()*cols)
    }
    blocks[`${food.x}-${food.y}`].classList.add("food")

    snake.unshift(head)

   score += 10
scoreelement.innerText = score

if(score > highscore){
    highscore = score
    localStorage.setItem("highscore", highscore.toString())
    highscoreelement.innerText = highscore  // ← is this line there?
}



}

snake.forEach(segment=>{
     (blocks[`${segment.x}-${segment.y}`].classList.remove("fill"))
})
snake.unshift(head)//element add in previous
snake.pop()//element remove from end

  

    snake.forEach(segment => {
        (blocks[`${segment.x}-${segment.y}`].classList.add("fill")
    )
    })
}

// intervalid=setInterval(() => {
//        render()
// },500);



startbutton.addEventListener("click",()=>{
    modal.style.display="none"
    intervalid=setInterval(()=>{render()},300)
    timerintervalid=setInterval(()=>{
        let [ min,sec]=time.split("-").map(Number)

        if(sec==59){
            min+=1
            sec=0
        }
        else{
            sec+=1
        }
        time=`${min}-${sec}`
        timeelement.innerText=time
    },1000)
})
// Restart button
restartbutton.addEventListener("click", restartGame)

function restartGame(){
    console.log("restart called!")
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill")
    })
    score=0
    time=`00-00`

    scoreelement.innerText=score
    timeelement.innerText=time
    highscoreelement.innerText=highscore

    blocks[`${food.x}-${food.y}`].classList.remove("food")
    clearInterval(intervalid)
    modal.style.display="none"        // hide entire modal
    snake = [{x:1, y:3}]
    direction = "down"
    food = {x:Math.floor(Math.random()*rows), y:Math.floor(Math.random()*cols)}
    intervalid = setInterval(() => { render() }, 300)
}

// FROM:
document.addEventListener("keydown", (event) => {
    event.preventDefault()
    if(event.key === "ArrowUp") direction = "up"
    else if(event.key === "ArrowRight") direction = "right"
    else if(event.key === "ArrowLeft") direction = "left"
    else if(event.key === "ArrowDown") direction = "down"
})

