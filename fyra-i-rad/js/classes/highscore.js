class Highscore {
	constructor(){
		this.list = [];
	}
	
	saveHighscore(rounds, name){
		this.list.push({name, rounds});
		this.sortList(this.list);
		this.list.splice(10, this.list.length - 10);
		JSON._save('highscore.json', this.list);
	}

	renderHighscore(){
		let counter = 1;
		JSON._load('highscore.json').then(function(players){
		   	for (let player of players){
					$(".highscore-list").append(`
        			<li class="list-group-item no-border">
        				<span class="trophy px-3"></span>
        				${counter}. ${player.name}
        				<span class="float-right mr-1 mr-md-5 pr-5">
        				${player.rounds}
        				</span>
        			</li>
        		`);
				counter++;
			}
		});
	}

	sortList(array){
		array.sort(function(a,b){
			return a.rounds - b.rounds;
		});
	}	
}
		