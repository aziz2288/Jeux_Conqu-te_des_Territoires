function maybeRunAI() {
  if (gameMode !== 'ai' || aiActing || state.winner) return;
  if (state.currentPlayer !== AI_PLAYER) return;

  if (state.phase === 'placement') { aiActing = true; setTimeout(aiDoPlacement, 500); return; }
  if (state.phase === 'dice-start') { aiActing = true; setTimeout(function() { aiActing = false; rollDiceAction(); }, 500); return; }
  if (state.phase === 'movement') { aiActing = true; setTimeout(aiPlayMovement, 600); return; }
  if (state.phase === 'action')   { aiActing = true; setTimeout(aiPlayAction, 600); return; }
}

function aiDoPlacement() {
  while (state.phase === 'placement' && state.placementIndex % 2 === 1) {
    var r = 8 + Math.floor(Math.random() * 2);
    var c = Math.floor(Math.random() * GRID_SIZE);
    handleCellClick(r, c);
  }
  aiActing = false;
}

function aiPlayMovement() {
  var myUnits = state.units.filter(function(u) { return u.player === AI_PLAYER && u.hp > 0 && !u.hasMoved; });
  if (myUnits.length === 0) { aiActing = false; nextPhase(); return; }

  var unit = aiPickUnitToMove(myUnits);
  var target = aiPickMoveTarget(unit);

  if (target) {
    state.selectedUnit = unit.id;
    handleCellClick(target.row, target.col);
    aiActing = false;
    setTimeout(function() { nextPhase(); }, 500);
  } else {
    // Aucun mouvement possible
    unit.hasMoved = true;
    aiActing = false;
    setTimeout(function() { nextPhase(); }, 200);
  }
}

function aiPlayAction() {
  var myUnits = state.units.filter(function(u) { return u.player === AI_PLAYER && u.hp > 0 && !u.hasActed; });
  if (myUnits.length === 0) { aiActing = false; nextPhase(); return; }

  // Chercher unit avec une action utile
  for (var i = 0; i < myUnits.length; i++) {
    var unit = myUnits[i];
    var action = aiPickActionFor(unit);
    if (action) {
      state.selectedUnit = unit.id;
      if (action.type === 'attack' || action.type === 'capture') {
        handleCellClick(action.row, action.col);
      } else if (action.type === 'defend') {
        defendUnit();
      }
      aiActing = false;
      setTimeout(function() { nextPhase(); }, 900);
      return;
    }
  }
  state.selectedUnit = null;
  aiActing = false;
  setTimeout(function() { nextPhase(); }, 300);
}

function aiPickUnitToMove(units) {
  if (aiDifficulty === 'easy') return units[Math.floor(Math.random() * units.length)];
  // Hard prioriser Tank puis Cavalier
  units.sort(function(a, b) {
    var order = { T: 0, C: 1, S: 2 };
    return order[a.type] - order[b.type];
  });
  return units[0];
}
// cell possible pour deplacement
function aiCandidateMoves(unit) {
  var stats = getUnitStats(unit);
  var maxMove = stats.move;
  var moves = [];
  for (var r = 0; r < GRID_SIZE; r++) {
    for (var c = 0; c < GRID_SIZE; c++) {
      var dist = Math.abs(unit.row - r) + Math.abs(unit.col - c);
      if (dist === 0 || dist > maxMove) continue;
      if (unit.type === 'C' && unit.row !== r && unit.col !== c) continue;
      if (getEnemyUnitsAt(r, c, unit.player).length > 0) continue;
      if (isCellBlocked(r, c)) continue;
      if (isInEnemyTankZoC(r, c, unit.player)) continue;
      if (unit.type !== 'C' && dist === 1 && hasBarrierBetween(unit.row, unit.col, r, c)) continue;
      moves.push({ row: r, col: c });
    }
  }
  return moves;
}

function aiPickMoveTarget(unit) {
  var moves = aiCandidateMoves(unit);
  if (moves.length === 0) return null;
  if (aiDifficulty === 'easy') return moves[Math.floor(Math.random() * moves.length)];

  // Hard c'est avec score
  var enemies = state.units.filter(function(u) { return u.player !== unit.player && u.hp > 0; });
  var best = null, bestScore = -1;
  for (var i = 0; i < moves.length; i++) {
    var m = moves[i];
    var cell = state.grid[m.row][m.col];
    var score = 0;
    if (cell.owner !== unit.player) score += 5; // capture
    if (cell.owner === (unit.player === 1 ? 2 : 1)) score += 3; // reprise sur l'ennemi
    if (cell.type === 'bonus-attack') score += 4;
    if (cell.type === 'bonus-defense') score += 2;
    if (cell.type === 'trap') score -= 6;
    if (score > bestScore) { bestScore = score; best = m; }
  }
  return best;
}

function aiPickActionFor(unit) {
  var dirs = [[-1,0],[1,0],[0,-1],[0,1]];
  var attacks = [];
  for (var i = 0; i < dirs.length; i++) {
    var nr = unit.row + dirs[i][0], nc = unit.col + dirs[i][1];
    if (nr < 0 || nr >= GRID_SIZE || nc < 0 || nc >= GRID_SIZE) continue;
    // ennemie a attaquer
    var enemies = getEnemyUnitsAt(nr, nc, unit.player);
    if (enemies.length > 0) attacks.push({ row: nr, col: nc, target: enemies[0] });
    // cell a capturer
    if (enemies.length === 0 && state.grid[nr][nc].owner !== unit.player && !isCellBlocked(nr, nc)) {
      attacks.push({ row: nr, col: nc, target: null, capture: true });
    }
  }
  if (attacks.length === 0) return null;

  if (aiDifficulty === 'easy') {
    var pick = attacks[Math.floor(Math.random() * attacks.length)];
    return { type: pick.target ? 'attack' : 'capture', row: pick.row, col: pick.col };
  }

  // Hard : prioriser cible la plus faible
  attacks.sort(function(a, b) {
    var ah = a.target ? a.target.hp : 99;
    var bh = b.target ? b.target.hp : 99;
    return ah - bh;
  });
  var pick = attacks[0];
  // Si la cible avec HP élevé : défendre
  if (pick.target && pick.target.hp >= getUnitStats(unit).force + 2) {
    return { type: 'defend' };
  }
  return { type: pick.target ? 'attack' : 'capture', row: pick.row, col: pick.col };
}