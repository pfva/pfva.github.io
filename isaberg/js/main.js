// Night mode button
// On click adds/subtracts classes from select elements
// This toggles the color between black/white
// Enables easier reading at night

$("button#night-mode").click(function() {
  $(this).toggleClass("btn-light btn-dark");
  $("body").toggleClass("bg-dark");
  $("nav").toggleClass("navbar-dark bg-dark navbar-light bg-light");
  $("h4.kategorier").toggleClass("text-light");
  $("footer").toggleClass("bg-dark text-light");
  $(".jobba-med-oss").toggleClass("text-light");
  $(".det-borjade-med").toggleClass("text-light");
});