// Gör en klickbar knapp med hjälp av jQuery
// Visar sektionen om den är dold och döljer den om sektionen visas
// med hjälp av funktionen 'slideToggle'
// Byter button-texten med hjälp av samma princip
// (funktionen 'toggle')
$('.timpriser-btn').click(function(){
	$('section.timpriser-section').slideToggle();
	$('.timpriser-btn .show-text').toggle();
	$('.timpriser-btn .hide-text').toggle();
});


// Hämtar data från en JSON-fil och visar upp den i en unordered list
$.getJSON('scripts/verkstad.json',function(verkstadLista){

	// Skapar ett nytt ul-element inuti section.timpriser-section
	$('section.timpriser-section').append(
		'<ul class="verkstader"></ul>'
		);

	// Loopar igenom objektet
	for(let verkstad in verkstadLista){

		// Hämtar värdet i key-value-paret
		let pris = verkstadLista[verkstad];

		// Skapar ett antal li-element med key-value-paren
		// och lägger till dem i ul-elementet
		$('ul.verkstader').append(
			'<li>' + verkstad + ': ' + pris + '</li>'
		);
	}
});