var cellIcons = { 'bonus-attack': '⚔️', 'bonus-defense': '🛡️', 'trap': '💀' };

function render() {
  renderBoard();
  renderPanel();
  maybeRunAI();
}

function renderBoard() {
  var board = document.getElementById('board');
  board.innerHTML = '';
  for (var r = 0; r < GRID_SIZE; r++) {
    for (var c = 0; c < GRID_SIZE; c++) {
      var cell = state.grid[r][c];
      var div = document.createElement('button');
      div.className = 'cell';

      if (cell.owner === 1) div.classList.add('owner-1');
      else if (cell.owner === 2) div.classList.add('owner-2');
      else if (cell.type !== 'neutral') div.classList.add(cell.type);

      var units = getUnitsAt(r, c);
      var hasSelected = false;
      for (var i = 0; i < units.length; i++) {
        if (units[i].id === state.selectedUnit) { hasSelected = true; break; }
      }
      if (hasSelected) div.classList.add('selected');

      var zoc = getTankZoCOwner(r, c);
      if (zoc[1]) div.classList.add('zoc-1');
      if (zoc[2]) div.classList.add('zoc-2');

      // Blocked cell
      if (isCellBlocked(r, c)) div.classList.add('blocked-cell');

      if (isCellBlocked(r, c) && units.length === 0) {
        var bicon = document.createElement('span');
        bicon.className = 'cell-icon';
        bicon.textContent = '🚧';
        div.appendChild(bicon);
      } else if (cellIcons[cell.type] && units.length === 0) {
        var icon = document.createElement('span');
        icon.className = 'cell-icon';
        icon.textContent = cellIcons[cell.type];
        div.appendChild(icon);
      }

      if (units.length > 0) {
        var container = document.createElement('div');
        container.className = 'units-stack';
        for (var j = 0; j < units.length; j++) {
          var u = units[j];
          var uStats = getUnitStats(u);
          var ud = document.createElement('div');
          ud.className = 'unit-mini p' + u.player;

          if (u.isDefending) ud.classList.add('defending');
          if (u.id === state.selectedUnit) ud.classList.add('unit-selected');
          if (uStats.rank > 0) ud.classList.add('rank-' + uStats.rank);

          ud.title = uStats.name + ' — Force ' + uStats.force + ' / HP ' + u.hp + '/' + uStats.hpMax + ' / XP ' + (u.xp || 0);
          var rankBadge = uStats.badge ? '<span class="unit-rank-mini">' + uStats.badge + '</span>' : '';
          ud.innerHTML = '<span class="unit-type-mini">' + u.type + '</span><span class="unit-hp-mini">' + u.hp + '</span>' + rankBadge;
          container.appendChild(ud);
        }
        div.appendChild(container);
      }

      (function(row, col) {
        div.addEventListener('click', function() { handleCellClick(row, col); });
      })(r, c);

      board.appendChild(div);
    }
  }

  renderBarriers(board);
}

function renderBarriers(board) {
  var old = board.querySelectorAll('.barrier');
  for (var i = 0; i < old.length; i++) old[i].remove();

  var barriers = state.barriers || [];
  if (barriers.length === 0) return;
  var prevPos = getComputedStyle(board).position;
  if (prevPos === 'static') board.style.position = 'relative';

  var cells = board.querySelectorAll('.cell');
  if (cells.length === 0) return;
  var boardRect = board.getBoundingClientRect();

  function rectOf(r, c) {
    var idx = r * GRID_SIZE + c;
    var el = cells[idx];
    var rect = el.getBoundingClientRect();
    return {
      left: rect.left - boardRect.left,
      top: rect.top - boardRect.top,
      width: rect.width,
      height: rect.height
    };
  }

  for (var k = 0; k < barriers.length; k++) {
    var b = barriers[k];
    var bar = document.createElement('div');
    bar.className = 'barrier ' + (b.dir === 'h' ? 'barrier-h' : 'barrier-v');
    bar.title = 'Barrière — bloque le passage (sauf Cavalier)';

    var a = rectOf(b.row, b.col);
    if (b.dir === 'h') {
      // Ligne horizontale en bas
      bar.style.left = a.left + 'px';
      bar.style.top = (a.top + a.height - 3) + 'px';
      bar.style.width = a.width + 'px';
      bar.style.height = '6px';
    } else {
      // Ligne verticale à droite
      bar.style.left = (a.left + a.width - 3) + 'px';
      bar.style.top = a.top + 'px';
      bar.style.width = '6px';
      bar.style.height = a.height + 'px';
    }
    board.appendChild(bar);
  }
}

