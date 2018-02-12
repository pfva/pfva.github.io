class Computer extends Player{
 
  constructor(game, name, color){
    super(game, name, color);
  }

  computerDropBrick(){
    $('.hover-brick-col').children().addClass('transparent');
		setTimeout(() => {
  		let colNumber;
      do {
        colNumber = Math.floor(Math.random()*7);
    	} while(!this.game.makeMove(colNumber));
    }, 1500);   
	}
}