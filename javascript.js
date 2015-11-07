var width_num=20,height_num=55;// 横10、縦20マス
var tetrisArray=[];//テトリスの盤面 0...ブロックなし,1...積みブロック,2...ユーザ操作中ブロック
var tetrisColor=[];//テトリスの盤面の色を保存しておく
//var draw
var interval;// ゲームタイマー
var current;//現在操作中のブロックの形(4*4)配列の大きさは？
var currentX=0,currentY=0;//現在操作中のブロックの位置
var score = 0;//スコア
var canDraw=true;
var playing=false;//ゲームの開始

var blockSize=5;//ブロックの一辺の大きさ

//ブロックのパターン
var shapes = [//A
	[0,1,1,0,0,
	 1,0,0,1,0,
	 1,0,0,1,0,
	 1,1,1,1,0,
	 1,0,0,1,0
	],//B
	[1,1,1,0,0,
	 1,0,0,1,0,
	 1,1,1,0,0,
	 1,0,0,1,0,
	 1,1,1,0,0	
	],//C
	[0,1,1,0,0,
	 1,0,0,1,0,
	 1,0,0,0,0,
	 1,0,0,1,0,
	 0,1,1,0,0	
	],//D
	[1,1,1,0,0,
	 1,0,0,1,0,
	 1,0,0,1,0,
	 1,0,0,1,0,
	 1,1,1,0,0	
	],//E
	[1,1,1,1,0,
	 1,0,0,0,0,
	 1,1,1,0,0,
	 1,0,0,0,0,
	 1,1,1,1,0	
	],//F
	[1,1,1,1,0,
	 1,0,0,0,0,
	 1,1,1,0,0,
	 1,0,0,0,0,
	 1,0,0,0,0	
	],//G
	[0,1,1,0,0,
	 1,0,0,0,0,
	 1,0,1,1,0,
	 1,0,0,1,0,
	 0,1,1,0,0	
	]
];
var id;

// ブロックの色
var colors = [
	'userAdd','cyan', 'orange', 'blue', 'yellow', 'red', 'green', 'purple','black'
];

onload = function() {
	document.getElementById("scoreboard").style.visibility="hidden";//はじめあスコアボードは隠しておく

	resetTetrisArray();//テトリスの盤面をリセット
	newShape();//新しいブロック
	drawHtmlStage();//ステージの描画

	//	interval = setInterval('draw()',50);
};

var gameStart = function(){
	playing=true;
	score=0;
	resetTetrisArray();
	//ボタンとスコアボードを消す
	document.getElementById("startbutton").style.visibility="hidden";
	document.getElementById("scoreboard").style.visibility="hidden";
	//	document.getElementById("startbutton").style.display="none";
	interval = setInterval('draw()',150);
}

var gameEnd = function(){
	playing=false;//ゲームを止める
	//スコアボードの中身を設定する
	var html = "SCORE<br>score:"+score+"点";//表示HTML
	//ボタンとスコアボードを表示する
	document.getElementById("scoreboard").innerHTML = html;
	document.getElementById("startbutton").style.visibility="visible";
	document.getElementById("scoreboard").style.visibility="visible";
}

function stopTimer(){
	clearInterval(interval);
}

var draw = function(){//毎秒呼び出される
	if(canDraw){
		if ( valid(0,1) ) {//ブロックが移動可
			currentY++;//一つ下へ移動する
			updateTetris(1);//移動してupdate
			//TODO : 落ち予定地を計算する
		} else {//移動不可
			if(currentY==0){
				console.log("game over");
				gameEnd();
			}else{
				updateTetris(0);//固定してupdate
				clearLines();//行がそろっていたら消去
				newShape();//新しいブロックをセットする	
			}
		}
		drawHtmlStage();
	}
	canDraw = !canDraw;
}



