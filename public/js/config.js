var GRID_SIZE = 10;
var WIN_CELLS = 51;

var UNIT_STATS = {
  S: { name: 'Soldat', move: 1, force: 3, hp: 3 },
  C: { name: 'Cavalier', move: 2, force: 2, hp: 2 },
  T: { name: 'Tank', move: 1, force: 5, hp: 5 }
};


var UNIT_RANKS = {
  S: [
    { name: 'Soldat', bonusForce: 0, bonusMove: 0, bonusHp: 0, badge: '' },
    { name: 'Soldat Vétéran', bonusForce: 1, bonusMove: 0, bonusHp: 0, badge: '★' },
    { name: 'Soldat Élite', bonusForce: 2, bonusMove: 0, bonusHp: 1, badge: '★★' }
  ],
  C: [
    { name: 'Cavalier', bonusForce: 0, bonusMove: 0, bonusHp: 0, badge: '' },
    { name: 'Cavalier Agile', bonusForce: 1, bonusMove: 0, bonusHp: 0, badge: '★' },
    { name: 'Cavalier Rapide', bonusForce: 2, bonusMove: 1, bonusHp: 1, badge: '★★' }
  ],
  T: [
    { name: 'Tank', bonusForce: 0, bonusMove: 0, bonusHp: 0, badge: '' },
    { name: 'Tank Renforcé', bonusForce: 1, bonusMove: 0, bonusHp: 0, badge: '★' },
    { name: 'Tank Lourd', bonusForce: 2, bonusMove: 0, bonusHp: 1, badge: '★★' }
  ]
};


var XP_THRESHOLDS = [0, 2, 4];

var UNITS_PER_PLAYER = ['S', 'S', 'C', 'T', 'S'];

var TURN_TIME = 60;
var state;
var timerInterval = null;
var timerSeconds = TURN_TIME;


var gameMode = 'multi';
var aiDifficulty = 'easy';
var AI_PLAYER = 2;
var aiActing = false;