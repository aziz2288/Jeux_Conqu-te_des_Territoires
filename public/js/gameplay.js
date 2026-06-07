function checkVictory() {
  for (var p = 1; p <= 2; p++) {
    if (countCells(p) >= WIN_CELLS) return p;
  }
  var alive1 = state.units.filter(function(u) { return u.player === 1 && u.hp > 0; }).length;
  var alive2 = state.units.filter(function(u) { return u.player === 2 && u.hp > 0; }).length;
  var total1 = state.units.filter(function(u) { return u.player === 1; }).length;
  var total2 = state.units.filter(function(u) { return u.player === 2; }).length;
  if (alive1 === 0 && total1 > 0) return 2;
  if (alive2 === 0 && total2 > 0) return 1;
  return null;
}

function setWinner(winner) {
  stopTimer();
  state.winner = winner;
  state.phase = 'game-over';
  state.selectedUnit = null;
  state.message = '🏆 Joueur ' + winner + ' remporte la victoire !';
}

function handleCellClick(row, col) {
  if (state.winner) return;

  if (state.phase === 'placement') {
    var totalUnits = UNITS_PER_PLAYER.length * 2;
    var player = state.placementIndex % 2 === 0 ? 1 : 2;
    var playerUnitIndex = Math.floor(state.placementIndex / 2);
    if (playerUnitIndex >= UNITS_PER_PLAYER.length) return;

    if (player === 1 && row > 1) { state.message = 'Joueur 1 : placez dans les 2 premières lignes !'; render(); return; }
    if (player === 2 && row < GRID_SIZE - 2) { state.message = 'Joueur 2 : placez dans les 2 dernières lignes !'; render(); return; }

    // création d'unité
    var unitType = UNITS_PER_PLAYER[playerUnitIndex];
    state.units.push({
      id: 'p' + player + '-' + playerUnitIndex,
      type: unitType, player: player, row: row, col: col,
      hasMoved: false, hasActed: false, isDefending: false,
      hp: UNIT_STATS[unitType].hp,
      xp: 0
    });
    state.grid[row][col].owner = player;
    state.placementIndex++;

    if (state.placementIndex >= totalUnits) {
      state.phase = 'dice-start';
      state.currentPlayer = 1;
      state.message = 'Phase de lancer de dé ! Joueur 1 et Joueur 2, lancez le dé pour décider qui commence.';
    } else {
      var np = state.placementIndex % 2 === 0 ? 1 : 2;
      var ni = Math.floor(state.placementIndex / 2);
      state.currentPlayer = np;
      state.message = 'Joueur ' + np + ' : placez votre ' + UNIT_STATS[UNITS_PER_PLAYER[ni]].name;
    }
    render();
    return;
  }

  if (state.phase === 'movement') {
    var friendlies = getFriendlyUnitsAt(row, col, state.currentPlayer);

    // Click sur un cell
    if (friendlies.length > 0 && !state.selectedUnit) {
      state.selectedUnit = friendlies[0].id;
      state.message = getUnitStats(friendlies[0]).name + ' sélectionné. Cliquez pour déplacer.';
      render(); return;
    }

    // if click la meme cell passer au next friendly unit
    if (friendlies.length > 0 && state.selectedUnit) {
      var currentSelected = state.units.find(function(u) { return u.id === state.selectedUnit; });
      if (currentSelected && currentSelected.row === row && currentSelected.col === col) {
        var idx = -1;
        for (var i = 0; i < friendlies.length; i++) {
          if (friendlies[i].id === state.selectedUnit) { idx = i; break; }
        }
        var nextIdx = (idx + 1) % friendlies.length;
        state.selectedUnit = friendlies[nextIdx].id;
        state.message = getUnitStats(friendlies[nextIdx]).name + ' sélectionné. Cliquez pour déplacer.';
        render(); return;
      }
    }
    // Deplacement
    if (state.selectedUnit) {
      var unit = state.units.find(function(u) { return u.id === state.selectedUnit; });
      if (unit.hasMoved) { state.message = 'Cette unité a déjà bougé ce tour !'; render(); return; }

      var dist = Math.abs(unit.row - row) + Math.abs(unit.col - col);
      var maxMove = getUnitStats(unit).move;

      if (unit.type === 'C' && dist <= maxMove) {
        if (unit.row !== row && unit.col !== col) {
          state.message = 'Le Cavalier se déplace en ligne droite uniquement !'; render(); return;
        }
      } else if (dist > maxMove || dist === 0) {
        state.message = 'Déplacement trop loin ! Max: ' + maxMove + ' case(s)'; render(); return;
      }
      // cell intermidiaire contient ennemie
      if (unit.type === 'C' && dist === 2) {
        var midR = (unit.row + row) / 2;
        var midC = (unit.col + col) / 2;
        if (Number.isInteger(midR) && Number.isInteger(midC) && getEnemyUnitsAt(midR, midC, unit.player).length > 0) {
          state.message = 'Chemin bloqué par un ennemi !'; render(); return;
        }
      }

      // Block mouvement vers enemy units
      var enemies = getEnemyUnitsAt(row, col, unit.player);
      if (enemies.length > 0) { state.message = 'Case occupée par une unité ennemie !'; render(); return; }

      // Blocked cells (event)
      if (isCellBlocked(row, col)) {
        state.message = '🚧 Cette case est bloquée par un événement ce tour !';
        render(); return;
      }

      // ZoC du Tank
      if (isInEnemyTankZoC(row, col, unit.player)) {
        state.message = '🛡️ Zone de contrôle ennemie ! Un Tank adverse bloque cette case. Combattez-le en phase action pour passer.';
        render(); return;
      }

      // vérifier barrières
      if (unit.type !== 'C' && dist === 1) {
        if (hasBarrierBetween(unit.row, unit.col, row, col)) {
          state.message = '🚧 Une barrière bloque ce passage ! Seul le Cavalier peut la franchir.';
          render();
          return;
        }
      }

      // ajouter la case au player 
      unit.row = row; unit.col = col; unit.hasMoved = true;
      state.grid[row][col].owner = unit.player;
      // vérifier case trap
      var msg = getUnitStats(unit).name + ' déplacé en (' + row + ',' + col + ').';
      var cell = state.grid[row][col];
      if (cell.type === 'trap') {
        msg += ' ⚠️ Piège ! -1 HP';
        unit.hp--;
        if (unit.hp <= 0) msg += ' — Unité détruite !';
      }

      state.selectedUnit = null;
      var w = checkVictory();
      if (w) { setWinner(w); render(); return; }
      state.message = msg + " Sélectionnez une autre unité ou passez à la phase d'action.";
      render(); return;
    }
    return;
  }

  // ACTION
  if (state.phase === 'action') {
    var friendlies = getFriendlyUnitsAt(row, col, state.currentPlayer);

    // Select/cycle friendly units
    if (friendlies.length > 0 && !state.selectedUnit) {
      state.selectedUnit = friendlies[0].id;
      state.message = getUnitStats(friendlies[0]).name + ' sélectionné. Attaquez un voisin, défendez ou capturez.';
      render(); return;
    }
    // Changer unité sur la même case
    if (friendlies.length > 0 && state.selectedUnit) {
      var currentSelected = state.units.find(function(u) { return u.id === state.selectedUnit; });
      if (currentSelected && currentSelected.row === row && currentSelected.col === col) {
        var idx = -1;
        for (var i = 0; i < friendlies.length; i++) {
          if (friendlies[i].id === state.selectedUnit) { idx = i; break; }
        }
        var nextIdx = (idx + 1) % friendlies.length;
        state.selectedUnit = friendlies[nextIdx].id;
        state.message = getUnitStats(friendlies[nextIdx]).name + ' sélectionné. Attaquez un voisin, défendez ou capturez.';
        render(); return;
      }
    }

    if (state.selectedUnit) {
      var attacker = state.units.find(function(u) { return u.id === state.selectedUnit; });

      var dist = Math.abs(attacker.row - row) + Math.abs(attacker.col - col);
      if (dist !== 1) { state.message = 'Cible trop éloignée ! (1 case adjacente)'; render(); return; }

      var enemies = getEnemyUnitsAt(row, col, state.currentPlayer);
      if (enemies.length > 0) {
        var defender = enemies[0];
        var atkStats = getUnitStats(attacker);
        var defStats = getUnitStats(defender);
        var atkRoll = rollDice(), defRoll = rollDice();
        var atkBonus = state.grid[attacker.row][attacker.col].type === 'bonus-attack' ? 2 : 0;
        var defBonus = (state.grid[defender.row][defender.col].type === 'bonus-defense' ? 2 : 0) + (defender.isDefending ? 2 : 0);
        var atkTotal = atkRoll + atkStats.force + atkBonus;
        var defTotal = defRoll + defStats.force + defBonus;

        attacker.hasActed = true;
        state.selectedUnit = null;

        var ctx = showDiceAnimation(
          atkStats.name + (atkStats.badge ? ' ' + atkStats.badge : '') + ' (J' + attacker.player + ')',
          defStats.name + (defStats.badge ? ' ' + defStats.badge : '') + ' (J' + defender.player + ')'
        );
        ctx.overlay.classList.add('dice-combat');
        // Animation du combats
        setTimeout(function() {
          var g1 = atkTotal > defTotal ? 'glow-green' : 'glow-red';
          var g2 = defTotal >= atkTotal ? 'glow-green' : 'glow-red';
          var info1 = atkRoll + ' + ' + atkStats.force + (atkBonus ? ' + ' + atkBonus : '') + ' = ' + atkTotal;
          var info2 = defRoll + ' + ' + defStats.force + (defBonus ? ' + ' + defBonus : '') + ' = ' + defTotal;

          var log = '⚔️ ' + atkStats.name + '(' + atkRoll + '+' + atkStats.force + ')=' + atkTotal +
                    ' vs ' + defStats.name + '(' + defRoll + '+' + defStats.force + ')=' + defTotal;
          var result = '';
          var promotionMsg = '';
          if (atkTotal > defTotal) {
            // Attaque réussie : le défenseur est totalement éliminé
            defender.hp = 0;
            state.units = state.units.filter(function(u) { return u.id !== defender.id; });
            result = ' → ' + defStats.name + ' éliminé !';

            // XP gain pour l'attaquant
            var oldRank = getRank(attacker);
            attacker.xp = (attacker.xp || 0) + 1;
            var newRank = getRank(attacker);
            if (newRank > oldRank) {
              var newStats = getUnitStats(attacker);
              attacker.hp = newStats.hpMax;
              promotionMsg = ' 🌟 PROMOTION : ' + newStats.name + ' ' + newStats.badge + ' !';
              result += promotionMsg;
            }

            var remainingEnemies = getEnemyUnitsAt(row, col, state.currentPlayer);
            if (remainingEnemies.length === 0) {
              // L'attaquant capture la case et s'y déplace
              attacker.row = row;
              attacker.col = col;
              state.grid[row][col].owner = attacker.player;
              result += ' Territoire capturé !';
            }
          } else {
            result = ' → Attaque repoussée !';
            // L'attaquant perd 1 HP 
            attacker.hp = Math.max(0, (attacker.hp || 0) - 1);
            result += ' ⚠️ ' + atkStats.name + ' -1 HP';
            if (attacker.hp <= 0) {
              state.units = state.units.filter(function(u) { return u.id !== attacker.id; });
              result += ' — Unité détruite !';
            }
            // XP de défense réussie pour le défenseur
            //if (defender.hp > 0) {
              var oldRankD = getRank(defender);
              defender.xp = (defender.xp || 0) + 1;
              var newRankD = getRank(defender);
              if (newRankD > oldRankD) {
                var newStatsD = getUnitStats(defender);
                defender.hp = newStatsD.hpMax;
                result += ' 🌟 PROMOTION défenseur : ' + newStatsD.name + ' ' + newStatsD.badge + ' !';
              }
            //}
          }
          state.combatLog.push(log + result);

          var resultMsg = atkTotal > defTotal ? '💥 Attaque réussie !' + (promotionMsg ? ' 🌟' : '') : '🛡️ Attaque repoussée !';
          resolveDiceAnimation(ctx, atkRoll, defRoll, g1, g2, info1, info2, resultMsg);

          ctx.onComplete = function() {
            var w = checkVictory();
            if (w) { setWinner(w); state.message = '🏆 Joueur ' + w + ' remporte la victoire !'; render(); return; }
            state.message = log + result;
            render();
          };
        }, 800);
        return;
      }
      // vérifier gagnant
      if (enemies.length === 0) {
        state.grid[row][col].owner = attacker.player;
        attacker.hasActed = true;
        state.selectedUnit = null;
        var w = checkVictory();
        if (w) { setWinner(w); render(); return; }
        state.message = 'Case (' + row + ',' + col + ') capturée !';
        render(); return;
      }
    }
  }
}