var drawHtmlStage = function(){
	var html = "";//表示HTML
	for(var i=0;i<height_num+1;i++){
		html +='<tr>';
		for(var j=0;j<width_num+2;j++){
			//1ならば積みブロックとして表示
			//2ならユーザ操作中のブロックとして表示
			//1,2以外(0)ならブロックなしなのでそのまま追加
			//			if(tetrisArray[i][j]==1){
			//				html +='<td class="'+colors[tetrisColor[i][j]]+'"></td>';
			//			}else if(tetrisArray[i][j]==2){
			//				html +='<td class="'+colors[tetrisColor[i][j]]+'"></td>';
			//			}else{
			//				html +='<td></td>';
			//			}

			if(tetrisArray[i][j]>0){
				html +='<td class="'+colors[tetrisColor[i][j]]+'"></td>';
			}else{
				html +='<td></td>';
			}
		}
		html +='</tr>';
		//	console.log(tetrisArray[i]);
	}
	document.getElementById("tetris").innerHTML = html;
}

//テトリス配列の初期化
var resetTetrisArray = function(){
	tetrisArray=[];
	tetrisColor=[];
	for(var i=0;i<height_num+1;i++){
		var tetrisLine = [];
		var colorLine = [];
		for(var j=0;j<width_num+2;j++){//lineを作る
			if(j==0||j==width_num+1){
				tetrisLine.push(1);//両端は積みブロック
				colorLine.push(shapes.length+1);
			}else if(i==height_num){
				tetrisLine.push(1);//一番下は積みブロック
				colorLine.push(shapes.length+1);
			}else{
				tetrisLine.push(0);//それ以外はブロックなし
				colorLine.push(0);
			}
		}
		tetrisArray.push(tetrisLine);//lineをtetrisArrayに追加
		tetrisColor.push(colorLine);//色も同じように設定する
	}
}

var updateTetris = function(mode){//mode==0なら固定、１なら移動
	mode*2;

	//TODO : もっと無駄のない移動中のブロックの消し方があるはず...
	for(var i=0;i<height_num+1;i++){
		for(var j=0;j<width_num+2;j++){
			//移動中のブロックがあれば消しておく
			if(tetrisArray[i][j]>1){
				tetrisArray[i][j]=0;
			}
		}
	}

	for(var i=0;i<blockSize;i++){
		for(var j=0;j<blockSize;j++){
			if ( current[ i ][ j ] ) {//ブロックの1の部分だけ変更を加える
				tetrisArray[currentY+i][currentX+j]=mode+1;//固定なら1,移動なら2に変更する
				tetrisColor[currentY+i][currentX+j]=id+1;
			}
		}
	}
}

var valid = function(x,y,newCurrent){//ブロックの当たり判定,ブロックがそれ以上進めないならfalseを返す
	//現在のブロックの位置を配列に反映させる
	x=currentX+x;
	y=currentY+y;
	newCurrent = newCurrent || current;//???
	for(var i=0;i<blockSize;i++){//移動先にすでに固定されたブロックがあるならfalseを返す
		for(var j=0;j<blockSize;j++){
			if ( newCurrent[i][j]==1) {
				//ブロックの置かれる部分が配列の外に出ていないかどうかをチェック
				if((y+i)>=tetrisArray.length||x+j<1){
					console.log("valid: 配列の外です");
					return false;
				}
				if((x+j)>=tetrisArray[y+i].length){
					console.log("valid: 配列の外です");
					return false;	
				}

				if(tetrisArray[y+i][x+j]==1){//ブロックの存在する部分の中で、移動先が1になるところ
					console.log("valid: 移動先にブロックがあります");
					return false;//falseを返す
				}
			}
		}
	}
	return true;
}


