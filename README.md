# ⚔️ Conquête Tactique — Guide du Jeu

Bienvenue dans **Conquête Tactique**, un jeu de stratégie au tour par tour où deux armées s'affrontent sur un plateau de 10×10 cases. Le but est simple en apparence : conquérir le territoire. Mais entre les unités aux capacités uniques, les événements imprévus et les décisions tactiques à chaque tour, chaque partie est une histoire différente.

---

## 🎯 L'objectif

Il y a deux façons de remporter la victoire :

- **Conquête territoriale** : être le premier à contrôler **51 cases** ou plus sur les 100 du plateau.
- **Anéantissement** : éliminer toutes les unités adverses.

Chaque case que vous occupez compte. Plus vous étendez votre territoire, plus vous rapprochez de la victoire… mais plus vous vous exposez aussi aux attaques ennemies.

---

## 🏛️ Les unités à votre disposition

Chaque joueur commande une armée de **5 unités** :
- 3 **Soldats**
- 1 **Cavalier**
- 1 **Tank**

Plusieurs unités peuvent coexister sur la même case. Cela permet de créer des regroupements tactiques ou de protéger une unité fragile derrière une autre.

### Soldat (S)
Le cœur de votre armée. Solide, polyvalent, sans faiblesse particulière.
- **Déplacement** : 1 case
- **Force** : 3
- **Points de vie** : 3

### Cavalier (C)
Rapide et agile. Son point fort est la mobilité : il se déplace en ligne droite sur **2 cases**, franchit les barrières, et son allonge lui permet de sauter par-dessus les obstacles. Par contre, il est fragile.
- **Déplacement** : 2 cases (ligne droite uniquement)
- **Force** : 2
- **Points de vie** : 2
- **Spécial** : peut franchir les barrières et ne peut pas être bloqué par un ennemi sur sa trajectoire (mais il ne peut pas atterrir sur une case ennemie)

### Tank (T)
Une forteresse sur chenilles. Lent mais dévastateur, il impose le respect autour de lui.
- **Déplacement** : 1 case
- **Force** : 5
- **Points de vie** : 5
- **Spécial** : **Zone de Contrôle** — les cases immédiatement à sa gauche et à sa droite sont sous son emprise. Aucune unité ennemie ne peut s'y déplacer sans d'abord combattre le Tank en phase d'action. C'est un excellent outil pour verrouiller des passages et protéger des zones stratégiques.

---

## 🎲 Déroulement d'une partie

### 1. Placement initial
La partie commence par la mise en place des armées. Les joueurs placent leurs 5 unités alternativement :
- **Joueur 1** place dans les **2 premières lignes** (haut du plateau)
- **Joueur 2** place dans les **2 dernières lignes** (bas du plateau)

### 2. Lancer de dé pour l'initiative
Avant que le combat ne commence, les deux joueurs lancent un dé. Celui qui obtient le plus grand score commence la partie. En cas d'égalité, on relance.

### 3. Les tours de jeu
Chaque tour se décompose en **deux phases**, pour chaque joueur :

#### Phase de mouvement
Vous pouvez déplacer **une seule unité** de votre choix, selon ses règles de déplacement. Une fois déplacée, l'unité est "fatiguée" pour ce tour et ne peut plus bouger.

Cliquez sur une case contenant vos unités pour les sélectionner. Si plusieurs unités sont sur la même case, recliquez pour passer de l'une à l'autre.

#### Phase d'action
Vous pouvez faire agir **une seule unité** parmi celles qui n'ont pas encore agi ce tour. Trois choix s'offrent à vous :

- **Attaquer** : ciblez une case adjacente (haut, bas, gauche, droite) occupée par un ennemi. Un combat au dé se déclenche alors.
- **Capturer** : si une case adjacente est vide, vous pouvez la revendiquer pour votre camp sans combat.
- **Défendre** : l'unité adopte une posture défensive, gagnant **+2 en défense** jusqu'au prochain tour.

---

## ⚔️ Le système de combat

Quand deux unités s'affrontent, le jeu lance un dé pour chaque camp (résultat entre 1 et 6). Le total de chaque côté se calcule ainsi :

**Attaquant** = dé + Force de l'unité + bonus de case d'attaque (+2 si sur une case ⚔️)

**Défenseur** = dé + Force de l'unité + bonus de case de défense (+2 si sur une case 🛡️) + bonus de défense (+2 si l'unité s'est mise en défense)

### Résultat du combat
- **Si l'attaquant gagne** : le défenseur est **éliminé** (retiré du plateau). S'il n'y a plus d'ennemis sur la case, l'attaquant s'y déplace et capture le territoire. L'attaquant gagne **1 point d'expérience**.
- **Si le défenseur gagne ou fait égalité** : l'attaque est **repoussée**. L'attaquant perd **1 point de vie** en contre-attaque. Si ses points de vie tombent à zéro, il est détruit. Le défenseur gagne **1 point d'expérience** pour sa résistance.

Le combat est toujours risqué : même le Tank le plus puissant peut échouer face à un Soldat bien positionné avec un peu de chance aux dés.

---

