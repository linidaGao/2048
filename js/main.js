$(function(){
	newGame();
});
// 定义数组
var array=Array();
var score=0;
var top=240;
function newGame(){
	// 初始化页面
	init();

//在随机的两个单元格子中生成数字
	getRanNum();
	getRanNum();
}

// 初始化页面
function init(){
	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			var gridCell=$("#grid-cell-"+i+'-'+j);
			gridCell.css("top",getPosTop(i,j));
			gridCell.css("left",getPosLeft(i,j));

		}
	}
	// 初始化数组
	for(var i=0;i<4;i++){
		array[i]=new Array();
		for(var j=0;j<4;j++){
			array[i][j]=0;
		}
	}

	//动态创建上层单元格
	updataView();
}

//动态创建上层单元格 并初始化
function updataView(){
	//每次创建时先清除
	$(".number-cell").remove();

	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			$(".container").append(`<div class="number-cell" id="number-cell-${i}-${j}"></div>`)
			var getNumCell=$(`#number-cell-${i}-${j}`);

			if(array[i][j]!=0){
				getNumCell.css('width','100px');
				getNumCell.css('height','100px');
				getNumCell.css('top',getPosTop(i,j));
				getNumCell.css('left',getPosLeft(i,j));
				getNumCell.css('color',getNumColor(array[i][j]));
				getNumCell.css('backgroundColor',getNumBackground(array[i][j]));
				getNumCell.text(array[i][j]);
			}else{
				getNumCell.css('width','0px');
				getNumCell.css('height','0px');
				getNumCell.css('top',getPosTop(i,j)+50);
				getNumCell.css('left',getPosLeft(i,j)+50);
				
			}
		}
	}
}

// 产生随机数

function getRanNum(){
	if(noSpace(array)){
		return;
	}

	//找到随机位置
	var count=0;
	var arrRan=new Array();
	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			if(array[i][j]==0){
				arrRan[count]=i*4+j;
				count++;
			}
		}
	}

	// 产生随机数
	var n=Math.floor(Math.random()*count);
	var ranX=Math.floor(arrRan[n]/4);
	var ranY=Math.floor(arrRan[n]%4);

	var ranNum=Math.random()>0.5?2:4;
	array[ranX][ranY]=ranNum;
	//随机的位置上显示随机数字
	showNumAmimation(ranX,ranY,ranNum);
}


$(document).keydown(function(event) {
	event.preventDefault();
	switch (event.keyCode) {
		case 37://left
			
			if (moveLeft()) {
				//每次新增一个数字就有可能出现游戏停止
				getRanNum();
				isgamesover;
			}
			break;
		case 38://up
			if (moveUp()) {
				getRanNum();
				isgamesover;
			}
		break;
		case 39://right
		
			if (moveRight()) {
				getRanNum();
				isgamesover;
			}
		break;
		case 40://down
		if (moveDown()) {
				getRanNum();
				isgamesover;
			}
		break;
	}
});

function isgamesover(){
	if (noSpace(array)&&nomove(array)) {
		gameover();
	}
}
function gameover(){
	alert("Gameover");
}

function moveLeft(){
	//判断是否能够向左移动
	if (!canMoveLeft(array)) {
		return false;
	}
	for(var i=0;i<4;i++){
		//最左边的一列不需要移动
		for(var j=1;j<4;j++){
			if(array[i][j]!=0){
				//(i,j)左侧的元素
				for(var k=0;k<j;k++){
					//落脚位置的是否为空 && 中间没有障碍物
					if(array[i][k]==0&&noBlockHorzontal(i,k,j,array)){
						//从第几行移动到第几列
						showMoveAnimation(i,j,i,k);
						array[i][k]=array[i][j];
						array[i][j]=0;
						break;
						//落脚位置的数字和本来的数字相等 && 中间没有障碍物
					}else if(array[i][k]==array[i][j]&&noBlockHorzontal(i,k,j,array)){
						 //move
						showMoveAnimation(i,j,i,k);
						//add
						array[i][k]+=array[i][j];
						array[i][j]=0;
						break;
					}
				}
			}
		}
	}
	setTimeout(updataView,200);
	return true;
}
function moveRight(){
	//判断是否能够向右移动
	if (!canMoveRight(array)) {
		return false;
	}
	for(var i=0;i<4;i++){
		//最右边一列不需要移动
		for(var j=2;j>=0;j--){
			if(array[i][j]!=0){
				//(i,j)右侧的元素 落脚位置
				for(var k=3;k>=j;k--){
					if(array[i][k]==0&&noBlockHorzontal(i,k,j,array)){
						showMoveAnimation(i,j,i,k);
						array[i][k]=array[i][j];
						array[i][j]=0;
						break;
					}else if(array[i][k]==array[i][j]&&noBlockHorzontal(i,k,j,array)){
						showMoveAnimation(i,j,i,k);
						array[i][k]+=array[i][j];
						array[i][j]=0;
						break;
					}

				}
			}
		}
	}
	setTimeout(updataView,200);
	return true;
}

function moveDown(){
	//判断是否能够向下移动
	if (!canMoveDown(array)) {
		return false;
	}
	for(var i=2;i>=0;i--){
		for(var j=0;j<4;j++){
			if(array[i][j]!=0){
				//(i,j)下方的元素落脚位置
				for(var k=3;k>j;k--){

					/*noBlockVertical(ver,col1,col2,nums)
						noBlockHorzontal(row,col1,col2,nums)*/
						if(array[k][j]==0&&noBlockVertical(k,i,j,array)){ //第i行的第k-j列之间是否有障碍物
							//移动操作
							showMoveAnimation(i,j,k,j); //显示移动的动画效果
							array[k][j]=array[i][j]; //从i,j移动到k,j
							array[i][j]=0; //将原来位置设置为0
							break;
					}else if(array[k][j]==array[i][j]&&noBlockVertical(k,i,j,array)){
							showMoveAnimation(i,j,k,j); //显示移动的动画效果
							array[k][j]+=array[i][j]; //从i,j移动到k,j
							array[i][j]=0; //将原来位置设置为0
							break;
						}
				}
			}
		}
	}
	setTimeout(updataView,200);
	return true;
} 

function moveUp(){
	//判断是否能够向上移动
	if (!canMoveUp(array)) {
		return false;
	}
	for(var i=1;i<4;i++){
		
		for(var j=0;j<4;j++){
			if(array[i][j]!=0){
				//落脚位置
				for(var k=0;k<i;k++){
					//落脚位置的是否为空 && 中间没有障碍物
					if(array[k][j]==0&&noBlockVertical(k,i,j,array)){
						//从第几行移动到第几列
						showMoveAnimation(i,j,k,j);
						array[k][j]=array[i][j];
						array[i][j]=0;
						break;
						//落脚位置的数字和本来的数字相等 && 中间没有障碍物
					}else if(array[k][j]==array[i][j]&&noBlockVertical(k,i,j,array)){
						 //move
						showMoveAnimation(i,j,k,j);
						//add
						array[k][j]+=array[i][j];
						array[i][j]=0;
						break;
					}
				}
			}
		}
	}
	setTimeout(updataView,200);
	return true;
}