function startNewTurn(np) {
  state.phase = 'movement';
  state.currentPlayer = np;
  state.selectedUnit = null;
  state.units.forEach(function(u) {
    if (u.player === np) { u.hasMoved = false; u.hasActed = false; u.isDefending = false; }
  });
  // Clear blocked cells et déclencher événement tous les 3 tours
  var eventMsg = null;
  if (np === 1) {
    state.blockedCells = [];
    generateBarriers();
    if (state.turnNumber > 0 && state.turnNumber % 3 === 0) {
      eventMsg = triggerRandomEvent();
    }
  }
  state.message = (eventMsg ? eventMsg + ' — ' : '') +
    'Tour ' + state.turnNumber + ' — Joueur ' + np + ' : Phase de mouvement.';
  startTimer();
}

function nextPhase() {
  if (state.phase === 'movement') {
    state.phase = 'action';
    state.selectedUnit = null;
    state.message = 'Joueur ' + state.currentPlayer + " : Phase d'action. Sélectionnez une unité pour attaquer, défendre ou capturer.";
  } else if (state.phase === 'action') {
    var np = state.currentPlayer === 1 ? 2 : 1;
    if (state.currentPlayer === 2) state.turnNumber++;
    startNewTurn(np);
  }
  render();
}
// mettre l’unité sélectionnée en position défensive.
function defendUnit() {
  if (state.phase !== 'action' || !state.selectedUnit) return;
  var unit = state.units.find(function(u) { return u.id === state.selectedUnit; });
  if (!unit || unit.hasActed) { state.message = 'Unité déjà utilisée !'; render(); return; }
  unit.isDefending = true;
  unit.hasActed = true;
  state.selectedUnit = null;
  state.message = getUnitStats(unit).name + ' en position défensive ! (+2 défense)';
  render();
}

function resetGame() {
  stopTimer();
  var bar = document.getElementById('timer-bar');
  if (bar) bar.style.display = 'none';
  state = initState();
  render();
}