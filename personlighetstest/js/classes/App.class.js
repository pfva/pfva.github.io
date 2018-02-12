class App extends Base {
  constructor() {
    super();
    this.questions;
    this.sumSources;
    this.user = new User(this);
    this.loadJSON();
    this.clearInstructions();
    this.nextQuestion();
    this.previousQuestion();
    this.renderInstructions();
  }

  // Laddar in information från questions.json så att vi kan använda den här
  loadJSON() {
    let that = this;
    $.getJSON('../../json/questions.json', function (data) {
      that.questions = data.questions;
      that.sumSources = data.sumSources;
    });
  }

  // Vid klick rensar instruktionerna och renderar första frågan
  clearInstructions() {
    $(document).on('click', '#instructions-button',function() {
      $('.card-content').empty();
      app.renderQuestion(0);
    });
  }

  // Vid klick läser av frågans index och värdet på slidern som användaren valt och lägger in dessa i arrayen user.answers
  // Renderar sedan nästa fråga förutom vid sista frågan
  nextQuestion() {
    $(document).on('click', '.btn-next', function() {
      app.user.answer((parseInt(this.id) - 1), $("#slider")[0].value);
      if (this.id <= 23) {
        app.renderQuestion(parseInt(this.id));
      } else {
        app.displayResult();
      }
    });
  }

  // Vid klick går tillbaka till föregående fråga
  previousQuestion() {
    $(document).on('click', '.btn-back', function() {
      app.user.answer((parseInt(this.id) + 1), $("#slider")[0].value);
      app.renderQuestion(parseInt(this.id));
    });
  }

  // Det första som renderas ut är testets instruktioner och start-knappen som HTML
  renderInstructions() {
    $('.card-header').html('Instruktioner');
    super.render(`
      <div class="card-body" id="test-instructions">
        <p class="card-text">Syftet med detta personlighetstest är att ge dig en bild av din personlighet, beskriven enligt Carl Jungs typlära.</p>
        <p class="card-text">Under övningen beskrivs 24 påståenden eller situationer ställda som motpoler. Du ska ställning till vilket påstående som stämmer bäst med hur du är och känner, och i hur stor utsträckning det är så, genom att dra reglaget till någon position på skalan.</p>
        <p class="card-text">Placera reglaget närmre påståendet ju mer träffsäkert det känns. Känns det som att bägge påståendena kan vara lika beskrivande av hur du är, placerar du reglaget någonstans mer mitt på skalan.</p>
        <a href="#" class="btn btn-primary btn-start d-block mx-auto" id="instructions-button">Jag förstår - Starta testet!</a>
      </div>
    `);
  }

  // Byter rubrik på card-headern
  // Deklarerar percent-variabeln som håller koll på procent-värdet i progress baren
  // Instansierar sliderValue till 6 (så nära mitten man kan komma)
  // Renderar ut frågorna till DOM i form av en template literal (med relevanta värden/variabler insprängda)
  renderQuestion(val) {
    $('.card-header').html('Personlighetstest');
    let percent = Math.ceil((val / (this.questions.length - 1)) * 100);
    let sliderValue = 6;
    let html = `
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="card-body p-1" id="test-questions">
              <p class="card-text my-5 question-start">${this.questions[`${val}`].q}</p>
              <div class="row">
                <div class="col-6">
                  <p class="card-text option-one float-left">${this.questions[`${val}`].a[0]}</p>
                </div>
                <div class="col-6">
                  <p class="card-text option-two float-right">${this.questions[`${val}`].a[1]}</p>
                </div>
              </div>
              <!-- Range slider -->
              <input type="range" name="score" min="0" max="11" value="${sliderValue}" id="slider" class="slider">

              <div class="row mt-4 pb-3">
                <!-- Frågecounter och progress bar -->
                <div class="col-6">
                  <div class="progress">
                    <div class="progress-bar" role="progressbar" style="width: ${percent}%;" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="24">${percent}%</div>
                  </div>
                </div>
                <!-- Tillbaka och nästa-button -->
                <div class="col-6 d-flex align-items-md-end">
                  <div class="container">
                    <div class="row">
                      <div class="col-md-6 order-2 order-md-1">
                        <button type="button" class="btn btn-outline-secondary btn-back w-100 mt-2 mt-md-0" id="${val-1}">Tillbaka</button>
                      </div>
                      <div class="col-md-6 order-1 order-md-2">
                        <button type="button" class="btn btn-primary btn-next w-100" id="${val+1}">Nästa fråga</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      `;
    super.render(html);
  }

  calculateResult() {
    // Den första for-loopen loopar igenom hela user.answers-arrayen där användarens alla svar ligger 
    for (let i = 0; i < this.user.answers.length; i++) {
      // Den andra for-loopen loopar igenom sumSources från questions.json där de olika frågekategorierna ligger 
      for (let x = 0; x < Object.keys(this.sumSources).length; x++) {
        // Den tredje for-loopen loopar igenom alla frågor där frågornas id korrelerar med vilken personlighetsaspekt de handlar om
        for (let y = 0; y < this.sumSources[Object.keys(this.sumSources)[x]].questionIds.length; y++) {
          // Om indexet på frågan 'i' i user.answers korrelerar med frågans id i sumSources så öka user.score på det specifika fråge-klustret med värdet av svaret (hur starkt/svagt användaren värderade frågan)
          if ((i + 1) === this.sumSources[Object.keys(this.sumSources)[x]].questionIds[y]) {
            this.user.score[0][Object.keys(this.sumSources)[x]] = parseInt(this.user.answers[i].val) + this.user.score[0][Object.keys(this.sumSources)[x]];
          }
        }
      }
    }
    this.user.saveAnswers();
  }

  // Byter rubrik på card-headern
  // Skapar en tom array och pushar in bokstav beroende på användarens poäng på den kategorin
  // Renderar ut den slutgiltiga personlighetstypen till DOM tillsammans med relevanta länkar
  // Ger användaren dennes personlighetstyp svart på vitt, inga gråskalor (mildlyFeeling etc.)
  displayResult() {
    $('.card-content').empty();
    $('.card-header').html('Ditt resultat');
    
    let personalityType = [];
    
    if (this.user.score[0].introvertExtrovert <= 33) {
      personalityType.push("I");
    } else {
      personalityType.push("E");
    }
    if (this.user.score[0].intuitionSensing <= 33) {
      personalityType.push("N");
    } else {
      personalityType.push("S");
    }
    if (this.user.score[0].thinkingFeeling <= 33) {
      personalityType.push("T");
    } else {
      personalityType.push("F");
    }
    if (this.user.score[0].perceptionJudgement <= 33) {
      personalityType.push("P");
    } else {
      personalityType.push("J");
    }

    let html = `
      <div class="card-body" id="test-result">
        <p class="card-text text-center">Grattis! Din personlighetstyp är:</p>
        <h1 class="display-1 text-center my-5">${personalityType.join(" ")}</h1>
        <div class="row">
          <div class="col-6">
            <p class="card-text float-left pb-3"><a href="https://www.16personalities.com/sv/personlighetstyper" target="_blank">Läs mer om de olika personlighetstyperna här</a></p>
          </div> 
          <div class="col-6">
            <p class="card-text float-right pb-3">Vill du göra om testet igen? <a href="/">Klicka här!</a></p>
          </div>
        </div> 
      </div>
      `;
    
    super.render(html);
  }
}
