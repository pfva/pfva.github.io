class Board{	
	constructor(selector, game){
		this.boardId = selector;
		this.game = game;
		this.arrBoard = [ [0,0,0,0,0,0,0],
										  [0,0,0,0,0,0,0],
										  [0,0,0,0,0,0,0],
										  [0,0,0,0,0,0,0],
										  [0,0,0,0,0,0,0],
										  [0,0,0,0,0,0,0] ];
		this.createBoard();
		$(window).on('resize', () => this.scale());
		this.scale();
	}

	scale(){
		if(window.location.pathname == '/spela.html'){
			let boardW;
			let boardH;
			if($(window).outerWidth() <= 768){
				boardW = 798;
				boardH = 985;
			}else{
				boardW = 1148;
				boardH = 798;
			}
			let w = $(window).width();
			let h = $(window).height(); 
			if($(window).width() > 1024){
		      h -= $('.board-holder').offset().top + 10;
		    }else{
		      h -= $('.board-holder').offset().top + 20;
		    }
			w -= + 20 * 2; 
			let wScale = w / boardW; 
			let hScale = h / boardH;
			let scaling = Math.min(wScale, hScale);
			$('#board').css('transform', `scale(${scaling})`).show();
			$('.board-holder').width(boardW * scaling).height(boardH * scaling);
		}
	}

	createBoard(){
		let hoverRow = $('<div>').addClass('hover-brick-row');
		for(let j = 0; j < 7; j++){
			let hoverCol = $('<div>').addClass('hover-brick-col').attr('data-colNr',j).attr('data-rowNr', 0);
			let circles = $('<div>').addClass('circle');
			hoverCol.append(circles);
			$(hoverRow).append(hoverCol);
		}
		$(this.boardId).append(hoverRow);

		for(let i = 0; i < 6; i++){
			let row = $('<div>').addClass('board-row');
			for(let j = 0; j < 7; j++){
				let col = $('<div>').addClass('board-col').attr('data-colNr',j).attr('data-rowNr', i);
				let circles = $('<div>').addClass('circle');
				col.append(circles);
				$(row).append(col);
			}
			$(this.boardId).append(row);
		}
	}
}