// shapesからランダムにブロックのパターンを出力し、盤面の一番上へセットする
var newShape = function(){

	id = Math.floor( Math.random() * shapes.length );  // ランダムにインデックスを出す
	var shape = shapes[ id ];
	//	console.log("newShape id:"+id+" shape:"+shape)
	// パターンを操作ブロックへセットする

	current = [];
	for ( var y = 0; y < blockSize; ++y ) {
		current[ y ] = [];
		for ( var x = 0; x < blockSize; ++x ) {
			var i = blockSize * y + x;
			if ( typeof shape[ i ] != 'undefined' && shape[ i ] ) {
				//				current[ y ][ x ] = id + 1;
				current[ y ][ x ] = 1;
			}else {
				current[ y ][ x ] = 0;
			}
		}
	}
	currentX = 5;
	currentY = 0;
}



var clearLines = function(){
	for(var i=0;i<height_num;i++){
		//		var sum=0;
		var rowFilled = true;
		for(var j=1;j<width_num+1;j++){
			//			sum=sum+tetrisArray[i][j];
			if (tetrisArray[i][j] == 0) {
				rowFilled = false; 
				break;
			}
		}
		if(rowFilled){//一列揃ってるならその列を消す
			score=score+100;
			console.log("消さなきゃ");
			for (var ii = i; ii > 0; ii-- ) {
				for ( var j = 1; j < width_num+1; j++ ) { 
					tetrisArray[ii][j] = tetrisArray[ii-1][j];
					tetrisColor[ii][j] = tetrisColor[ii-1][j];
				}
			}
		}

		$("#score").text("score " + score);
	}
}

var keyPress = function(key){
	switch(key){
		case 'left':
			if ( valid(-1,0) ) //移動可
				currentX--;

			break;
		case 'right':
			if ( valid(1,0) ) //移動可
				currentX++;

			break;
		case 'down':
			break;
		case 'rotate':
			var rotated = rotate( current );
			if ( valid( 0, 0, rotated ) ) {//回転可
				current = rotated;
			}
			break;
		default:
			break;
	}
}


document.onkeydown = function( event ){//キー入力のチェック,IE9より前では動作しない可能性がある
	var keyEvent = event || window.event;

	//resetTetrisArray();//初期化
	//newShape();

	var keys = {37: 'left',
			39: 'right',
			40: 'down',
			38: 'rotate',
			68: 'debug'
		     }

	if ( typeof keys[ keyEvent.keyCode ] != 'undefined' ) { 
		keyPress( keys[ keyEvent.keyCode ] );
	}
	console.log( "check1 "+keyEvent.keyCode );
}

function rotate( current ) {
	var newCurrent = [];
	for ( var i = 0; i < blockSize; i++) {
		newCurrent[i] = []; 
		for ( var j = 0; j < blockSize; j++ ) { 
			newCurrent[ i ][ j ] = current[ blockSize-1 - j ][ i ]; 
		} 
	}
	return newCurrent; 
}


//	$("td").on("mouseover",function() {//マウスホバーイベントの取得
//		var index = $("td").index(this);
//		var x = Math.floor(index/(width_num+2)),y = index%(width_num+2);
//		if(!tetrisArray[x][y]){//埋まって無ければ
//			tetrisArray[x][y]=1;//埋める
//			tetrisColor[x][y]=1+Math.floor( Math.random() * (colors.length-2));
//			clearLines();//ライン消去
//			drawHtmlStage();//再描画
//		}
//	});	


$(function() {
	//	$(document).on('click', 'button', function(){
	//		console.log("ボタンのクリック");
	//		//		$( "canvas" ).trigger( "click" );
	//
	//	});
	//	$('canvas').click( function(event){
	//	});


	$(document).on('mouseover','td',function() {//マウスホバーイベントの取得
		if(playing){
			var index = $("td").index(this);
			var x = Math.floor(index/(width_num+2)),y = index%(width_num+2);
			if(!tetrisArray[x][y]){//埋まって無ければ
				tetrisArray[x][y]=1;//埋める
				tetrisColor[x][y]=1+Math.floor( Math.random() * (colors.length-2));
				clearLines();//ライン消去
				drawHtmlStage();//再描画
			}
		}

	});
});