## 🌟 Le système de progression (XP et Rangs)

Chaque unité qui survit à un combat gagne de l'**expérience** (XP) : 1 XP par combat gagné (attaque ou défense). Au fil des combats, les unités montent en grade et deviennent plus puissantes.

| Rang | XP requis | Nom | Bonus |
|------|-----------|-----|-------|
| ⭐ — Recrue | 0 | Nom de base | Aucun |
| ⭐★ — Vétéran | 2 | Nom amélioré | +1 Force (et parfois +1 PV) |
| ⭐★★ — Élite | 4 | Nom d'élite | +2 Force, +1 PV (selon l'unité) |

**Promotion** : quand une unité monte de rang, elle est **complètement soignée** (ses points de vie remontent au maximum de son nouveau grade). Cela fait des vétérans des unités précieuses à préserver.

Exemples de promotions :
- Soldat → Soldat Vétéran ★ → Soldat Élite ★★
- Cavalier → Cavalier Agile ★ → Cavalier Rapide ★★ (+1 déplacement !)
- Tank → Tank Renforcé ★ → Tank Lourd ★★

---

## 🗺️ Les cases spéciales du plateau

Dispersées sur le champ de bataille (sauf dans les zones de déploiement), ces cases modifient la donne :

| Icône | Type | Effet |
|-------|------|-------|
| ⚔️ | **Bonus d'attaque** | +2 Force pour toute unité qui combat depuis cette case |
| 🛡️ | **Bonus de défense** | +2 Force pour toute unité qui défend cette case |
| 💀 | **Piège** | -1 point de vie pour toute unité qui s'y déplace. Attention, un piège peut détruire une unité fragile ! |

Ces cases sont placées aléatoirement en début de partie. Il y a au moins 4 de chaque type, avec quelques supplémentaires réparties au hasard.

---

## 🚧 Les barrières

À chaque **tour complet** (au début du tour du Joueur 1), **3 barrières** apparaissent aléatoirement entre des cases adjacentes. Ces murs bloquent le passage de toutes les unités… **sauf le Cavalier**, qui les enjambe grâce à son agilité.

Les barrières changent constamment, ce qui oblige à adapter sa stratégie. Un passage libre peut devenir un cul-de-sac, et vice versa.

---

## 🎲 Les événements aléatoires

Tous les **3 tours**, un événement inattendu bouleverse la partie. Trois types d'événements peuvent survenir :

### 💪 Renforts
Une unité encore en vie (de n'importe quel camp) reçoit un renfort imprévu : **+2 en Force** et **+2 points de vie supplémentaires**. Cette unité devient soudainement beaucoup plus menaçante.

### 🌪️ Tempête
Le vent et la foudre frappent le plateau. Une unité de chaque camp est **téléportée** aléatoirement vers une case sûre (pas bloquée, pas sous contrôle ennemi). Cela peut sauver une unité encerclée… ou placer un ennemi derrière vos lignes.

### 🚧 Zones bloquées
**4 cases aléatoires** deviennent infranchissables pour ce tour uniquement. Aucune unité ne peut s'y déplacer. Elles sont marquées d'un cône de signalisation 🚧.

---

## ⏱️ Le chronomètre

Chaque joueur dispose de **60 secondes** par tour pour jouer. Si le temps s'écoule, le tour passe automatiquement à l'adversaire. Le chronomètre devient rouge quand il ne reste plus que 10 secondes.

En mode solo contre l'IA, le chronomètre est désactivé pendant le tour de l'ordinateur.

---

## 🤖 Mode solo contre l'IA

Vous pouvez affronter une intelligence artificielle à deux niveaux de difficulté :

- **Facile** : l'IA choisit ses actions au hasard parmi les coups possibles.
- **Difficile** : l'IA priorise ses Tanks et Cavaliers, vise les cases bonus, cherche à attaquer les unités les plus faibles, et se met en défense quand elle n'a pas l'avantage.

En mode IA, l'ordinateur joue automatiquement après un court délai. Vous pouvez ainsi vous entraîner ou défier l'IA à votre rythme.

---

## 💡 Conseils stratégiques

- **Le Tank est un verrou** : placez-le dans des couloirs étroits pour bloquer l'avancée ennemie avec sa Zone de Contrôle.
- **Le Cavalier est votre éclaireur** : profitez de sa vitesse et de sa capacité à franchir les barrières pour contourner l'ennemi ou capturer des cases isolées.
- **Les Soldats sont votre fond de jeu** : ils ne brillent pas particulièrement, mais ils sont nombreux et fiables. Utilisez-les pour tenir le terrain.
- **Pensez aux promotions** : une unité proche de monter de grade vaut souvent plus qu'une unité fraîchement déployée. Protégez vos vétérans.
- **L'attaque a ses risques** : si vous attaquez et perdez, vous perdez 1 PV. N'attaquez pas aveuglément — évaluez la position et les bonus de défense adverses.
- **La défense est une action** : mettre une unité en défense consomme votre action du tour, mais le bonus de +2 peut faire basculer un combat crucial.

---

**Bonne chance, commandant. Que le meilleur stratège l'emporte !** 🏆
