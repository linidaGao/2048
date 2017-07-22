function showNumAmimation(i,j,ranNum){
	var numberCell=$(`#number-cell-${i}-${j}`);
	numberCell.css('background-color',getNumBackground(ranNum));
	numberCell.css('color',getNumColor(ranNum));
	numberCell.text(ranNum);

	//动画效果
	numberCell.animate({
       width:'100px',
       height:'100px',
       top:getPosTop(i,j),
       left:getPosLeft(i,j)

	}, 500);
}

function showMoveAnimation(fromx,fromy,tox,toy){
	var numCell=$(`#number-cell-${fromx}-${fromy}`);
	numCell.animate({
		top:getPosTop(tox,toy),
		left:getPosLeft(tox,toy),
	},200);
}
