function initMenu() {
  var menu = document.getElementById('main-menu');
  var diffSection = document.getElementById('difficulty-section');
  var modeBtns = menu.querySelectorAll('[data-mode]');
  var diffBtns = menu.querySelectorAll('[data-diff]');
  var backMode = document.getElementById('menu-back-mode');

  function showMenu() {
    diffSection.style.display = 'none';
    menu.style.display = 'flex';
  }

  modeBtns.forEach(function(b) {
    b.addEventListener('click', function() {
      var m = b.getAttribute('data-mode');
      if (m === 'multi') { startGameWithMode('multi'); }
      else { diffSection.style.display = 'block'; }
    });
  });
  diffBtns.forEach(function(b) {
    b.addEventListener('click', function() {
      aiDifficulty = b.getAttribute('data-diff');
      startGameWithMode('ai');
    });
  });
  backMode.addEventListener('click', function() {
    diffSection.style.display = 'none';
  });

  // le bouton "Retour au menu" dans le panneau
  window.__showMainMenu = function() {
    stopTimer();
    var bar = document.getElementById('timer-bar');
    if (bar) bar.style.display = 'none';
    showMenu();
  };

  showMenu();
}

function startGameWithMode(mode) {
  gameMode = mode;
  document.getElementById('main-menu').style.display = 'none';
  updateModeBadge();
  state = initState();
  render();
}

function updateModeBadge() {
  var el = document.getElementById('mode-badge');
  if (!el) return;
  el.classList.remove('ai-easy', 'ai-hard');
  if (gameMode === 'multi') { el.textContent = '👥 Multijoueur'; }
  else if (gameMode === 'ai') {
    el.textContent = '🤖 vs IA — ' + (aiDifficulty === 'hard' ? 'Difficile' : 'Facile');
    el.classList.add(aiDifficulty === 'hard' ? 'ai-hard' : 'ai-easy');
  }
}

// Init
initMenu();