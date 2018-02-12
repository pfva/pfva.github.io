class User {
  constructor(app) {
    this.answers = [];
    this.score = [{
      introvertExtrovert: 0,
      intuitionSensing: 0,
      perceptionJudgement: 0,
      thinkingFeeling: 0
    }];
    this.app = app;
  }

  // Får index och värde vid varje besvarad fråga
  // Lägger in dessa tillsammans som ett objekt i arrayen user.answers
  // Om arrayen fylls upp (24 svar) så körs metoden som räknar ut resultatet
  answer(index, val) {
    this.answers[index] = {
      val: val,
      id: (parseInt(index) + 1)
    };
    if ((this.answers).length == 24)
      this.app.calculateResult();
  }

  // Sparar användares svar till answers.json
  saveAnswers() {
    JSON._save('answers', {
      answers: this.answers,
      score: this.score,
    });
  }
}