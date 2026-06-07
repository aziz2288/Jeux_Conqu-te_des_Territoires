function createGrid() {
  var grid = [];
  for (var r = 0; r < GRID_SIZE; r++) {
    var row = [];
    for (var c = 0; c < GRID_SIZE; c++) {
      row.push({ row: r, col: c, type: 'neutral', owner: null });
    }
    grid.push(row);
  }
  // cases des bonus et pièges (rows 2-7)
  var eligible = [];
  for (var r = 2; r < 8; r++) {
    for (var c = 0; c < GRID_SIZE; c++) {
      eligible.push({ r: r, c: c });
    }
  }
  // Mélange eligible cells
  for (var i = eligible.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = eligible[i]; 
    eligible[i] = eligible[j]; 
    eligible[j] = tmp;
  }
  // Placer minimum 4 pour chaque type,
  var MIN_EACH = 4;
  var types = ['bonus-attack', 'bonus-defense', 'trap'];
  var idx = 0;
  for (var t = 0; t < types.length; t++) {
    for (var k = 0; k < MIN_EACH && idx < eligible.length; k++) {
      grid[eligible[idx].r][eligible[idx].c].type = types[t];
      idx++;
    }
  }
  return grid;
}

function initState() {
  return {
    grid: createGrid(),
    units: [],
    currentPlayer: 1,
    phase: 'placement',
    placementIndex: 0,
    diceResult: null,
    selectedUnit: null,
    turnNumber: 0,
    winner: null,
    message: 'Joueur 1 : placez votre ' + UNIT_STATS[UNITS_PER_PLAYER[0]].name,
    combatLog: [],
    blockedCells: [],
    barriers: [],
    lastEvent: null
  };
}

function isCellBlocked(row, col) {
  return (state.blockedCells || []).some(function(b) { return b.row === row && b.col === col; });
}

// possibilité de barrier between (r1,c1) and (r2,c2)
function normalizeBarrier(r1, c1, r2, c2) {
  if (r1 === r2 && Math.abs(c1 - c2) === 1) {
    var c = Math.min(c1, c2);
    return { row: r1, col: c, dir: 'v' };
  }
  if (c1 === c2 && Math.abs(r1 - r2) === 1) {
    var r = Math.min(r1, r2);
    return { row: r, col: c1, dir: 'h' };
  }
  return null;
}

function hasBarrierBetween(r1, c1, r2, c2) {
  var b = normalizeBarrier(r1, c1, r2, c2);
  if (!b) return false;
  return (state.barriers || []).some(function(x) {
    return x.row === b.row && x.col === b.col && x.dir === b.dir;
  });
}

function generateBarriers() {
  var picks = [];
  while (picks.length < 3) {
    var dir = Math.random() < 0.5 ? 'h' : 'v';
    var r, c;
    if (dir === 'h') { // entre (r,c) et (r-1,c)
      r = Math.floor(Math.random() * (GRID_SIZE - 1));
      c = Math.floor(Math.random() * GRID_SIZE);
    } else { // entre (r,c) et (r,c-1)
      r = Math.floor(Math.random() * GRID_SIZE);
      c = Math.floor(Math.random() * (GRID_SIZE - 1));
    }
    // vérification des doublons
    var dup = picks.some(function(b) { return b.row === r && b.col === c && b.dir === dir; });
    if (!dup) picks.push({ row: r, col: c, dir: dir });
  }
  state.barriers = picks;
}

function countCells(player) {
  var count = 0;
  for (var r = 0; r < GRID_SIZE; r++)
    for (var c = 0; c < GRID_SIZE; c++)
      if (state.grid[r][c].owner === player) count++;
  return count;
}