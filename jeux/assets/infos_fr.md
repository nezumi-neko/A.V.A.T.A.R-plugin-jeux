# Jeux

![jeux](../../core/plugins/jeux/assets/images/jeux.png =100x*)

Ce plugin est un add-on pour le framework [A.V.A.T.A.R](https://github.com/Avatar-Home-Automation/A.V.A.T.A.R-Server)

Le plugin Jeux est un petit outil polyvalent qui permet de réaliser plusieurs actions amusantes et utiles :

- Lancer un ou deux dés virtuels : idéal si vous jouez à un jeu nécessitant des dés et que vous n'en avez pas sous la main.
- Tirer une carte au hasard d'un jeu de poker virtuel (jeu de 52 cartes).
- Jouer à pile ou face grâce à une pièce virtuelle.
- Jouer au Blackjack contre un croupier virtuel.

---

## Installation :

### Installation Manuelle :

- Téléchargez et dézippez le plugin sur votre ordinateur.
- Au cas ou ce ne serait pas déjà le cas, renomez le dernier dossier jeux et placez le directement dans le répertoire *plugins* d'Avatar.

### Installation Automatique :

- Passer par la bibliothèque d'Aavatar pour télécharger le plugin.

---

## Fonctionnement du plugin :

Ce plugin repose entièrement sur le hasard. À partir de phrases clés, il déclenche une action correspondante.
Pour enrichir l’expérience, chaque action est accompagnée d’un petit effet sonore au format MP3 soulignant l’événement.

---

Lancement d'un dé virtuel :
`*"Mot clé"*, lance un dé`

---

Lancement de deux dés virtuels :
`*"Mot clé"*, lance deux dés`

---

Choix d'une carte au hasard dans un jeu de poker virtuel de 52 cartes :
`*"Mot clé"*, choisit une carte`

---

Jouer au Blacklack :
`*"Mot clé"*, jeu pile ou face`
`*"Mot clé"*, on joue à pile ou face`

A ce moment, Sarah vous demandera de choisir entre pile ou face.
Mot à prononcer : "pile" ou "face"

---

Jouer au Blacklack :
`*"Mot clé"*, joue au Blacklack`

A ce moment, Sarah lancera le jeu.

Le Blackjack est un jeu où le joueur et le croupier tentent d'obtenir une main proche de 21 sans la dépasser.
Un jeu de 52 cartes est mélangé, et chaque carte a une valeur spécifique : chiffres (valeur nominale), figures (10 points), et as (1 ou 11 points).
Le joueur reçoit deux cartes face visible et peut choisir entre "tirer" des cartes supplémentaires pour se rapprocher de 21 ou "rester". Si les points du joueur dépassent 21, il perd immédiatement. Le croupier reçoit 1 carte face visible (et garde sa seconde carte cachée) et joue ensuite, tirant des cartes jusqu'à atteindre au moins 17 points.
Le gagnant est celui qui a la main la plus proche de 21 sans dépasser. En cas d'égalité, c'est un match nul.

Valeur des cartes :
Les cartes de 2 à 10 valent leur chiffre.
Les figures (valet, dame, roi) valent 10 points.
L'as peut valoir 11 points ou 1 point (en fonction de la main pour éviter de dépasser 21).

---

Auteur de base : Hervé le hibou (plugins pour Sarah)
Conversion et modification : Nezumi



<br><br><br><br>