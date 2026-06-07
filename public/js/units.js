function getRank(unit) {
  var xp = unit.xp || 0;
  var r = 0;
  for (var i = XP_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= XP_THRESHOLDS[i]) { r = i; break; }
  }
  return r;
}

function getUnitStats(unit) {
  var base = UNIT_STATS[unit.type];
  var rankIdx = getRank(unit);
  var rank = UNIT_RANKS[unit.type][rankIdx];
  var bonusF = unit.forceBonus || 0;
  var bonusH = unit.hpBonus || 0;
  return {
    name: rank.name,
    badge: rank.badge,
    rank: rankIdx,
    force: base.force + rank.bonusForce + bonusF,
    move: base.move + rank.bonusMove,
    hpMax: base.hp + rank.bonusHp + bonusH
  };
}

// Return all units pour une cell
function getUnitsAt(row, col) {
  return state.units.filter(function(u) {
    return u.row === row && u.col === col && u.hp > 0;
  });
}

// Return first unit pour une cell
function getUnitAt(row, col) {
  var units = getUnitsAt(row, col);
  return units.length > 0 ? units[0] : null;
}

// Return enemy units pour une cell
function getEnemyUnitsAt(row, col, player) {
  return getUnitsAt(row, col).filter(function(u) { return u.player !== player; });
}

// Return friendly units pour une cell
function getFriendlyUnitsAt(row, col, player) {
  return getUnitsAt(row, col).filter(function(u) { return u.player === player; });
}

// vérifier enemy Tank zone
function isInEnemyTankZoC(row, col, player) {
  return state.units.some(function(u) {
    if (u.player === player || u.hp <= 0 || u.type !== 'T') return false;
    return u.row === row && Math.abs(u.col - col) === 1;
  });
}
// vérifier Tank zone pour qu'elle joueur
function getTankZoCOwner(row, col) {
  var owners = {};
  state.units.forEach(function(u) {
    if (u.hp <= 0 || u.type !== 'T') return;
    if (u.row === row && Math.abs(u.col - col) === 1) owners[u.player] = true;
  });
  return owners;
}