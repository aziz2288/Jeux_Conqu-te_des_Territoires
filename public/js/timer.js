function rollDice() { return Math.floor(Math.random() * 6) + 1; }

function startTimer() {
  stopTimer();
  if (gameMode === 'ai' && state && state.currentPlayer === AI_PLAYER && state.phase !== 'placement' && state.phase !== 'dice-start') {
    var bar = document.getElementById('timer-bar');
    if (bar) bar.style.display = 'none';
    return;
  }
  
  timerSeconds = TURN_TIME;
  updateTimerUI();
  var bar = document.getElementById('timer-bar');
  if (bar) bar.style.display = 'flex';
  timerInterval = setInterval(function() {
    timerSeconds--;
    updateTimerUI();
    //changement du turn si Temps écoulé
    if (timerSeconds <= 0) {
      stopTimer();
      var np = state.currentPlayer === 1 ? 2 : 1;
      if (state.currentPlayer === 2) state.turnNumber++;
      startNewTurn(np);
      state.message = '⏱️ Temps écoulé ! ' + state.message;
      render();
    }
  }, 1000);
}

function stopTimer() {
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
}

function updateTimerUI() {
  var fill = document.getElementById('timer-fill');
  var text = document.getElementById('timer-text');
  if (!fill || !text) return;
  var pct = (timerSeconds / TURN_TIME) * 100;
  fill.style.width = pct + '%';
  fill.className = 'timer-fill' + (timerSeconds <= 10 ? ' danger' : timerSeconds <= 20 ? ' warning' : '');
  text.textContent = timerSeconds + 's';
}