

$(".toggle").click(function(){
	console.log('$(this)', $(this));
	$(".drop-down").toggle();
});

$(".toggle-ul").click(function(){
	console.log('$(this)', $(this));
	$(".drop-down-li").toggle();
});