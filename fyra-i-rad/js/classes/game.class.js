class Game {
  constructor(){
    this.board = new Board('#board',this);
    localStorage.playerInput ? this.createPlayerStep2() : this.createPlayer();
    this.counter = 0;
    this.roundNumber;
    this.highscore = new Highscore(this);
    JSON._load('highscore')
    .then((data) => {
      for(let players of data){
        this.highscore.list.push(players);
      }
      this.highscore.renderHighscore();
    });
  }

  createPlayer(){
    $(document).on('click', '.button', function(){
      let input1 = $('#input-1').val();
      let input2 = $('#input-2').val();
      let radio1 = $('#human-1').is(':checked');
      let radio3 = $('#human-2').is(':checked');

      localStorage.playerInput = JSON.stringify({
        input1: input1,
        input2: input2,
        radio1: radio1,
        radio3: radio3
      });

     if(input1.replace(/^\s+|\s+$/g, "") && input2.replace(/^\s+|\s+$/g, "")){
        location.href = '/spela.html';
      }
      else if(input1.replace(/^\s+|\s+$/g, "")){
        $('#input-1').removeClass('form-error');
        $('#input-2').attr('placeholder', 'Fyll i namn här tack!');
        $('#input-2').addClass('form-error');
      }
      else{
        $('#input-2').removeClass('form-error');
        $('#input-1').attr('placeholder', 'Fyll i namn här tack!');
        $('#input-1').addClass('form-error');
        }
    });
  }

  createPlayerStep2(){
    let x = JSON.parse(localStorage.playerInput);
    delete localStorage.playerInput;
    x.radio1 ?  this.player1 = new Player(this,x.input1,'red') : 
                this.player1 = new Computer(this,x.input1,'red');           
    x.radio3 ?  this.player2 = new Player(this,x.input2,'yellow') :
                this.player2 = new Computer(this,x.input2,'yellow');
    $('.player1Name').text(this.player1.name);
    $('.player2Name').text(this.player2.name);
    this.hoverBrick();
    this.dropBrick();
    this.currentPlayer = this.player2;
    this.togglePlayer();
  }


   togglePlayer(){
    if(this.currentPlayer == this.player1){
      this.currentPlayer = this.player2;
      $('.player-1').removeClass('active-player');
      $('.player-2').addClass('active-player');           
    }
    else{
      this.currentPlayer = this.player1;
      $('.player-2').removeClass('active-player');
      $('.player-1').addClass('active-player');
    }
    if(this.currentPlayer instanceof Computer){
      this.currentPlayer.computerDropBrick();
    }
  }
 
  hoverBrick(){ 
    const that = this;
    if(this.currentPlayer instanceof Computer){
      $('.hover-brick-col').children().removeClass('transparent');
      if(this.currentPlayer.color == 'yellow'){
        $('.hover-brick-col').children().removeClass('yellow');
      }
      else if(this.currentPlayer.color == 'red'){
        $('.hover-brick-col').children().removeClass('red');
      } 
    }

    $(this.board.boardId).on('mouseover', '.board-col', function(){
      let colNumber = $(this).data('colnr');
      $(`.hover-brick-col[data-colNr='${colNumber}']`).children().addClass(that.currentPlayer.color);
    });

    $(this.board.boardId).on('mouseleave', '.board-col', function(){
      let colNumber = $(this).data('colnr');
      $(`.hover-brick-col[data-colNr='${colNumber}']`).children().removeClass('red yellow');
    });
  }

  dropBrick(){
    const that = this;
    $('.board-col').on('click', function(){
      if(that.currentPlayer instanceof Computer){
        return;
      } 
      let colNumber = $(this).data('colnr');
      that.makeMove(colNumber);
    });
  }

  makeMove(colNumber){
    for (let row = 5; row >= 0; row--) {
      if (this.board.arrBoard[row][colNumber] == 0) {
        this.board.arrBoard[row][colNumber] = this.currentPlayer.color;
        let emptyCols = $(`.board-col[data-rowNr='${row}'][data-colNr='${colNumber}']`);
        $(emptyCols).children().addClass(this.currentPlayer.color).addClass('blinking');
        setTimeout(() => {
          $(emptyCols).children().removeClass('blinking');
        }, 1000);
        this.counter++;
        this.roundNumber = Math.ceil(this.counter/2);
        $('#roundNumber').text(this.roundNumber);
        let hoverCol = $(`.hover-brick-col[data-colNr='${colNumber}']`).children();
        hoverCol.removeClass('red yellow');
        if(!(this.currentPlayer instanceof Computer)){
          hoverCol.addClass(this.currentPlayer.color);
        }
        if(!this.victoryLoop()){
          this.hoverBrick();
          this.togglePlayer();
        }
        return true;
      }
    }
    return false;
  }

  victoryLoop(){
    const that = this;
    let b = this.board.arrBoard , winner, emptySlots = false;
    for(let row = 0; row <= 5; row++){
      for(let col = 0; col <= 6; col++){
        for(let p of ["red", "yellow"]){
          if(
            // Vertical
            (row <= 2 && b[row][col] == p && b[row+1][col] == p && b[row+2][col] == p && p && b[row+3][col] == p) || 
            // Horizontel
            (col <= 3 && b[row][col] == p && b[row][col+1] == p && b[row][col+2] == p && p && b[row][col+3] == p)  ||
            // Diagonal \
            (col <= 3 && row <= 2 && b[row][col] == p && b[row+1][col+1] == p && b[row+2][col+2] == p && p && b[row+3][col+3] == p)  ||
            // Diagonal /
            (col >= 3 && row <= 2 && b[row][col] == p && b[row+1][col-1] == p && b[row+2][col-2] == p && p && b[row+3][col-3] == p) 
          ){
            winner = this.currentPlayer.name;
          }
        } 
        emptySlots = emptySlots || b[row][col] === 0;
      }
    }
    let gameover = winner ? winner : (!emptySlots ? 'draw' : false);
    if (gameover == this.currentPlayer.name){
      new Modal(
        `Grattis ${this.currentPlayer.name}`,
        [
          `Spelare ${this.currentPlayer.name} har vunnit!`,
          `Det gick ${this.roundNumber} rundor till vinst.`,
          `Spela igen? Tryck på knappen.`
        ]
      );
      this.highscore.saveHighscore(this.roundNumber, this.currentPlayer.name);
      return true;            
    } 
    else if(gameover == "draw"){
      new Modal(
        `Det blev oavgjort.`,
        [
          `Spela igen? Tryck på knappen.`
        ]
      );
      return true;
    }
    else{
      return false;
    }
  }    
}
  



