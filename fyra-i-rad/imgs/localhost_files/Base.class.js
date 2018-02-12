class Base {
  constructor() {
    this.render();
  }

  // Metod för att rendera ut sidoinnehåll till DOM
  render(html) {
    $('.card-content').html(html);
  }
}