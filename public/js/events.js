function triggerRandomEvent() {
  var events = ['reinforcements', 'storm', 'blocked'];
  var ev = events[Math.floor(Math.random() * events.length)];
  state.blockedCells = [];

  if (ev === 'reinforcements') {
    var alive = state.units.filter(function(u) { return u.hp > 0; });
    if (alive.length === 0) return null;
    var u = alive[Math.floor(Math.random() * alive.length)];
    u.forceBonus = (u.forceBonus || 0) + 2;
    u.hpBonus = (u.hpBonus || 0) + 2;
    u.hp = (u.hp || 0) + 2;
    let s = getUnitStats(u);
    var msg = '💪 RENFORTS ! ' + s.name + ' (J' + u.player + ') gagne +2 Force (total: ' + s.force + ') et +2 HP (total: ' + u.hp + '/' + s.hpMax + ').';
    state.lastEvent = msg;
    state.combatLog.push(msg);
    return msg;
  }

  if (ev === 'storm') {
    var moved = [];
    [1, 2].forEach(function(p) {
      var alive = state.units.filter(function(u) { return u.hp > 0 && u.player === p; });
      if (alive.length === 0) return;
      var u = alive[Math.floor(Math.random() * alive.length)];
      // Find cell (non enemy ZoC, non blocked)
      var attempts = 0, nr = u.row, nc = u.col;
      while (attempts < 30) {
        var r = Math.floor(Math.random() * GRID_SIZE);
        var c = Math.floor(Math.random() * GRID_SIZE);
        if (!isInEnemyTankZoC(r, c, u.player) && getEnemyUnitsAt(r, c, u.player).length === 0) {
          nr = r; nc = c; break;
        }
        attempts++;
      }
      u.row = nr; u.col = nc;
      state.grid[nr][nc].owner = u.player;
      moved.push('J' + p + ' ' + getUnitStats(u).name + '→(' + nr + ',' + nc + ')');
    });
    var msg = '🌪️ TEMPÊTE ! Unités déplacées : ' + moved.join(', ') + '.';
    state.lastEvent = msg;
    state.combatLog.push(msg);
    return msg;
  }

  if (ev === 'blocked') {
    var picks = [];
    var attempts = 0;
    while (picks.length < 4 && attempts < 100) {
      var r = Math.floor(Math.random() * GRID_SIZE);
      var c = Math.floor(Math.random() * GRID_SIZE);
      //éviter cell occupées et doublons 
      var occupied = getUnitsAt(r, c).length > 0;
      var dup = picks.some(function(p) { return p.row === r && p.col === c; });
      if (!occupied && !dup) picks.push({ row: r, col: c });
      attempts++;
    }
    state.blockedCells = picks;
    var coords = picks.map(function(p) { return '(' + p.row + ',' + p.col + ')'; }).join(' ');
    var msg = '🚧 ZONES BLOQUÉES ce tour : ' + coords + '.';
    state.lastEvent = msg;
    state.combatLog.push(msg);
    return msg;
  }
  return null;
}