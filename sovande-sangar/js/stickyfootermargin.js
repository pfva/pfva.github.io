var height = $('footer').height() + 30;
$('body').css({marginBottom: height});
$(window).on('resize',function(){location.reload();});