function renderPanel() {
  var titleEl = document.getElementById('turn-title');
  titleEl.textContent = state.winner ? '🏆 Fin de partie' : 'Tour ' + (state.turnNumber || '-');

  var cpEl = document.getElementById('current-player');
  if (!state.winner) {
    cpEl.textContent = '▶ Joueur ' + state.currentPlayer;
    cpEl.className = state.currentPlayer === 1 ? 'cp1' : 'cp2';
  } else {
    cpEl.textContent = '';
  }

  document.getElementById('message').textContent = state.message;

  var msgEl = document.getElementById('message');
  // refresh event banner juste après message
  var existingBanner = document.getElementById('event-banner');
  if (existingBanner) existingBanner.remove();
  if (state.lastEvent && state.phase !== 'placement' && state.phase !== 'dice-start' && !state.winner) {
    var banner = document.createElement('div');
    banner.id = 'event-banner';
    banner.className = 'event-banner';
    banner.textContent = '🎲 Événement : ' + state.lastEvent;
    msgEl.parentNode.insertBefore(banner, msgEl.nextSibling);
  }

  var alive1 = state.units.filter(function(u) { return u.player === 1 && u.hp > 0; }).length;
  var alive2 = state.units.filter(function(u) { return u.player === 2 && u.hp > 0; }).length;
  var c1 = countCells(1), c2 = countCells(2);
  document.getElementById('score-p1').textContent = 'J1: ' + c1 + ' cases — ' + alive1 + ' unités';
  document.getElementById('score-p2').textContent = 'J2: ' + c2 + ' cases — ' + alive2 + ' unités';
  document.getElementById('progress-p1').style.width = (c1 / 100 * 100) + '%';
  document.getElementById('progress-p2').style.width = (c2 / 100 * 100) + '%';

  // zone des boutons d'action
  var actions = document.getElementById('actions-card');
  actions.innerHTML = '';

  if (state.phase === 'dice-start') {
  actions.appendChild(
    makeBtn(
      '<img src="/public/assets/dice.png" class="btn-icon"> Lancer le dé',
      'btn-primary',
      rollDiceAction
    )
  );
}

if (state.phase === 'movement') {
  actions.appendChild(
    makeBtn(
      '<img src="/public/assets/move.png" class="btn-icon"> Phase d’action',
      'btn-accent',
      nextPhase
    )
  );
}

if (state.phase === 'action') {
  if (state.selectedUnit) {
    actions.appendChild(
      makeBtn(
        '<img src="/public/assets/shield.png" class="btn-icon"> Défendre',
        'btn-secondary',
        defendUnit
      )
    );
  }

  actions.appendChild(
    makeBtn(
      '<img src="/public/assets/endturn.png" class="btn-icon"> Fin du tour',
      'btn-accent',
      nextPhase
    )
  );
}

actions.appendChild(
  makeBtn(
    '<img src="/public/assets/restart.png" class="btn-icon"> Nouvelle partie',
    'btn-destructive',
    resetGame
  )
);

actions.appendChild(
  makeBtn(
    '<img src="/public/assets/home.png" class="btn-icon"> Retour au menu',
    'btn-back-menu',
    function() {
      if (window.__showMainMenu) window.__showMainMenu();
    }
  )
);

  // journal de combat
  var logCard = document.getElementById('combat-log-card');
  var logDiv = document.getElementById('combat-log');
  if (state.combatLog.length > 0) {
    logCard.style.display = '';
    logDiv.innerHTML = '';
    var recent = state.combatLog.slice(-8).reverse();
    for (var i = 0; i < recent.length; i++) {
      var p = document.createElement('p');
      p.textContent = recent[i];
      logDiv.appendChild(p);
    }
  } else {
    logCard.style.display = 'none';
  }
}

function makeBtn(text, cls, handler) {
  var btn = document.createElement('button');
  btn.className = 'btn ' + cls;
  btn.textContent = text;
  btn.addEventListener('click', handler);
  btn.innerHTML = text;
  return btn;
}