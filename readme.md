# RGU-3js

## Setup
Download [Node.js](https://nodejs.org/en/download/).
Run this followed commands:

``` bash
# Install dependencies (only the first time) 
npm install

# Run the local server at localhost:8080
npm run dev

# Build for production in the dist/ directory
npm run build
```


# How to play:

## Board and pieces
- A game board with 20 squares, in the shape of an elongated H.
- 7 game "checkers" for each player.
- 1 pyramid-shaped die(Traditionally it would be 4 dice, with two white tips. This is not implemented)

## Objective
The objective of the game is to move all of your pieces around the board and off the board before your opponent does.

## Playing the game
1. On your turn, roll the die by clicking it
2. Select your top piece(Red goes first), possible positions will appear on the board. Selecting another piece of the same color will deselect a piece.
3. Pieces enter the board below the purple square.
4. Outer edge's of the board (where the red squares are) are safe squares.
5. To score a point a player must land exactly on the green square.
6. Landing on a red square rewards an extra move.
7. Landing on the purple square means that piece can not be captured as well as an extra move is rewarded.

Red player moves this way:
→ → → → → → → ↓                       
↑← ← ←  ← ← ← ←

Blue player moves this way:
↓← ← ←  ← ← ← ←
→ → → → → → → ↑                     


###Missing Features:
- Object glow to show player move
- Score board redesign
- Animated die roll
- Hide placeholder piece when not in use
- Return jumped piece to stack