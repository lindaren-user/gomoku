let head = document.querySelector("#head");
let decr = document.querySelector("#decr");
let btn = document.querySelector("#btnStart");
let about = document.querySelector("#btnAbout");
let blackChess = document.querySelector("#black");
let whiteChess = document.querySelector("#white");
let isTurnTo = document.querySelector("#isTurnTo");
let canvas = document.querySelector("canvas");
let finishGame = document.querySelector("#finishGame");
let player = document.querySelector("#player");
let ctn = document.querySelector("#continue");
let isFighting = false;

//开始游戏
btn.addEventListener("click", ()=>{
  //准备工作
  head.style.display = decr.style.display = btn.style.display = about.style.display = finishGame.style.display = ctn.style.display = "none";
  isTurnTo.style.display = canvas.style.display = "block";
  
  isFighting = true;  

  //绘制棋盘...
  startGame();
})

//重新开始
ctn.addEventListener("click", ()=>{
  //准备工作
  head.style.display = decr.style.display = btn.style.display = about.style.display = "block";
  isTurnTo.style.display = canvas.style.display = finishGame.style.display = ctn.style.display = "none";

  canvas.style.opacity = "1";
  finishGame.style.opacity = ctn.style.opacity = "0";

  isFighting = true; 

  startGame();
})

//棋盘各个属性
const size = 15;  //棋盘的线条数
const checkWidth = Math.min(window.innerHeight,window.innerWidth) / (size + 3);  //每个格子的宽度
const chessboardWidth = (size + 1)* checkWidth;  //棋盘的宽度

