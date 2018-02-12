class Modal{
  constructor(title, body, btn = 'Spela igen'){
    this.title = title;
    this.body = '<p>' + body.join('</p><p>') + '</p>';
    this.btn = btn;
    this.drawModal();
  }

  drawModal(){
    $('main #main-modal').remove();
    $('main').append(`
      <div class="modal fade" id="main-modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h2 class="modal-title text-danger">${this.title}</h2>
              </div>
              <div class="modal-body mx-4">
                ${this.body}
              </div>
              <div class="modal-footer">
                <a href="javascript:history.back(1)"><button type="button" class="btn btn-danger">${this.btn}</button></a>
              </div>
            </div>
          </div>
        </div>
    `);
   $('#main-modal').modal({
       backdrop: 'static',
       keyboard: false
   });
  }
}