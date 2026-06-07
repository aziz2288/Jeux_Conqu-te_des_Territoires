function showDiceAnimation(label1, label2, onComplete) {
  var overlay = document.createElement('div');
  overlay.className = 'dice-overlay';
  overlay.innerHTML =
    '<div class="dice-container">' +
      '<div class="dice-player-col">' +
        '<div class="dice-player-label p1">' + label1 + '</div>' +
        '<div class="dice-cube" id="dice-cube-1"><div class="dice-inner rolling"><div class="dice-face">?</div></div></div>' +
        '<div id="dice-info-1" class="dice-combat-info"></div>' +
      '</div>' +
      '<div class="dice-vs">VS</div>' +
      '<div class="dice-player-col">' +
        '<div class="dice-player-label p2">' + label2 + '</div>' +
        '<div class="dice-cube" id="dice-cube-2"><div class="dice-inner rolling"><div class="dice-face">?</div></div></div>' +
        '<div id="dice-info-2" class="dice-combat-info"></div>' +
      '</div>' +
    '</div>';
  document.body.appendChild(overlay);
  return { overlay: overlay, onComplete: onComplete };
}

function resolveDiceAnimation(ctx, val1, val2, glow1, glow2, info1, info2, resultText) {
  var cube1 = document.getElementById('dice-cube-1');
  var cube2 = document.getElementById('dice-cube-2');
  // Stope rolling et show resultat
  cube1.innerHTML = '<div class="dice-inner"><div class="dice-face ' + glow1 + '">' + val1 + '</div></div>';
  setTimeout(function() {
    cube2.innerHTML = '<div class="dice-inner"><div class="dice-face ' + glow2 + '">' + val2 + '</div></div>';
    if (info1) document.getElementById('dice-info-1').textContent = info1;
    if (info2) document.getElementById('dice-info-2').textContent = info2;

    setTimeout(function() {
      var resDiv = document.createElement('div');
      resDiv.className = 'dice-result-text';
      resDiv.textContent = resultText;
      ctx.overlay.querySelector('.dice-container').appendChild(resDiv);
      // close overlay
      setTimeout(function() {
        ctx.overlay.style.opacity = '0';
        ctx.overlay.style.transition = 'opacity 0.3s';
        setTimeout(function() {
          if (ctx.overlay.parentNode) ctx.overlay.parentNode.removeChild(ctx.overlay);
          if (ctx.onComplete) ctx.onComplete();
        }, 300);
      }, 1500);
    }, 400);
  }, 300);
}
// lance le premier dé
function rollDiceAction() {
  if (state.phase !== 'dice-start') return;
  var d1 = rollDice(), d2 = rollDice();
  var ctx = showDiceAnimation('Joueur 1', 'Joueur 2');

  setTimeout(function() {
    var g1 = d1 > d2 ? 'glow-green' : d1 < d2 ? 'glow-red' : '';
    var g2 = d2 > d1 ? 'glow-green' : d2 < d1 ? 'glow-red' : '';
    var resultMsg = d1 === d2 ? '🔄 Égalité ! Relancez.' : '🎯 Joueur ' + (d1 > d2 ? '1' : '2') + ' commence !';

    resolveDiceAnimation(ctx, d1, d2, g1, g2, '', '', resultMsg);

    // After animation completes
    ctx.onComplete = function() {
      if (d1 === d2) {
        state.message = 'Égalité (' + d1 + ' vs ' + d2 + ') ! Relancez.';
        render(); return;
      }
      var starter = d1 >= d2 ? 1 : 2;
      state.currentPlayer = starter;
      state.phase = 'movement';
      state.turnNumber = 1;
      state.message = 'Joueur 1: ' + d1 + ', Joueur 2: ' + d2 + '. Joueur ' + starter + ' commence ! Phase de mouvement.';
      state.units.forEach(function(u) { u.hasMoved = false; u.hasActed = false; u.isDefending = false; });
      startTimer();
      render();
    };
  }, 800);
}