function startGame(){
  if(canvas.getContext){
    let ctx = canvas.getContext("2d");
  
    const cW = checkWidth;
    const cbW = chessboardWidth;
  
    canvas.width = canvas.height = cbW;
  
    //绘制棋盘
    drawChessboard();
  
    //黑棋优先
    let isTurnToBlack = true;
    blackChess.style.display = "inline-block";
  
    //各个位置棋子状态
    //黑棋1，白棋0，空-1
    let chessSt = Array.from({length: size}, (v)=> v = Array(size).fill(-1));
  
    //精准落子（转化坐标）
    let place = (e)=>{
      let [x, y] = [e.offsetX, e.offsetY].map((n)=>{
        return Math.round(n / cW) - 1;  
      })
  
      //超出边界或者重复下均无法落子
      if(!checked(x, y) || chessSt[y][x] !== -1)return false;  
  
      //落子
      placeAPieceAndCheck(x, y);
    };
  
    canvas.addEventListener("click", place);
  
    function placeAPieceAndCheck(x, y){
      ctx.beginPath();
      ctx.arc(cW * (x + 1), cW * (y + 1), cW *2 / 5, 0, Math.PI * 2);
      if(isTurnToBlack){
        ctx.fillStyle = "black";
        isTurnToBlack = false;
        chessSt[y][x] = 1;
      }
      else{
        ctx.fillStyle = "white";
        isTurnToBlack = true;
        chessSt[y][x] = 0;
      }
      ctx.fill();
  
      //每次落子均要判断是否有胜负
      isWinner(x, y);
      
      if(isTurnToBlack){
        blackChess.style.display = "inline-block";
        whiteChess.style.display = "none";
      }
      else{
        blackChess.style.display = "none";
        whiteChess.style.display = "inline-block";
      }
    }
  
    function drawChessboard(){
      ctx.fillStyle = "#E4A751";
      ctx.fillRect(0,0,cbW,cbW);
    
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
    
      //绘制横线条
      for(let i = 1; i <= size; i++){
        ctx.beginPath();
        ctx.moveTo(cW, i * cW);
        ctx.lineTo(size * cW, i * cW);
        ctx.stroke();
      }
    
      //绘制竖线条
      for(let i = 1; i <= size; i++){
        ctx.beginPath();
        ctx.moveTo(i * cW, cW);
        ctx.lineTo(i * cW, size * cW);
        ctx.stroke();
      }
    
      //绘制圆点
      ctx.fillStyle = "black";
      for(let i = 1; i <= 3; i++)
      {
        for(let j = 1; j <= 3; j++)
          {
            ctx.beginPath();
            ctx.arc(i * 4 * cW, j * 4 * cW, cW / 6, 0, Math.PI * 2);
            ctx.fill();
          }
      }
    }
  
    window.addEventListener("resize", ()=>{
      //防止比赛过程中调整窗口大小而导致错误
      if (!isFighting && window.innerWidth < 768) location.reload();
    });
  
    function isWinner(x, y){
      let goal = chessSt[y][x];
  
      let start;  //起始坐标
  
      //注意边界判断
      let count = 0;
      let a = x, b = y;
      //横向判断
      while(checked(b, a - 1) && chessSt[b][a - 1] === goal){
        a--;
        count++;
      }
      
      start = {x:a, y:b};
  
      a = x, b = y;
      while(checked(b, a + 1) && chessSt[b][a + 1] === goal){
        a++;
        count++;
      }
  
      if(count === 4){
        //宣布胜利
        declareVictory(start.x, start.y, "horizontal");
        return;
      }
  
      //竖向判断
      a = x, b = y, count = 0;
      while(checked(b - 1, a) && chessSt[b - 1][a] === goal){
        b--;
        count++;
      }
  
      start = {x:a, y:b};
  
      a = x, b = y;
      while(checked(b + 1, a) && chessSt[b + 1][a] === goal){
        b++;
        count++;
      }
  
      if(count === 4){
        declareVictory(start.x, start.y, "vertical");
        return;
      }
      
      //正斜线
      a = x, b = y, count = 0;
      while(checked(b - 1, a + 1) && chessSt[b - 1][a + 1] === goal){
        b--;
        a++;
        count++;
      }
  
      start = {x:a, y:b};
  
      a = x, b = y;
      while(checked(b + 1, a - 1) && chessSt[b + 1][a - 1] === goal){
        b++;
        a--;
        count++;
      }
  
      if(count === 4){
        declareVictory(start.x, start.y, "forwardSlash");
        return;
      }
  
      //反斜线
      a = x, b = y, count = 0;
      while(checked(b - 1, a - 1) && chessSt[b - 1][a - 1] === goal){
        b--;
        a--;
        count++;
      }
  
      start = {x:a, y:b};
  
      a = x, b = y;
      while(checked(b + 1, a + 1) && chessSt[b + 1][a + 1] === goal){
        b++;
        a++;
        count++;
      }
  
      if(count === 4){
        declareVictory(start.x, start.y, "backslash");
        return;
      }
    }
  
    function checked(x, y){
      if(x < 0 || y < 0 || x > 14 || y > 14 )
        return false;
      return true;
    }
  
    function declareVictory(x, y, direction){
      //绘制提示线
      ctx.beginPath();
      ctx.moveTo(cW * (x + 1), cW * (y + 1));
      if(direction === "horizontal"){
        ctx.lineTo(cW * (x + 4 + 1), cW * (y + 1));
      }
      else if(direction === "vertical"){
        ctx.lineTo(cW * (x + 1), cW * (y + 4 + 1));
      }
      else if(direction === "forwardSlash"){
        ctx.lineTo(cW * (x - 4 + 1),cW * ( y + 4 + 1));
      }
      else{
        ctx.lineTo(cW * (x + 4 + 1), cW * (y + 4 + 1));
      }
      ctx.strokeStyle = "red";
      ctx.lineWidth = 3; 
      ctx.stroke();
  
      isTurnTo.style.display = "none";
      finishGame.style.display = ctn.style.display = "block";
  
      //棋盘无法点击
      canvas.style.cursor = "default";
      canvas.removeEventListener("click", place);
  
      if(isTurnToBlack){
        player.style.color = "white";
        player.innerHTML = "white";
      }
      else player.innerHTML = "black";
  
      //逐渐显示结束语
      let count = 0;
      let f = setInterval(()=>{
        canvas.style.opacity = String(1 - count * 0.1);
        finishGame.style.opacity = ctn.style.opacity = String(count * 0.3);
        count++;
        if(canvas.style.opacity === "0.3"){
          clearInterval(f);
        }
      }, 100)
    }
  }
  else alert("不好意思，您的浏览器无法进行此游戏");
}