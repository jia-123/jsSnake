// 获取分数标签
var score = document.getElementById('score');
// 获取路径地图标签
var map = document.getElementById('snake_map');
// 为了灵活的设置地图的大小，以下设置两个变量
// 用于存储行数和列数（即方格的个数）
var rowNumber = 25;//行数
var columnNumber = 20;//列数
var mapWidth = columnNumber * 20 + 'px';//地图的宽
var mapHeight = rowNumber * 20 + 'px';//地图的高
map.style.width = mapWidth;
map.style.height = mapHeight;//设置地图的宽高
// 创建一个二维数组，用来记录地图上的所有div的位置
var snakeDIVPosition = [];
// 通过双层for循环来创建地图元素；
for (var i = 0; i < rowNumber; i++) {
  // 创建行div
  var rowDIV = document.createElement('div');
  // 设置div样式
  rowDIV.className = 'row';
  // 将行div添加到路径地图map中
  map.appendChild(rowDIV)
  // 创建一个行级数组，用来存储当前行中的每个方块div
  var rowArray = [];
  for (var j = 0; j < columnNumber; j++) {
    var columnDIV = document.createElement('div');
    columnDIV.className = 'col';
    rowDIV.appendChild(columnDIV);
    rowArray.push(columnDIV);
  }
  snakeDIVPosition.push(rowArray);
}

// 创建蛇模型
// 创建一个一维数组，用来存储蛇身所占的div
var snake = [];
// 固定蛇身起始长度为3个div
for (var i = 0; i < 3; i++) {
  // 为蛇身设置不同颜色的div
  snakeDIVPosition[0][i].className = 'col activeSnake';
  // 存储在蛇身数组中
  snake[i] = snakeDIVPosition[0][i];
}
// 定义变量来控制蛇
var x = 2;
var y = 0;//蛇头的起始位置偏移量
var scoreCount = 0;//分数计数器
var eggX = 0;//记录蛋所在的行位置
var eggY = 0;//记录蛋所在的列位置

var direction = 'right';//记录蛇移动的方向，初始为向右
var changeDir = true;//判断是否需要改变蛇的移动方向
var delayTimer = null;//延迟定时器

//添加键盘事件监听方向键来改变蛇的移动方向
document.onkeydown = function(event) {
  //先判断是否需要改变方向，ture表示需要，false表示不需要
  if (!changeDir) {
    return;//return表示直接结束函数，后续代码不执行
  }
  event = event || window.event;
  // 为了合理处理蛇的移动，需要判断蛇头和蛇身
  // 假设蛇向右移动，点方向键左，右键都不需要做出响应
  if (direction == 'right' && event.key == 'ArrowRight' ) {
    return;
  }
  if (direction == 'left' && event.key == 'ArrowLeft') {
    return;
  }
  if (direction == 'up' && event.key == 'ArrowUp') {
    return;
  } 
  if (direction == 'down' && event.key == 'ArrowDown') {
    return;
  }  
  // 我们通过key确定蛇要移动的方向
  switch (event.key) {
    case 'ArrowLeft' :
      direction = 'left';
      break;
    case 'ArrowRigt' :
      direction = 'right';
      break;
    case 'ArrowDown' :
      direction = 'down';
      break;
    case 'ArrowUp' :
      direction = 'up';
      break;
  }      
  changeDir = false;
  delayTimer = setTimeout(function() {
    // 设置是否需要改变方向
    changeDir = true;
  },300)               
}

// 开始设置蛇移动逻辑
// 蛇移动函数
function snakeMove() {
  // 根据上面设置的方向来设置蛇头的位置
  switch (direction) {
    case 'left':
      x--;
      break;
    case 'right':
      x++;
      break;
    case 'up':
      y--;
      break;
    case 'down':
      y++;
      break;
  }
  // 判断是否游戏结束
  if (x < 0 || y < 0 || x >= columnNumber || y >= rowNumber) {
    alert('游戏结束！！！')
    // 结束蛇移动的定时器
    clearInterval(moveTimer);
    return;//终止键盘事件
  }
  // 如果蛇吃到自己,也要结束游戏
  for (var i = 0; i < snake.length; i++) {
    // 将此时蛇头移动后的位置与之前左右的组成蛇的div的位置进行比较，如果相同则说明吃到自己，游戏结束；
    if (snake[i] == snakeDIVPosition[y][x]) {
      alert('游戏结束！！！');
      clearInterval(moveTimer);
      return;
    }
  }
  // 判断蛇头移动的位置是否有蛋
  if (eggX == x && eggY == y) {
    snakeDIVPosition[eggY][eggX].className = 'col activeSnake';
    snake.push(snakeDIVPosition[eggY][eggX]);//加入蛇身；
    scoreCount++;//记录分数
    // 更新当前的分数
    score.innerHTML = scoreCount;
    // 随机产生一个蛋
    createNewEgg();
  }else {
    // 设置蛇碰不到蛋的逻辑
    // 让蛇移动
    // 蛇尾去掉自身的颜色，变成格子的颜色
    snake[0].className = 'col';
    // 将蛇尾div从数组中移除
    snake.shift();
    // 定位到的新的蛇头加入到蛇数组中；
    snakeDIVPosition[y][x].className = 'col activeSnake';
    snake.push(snakeDIVPosition[y][x]);
  }
}
var moveTimer = setInterval('snakeMove()',300);
// 定义一个生成min,max之间的随机数函数
function random(min,max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function createNewEgg() {
  // 随机出新的egg的下标的x和y值
  eggX = random(0,columnNumber - 1);
  eggY = random(0,rowNumber - 1);

  // 判断如果随机产生的蛋与蛇身重合，就随机产生一个新的蛋
  if (snakeDIVPosition[eggY][eggX].className == 'col activeSnake') {
    createNewEgg();
  }else {
    snakeDIVPosition[eggY][eggX].className = 'col egg';
  }
}
createNewEgg();
var pause = document.getElementById('Pause');
var start = document.getElementById('Start');
var refresh = document.getElementById('Refresh');
var speed = document.getElementById('Speed');
// 添加暂停按钮
pause.onclick = function () {
  clearInterval(moveTimer);
}
// 添加开始按钮
start.onclick = function () {
  clearInterval(moveTimer);
  moveTimer = setInterval('snakeMove()',speed1);
}
// 添加刷新按钮
refresh.onclick = function () {
  window.location.reload();
}
// 添加加速按钮
var speed1 = 300;
speed.onclick = function () {
  speed1 -= 20;
  clearInterval(moveTimer);
  moveTimer = setInterval('snakeMove()',speed1);
}
