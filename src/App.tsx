import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

// ============================================================
//  SECTION 1: CSS STYLES (Embedded)
// ============================================================

const GLOBAL_CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --color-bg-primary:       #F5EFE0;
    --color-bg-secondary:     #EDE4CF;
    --color-bg-panel:         #FAF6EE;
    --color-board-light:      #FFFFFF;
    --color-board-dark:       #00f232;
    --color-board-border:     #2C2C2C;
    --color-yarn-white:       #F5F0E8;
    --color-yarn-black:       #2C2C2C;
    --color-hat-gold:         #FFD700;
    --color-hat-band:         #3A2A00;
    --color-accent-green:     #4CAF50;
    --color-highlight-select: rgba(255,213,0,0.45);
    --color-check-red:        rgba(220,53,69,0.35);
    --color-text-primary:     #1A1208;
    --color-text-secondary:   #5C4A2A;
    --color-text-muted:       #9C8660;
    --color-panel-border:     #D9C9A5;
    --color-shadow:           rgba(90,60,20,0.18);
  }

  body {
    background: var(--color-bg-primary);
    font-family: 'DM Sans', sans-serif;
    color: var(--color-text-primary);
    min-height: 100vh;
    overflow-x: hidden;
  }

  @keyframes queenFire {
    0%   { transform: scale(1); filter: brightness(1); }
    20%  { transform: scale(1.3); filter: brightness(2) hue-rotate(30deg); }
    40%  { transform: scale(0.8) rotate(5deg); }
    60%  { opacity: 0.6; transform: translateY(-20px) scale(0.5); }
    100% { opacity: 0; transform: translateY(-60px) scale(0); }
  }

  @keyframes goldSpark {
    0%   { transform: translate(0,0) scale(1); opacity: 1; }
    100% { transform: translate(var(--dx), var(--dy)) scale(0); opacity: 0; }
  }

  @keyframes pawnKick {
    0%   { transform: translateX(0) rotate(0deg); }
    30%  { transform: translateX(-8px) rotate(-10deg); }
    50%  { transform: translateX(6px) rotate(15deg); }
    100% { transform: translateX(120px) rotate(720deg); opacity: 0; }
  }

  @keyframes rookMelt {
    0%   { transform: scaleY(1) scaleX(1); filter: blur(0px); opacity: 1; }
    25%  { transform: scaleY(0.85) scaleX(1.1); border-radius: 40%; }
    50%  { transform: scaleY(0.5) scaleX(1.3); filter: blur(1px); border-radius: 60%; }
    75%  { transform: scaleY(0.2) scaleX(1.5); filter: blur(3px); opacity: 0.5; }
    100% { transform: scaleY(0) scaleX(1.8); filter: blur(6px); opacity: 0; }
  }

  @keyframes tornadoSpin {
    0%   { transform: rotate(0deg) scaleX(1); opacity: 0; }
    20%  { opacity: 1; }
    100% { transform: rotate(1080deg) scaleX(0.1) translateY(-100px); opacity: 0; }
  }

  @keyframes tornadoBody {
    0%   { transform: scaleX(0.3) scaleY(0.3); opacity: 0; }
    30%  { opacity: 1; transform: scaleX(1) scaleY(1); }
    70%  { transform: scaleX(1.2) scaleY(1.4) rotate(5deg); }
    100% { transform: scaleX(0) scaleY(0); opacity: 0; }
  }

  @keyframes charCrumble {
    0%   { filter: brightness(1) saturate(1); transform: scale(1); }
    30%  { filter: brightness(3) saturate(0) sepia(1); }
    60%  { transform: scale(0.9) rotate(3deg); filter: brightness(0.3) saturate(0); }
    100% { transform: scale(0) rotate(10deg); opacity: 0; filter: brightness(0); }
  }

  @keyframes waterRipple {
    0%   { transform: scale(0); opacity: 0.8; border-radius: 50%; }
    100% { transform: scale(4); opacity: 0; border-radius: 50%; }
  }

  @keyframes pieceDissolve {
    0%   { opacity: 1; filter: blur(0px) saturate(1); transform: translateY(0); }
    30%  { filter: blur(0px) saturate(0.5) hue-rotate(180deg); }
    60%  { opacity: 0.6; filter: blur(2px) saturate(0); transform: translateY(8px); }
    100% { opacity: 0; filter: blur(8px); transform: translateY(20px) scaleY(0.3); }
  }

  @keyframes boardFlash {
    0%   { opacity: 0; }
    10%  { opacity: 0.9; }
    20%  { opacity: 0; }
    100% { opacity: 0; }
  }

  @keyframes checkPulse {
    0%, 100% { background: rgba(220,53,69,0.2); }
    50%       { background: rgba(220,53,69,0.5); }
  }

  @keyframes pieceFloat {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-3px); }
  }

  /* Cute piece wobble animations */
  @keyframes cuteWobble {
    0%, 100% { transform: rotate(0deg) scale(1); }
    25%      { transform: rotate(-3deg) scale(1.02); }
    50%      { transform: rotate(3deg) scale(1); }
    75%      { transform: rotate(-2deg) scale(1.01); }
  }

  @keyframes cuteBounce {
    0%, 100% { transform: translateY(0) scale(1); }
    25%      { transform: translateY(-4px) scale(1.05); }
    50%      { transform: translateY(-2px) scale(1.02); }
    75%      { transform: translateY(-5px) scale(1.03); }
  }

  @keyframes excitedShake {
    0%, 100% { transform: rotate(0deg) translateX(0); }
    10%      { transform: rotate(-5deg) translateX(-2px); }
    20%      { transform: rotate(5deg) translateX(2px); }
    30%      { transform: rotate(-4deg) translateX(-1px); }
    40%      { transform: rotate(4deg) translateX(1px); }
    50%      { transform: rotate(-3deg) translateX(0); }
    60%      { transform: rotate(3deg) translateX(-1px); }
    70%      { transform: rotate(-2deg) translateX(1px); }
    80%      { transform: rotate(2deg) translateX(0); }
    90%      { transform: rotate(-1deg) translateX(-1px); }
  }

  @keyframes selectedPulse {
    0%, 100% { transform: scale(1); filter: brightness(1); }
    50%      { transform: scale(1.08); filter: brightness(1.2); }
  }

  /* Impact frame animations */
  @keyframes impactShake {
    0%, 100% { transform: translate(0, 0); }
    10%      { transform: translate(-4px, -2px); }
    20%      { transform: translate(4px, 2px); }
    30%      { transform: translate(-3px, 1px); }
    40%      { transform: translate(3px, -1px); }
    50%      { transform: translate(-2px, 2px); }
    60%      { transform: translate(2px, -2px); }
    70%      { transform: translate(-1px, 1px); }
    80%      { transform: translate(1px, -1px); }
    90%      { transform: translate(-1px, 0); }
  }

  @keyframes screenFlash {
    0%   { opacity: 0; }
    5%    { opacity: 0.95; }
    15%   { opacity: 0; }
    25%   { opacity: 0.7; }
    35%   { opacity: 0; }
    100%  { opacity: 0; }
  }

  @keyframes impactRing {
    0%   { transform: scale(0.5); opacity: 1; border-width: 8px; }
    100% { transform: scale(3); opacity: 0; border-width: 2px; }
  }

  @keyframes starBurst {
    0%   { transform: scale(0) rotate(0deg); opacity: 1; }
    50%   { transform: scale(1.2) rotate(180deg); opacity: 0.8; }
    100%  { transform: scale(2) rotate(360deg); opacity: 0; }
  }

  @keyframes fadeInUp {
    from { transform: translateY(10px); opacity: 0; }
    to   { transform: translateY(0); opacity: 1; }
  }

  @keyframes scaleIn {
    from { transform: scale(0.85); opacity: 0; }
    to   { transform: scale(1); opacity: 1; }
  }

  @keyframes hatBounce {
    0%, 100% { transform: rotate(8deg) translateY(0); }
    50%       { transform: rotate(12deg) translateY(-2px); }
  }

  @keyframes shrinkBar {
    from { transform: scaleX(1); }
    to   { transform: scaleX(0); }
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  @keyframes queenExplosion {
    0%   { transform: scale(1) rotate(0deg); filter: brightness(1); }
    25%  { transform: scale(1.5) rotate(10deg); filter: brightness(3) hue-rotate(45deg); }
    50%  { transform: scale(0.7) rotate(-5deg); filter: brightness(1.5); }
    75%  { transform: scale(1.2) rotate(8deg); opacity: 0.6; }
    100% { transform: scale(0) rotate(30deg); opacity: 0; }
  }

  @keyframes sparkFly {
    0%   { transform: translate(0,0) scale(1) rotate(0deg); opacity: 1; }
    100% { transform: translate(var(--dx), var(--dy)) scale(0) rotate(var(--dr)); opacity: 0; }
  }

  @keyframes knightJump {
    0%   { transform: translateY(0) scale(1); }
    30%  { transform: translateY(-20px) scale(1.1); }
    60%  { transform: translateY(-8px) scale(1.05); }
    100% { transform: translateY(0) scale(1); }
  }

  @keyframes victimSpin {
    0%   { transform: scale(1) rotate(0deg); opacity: 1; }
    30%  { transform: scale(1.1) rotate(90deg); opacity: 0.9; }
    70%  { transform: scale(0.5) rotate(540deg) translateY(-30px); opacity: 0.4; }
    100% { transform: scale(0) rotate(1080deg) translateY(-60px); opacity: 0; }
  }

  @keyframes bishopStrike {
    0%   { transform: rotate(-10deg) scale(1); }
    20%  { transform: rotate(15deg) scale(1.2); filter: brightness(2); }
    40%  { transform: rotate(-5deg) scale(1.1); }
    100% { transform: rotate(0deg) scale(1); }
  }

  .board-3d-wrapper {
    transform: perspective(900px) rotateX(5deg);
    transform-style: preserve-3d;
    transition: transform 0.4s ease;
  }

  .board-3d-wrapper:hover {
    transform: perspective(900px) rotateX(3deg);
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--color-bg-secondary); }
  ::-webkit-scrollbar-thumb { background: var(--color-board-dark); border-radius: 3px; }

  .piece-3d {
    filter: drop-shadow(2px 4px 6px rgba(90,60,20,0.35));
    transition: filter 0.2s, transform 0.2s;
  }

  .piece-3d:hover {
    filter: drop-shadow(3px 6px 10px rgba(90,60,20,0.5)) drop-shadow(0 0 6px rgba(255,215,0,0.3));
    transform: translateY(-2px) scale(1.05);
  }

  /* Animation classes for pieces */
  .piece-idle {
    animation: cuteWobble 2.5s ease-in-out infinite;
  }

  .piece-selected-anim {
    animation: excitedShake 0.4s ease-in-out infinite, selectedPulse 0.8s ease-in-out infinite;
  }

  .piece-legal-target {
    animation: cuteBounce 1s ease-in-out infinite;
  }

  /* Impact frame container */
  .impact-overlay {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 100;
  }

  .impact-shake {
    animation: impactShake 0.3s ease-out;
  }

  .screen-flash {
    animation: screenFlash 0.4s ease-out forwards;
  }

  .impact-ring {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: 6px solid rgba(255,215,0,0.9);
    animation: impactRing 0.5s ease-out forwards;
  }

  .star-burst {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 40px;
    height: 40px;
    transform: translate(-50%, -50%);
    animation: starBurst 0.6s ease-out forwards;
  }

  .board-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: var(--color-text-muted);
    user-select: none;
    line-height: 1;
  }

  .cinema-quote {
    font-family: 'Caveat', cursive;
    font-size: 16px;
    font-style: italic;
    color: var(--color-text-muted);
    line-height: 1.5;
  }

  .move-row {
    display: grid;
    grid-template-columns: 28px 1fr 1fr;
    gap: 8px;
    padding: 3px 0;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    border-radius: 4px;
    transition: background 0.15s;
  }

  .move-row:hover { background: var(--color-bg-secondary); }
  .move-row.current { background: rgba(255,213,0,0.2); }

  .btn-primary {
    padding: 10px 20px;
    background: var(--color-board-dark);
    color: #fff;
    border: none;
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s, transform 0.1s;
  }

  .btn-primary:hover { background: #b07840; transform: translateY(-1px); }
  .btn-primary:active { transform: translateY(0); }

  .btn-secondary {
    padding: 10px 20px;
    background: transparent;
    color: var(--color-board-dark);
    border: 2px solid var(--color-board-dark);
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-secondary:hover { background: rgba(200,149,95,0.1); }

  @keyframes thinkingDot {
    0%, 80%, 100% { transform: scale(0); opacity: 0; }
    40%            { transform: scale(1); opacity: 1; }
  }

  .thinking-dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--color-board-dark);
    animation: thinkingDot 1.4s infinite ease-in-out;
  }

  .promotion-piece {
    cursor: pointer;
    transition: transform 0.2s, filter 0.2s;
    padding: 8px;
    border-radius: 8px;
    border: 2px solid transparent;
  }

  .promotion-piece:hover {
    transform: scale(1.1) translateY(-4px);
    border-color: var(--color-hat-gold);
    background: rgba(255,215,0,0.1);
  }
`;

// ============================================================
//  SECTION 2: CHESS LOGIC ENGINE
// ============================================================

const FILES_ARR = ['a','b','c','d','e','f','g','h'];
const RANKS_ARR = ['1','2','3','4','5','6','7','8'];

const PIECE_VALUES: Record<string, number> = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };

const PAWN_TABLE = [
  [0,0,0,0,0,0,0,0],
  [50,50,50,50,50,50,50,50],
  [10,10,20,30,30,20,10,10],
  [5,5,10,25,25,10,5,5],
  [0,0,0,20,20,0,0,0],
  [5,-5,-10,0,0,-10,-5,5],
  [5,10,10,-20,-20,10,10,5],
  [0,0,0,0,0,0,0,0]
];

const KNIGHT_TABLE = [
  [-50,-40,-30,-30,-30,-30,-40,-50],
  [-40,-20,0,0,0,0,-20,-40],
  [-30,0,10,15,15,10,0,-30],
  [-30,5,15,20,20,15,5,-30],
  [-30,0,15,20,20,15,0,-30],
  [-30,5,10,15,15,10,5,-30],
  [-40,-20,0,5,5,0,-20,-40],
  [-50,-40,-30,-30,-30,-30,-40,-50]
];

const BISHOP_TABLE = [
  [-20,-10,-10,-10,-10,-10,-10,-20],
  [-10,0,0,0,0,0,0,-10],
  [-10,0,5,10,10,5,0,-10],
  [-10,5,5,10,10,5,5,-10],
  [-10,0,10,10,10,10,0,-10],
  [-10,10,10,10,10,10,10,-10],
  [-10,5,0,0,0,0,5,-10],
  [-20,-10,-10,-10,-10,-10,-10,-20]
];

const ROOK_TABLE = [
  [0,0,0,0,0,0,0,0],
  [5,10,10,10,10,10,10,5],
  [-5,0,0,0,0,0,0,-5],
  [-5,0,0,0,0,0,0,-5],
  [-5,0,0,0,0,0,0,-5],
  [-5,0,0,0,0,0,0,-5],
  [-5,0,0,0,0,0,0,-5],
  [0,0,0,5,5,0,0,0]
];

const QUEEN_TABLE = [
  [-20,-10,-10,-5,-5,-10,-10,-20],
  [-10,0,0,0,0,0,0,-10],
  [-10,0,5,5,5,5,0,-10],
  [-5,0,5,5,5,5,0,-5],
  [0,0,5,5,5,5,0,-5],
  [-10,5,5,5,5,5,0,-10],
  [-10,0,5,0,0,0,0,-10],
  [-20,-10,-10,-5,-5,-10,-10,-20]
];

const KING_MIDDLE_TABLE = [
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-20,-30,-30,-40,-40,-30,-30,-20],
  [-10,-20,-20,-20,-20,-20,-20,-10],
  [20,20,0,0,0,0,20,20],
  [20,30,10,0,0,10,30,20]
];

interface Piece {
  type: string;
  color: string;
}

interface Move {
  from: string;
  to: string;
  piece: string;
  color: string;
  captured?: string;
  promotion?: string;
  castle?: string;
  enPassant?: boolean;
  doublePush?: boolean;
}

function sqToCoords(sq: string): { file: number; rank: number } {
  const file = FILES_ARR.indexOf(sq[0]);
  const rank = parseInt(sq[1]) - 1;
  return { file, rank };
}

function coordsToSq(file: number, rank: number): string | null {
  if (file < 0 || file > 7 || rank < 0 || rank > 7) return null;
  return FILES_ARR[file] + RANKS_ARR[rank];
}

class ChessGame {
  board: Record<string, Piece>;
  turn: string;
  castlingRights: Record<string, Record<string, boolean>>;
  enPassantSquare: string | null;
  halfMoveClock: number;
  fullMoveNumber: number;
  history: Move[];
  positionHistory: string[];

  constructor() {
    this.board = this._initBoard();
    this.turn = 'w';
    this.castlingRights = { w: { k: true, q: true }, b: { k: true, q: true } };
    this.enPassantSquare = null;
    this.halfMoveClock = 0;
    this.fullMoveNumber = 1;
    this.history = [];
    this.positionHistory = [];
    this._updatePositionHistory();
  }

  _initBoard(): Record<string, Piece> {
    const board: Record<string, Piece> = {};
    const backRankPieces = ['r','n','b','q','k','b','n','r'];
    FILES_ARR.forEach((f, i) => {
      board[f+'8'] = { type: backRankPieces[i], color: 'b' };
      board[f+'7'] = { type: 'p', color: 'b' };
      board[f+'2'] = { type: 'p', color: 'w' };
      board[f+'1'] = { type: backRankPieces[i], color: 'w' };
    });
    return board;
  }

  clone(): ChessGame {
    const g = new ChessGame();
    g.board = { ...this.board };
    g.turn = this.turn;
    g.castlingRights = {
      w: { ...this.castlingRights.w },
      b: { ...this.castlingRights.b }
    };
    g.enPassantSquare = this.enPassantSquare;
    g.halfMoveClock = this.halfMoveClock;
    g.fullMoveNumber = this.fullMoveNumber;
    g.history = [...this.history];
    g.positionHistory = [...this.positionHistory];
    return g;
  }

  get(sq: string): Piece | null { return this.board[sq] || null; }

  _updatePositionHistory(): void {
    const key = JSON.stringify(this.board) + this.turn;
    this.positionHistory.push(key);
  }

  _isOnBoard(file: number, rank: number): boolean {
    return file >= 0 && file <= 7 && rank >= 0 && rank <= 7;
  }

  _getPseudoLegalMoves(sq: string): Move[] {
    const piece = this.board[sq];
    if (!piece) return [];
    const { file, rank } = sqToCoords(sq);
    const moves: Move[] = [];
    const color = piece.color;
    const opp = color === 'w' ? 'b' : 'w';
    const dir = color === 'w' ? 1 : -1;

    const addSliding = (dirs: number[][]) => {
      for (const [df, dr] of dirs) {
        let cf = file + df, cr = rank + dr;
        while (this._isOnBoard(cf, cr)) {
          const toSq = coordsToSq(cf, cr);
          if (!toSq) break;
          const target = this.board[toSq];
          if (target) {
            if (target.color !== color) {
              moves.push({ from: sq, to: toSq, piece: piece.type, color, captured: target.type });
            }
            break;
          }
          moves.push({ from: sq, to: toSq, piece: piece.type, color });
          cf += df; cr += dr;
        }
      }
    };

    switch (piece.type) {
      case 'p': {
        const fwd = coordsToSq(file, rank + dir);
        if (fwd && !this.board[fwd]) {
          const isPromo = (color === 'w' && rank + dir === 7) || (color === 'b' && rank + dir === 0);
          if (isPromo) {
            for (const promo of ['q','r','b','n']) {
              moves.push({ from: sq, to: fwd, piece: 'p', color, promotion: promo });
            }
          } else {
            moves.push({ from: sq, to: fwd, piece: 'p', color });
          }
          const startRank = color === 'w' ? 1 : 6;
          if (rank === startRank) {
            const dbl = coordsToSq(file, rank + dir * 2);
            if (dbl && !this.board[dbl]) {
              moves.push({ from: sq, to: dbl, piece: 'p', color, doublePush: true });
            }
          }
        }
        for (const cf of [file - 1, file + 1]) {
          const capSq = coordsToSq(cf, rank + dir);
          if (!capSq) continue;
          const target = this.board[capSq];
          if (target && target.color === opp) {
            const isPromo = (color === 'w' && rank + dir === 7) || (color === 'b' && rank + dir === 0);
            if (isPromo) {
              for (const promo of ['q','r','b','n']) {
                moves.push({ from: sq, to: capSq, piece: 'p', color, captured: target.type, promotion: promo });
              }
            } else {
              moves.push({ from: sq, to: capSq, piece: 'p', color, captured: target.type });
            }
          }
          if (capSq === this.enPassantSquare) {
            moves.push({ from: sq, to: capSq, piece: 'p', color, captured: 'p', enPassant: true });
          }
        }
        break;
      }
      case 'n': {
        const knightMoves = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
        for (const [df, dr] of knightMoves) {
          const nf = file + df, nr = rank + dr;
          if (!this._isOnBoard(nf, nr)) continue;
          const toSq = coordsToSq(nf, nr);
          if (!toSq) continue;
          const target = this.board[toSq];
          if (!target || target.color !== color) {
            moves.push({ from: sq, to: toSq, piece: 'n', color, captured: target?.type });
          }
        }
        break;
      }
      case 'b': addSliding([[-1,-1],[-1,1],[1,-1],[1,1]]); break;
      case 'r': addSliding([[-1,0],[1,0],[0,-1],[0,1]]); break;
      case 'q': addSliding([[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]]); break;
      case 'k': {
        const kingMoves = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
        for (const [df, dr] of kingMoves) {
          const kf = file + df, kr = rank + dr;
          if (!this._isOnBoard(kf, kr)) continue;
          const toSq = coordsToSq(kf, kr);
          if (!toSq) continue;
          const target = this.board[toSq];
          if (!target || target.color !== color) {
            moves.push({ from: sq, to: toSq, piece: 'k', color, captured: target?.type });
          }
        }
        const backRank = color === 'w' ? 0 : 7;
        if (rank === backRank && file === 4) {
          if (this.castlingRights[color].k) {
            const f5 = coordsToSq(5, backRank);
            const f6 = coordsToSq(6, backRank);
            const rook = coordsToSq(7, backRank);
            if (f5 && f6 && rook && !this.board[f5] && !this.board[f6] && this.board[rook]?.type === 'r' && this.board[rook]?.color === color) {
              moves.push({ from: sq, to: f6, piece: 'k', color, castle: 'k' });
            }
          }
          if (this.castlingRights[color].q) {
            const f3 = coordsToSq(3, backRank);
            const f2 = coordsToSq(2, backRank);
            const f1 = coordsToSq(1, backRank);
            const rook = coordsToSq(0, backRank);
            if (f3 && f2 && f1 && rook && !this.board[f3] && !this.board[f2] && !this.board[f1] && this.board[rook]?.type === 'r' && this.board[rook]?.color === color) {
              moves.push({ from: sq, to: f2, piece: 'k', color, castle: 'q' });
            }
          }
        }
        break;
      }
    }
    return moves;
  }

  _isSquareAttackedBy(sq: string, attackerColor: string): boolean {
    for (const s of Object.keys(this.board)) {
      const p = this.board[s];
      if (!p || p.color !== attackerColor) continue;
      const moves = this._getPseudoLegalMoves(s);
      if (moves.some(m => m.to === sq)) return true;
    }
    return false;
  }

  _findKing(color: string): string | null {
    for (const sq of Object.keys(this.board)) {
      const p = this.board[sq];
      if (p && p.type === 'k' && p.color === color) return sq;
    }
    return null;
  }

  _isInCheck(color: string): boolean {
    const kingSq = this._findKing(color);
    if (!kingSq) return false;
    const opp = color === 'w' ? 'b' : 'w';
    return this._isSquareAttackedBy(kingSq, opp);
  }

  _applyMoveToBoard(move: Move): Record<string, Piece> {
    const newBoard = { ...this.board };
    const piece = newBoard[move.from];
    delete newBoard[move.from];
    newBoard[move.to] = move.promotion ? { type: move.promotion, color: piece.color } : { ...piece };
    if (move.enPassant) {
      const epRank = piece.color === 'w' ? parseInt(move.to[1]) - 1 : parseInt(move.to[1]) + 1;
      delete newBoard[move.to[0] + epRank];
    }
    if (move.castle) {
      const backRank = piece.color === 'w' ? '1' : '8';
      if (move.castle === 'k') {
        newBoard['f' + backRank] = newBoard['h' + backRank];
        delete newBoard['h' + backRank];
      } else {
        newBoard['d' + backRank] = newBoard['a' + backRank];
        delete newBoard['a' + backRank];
      }
    }
    return newBoard;
  }

  getLegalMoves(sq: string): Move[] {
    const piece = this.board[sq];
    if (!piece || piece.color !== this.turn) return [];
    const pseudo = this._getPseudoLegalMoves(sq);
    return pseudo.filter(move => {
      if (move.castle) {
        const color = piece.color;
        const opp = color === 'w' ? 'b' : 'w';
        const backRank = color === 'w' ? 0 : 7;
        const pathSqs = move.castle === 'k'
          ? [coordsToSq(4, backRank), coordsToSq(5, backRank), coordsToSq(6, backRank)]
          : [coordsToSq(4, backRank), coordsToSq(3, backRank), coordsToSq(2, backRank)];
        const savedBoard = this.board;
        for (const pathSq of pathSqs) {
          if (!pathSq) continue;
          this.board = this._applyMoveToBoard({ from: sq, to: pathSq, piece: 'k', color });
          const attacked = this._isSquareAttackedBy(pathSq, opp);
          this.board = savedBoard;
          if (attacked) return false;
        }
      }
      const savedBoard = this.board;
      this.board = this._applyMoveToBoard(move);
      const inCheck = this._isInCheck(piece.color);
      this.board = savedBoard;
      return !inCheck;
    });
  }

  getAllLegalMoves(): Move[] {
    const moves: Move[] = [];
    for (const sq of Object.keys(this.board)) {
      if (this.board[sq]?.color === this.turn) {
        moves.push(...this.getLegalMoves(sq));
      }
    }
    return moves;
  }

  move(from: string, to: string, promotion: string = 'q'): Move | null {
    const legalMoves = this.getLegalMoves(from);
    const move = legalMoves.find(m => m.to === to && (!m.promotion || m.promotion === promotion));
    if (!move) return null;

    this.board = this._applyMoveToBoard(move);

    if (move.piece === 'k') {
      this.castlingRights[move.color] = { k: false, q: false };
    }
    if (move.piece === 'r') {
      if (from === 'a1') this.castlingRights.w.q = false;
      if (from === 'h1') this.castlingRights.w.k = false;
      if (from === 'a8') this.castlingRights.b.q = false;
      if (from === 'h8') this.castlingRights.b.k = false;
    }
    if (move.captured === 'r') {
      if (to === 'a1') this.castlingRights.w.q = false;
      if (to === 'h1') this.castlingRights.w.k = false;
      if (to === 'a8') this.castlingRights.b.q = false;
      if (to === 'h8') this.castlingRights.b.k = false;
    }

    this.enPassantSquare = move.doublePush
      ? coordsToSq(sqToCoords(from).file, (sqToCoords(from).rank + sqToCoords(to).rank) / 2)
      : null;

    this.halfMoveClock = (move.captured || move.piece === 'p') ? 0 : this.halfMoveClock + 1;
    if (this.turn === 'b') this.fullMoveNumber++;
    this.turn = this.turn === 'w' ? 'b' : 'w';
    this.history.push(move);
    this._updatePositionHistory();
    return move;
  }

  inCheck(): boolean { return this._isInCheck(this.turn); }
  isCheckmate(): boolean {
    if (!this.inCheck()) return false;
    return this.getAllLegalMoves().length === 0;
  }
  isStalemate(): boolean {
    if (this.inCheck()) return false;
    return this.getAllLegalMoves().length === 0;
  }
  isDraw(): boolean {
    if (this.isStalemate()) return true;
    if (this.halfMoveClock >= 100) return true;
    const curKey = this.positionHistory[this.positionHistory.length - 1];
    const count = this.positionHistory.filter(k => k === curKey).length;
    if (count >= 3) return true;
    return false;
  }
  isGameOver(): boolean { return this.isCheckmate() || this.isDraw(); }
  getStatus(): string {
    if (this.isCheckmate()) return 'checkmate';
    if (this.isDraw()) return 'draw';
    if (this.inCheck()) return 'check';
    return 'playing';
  }
}

// ============================================================
//  SECTION 3: AI ENGINE — Minimax with Alpha-Beta Pruning
// ============================================================

function evaluateBoard(game: ChessGame): number {
  if (game.isCheckmate()) {
    return game.turn === 'w' ? -100000 : 100000;
  }
  if (game.isDraw()) return 0;

  let score = 0;
  for (const [sq, piece] of Object.entries(game.board)) {
    if (!piece) continue;
    const base = PIECE_VALUES[piece.type] || 0;
    const { file, rank } = sqToCoords(sq);
    let posBonus = 0;

    const tableRank = piece.color === 'w' ? (7 - rank) : rank;
    const tableFile = file;

    const getBonus = (table: number[][]) => table[tableRank]?.[tableFile] ?? 0;

    switch (piece.type) {
      case 'p': posBonus = getBonus(PAWN_TABLE); break;
      case 'n': posBonus = getBonus(KNIGHT_TABLE); break;
      case 'b': posBonus = getBonus(BISHOP_TABLE); break;
      case 'r': posBonus = getBonus(ROOK_TABLE); break;
      case 'q': posBonus = getBonus(QUEEN_TABLE); break;
      case 'k': posBonus = getBonus(KING_MIDDLE_TABLE); break;
    }

    const pieceScore = base + posBonus;
    score += piece.color === 'w' ? pieceScore : -pieceScore;
  }
  return score;
}

function minimax(game: ChessGame, depth: number, alpha: number, beta: number, maximizing: boolean): number {
  if (depth === 0 || game.isGameOver()) {
    return evaluateBoard(game);
  }

  const moves = game.getAllLegalMoves();

  moves.sort((a, b) => {
    const aScore = a.captured ? (PIECE_VALUES[a.captured] || 0) - (PIECE_VALUES[a.piece] || 0) / 10 : -100;
    const bScore = b.captured ? (PIECE_VALUES[b.captured] || 0) - (PIECE_VALUES[b.piece] || 0) / 10 : -100;
    return bScore - aScore;
  });

  if (maximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      const newGame = game.clone();
      newGame.move(move.from, move.to, move.promotion);
      const evalScore = minimax(newGame, depth - 1, alpha, beta, false);
      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      const newGame = game.clone();
      newGame.move(move.from, move.to, move.promotion);
      const evalScore = minimax(newGame, depth - 1, alpha, beta, true);
      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

function getBestMove(game: ChessGame, depth: number = 3): Move | null {
  const moves = game.getAllLegalMoves();
  if (moves.length === 0) return null;

  moves.sort((a, b) => {
    const aScore = a.captured ? (PIECE_VALUES[a.captured] || 0) : -50;
    const bScore = b.captured ? (PIECE_VALUES[b.captured] || 0) : -50;
    return bScore - aScore;
  });

  let bestMove: Move | null = null;
  let bestScore = game.turn === 'w' ? -Infinity : Infinity;
  const maximizing = game.turn === 'w';

  for (const move of moves) {
    const newGame = game.clone();
    newGame.move(move.from, move.to, move.promotion);
    const score = minimax(newGame, depth - 1, -Infinity, Infinity, !maximizing);

    if (maximizing ? score > bestScore : score < bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }
  return bestMove;
}

const AI_DEPTHS: Record<string, number> = { beginner: 1, easy: 2, medium: 3, hard: 4 };

// ============================================================
//  SECTION 4: SVG PIECE COMPONENTS
// ============================================================

function YarnTextureDefs({ id = "yarn" }: { id?: string }) {
  return (
    <defs>
      <filter id={id} x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.65 0.75" numOctaves="3" seed="2" result="noise"/>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.5" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
    </defs>
  );
}

function DetectiveHat({ cx, cy, size = 1 }: { cx: number; cy: number; size?: number }) {
  const s = size;
  return (
    <g transform={`translate(${cx}, ${cy}) scale(${s}) rotate(8)`} style={{ animation: 'hatBounce 4s ease-in-out infinite' }}>
      {/* Base brim - wider and more realistic */}
      <ellipse cx="0" cy="10" rx="12" ry="3.5" fill="#D4A84B" stroke="#8B6914" strokeWidth="0.4"/>
      <ellipse cx="0" cy="9" rx="11" ry="3" fill="#E8C054" stroke="none"/>

      {/* Main dome - more structured */}
      <path d="M -8,9 Q -9,2 -7,-4 Q -3,-10 0,-11 Q 3,-10 7,-4 Q 9,2 8,9 Z"
            fill="#E8C054" stroke="#8B6914" strokeWidth="0.5"/>

      {/* Front seam line */}
      <path d="M 0,-11 L 0,9" stroke="#8B6914" strokeWidth="0.4" strokeDasharray="1.5 1"/>

      {/* Checkered texture pattern */}
      <path d="M -5,-6 Q -4,-5 -3,-6 Q -2,-7 -1,-6" stroke="#C4A030" strokeWidth="0.3" fill="none"/>
      <path d="M 1,-6 Q 2,-5 3,-6 Q 4,-7 5,-6" stroke="#C4A030" strokeWidth="0.3" fill="none"/>
      <path d="M -4,-2 Q -3,-1 -2,-2 Q -1,-3 0,-2" stroke="#C4A030" strokeWidth="0.3" fill="none"/>
      <path d="M 0,-2 Q 1,-1 2,-2 Q 3,-3 4,-2" stroke="#C4A030" strokeWidth="0.3" fill="none"/>

      {/* Hat band - thick leather look */}
      <rect x="-8" y="3" width="16" height="4" fill="#3A2A00" rx="1"/>
      <rect x="-8" y="3" width="16" height="1.5" fill="#4A3500" rx="0.5"/>
      <line x1="-6" y1="5" x2="6" y2="5" stroke="#5A4000" strokeWidth="0.5"/>

      {/* Ear flaps tied up - characteristic deerstalker feature */}
      <path d="M -8,9 Q -12,11 -11,15 Q -9,17 -6,14 Q -5,11 -6,9 Z"
            fill="#D4A84B" stroke="#8B6914" strokeWidth="0.4"/>
      <path d="M 8,9 Q 12,11 11,15 Q 9,17 6,14 Q 5,11 6,9 Z"
            fill="#D4A84B" stroke="#8B6914" strokeWidth="0.4"/>

      {/* Tie strings at top */}
      <path d="M -2,0 Q -3,-4 0,-10" stroke="#8B6914" strokeWidth="0.6" fill="none"/>
      <path d="M 2,0 Q 3,-4 0,-10" stroke="#8B6914" strokeWidth="0.6" fill="none"/>
      <circle cx="0" cy="-10" r="1.5" fill="#8B6914"/>

      {/* Highlight for 3D effect */}
      <ellipse cx="-3" cy="-2" rx="4" ry="3" fill="rgba(255,255,255,0.2)" transform="rotate(-15)"/>

      {/* Button detail on flaps */}
      <circle cx="-8" cy="12" r="1" fill="#8B6914"/>
      <circle cx="8" cy="12" r="1" fill="#8B6914"/>
    </g>
  );
}

function YarnEyes({ cx, cy, size = 1 }: { cx: number; cy: number; size?: number }) {
  const d = 5 * size;
  return (
    <g>
      <circle cx={cx - d} cy={cy} r={2 * size} fill="#0A0A0A"/>
      <circle cx={cx + d} cy={cy} r={2 * size} fill="#0A0A0A"/>
      <circle cx={cx - d + 0.7 * size} cy={cy - 0.7 * size} r={0.6 * size} fill="rgba(255,255,255,0.7)"/>
      <circle cx={cx + d + 0.7 * size} cy={cy - 0.7 * size} r={0.6 * size} fill="rgba(255,255,255,0.7)"/>
    </g>
  );
}

function CrochetPawn({ color, size = 56, animState = 'idle' }: { color: string; size?: number; animState?: string }) {
  const fill = color === 'w' ? '#F5F0E8' : '#2C2C2C';
  const stroke = color === 'w' ? '#D4C9B0' : '#1A1A1A';

  return (
    <svg width={size} height={size} viewBox="0 0 56 56" className="piece-3d"
      style={{ animation: animState === 'idle' ? 'pieceFloat 3s ease-in-out infinite' : 'none',
               filter: `drop-shadow(2px 4px 6px rgba(90,60,20,0.4))` }}>
      <YarnTextureDefs id={`yarn-pawn-${color}`}/>
      <g filter={`url(#yarn-pawn-${color})`}>
        <ellipse cx="28" cy="38" rx="14" ry="10" fill={fill} stroke={stroke} strokeWidth="1.5" strokeDasharray="3 2"/>
        <circle cx="28" cy="26" r="12" fill={fill} stroke={stroke} strokeWidth="1.5" strokeDasharray="3 2"/>
        <ellipse cx="22" cy="34" rx="4" ry="3" fill="none" stroke={stroke} strokeWidth="0.8" opacity="0.4"/>
        <ellipse cx="34" cy="34" rx="4" ry="3" fill="none" stroke={stroke} strokeWidth="0.8" opacity="0.4"/>
        <ellipse cx="28" cy="42" rx="5" ry="3" fill="none" stroke={stroke} strokeWidth="0.8" opacity="0.4"/>
      </g>
      <YarnEyes cx={28} cy={22} size={0.85}/>
      <path d="M 24,28 Q 28,32 32,28" stroke="#0A0A0A" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <line x1={20} y1={36} x2={36} y2={36} stroke={stroke} strokeWidth={1.2} strokeDasharray="3,2" opacity="0.5"/>
      <DetectiveHat cx={28} cy={12}/>
      <ellipse cx="28" cy="50" rx="12" ry="3" fill="rgba(90,60,20,0.25)"/>
    </svg>
  );
}

function CrochetRook({ color, size = 56, animState = 'idle' }: { color: string; size?: number; animState?: string }) {
  const fill = color === 'w' ? '#F5F0E8' : '#2C2C2C';
  const stroke = color === 'w' ? '#D4C9B0' : '#1A1A1A';

  return (
    <svg width={size} height={size} viewBox="0 0 56 56" className="piece-3d"
      style={{ animation: animState === 'idle' ? 'pieceFloat 3.3s ease-in-out infinite' : 'none',
               animationDelay: '0.4s',
               filter: `drop-shadow(2px 4px 6px rgba(90,60,20,0.4))` }}>
      <YarnTextureDefs id={`yarn-rook-${color}`}/>
      <g filter={`url(#yarn-rook-${color})`}>
        <rect x="14" y="24" width="28" height="22" rx="3" fill={fill} stroke={stroke} strokeWidth="1.5" strokeDasharray="3 2"/>
        <rect x="13" y="18" width="7" height="8" rx="2" fill={fill} stroke={stroke} strokeWidth="1.5" strokeDasharray="3 2"/>
        <rect x="24" y="18" width="8" height="8" rx="2" fill={fill} stroke={stroke} strokeWidth="1.5" strokeDasharray="3 2"/>
        <rect x="36" y="18" width="7" height="8" rx="2" fill={fill} stroke={stroke} strokeWidth="1.5" strokeDasharray="3 2"/>
        <rect x="23" y="32" width="10" height="8" rx="2" fill={color === 'w' ? '#B8A888' : '#0A0A0A'} opacity="0.5"/>
        <line x1="14" y1="30" x2="42" y2="30" stroke={stroke} strokeWidth="0.8" strokeDasharray="3 2" opacity="0.5"/>
        <line x1="14" y1="36" x2="42" y2="36" stroke={stroke} strokeWidth="0.8" strokeDasharray="3 2" opacity="0.5"/>
        <line x1="14" y1="42" x2="42" y2="42" stroke={stroke} strokeWidth="0.8" strokeDasharray="3 2" opacity="0.5"/>
      </g>
      <YarnEyes cx={28} cy={27} size={0.8}/>
      <path d="M 24,31 Q 28,34 32,31" stroke="#0A0A0A" strokeWidth="1" fill="none" strokeLinecap="round"/>
      <DetectiveHat cx={28} cy={14}/>
      <ellipse cx="28" cy="50" rx="12" ry="3" fill="rgba(90,60,20,0.25)"/>
    </svg>
  );
}

function CrochetKnight({ color, size = 56, animState = 'idle', flipped = false }: { color: string; size?: number; animState?: string; flipped?: boolean }) {
  const fill = color === 'w' ? '#F5F0E8' : '#2C2C2C';
  const stroke = color === 'w' ? '#D4C9B0' : '#1A1A1A';
  const flip = flipped ? 'scale(-1,1) translate(-56,0)' : '';

  return (
    <svg width={size} height={size} viewBox="0 0 56 56" className="piece-3d"
      style={{ animation: animState === 'idle' ? 'pieceFloat 2.8s ease-in-out infinite' : 'none',
               animationDelay: '0.8s',
               filter: `drop-shadow(2px 4px 6px rgba(90,60,20,0.4))` }}>
      <YarnTextureDefs id={`yarn-knight-${color}`}/>
      <g filter={`url(#yarn-knight-${color})`} transform={flip}>
        <rect x="18" y="30" width="20" height="16" rx="4" fill={fill} stroke={stroke} strokeWidth="1.5" strokeDasharray="3 2"/>
        <ellipse cx="30" cy="20" rx="12" ry="10" fill={fill} stroke={stroke} strokeWidth="1.5" strokeDasharray="3 2"/>
        <ellipse cx="38" cy="24" rx="6" ry="5" fill={fill} stroke={stroke} strokeWidth="1.2" strokeDasharray="3 2"/>
        <ellipse cx="22" cy="12" rx="4" ry="6" fill={fill} stroke={stroke} strokeWidth="1.2" strokeDasharray="3 2"/>
        <circle cx="20" cy="16" r="4" fill={fill} stroke={stroke} strokeWidth="1" strokeDasharray="2 2"/>
        <circle cx="18" cy="22" r="3.5" fill={fill} stroke={stroke} strokeWidth="1" strokeDasharray="2 2"/>
        <circle cx="40" cy="26" r="1.5" fill={color === 'w' ? '#B8A888' : '#0A0A0A'} opacity="0.6"/>
      </g>
      <circle cx={flipped ? 20 : 36} cy={16} r={2} fill="#0A0A0A"/>
      <circle cx={flipped ? 20.7 : 36.7} cy={15.3} r={0.6} fill="rgba(255,255,255,0.7)"/>
      <DetectiveHat cx={flipped ? 28 : 26} cy={8}/>
      <ellipse cx="28" cy="50" rx="12" ry="3" fill="rgba(90,60,20,0.25)"/>
    </svg>
  );
}

function CrochetBishop({ color, size = 56, animState = 'idle' }: { color: string; size?: number; animState?: string }) {
  const fill = color === 'w' ? '#F5F0E8' : '#2C2C2C';
  const stroke = color === 'w' ? '#D4C9B0' : '#1A1A1A';

  return (
    <svg width={size} height={size} viewBox="0 0 56 56" className="piece-3d"
      style={{ animation: animState === 'idle' ? 'pieceFloat 3.6s ease-in-out infinite' : 'none',
               animationDelay: '1.2s',
               filter: `drop-shadow(2px 4px 6px rgba(90,60,20,0.4))` }}>
      <YarnTextureDefs id={`yarn-bishop-${color}`}/>
      <g filter={`url(#yarn-bishop-${color})`}>
        <path d="M 16,46 Q 14,34 20,22 Q 28,10 36,22 Q 42,34 40,46 Z" fill={fill} stroke={stroke} strokeWidth="1.5" strokeDasharray="3 2"/>
        <ellipse cx="28" cy="38" rx="13" ry="5" fill={fill} stroke={stroke} strokeWidth="1.2" strokeDasharray="3 2"/>
        <circle cx="28" cy="20" r="9" fill={fill} stroke={stroke} strokeWidth="1.2" strokeDasharray="3 2"/>
        <path d="M 24,14 Q 28,8 32,14" fill={fill} stroke={stroke} strokeWidth="1.2" strokeDasharray="3 2"/>
        <line x1="22" y1="28" x2="34" y2="28" stroke={stroke} strokeWidth="1" strokeDasharray="2 2" opacity="0.5"/>
        <line x1="28" y1="24" x2="28" y2="36" stroke={stroke} strokeWidth="1" strokeDasharray="2 2" opacity="0.5"/>
      </g>
      <YarnEyes cx={28} cy={18} size={0.8}/>
      <path d="M 24,23 Q 28,26 32,23" stroke="#0A0A0A" strokeWidth="1" fill="none" strokeLinecap="round"/>
      <DetectiveHat cx={28} cy={9}/>
      <ellipse cx="28" cy="50" rx="11" ry="2.5" fill="rgba(90,60,20,0.25)"/>
    </svg>
  );
}

function CrochetQueen({ color, size = 56, animState = 'idle' }: { color: string; size?: number; animState?: string }) {
  const fill = color === 'w' ? '#F5F0E8' : '#2C2C2C';
  const stroke = color === 'w' ? '#D4C9B0' : '#1A1A1A';
  const accent = '#FFD700';

  return (
    <svg width={size} height={size} viewBox="0 0 56 56" className="piece-3d"
      style={{ animation: animState === 'idle' ? 'pieceFloat 4s ease-in-out infinite' : 'none',
               animationDelay: '0.2s',
               filter: `drop-shadow(2px 4px 6px rgba(90,60,20,0.4)) drop-shadow(0 0 4px rgba(255,215,0,0.3))` }}>
      <YarnTextureDefs id={`yarn-queen-${color}`}/>
      <g filter={`url(#yarn-queen-${color})`}>
        <path d="M 8,48 Q 10,32 20,26 Q 28,22 36,26 Q 46,32 48,48 Z" fill={fill} stroke={stroke} strokeWidth="1.5" strokeDasharray="3 2"/>
        <ellipse cx="28" cy="28" rx="12" ry="8" fill={fill} stroke={stroke} strokeWidth="1.2" strokeDasharray="3 2"/>
        <circle cx="28" cy="20" r="10" fill={fill} stroke={stroke} strokeWidth="1.5" strokeDasharray="3 2"/>
        <path d="M 18,20 L 20,14 L 24,18 L 28,12 L 32,18 L 36,14 L 38,20 Z" fill={accent} stroke="#B8860B" strokeWidth="0.8"/>
        <path d="M 10,36 Q 28,32 46,36" stroke={stroke} strokeWidth="0.8" strokeDasharray="3 2" fill="none" opacity="0.5"/>
        <path d="M 8,44 Q 28,40 48,44" stroke={stroke} strokeWidth="0.8" strokeDasharray="3 2" fill="none" opacity="0.5"/>
        <circle cx="28" cy="30" r="3" fill={accent} opacity="0.8"/>
      </g>
      <YarnEyes cx={28} cy={17} size={0.9}/>
      <path d="M 23,22 Q 28,26 33,22" stroke="#0A0A0A" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <DetectiveHat cx={28} cy={7}/>
      <ellipse cx="28" cy="51" rx="16" ry="3.5" fill="rgba(90,60,20,0.3)"/>
    </svg>
  );
}

function CrochetKing({ color, size = 56, animState = 'idle' }: { color: string; size?: number; animState?: string }) {
  const fill = color === 'w' ? '#F5F0E8' : '#2C2C2C';
  const stroke = color === 'w' ? '#D4C9B0' : '#1A1A1A';
  const accent = '#FFD700';

  return (
    <svg width={size} height={size} viewBox="0 0 56 56" className="piece-3d"
      style={{ animation: animState === 'idle' ? 'pieceFloat 3.5s ease-in-out infinite' : 'none',
               filter: `drop-shadow(2px 4px 6px rgba(90,60,20,0.4)) drop-shadow(0 0 6px rgba(255,215,0,0.4))` }}>
      <YarnTextureDefs id={`yarn-king-${color}`}/>
      <g filter={`url(#yarn-king-${color})`}>
        <path d="M 14,48 Q 12,32 18,20 Q 28,14 38,20 Q 44,32 42,48 Z" fill={fill} stroke={stroke} strokeWidth="1.5" strokeDasharray="3 2"/>
        <circle cx="28" cy="18" r="11" fill={fill} stroke={stroke} strokeWidth="1.5" strokeDasharray="3 2"/>
        <line x1="22" y1="30" x2="34" y2="30" stroke={accent} strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="28" y1="24" x2="28" y2="38" stroke={accent} strokeWidth="2.5" strokeLinecap="round"/>
        <ellipse cx="28" cy="30" rx="14" ry="4" fill={fill} stroke={stroke} strokeWidth="1" strokeDasharray="3 2"/>
        <path d="M 14,46 Q 28,42 42,46" stroke={accent} strokeWidth="1.5" fill="none" opacity="0.7"/>
      </g>
      <YarnEyes cx={28} cy={15} size={0.95}/>
      <path d="M 22,21 Q 28,25 34,21" stroke="#0A0A0A" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <DetectiveHat cx={28} cy={4}/>
      <ellipse cx="28" cy="51" rx="14" ry="3" fill="rgba(90,60,20,0.28)"/>
    </svg>
  );
}

function CrochetPiece({ type, color, size = 56, animState = 'idle', flipped = false }: { type: string; color: string; size?: number; animState?: string; flipped?: boolean }) {
  const props = { color, size, animState, flipped };
  switch (type) {
    case 'p': return <CrochetPawn {...props}/>;
    case 'r': return <CrochetRook {...props}/>;
    case 'n': return <CrochetKnight {...props}/>;
    case 'b': return <CrochetBishop {...props}/>;
    case 'q': return <CrochetQueen {...props}/>;
    case 'k': return <CrochetKing {...props}/>;
    default:  return null;
  }
}

// ============================================================
//  SECTION 5: CAPTURE ANIMATION COMPONENTS
// ============================================================

function GoldSparks({ active, onDone }: { active: boolean; onDone?: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;
    const container = containerRef.current;
    container.innerHTML = '';
    for (let i = 0; i < 16; i++) {
      const spark = document.createElement('div');
      const angle = (i / 16) * 360;
      const dist = 50 + Math.random() * 60;
      const dx = Math.cos((angle * Math.PI) / 180) * dist;
      const dy = Math.sin((angle * Math.PI) / 180) * dist;
      const dr = (Math.random() - 0.5) * 720;
      const size = 4 + Math.random() * 6;
      spark.style.cssText = `
        position:absolute; width:${size}px; height:${size}px;
        background:${Math.random() > 0.5 ? '#FFD700' : '#FFA500'};
        border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
        top:50%; left:50%; margin-left:-${size/2}px; margin-top:-${size/2}px;
        --dx:${dx}px; --dy:${dy}px; --dr:${dr}deg;
        animation:sparkFly ${0.5 + Math.random() * 0.4}s ease-out forwards;
        animation-delay:${Math.random() * 0.1}s;
        box-shadow:0 0 6px #FFD700, 0 0 10px rgba(255,215,0,0.5);
      `;
      container.appendChild(spark);
    }
    const t = setTimeout(() => onDone?.(), 1000);
    return () => clearTimeout(t);
  }, [active, onDone]);

  return (
    <div ref={containerRef} style={{
      position:'absolute', inset:0, pointerEvents:'none',
      overflow:'visible', zIndex:60
    }}/>
  );
}

function TornadoEffect({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div style={{
      position:'absolute', inset:0, pointerEvents:'none',
      display:'flex', alignItems:'center', justifyContent:'center', zIndex:55
    }}>
      <div style={{
        width:40, height:60, position:'relative',
        animation:'tornadoBody 1s ease-in-out forwards'
      }}>
        {[0,1,2,3,4].map(i => (
          <div key={i} style={{
            position:'absolute',
            left:'50%',
            top: `${i * 12}px`,
            width: `${10 + i * 6}px`,
            height: '8px',
            background: 'rgba(180,140,80,0.5)',
            borderRadius: '50%',
            transform: 'translateX(-50%)',
            filter: 'blur(1px)',
            animation: `spin ${0.3 + i * 0.05}s linear infinite`
          }}/>
        ))}
      </div>
    </div>
  );
}

function WaterRipples({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div style={{position:'absolute', inset:0, pointerEvents:'none', zIndex:50}}>
      {[0, 200, 400].map((delay, i) => (
        <div key={i} style={{
          position:'absolute',
          top:'50%', left:'50%',
          transform:'translate(-50%,-50%)',
          width:40, height:40,
          borderRadius:'50%',
          border:'2px solid rgba(26,107,138,0.6)',
          background:'radial-gradient(circle, rgba(26,107,138,0.15) 0%, transparent 70%)',
          animation:`waterRipple 1.2s ease-out forwards`,
          animationDelay:`${delay}ms`
        }}/>
      ))}
    </div>
  );
}

function LightningFlash({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div style={{
      position:'absolute', inset:0, zIndex:70, pointerEvents:'none',
      background:'rgba(255,255,255,0.85)',
      animation:'boardFlash 0.12s ease-out forwards'
    }}/>
  );
}

// ============================================================
//  SECTION 6: CAPTURE CINEMA PANEL
// ============================================================

const FLAVOR_QUOTES: Record<string, string[]> = {
  p: ["The detective hat never lies.", "Even the small ones bite.", "Pawn takes. Game changes."],
  r: ["Yarn has no mercy.", "The tower melts. The threat remains.", "Castle falls. Thread unravels."],
  n: ["The horse danced. Chaos ensued.", "L-shaped logic, spiral-shaped justice.", "Knights don't ask. Knights take."],
  b: ["Diagonal and devastating.", "The bishop struck with holy yarn.", "God doesn't play chess. The bishop does."],
  q: ["The queen fires when she pleases.", "Your detective hat cannot save you.", "She came, she knitted, she conquered."],
  k: ["The king dissolves gracefully.", "Rare, but unstoppable.", "Adjacent. Lethal. Regal."]
};

const ANIMATION_LABELS: Record<string, string> = {
  p: "Yarn Kick", r: "Yarn Melt", n: "Tornado Vortex",
  b: "Thunder Strike", q: "Fireworks Volley", k: "Water Dissolution"
};

const PIECE_NAMES: Record<string, string> = {
  p: "Pawn", r: "Rook", n: "Knight", b: "Bishop", q: "Queen", k: "King"
};

const PIECE_EMOJIS: Record<string, string> = {
  p: "♟", r: "♜", n: "♞", b: "♝", q: "♛", k: "♚"
};

interface CaptureEvent {
  attacker: { type: string; color: string };
  victim: { type: string; color: string };
  timestamp: number;
}

function CaptureAnimation({ captureEvent }: { captureEvent: CaptureEvent }) {
  const { attacker, victim } = captureEvent;
  const [phase, setPhase] = useState(0);
  const [impactPhase, setImpactPhase] = useState(false);

  useEffect(() => {
    setPhase(0);
    setImpactPhase(false);
    const t1 = setTimeout(() => setPhase(1), 100);
    const t2 = setTimeout(() => setImpactPhase(true), 300);
    const t3 = setTimeout(() => setImpactPhase(false), 600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [captureEvent]);

  const getVictimAnim = (type: string): string => {
    switch(type) {
      case 'q': return 'queenExplosion 1s ease-out forwards';
      case 'p': return 'pawnKick 0.8s ease-out forwards';
      case 'r': return 'rookMelt 1s ease-out forwards';
      case 'n': return 'victimSpin 1s ease-out forwards';
      case 'b': return 'charCrumble 1s ease-out forwards';
      case 'k': return 'pieceDissolve 1.2s ease-out forwards';
      default:  return 'queenFire 1s ease-out forwards';
    }
  };

  const getAttackerAnim = (type: string): string => {
    switch(type) {
      case 'n': return 'knightJump 0.6s ease-out forwards';
      case 'b': return 'bishopStrike 0.6s ease-out forwards';
      default:  return 'cuteWobble 0.5s ease-out';
    }
  };

  return (
    <div
      className={impactPhase ? 'impact-shake' : ''}
      style={{
        position: 'relative',
        height: 140,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        background: 'linear-gradient(135deg, #1A1208 0%, #2C1A0A 100%)',
        borderRadius: 10,
        overflow: 'hidden',
        margin: '12px 0',
      }}
    >
      {/* Background stars */}
      {[...Array(18)].map((_, i) => (
        <div key={i} style={{
          position:'absolute',
          left:`${10 + (i * 5) % 80}%`,
          top:`${5 + (i * 7) % 80}%`,
          width: 2, height: 2,
          background:i % 3 === 0 ? 'rgba(255,215,0,0.6)' : 'rgba(255,255,255,0.3)',
          borderRadius:'50%',
          animation: `cuteWobble ${2 + i * 0.1}s ease-in-out infinite`
        }}/>
      ))}

      {/* Impact flash overlay */}
      {impactPhase && (
        <div className="screen-flash" style={{
          position: 'absolute',
          inset: 0,
          background: attacker.type === 'q' ? 'rgba(255,215,0,0.4)'
                   : attacker.type === 'b' ? 'rgba(100,200,255,0.4)'
                   : attacker.type === 'n' ? 'rgba(180,140,80,0.4)'
                   : 'rgba(255,255,255,0.3)',
          zIndex: 5
        }}/>
      )}

      {/* Impact ring */}
      {impactPhase && (
        <div className="impact-ring" style={{
          borderColor: attacker.type === 'q' ? 'rgba(255,215,0,0.9)'
                    : attacker.type === 'b' ? 'rgba(100,200,255,0.9)'
                    : 'rgba(255,150,50,0.9)'
        }}/>
      )}

      {/* Star burst on impact */}
      {impactPhase && (
        <div className="star-burst">
          <svg viewBox="0 0 40 40" style={{width: '100%', height: '100%'}}>
            <path d="M20,0 L23,15 L40,15 L27,24 L32,40 L20,31 L8,40 L13,24 L0,15 L17,15 Z"
              fill={attacker.type === 'q' ? '#FFD700' : attacker.type === 'b' ? '#88CCFF' : '#FFA500'}
              opacity="0.8"/>
          </svg>
        </div>
      )}

      {/* Attacker piece */}
      <div style={{
        transform:'scale(1.3)',
        animation: phase === 1 ? getAttackerAnim(attacker.type) : 'none',
        filter: impactPhase
          ? 'drop-shadow(0 0 15px rgba(255,215,0,0.9)) brightness(1.3)'
          : 'drop-shadow(0 0 8px rgba(255,215,0,0.6))',
        zIndex: 10
      }}>
        <CrochetPiece type={attacker.type} color={attacker.color} size={72} animState="static"/>
      </div>

      {/* Impact arrow/lightning */}
      <div style={{
        fontSize: 32,
        color: '#FFD700',
        textShadow: '0 0 15px #FFD700, 0 0 30px rgba(255,215,0,0.5)',
        transform: impactPhase ? 'scale(1.5)' : 'scale(1)',
        transition: 'transform 0.1s',
        zIndex: 10
      }}>
        {attacker.type === 'b' ? '⚡' : attacker.type === 'n' ? '🌀' : '💥'}
      </div>

      {/* Victim piece */}
      <div style={{
        animation: phase === 1 ? getVictimAnim(victim.type) : 'none',
        position:'relative',
        zIndex: 10
      }}>
        <CrochetPiece type={victim.type} color={victim.color} size={72} animState="static"/>
        {attacker.type === 'q' && phase === 1 && (
          <div style={{position:'absolute', inset:0}}>
            <GoldSparks active={true} onDone={() => {}}/>
          </div>
        )}
        {attacker.type === 'n' && phase === 1 && <TornadoEffect active={true}/>}
        {attacker.type === 'k' && phase === 1 && <WaterRipples active={true}/>}
      </div>

      {/* Animation label */}
      <div style={{
        position:'absolute', bottom:8, left:0, right:0, textAlign:'center',
        fontFamily:"'Caveat', cursive", fontSize:13, color:'rgba(255,215,0,0.7)',
        letterSpacing:1, textTransform:'uppercase'
      }}>
        {ANIMATION_LABELS[attacker.type]}
      </div>

      {attacker.type === 'b' && phase === 1 && <LightningFlash active={true}/>}
    </div>
  );
}

function CapturePanel({ captureEvent, moveHistory }: { captureEvent: CaptureEvent | null; moveHistory: Move[] }) {
  const [activeEvent, setActiveEvent] = useState<CaptureEvent | null>(null);
  const [barKey, setBarKey] = useState(0);

  useEffect(() => {
    if (!captureEvent) return;
    setActiveEvent(captureEvent);
    setBarKey(k => k + 1);
    const t = setTimeout(() => setActiveEvent(null), 4000);
    return () => clearTimeout(t);
  }, [captureEvent]);

  const quote = useMemo(() => {
    if (!activeEvent) return "";
    const quotes = FLAVOR_QUOTES[activeEvent.attacker.type] || ["The yarn speaks."];
    return quotes[Math.floor(Math.random() * quotes.length)];
  }, [activeEvent]);

  return (
    <div style={{
      background: 'var(--color-bg-panel)',
      border: '1px solid var(--color-panel-border)',
      borderRadius: 14,
      padding: '20px 18px',
      boxShadow: '0 4px 24px var(--color-shadow)',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }}>
      <div style={{display:'flex', alignItems:'center', gap:8}}>
        <span style={{fontSize:18}}>🎬</span>
        <span style={{
          fontFamily:"'Playfair Display', serif",
          fontWeight:700, fontSize:16,
          color:'var(--color-text-primary)'
        }}>Capture Cinema</span>
      </div>

      {activeEvent ? (
        <div style={{animation:'fadeInUp 0.3s ease forwards'}}>
          <div style={{
            display:'flex', alignItems:'center', justifyContent:'space-between',
            marginBottom:8
          }}>
            <span style={{
              fontFamily:"'DM Sans', sans-serif", fontWeight:500,
              fontSize:13, color:'var(--color-text-secondary)'
            }}>
              {PIECE_EMOJIS[activeEvent.attacker.type]} {PIECE_NAMES[activeEvent.attacker.type]}
              {' '}captures{' '}
              {PIECE_EMOJIS[activeEvent.victim.type]} {PIECE_NAMES[activeEvent.victim.type]}
            </span>
          </div>

          <CaptureAnimation captureEvent={activeEvent}/>

          <p className="cinema-quote" style={{marginBottom:12, fontSize:15}}>
            "{quote}"
          </p>

          <div style={{height:3, background:'var(--color-bg-secondary)', borderRadius:2, overflow:'hidden'}}>
            <div key={barKey} style={{
              height:'100%', background:'var(--color-hat-gold)',
              borderRadius:2, transformOrigin:'left',
              animation:'shrinkBar 3.5s linear forwards'
            }}/>
          </div>
        </div>
      ) : (
        <div style={{
          flex:1, display:'flex', flexDirection:'column',
          alignItems:'center', justifyContent:'center', gap:12,
          opacity:0.6
        }}>
          <span style={{fontSize:40}}>🧶</span>
          <p className="cinema-quote" style={{textAlign:'center', fontSize:14}}>
            Make a capture to see the show
          </p>
        </div>
      )}

      <div style={{borderTop:'1px solid var(--color-panel-border)', paddingTop:12}}>
        <p style={{
          fontFamily:"'DM Sans', sans-serif", fontWeight:500,
          fontSize:12, color:'var(--color-text-muted)', marginBottom:8,
          textTransform:'uppercase', letterSpacing:0.5
        }}>Move History</p>
        <div style={{maxHeight:160, overflowY:'auto'}}>
          {moveHistory.length === 0 ? (
            <p style={{fontSize:12, color:'var(--color-text-muted)', fontStyle:'italic'}}>No moves yet</p>
          ) : (
            Array.from({ length: Math.ceil(moveHistory.length / 2) }, (_, i) => {
              const wMove = moveHistory[i * 2];
              const bMove = moveHistory[i * 2 + 1];
              const isCurrentPair = i === Math.ceil(moveHistory.length / 2) - 1;
              return (
                <div key={i} className={`move-row ${isCurrentPair ? 'current' : ''}`}>
                  <span style={{color:'var(--color-text-muted)'}}>{i+1}.</span>
                  <span>{wMove ? `${PIECE_EMOJIS[wMove.piece]}${wMove.to}` : ''}</span>
                  <span>{bMove ? `${PIECE_EMOJIS[bMove.piece]}${bMove.to}` : ''}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
//  SECTION 7: BOARD SQUARE COMPONENT
// ============================================================

interface BoardSquareProps {
  sq: string;
  piece: Piece | null;
  isLight: boolean;
  isSelected: boolean;
  isLegalMove: boolean;
  isLastMove: boolean;
  isInCheck: boolean;
  onClick: () => void;
  squareSize: number;
  captureAnim: string | null;
}

function BoardSquare({ sq, piece, isLight, isSelected, isLegalMove, isLastMove, isInCheck, onClick, squareSize, captureAnim }: BoardSquareProps) {
  // Black and white squares with subtle texture
  const baseColor = isLight ? '#FFFFFF' : '#87CEEB';
  const altColor = isLight ? '#F8F8F8' : '#0A0A0A';
  const flipped = piece?.color === 'b';

  // Determine animation class for the piece
  const getAnimClass = () => {
    if (captureAnim) return '';
    if (isSelected) return 'piece-selected-anim';
    if (isLegalMove && piece) return 'piece-legal-target';
    return 'piece-idle';
  };

  return (
    <div
      onClick={onClick}
      style={{
        width: squareSize, height: squareSize,
        background: `linear-gradient(135deg, ${baseColor} 0%, ${altColor} 100%)`,
        position: 'relative',
        cursor: piece ? 'grab' : 'pointer',
        overflow: 'hidden',
        boxShadow: 'inset 0 0 0 1px rgba(128,128,128,0.1)'
      }}
    >
      {/* Subtle grain texture */}
      <div style={{
        position:'absolute', inset:0, pointerEvents:'none',
        opacity: 0.03,
        background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
      }}/>

      {isLastMove && (
        <div style={{
          position:'absolute', inset:0, pointerEvents:'none',
          background: isLight ? 'rgba(200,180,100,0.35)' : 'rgba(200,180,100,0.4)',
          transition:'opacity 0.3s'
        }}/>
      )}

      {isSelected && (
        <div style={{
          position:'absolute', inset:0, pointerEvents:'none',
          background:'rgba(255,213,0,0.5)',
          boxShadow:'inset 0 0 0 3px #FFD700'
        }}/>
      )}

      {isInCheck && (
        <div style={{
          position:'absolute', inset:0, pointerEvents:'none',
          background:'rgba(220,53,69,0.45)',
          animation:'checkPulse 1s infinite'
        }}/>
      )}

      {isLegalMove && !piece && (
        <div style={{
          position:'absolute', inset:0, pointerEvents:'none',
          background: isLight
            ? 'radial-gradient(circle, rgba(76,175,80,0.6) 26%, transparent 30%)'
            : 'radial-gradient(circle, rgba(76,175,80,0.7) 26%, transparent 30%)',
          animation: 'cuteBounce 1.5s ease-in-out infinite'
        }}/>
      )}
      {isLegalMove && piece && (
        <div style={{
          position:'absolute', inset:0, pointerEvents:'none',
          boxShadow:'inset 0 0 0 4px rgba(220,53,69,0.9)',
          animation: 'cuteWobble 1s ease-in-out infinite',
          background: 'rgba(220,53,69,0.2)'
        }}/>
      )}

      {piece && (
        <div
          className={getAnimClass()}
          style={{
            position:'absolute', inset:0,
            display:'flex', alignItems:'flex-end', justifyContent:'center',
            paddingBottom:2,
            animation: captureAnim ? `${captureAnim}` : undefined,
            zIndex:2
          }}
        >
          <CrochetPiece
            type={piece.type}
            color={piece.color}
            size={squareSize - 6}
            animState={isSelected ? 'selected' : 'idle'}
            flipped={flipped && piece.type === 'n'}
          />
        </div>
      )}

      {sq[0] === 'a' && (
        <span className="board-label" style={{
          position:'absolute', top:2, left:3, zIndex:3,
          color: isLight ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)',
          textShadow: isLight ? 'none' : '0 0 4px rgba(0,0,0,0.5)'
        }}>
          {sq[1]}
        </span>
      )}
      {sq[1] === '1' && (
        <span className="board-label" style={{
          position:'absolute', bottom:2, right:3, zIndex:3,
          color: isLight ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)',
          textShadow: isLight ? 'none' : '0 0 4px rgba(0,0,0,0.5)'
        }}>
          {sq[0]}
        </span>
      )}
    </div>
  );
}

// ============================================================
//  SECTION 8: CHESS BOARD COMPONENT
// ============================================================

const FILES = ['a','b','c','d','e','f','g','h'];
const RANKS_DESC = ['8','7','6','5','4','3','2','1'];

interface ChessBoardProps {
  game: ChessGame;
  selectedSq: string | null;
  legalMoves: string[];
  lastMove: { from: string; to: string } | null;
  status: string;
  onSquareClick: (sq: string) => void;
  captureSquare: string | null;
  captureAnim: string | null;
  boardSize?: number;
}

function ChessBoard({ game, selectedSq, legalMoves, lastMove, status, onSquareClick, captureSquare, captureAnim, boardSize = 480 }: ChessBoardProps) {
  const squareSize = Math.floor(boardSize / 8);

  return (
    <div style={{ position:'relative', display:'inline-block' }}>
      {/* Soft ambient glow around board */}
      <div style={{
        position:'absolute',
        inset:-20,
        background:'radial-gradient(ellipse at center, rgba(200,149,95,0.15) 0%, transparent 70%)',
        pointerEvents:'none'
      }}/>

      <div className="board-3d-wrapper">
        <div style={{
          background:'linear-gradient(145deg, #2C2C2C 0%, #1A1A1A 50%, #0A0A0A 100%)',
          padding:12,
          borderRadius:8,
          boxShadow:`
            0 20px 60px rgba(0,0,0,0.5),
            0 8px 24px rgba(0,0,0,0.4),
            inset 0 1px 0 rgba(255,255,255,0.1),
            inset 0 -1px 0 rgba(0,0,0,0.3)
          `,
          position:'relative',
          border:'1px solid rgba(255,255,255,0.08)'
        }}>
          <div style={{
            display:'grid',
            gridTemplateColumns:`repeat(8, ${squareSize}px)`,
            gridTemplateRows:`repeat(8, ${squareSize}px)`,
            position:'relative',
            borderRadius:4,
            overflow:'hidden',
            boxShadow:'inset 0 2px 8px rgba(0,0,0,0.3)'
          }}>
            {RANKS_DESC.map(rank =>
              FILES.map(file => {
                const sq = `${file}${rank}`;
                const piece = game.get(sq);
                const isLight = (FILES.indexOf(file) + RANKS_DESC.indexOf(rank)) % 2 === 1;
                const isSelected = selectedSq === sq;
                const isLegal = legalMoves.includes(sq);
                const isLastFrom = lastMove?.from === sq;
                const isLastTo = lastMove?.to === sq;
                const isCheck = status === 'check' && piece?.type === 'k' && piece.color === game.turn;
                const isCaptureSquare = captureSquare === sq;

                return (
                  <BoardSquare
                    key={sq}
                    sq={sq}
                    piece={piece}
                    isLight={isLight}
                    isSelected={isSelected}
                    isLegalMove={isLegal}
                    isLastMove={isLastFrom || isLastTo}
                    isInCheck={isCheck || false}
                    onClick={() => onSquareClick(sq)}
                    squareSize={squareSize}
                    captureAnim={isCaptureSquare ? captureAnim : null}
                  />
                );
              })
            )}
          </div>

          {/* 3D base effect */}
          <div style={{
            position:'absolute', bottom:-12, left:12, right:12, height:12,
            background:'linear-gradient(to bottom, #1A1A1A, #0A0A0A)',
            borderRadius:'0 0 6px 6px',
            boxShadow:'0 6px 16px rgba(0,0,0,0.5)'
          }}/>
        </div>
      </div>
    </div>
  );
}

// ============================================================
//  SECTION 9: GAME END OVERLAY
// ============================================================

function GameEndOverlay({ status, winner, onReset, onReview }: { status: string; winner: string | null; onReset: () => void; onReview: () => void }) {
  if (status !== 'checkmate' && status !== 'draw') return null;

  const title = status === 'checkmate'
    ? `${winner === 'w' ? 'White' : 'Black'} wins — Checkmate! ♟`
    : "It's a Draw! 🤝";

  const sub = status === 'checkmate'
    ? "The yarn unravels. The detective hat crowns another."
    : "Two detectives. No conclusion. The game goes on.";

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:200,
      display:'flex', alignItems:'center', justifyContent:'center',
      background:'rgba(15,10,5,0.75)',
      backdropFilter:'blur(8px)'
    }}>
      <div style={{
        background:'var(--color-bg-panel)',
        borderRadius:16, padding:'48px 56px',
        textAlign:'center',
        boxShadow:'0 24px 80px rgba(0,0,0,0.35)',
        animation:'scaleIn 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards',
        maxWidth:440
      }}>
        <div style={{fontSize:56, marginBottom:16}}>
          {status === 'checkmate' ? '🏆' : '🤝'}
        </div>

        <h2 style={{
          fontFamily:"'Playfair Display', serif",
          fontSize:28, marginBottom:10,
          color:'var(--color-text-primary)'
        }}>
          {title}
        </h2>
        <p className="cinema-quote" style={{fontSize:17, marginBottom:32}}>
          {sub}
        </p>

        <div style={{display:'flex', gap:16, justifyContent:'center'}}>
          <button className="btn-primary" onClick={onReset}>
            🧶 Play Again
          </button>
          <button className="btn-secondary" onClick={onReview}>
            📋 Review
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
//  SECTION 10: PROMOTION MODAL
// ============================================================

function PromotionModal({ color, onSelect }: { color: string; onSelect: (piece: string) => void }) {
  const pieces = ['q','r','b','n'];
  return (
    <div style={{
      position:'fixed', inset:0, zIndex:150,
      display:'flex', alignItems:'center', justifyContent:'center',
      background:'rgba(15,10,5,0.6)', backdropFilter:'blur(6px)'
    }}>
      <div style={{
        background:'var(--color-bg-panel)',
        borderRadius:14, padding:'28px 32px',
        boxShadow:'0 12px 48px rgba(0,0,0,0.3)',
        animation:'scaleIn 0.25s ease forwards',
        textAlign:'center'
      }}>
        <p style={{
          fontFamily:"'Playfair Display', serif",
          fontSize:18, marginBottom:20,
          color:'var(--color-text-primary)'
        }}>
          🧶 Promote your Pawn!
        </p>
        <div style={{display:'flex', gap:16}}>
          {pieces.map(p => (
            <div key={p} className="promotion-piece" onClick={() => onSelect(p)}>
              <CrochetPiece type={p} color={color} size={64} animState="idle"/>
              <p style={{
                fontFamily:"'DM Sans', sans-serif",
                fontSize:11, marginTop:6,
                color:'var(--color-text-muted)',
                fontWeight:500
              }}>
                {PIECE_NAMES[p]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
//  SECTION 11: PLAYER CARD COMPONENT
// ============================================================

function PlayerCard({ color, isAI = false, isActive = false, capturedPieces = [] }: { color: string; isAI?: boolean; isActive?: boolean; capturedPieces?: string[] }) {
  const label = isAI ? `🤖 AI (Black)` : `🧶 ${color === 'w' ? 'White' : 'Black'}`;
  const bg = color === 'w' ? '#F5F0E8' : '#2C2C2C';

  return (
    <div style={{
      display:'flex', alignItems:'center', gap:12, padding:'10px 14px',
      background:'var(--color-bg-panel)',
      border: isActive ? '2px solid var(--color-hat-gold)' : '2px solid var(--color-panel-border)',
      borderRadius:10,
      transition:'border-color 0.3s',
      boxShadow: isActive ? '0 0 12px rgba(255,215,0,0.3)' : 'none'
    }}>
      <div style={{
        width:36, height:36, borderRadius:'50%',
        background:bg, border:`2px solid ${color === 'w' ? '#D4C9B0' : '#1A1A1A'}`,
        display:'flex', alignItems:'center', justifyContent:'center',
        flexShrink:0,
        fontSize:16
      }}>
        {isAI ? '🤖' : '🧶'}
      </div>

      <div style={{flex:1, minWidth:0}}>
        <p style={{
          fontFamily:"'DM Sans', sans-serif",
          fontWeight:500, fontSize:13,
          color:'var(--color-text-primary)'
        }}>{label}</p>
        <div style={{display:'flex', flexWrap:'wrap', gap:1, marginTop:2}}>
          {capturedPieces.map((p, i) => (
            <span key={i} style={{fontSize:11, opacity:0.7}}>
              {PIECE_EMOJIS[p]}
            </span>
          ))}
        </div>
      </div>

      {isActive && (
        <div style={{display:'flex', gap:3}}>
          {[0,1,2].map(i => (
            <div key={i} className="thinking-dot" style={{animationDelay:`${i*0.2}s`}}/>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
//  SECTION 12: NAV BAR COMPONENT
// ============================================================

function NavBar({ gameMode, onSetMode, onReset }: { gameMode: string; onSetMode: (mode: string) => void; onReset: () => void }) {
  return (
    <header style={{
      height:56, display:'flex', alignItems:'center',
      padding:'0 24px', gap:20,
      background:'linear-gradient(to right, #FAF6EE, #F5EFE0)',
      borderBottom:'1px solid rgba(90,60,20,0.15)',
      position:'sticky', top:0, zIndex:100,
      boxShadow:'0 2px 12px rgba(90,60,20,0.08)'
    }}>
      <div style={{
        display:'flex', alignItems:'center', gap:10, marginRight:8
      }}>
        <span style={{fontSize:24, filter: 'drop-shadow(0 2px 4px rgba(139,69,19,0.2))'}}>🧶</span>
        <span style={{
          fontFamily:"'Playfair Display', serif",
          fontWeight:700, fontSize:22,
          background: 'linear-gradient(135deg, #2C2C2C 0%, #5C4A2A 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing:'-0.5px'
        }}>BLUE_ZONE Chess</span>
      </div>

      <div style={{flex:1}}/>

      <div style={{
        display:'flex', gap:2,
        background:'linear-gradient(135deg, #EDE4CF 0%, #E0D4BC 100%)',
        borderRadius:10, padding:4,
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
      }}>
        {[
          {id:'vs-ai', label:'🤖 vs AI'},
          {id:'manual', label:'👥 2 Player'}
        ].map(mode => (
          <button key={mode.id}
            onClick={() => onSetMode(mode.id)}
            style={{
              padding:'6px 16px',
              borderRadius:7,
              border:'none',
              fontFamily:"'DM Sans', sans-serif",
              fontSize:13, fontWeight:500,
              cursor:'pointer',
              background: gameMode === mode.id
                ? 'linear-gradient(135deg, #2C2C2C 0%, #1A1A1A 100%)'
                : 'transparent',
              color: gameMode === mode.id ? '#FFFFFF' : '#5C4A2A',
              transition:'all 0.25s ease',
              boxShadow: gameMode === mode.id ? '0 2px 8px rgba(0,0,0,0.2)' : 'none'
            }}
          >{mode.label}</button>
        ))}
      </div>

      <button
        onClick={onReset}
        style={{
          fontSize:13,
          padding:'8px 18px',
          background:'linear-gradient(135deg, #C8955F 0%, #A67B4A 100%)',
          color:'#FFFFFF',
          border:'none',
          borderRadius:8,
          fontWeight:500,
          cursor:'pointer',
          fontFamily:"'DM Sans', sans-serif",
          boxShadow:'0 2px 8px rgba(139,69,19,0.2)',
          transition:'all 0.2s'
        }}
      >
        New Game
      </button>
    </header>
  );
}

// ============================================================
//  SECTION 13: AI DIFFICULTY SELECTOR
// ============================================================

function DifficultyBadge({ difficulty, onChange }: { difficulty: string; onChange: (d: string) => void }) {
  const levels = ['beginner','easy','medium','hard'];
  const colors: Record<string, string> = {
    beginner:'#4CAF50', easy:'#FFC107', medium:'#FF9800', hard:'#F44336'
  };
  return (
    <div style={{display:'flex', alignItems:'center', gap:6}}>
      <span style={{fontSize:12, color:'var(--color-text-muted)', fontFamily:"'DM Sans', sans-serif"}}>
        AI:
      </span>
      {levels.map(l => (
        <button key={l}
          onClick={() => onChange(l)}
          style={{
            padding:'3px 10px', borderRadius:12, border:'none',
            fontSize:11, fontWeight:500, cursor:'pointer',
            fontFamily:"'DM Sans', sans-serif",
            background: difficulty === l ? colors[l] : 'var(--color-bg-secondary)',
            color: difficulty === l ? '#fff' : 'var(--color-text-muted)',
            transition:'all 0.2s', textTransform:'capitalize'
          }}
        >{l}</button>
      ))}
    </div>
  );
}

// ============================================================
//  SECTION 14: AI THINKING OVERLAY
// ============================================================

function AIThinkingOverlay({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <div style={{
      position:'absolute', inset:0, zIndex:80,
      background:'rgba(250,246,238,0.75)',
      display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center',
      gap:12, pointerEvents:'all', borderRadius:6,
      backdropFilter:'blur(2px)'
    }}>
      <div style={{display:'flex', gap:8}}>
        {[0,1,2,3].map(i => (
          <div key={i} className="thinking-dot" style={{
            width:10, height:10,
            animationDelay:`${i*0.14}s`
          }}/>
        ))}
      </div>
      <p style={{
        fontFamily:"'Caveat', cursive",
        fontSize:18, color:'var(--color-text-secondary)'
      }}>
        🤖 AI is thinking...
      </p>
    </div>
  );
}

// ============================================================
//  SECTION 15: STATUS BAR COMPONENT
// ============================================================

function StatusBar({ status, turn, gameMode, aiDifficulty, onChangeDifficulty, moveCount }: { status: string; turn: string; gameMode: string; aiDifficulty: string; onChangeDifficulty: (d: string) => void; moveCount: number }) {
  const statusMessages: Record<string, string> = {
    playing: turn === 'w' ? "⚪ White to move" : "⚫ Black to move",
    check:   turn === 'w' ? "⚠️ White is in check!" : "⚠️ Black is in check!",
    checkmate: "♟ Checkmate!",
    draw: "🤝 Draw!",
    idle: "Click a piece to start"
  };

  const statusColors: Record<string, string> = {
    check: '#E53935',
    checkmate: '#B71C1C',
    draw: '#5C4A2A',
    playing: 'var(--color-text-secondary)',
    idle: 'var(--color-text-muted)'
  };

  return (
    <div style={{
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'10px 4px',
      flexWrap:'wrap', gap:8
    }}>
      <span style={{
        fontFamily:"'DM Sans', sans-serif",
        fontWeight:500, fontSize:14,
        color: statusColors[status] || 'var(--color-text-secondary)',
        transition:'color 0.3s'
      }}>
        {statusMessages[status]}
        {moveCount > 0 && (
          <span style={{
            marginLeft:10, fontSize:12,
            color:'var(--color-text-muted)', fontWeight:400
          }}>
            Move {Math.ceil(moveCount/2)}
          </span>
        )}
      </span>

      {gameMode === 'vs-ai' && (
        <DifficultyBadge difficulty={aiDifficulty} onChange={onChangeDifficulty}/>
      )}
    </div>
  );
}

// ============================================================
//  SECTION 16: MAIN APP COMPONENT
// ============================================================

export default function App() {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = GLOBAL_CSS;
    document.head.appendChild(style);
  }, []);

  const [game, setGame] = useState(() => new ChessGame());
  const [selectedSq, setSelectedSq] = useState<string | null>(null);
  const [legalMoves, setLegalMoves] = useState<string[]>([]);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [status, setStatus] = useState('idle');
  const [captureEvent, setCaptureEvent] = useState<CaptureEvent | null>(null);
  const [captureSquare, setCaptureSquare] = useState<string | null>(null);
  const [captureAnim, setCaptureAnim] = useState<string | null>(null);
  const [moveHistory, setMoveHistory] = useState<Move[]>([]);
  const [gameMode, setGameMode] = useState('vs-ai');
  const [aiDifficulty, setAiDifficulty] = useState('medium');
  const [aiThinking, setAiThinking] = useState(false);
  const [promotionPending, setPromotionPending] = useState<{ from: string; to: string } | null>(null);
  const [whiteCaptured, setWhiteCaptured] = useState<string[]>([]);
  const [blackCaptured, setBlackCaptured] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  const capturedByWhite = useRef<string[]>([]);
  const capturedByBlack = useRef<string[]>([]);

  const boardSize = 480;

  const resetGame = useCallback(() => {
    const newGame = new ChessGame();
    setGame(newGame);
    setSelectedSq(null);
    setLegalMoves([]);
    setLastMove(null);
    setStatus('idle');
    setCaptureEvent(null);
    setCaptureSquare(null);
    setCaptureAnim(null);
    setMoveHistory([]);
    setAiThinking(false);
    setPromotionPending(null);
    capturedByWhite.current = [];
    capturedByBlack.current = [];
    setWhiteCaptured([]);
    setBlackCaptured([]);
    setGameOver(false);
    setWinner(null);
  }, []);

  const applyMove = useCallback((currentGame: ChessGame, from: string, to: string, promotion: string = 'q'): { newGame: ChessGame; move: Move } | null => {
    const newGame = currentGame.clone();
    const move = newGame.move(from, to, promotion);
    if (!move) return null;

    if (move.captured) {
      const captureAnimMap: Record<string, string> = {
        q: 'queenFire 0.8s ease-out forwards',
        p: 'pawnKick 0.7s ease-out forwards',
        r: 'rookMelt 0.9s ease-out forwards',
        n: 'tornadoSpin 0.9s ease-out forwards',
        b: 'charCrumble 0.8s ease-out forwards bishop',
        k: 'pieceDissolve 1s ease-out forwards'
      };
      const captureAnimName = captureAnimMap[move.piece] || 'queenFire 0.8s ease-out forwards';

      setCaptureSquare(to);
      setCaptureAnim(captureAnimName);
      setCaptureEvent({
        attacker: { type: move.piece, color: move.color },
        victim:   { type: move.captured, color: move.color === 'w' ? 'b' : 'w' },
        timestamp: Date.now()
      });

      if (move.color === 'w') {
        capturedByWhite.current = [...capturedByWhite.current, move.captured];
        setWhiteCaptured([...capturedByWhite.current]);
      } else {
        capturedByBlack.current = [...capturedByBlack.current, move.captured];
        setBlackCaptured([...capturedByBlack.current]);
      }

      setTimeout(() => {
        setCaptureSquare(null);
        setCaptureAnim(null);
      }, 1000);
    }

    setMoveHistory(h => [...h, move]);
    setLastMove({ from, to });

    const newStatus = newGame.getStatus();
    setStatus(newStatus);

    if (newGame.isCheckmate()) {
      setGameOver(true);
      setWinner(move.color);
    } else if (newGame.isDraw()) {
      setGameOver(true);
      setWinner(null);
    }

    setGame(newGame);
    return { newGame, move };
  }, []);

  const makeAIMove = useCallback((currentGame: ChessGame) => {
    if (currentGame.isGameOver()) return;
    setAiThinking(true);

    setTimeout(() => {
      const depth = AI_DEPTHS[aiDifficulty] || 3;
      const bestMove = getBestMove(currentGame, depth);

      if (bestMove) {
        const result = applyMove(currentGame, bestMove.from, bestMove.to, bestMove.promotion || 'q');
        if (result) {
          setSelectedSq(null);
          setLegalMoves([]);
        }
      }
      setAiThinking(false);
    }, 150);
  }, [aiDifficulty, applyMove]);

  const handleSquareClick = useCallback((sq: string) => {
    if (aiThinking) return;
    if (gameOver) return;

    if (gameMode === 'vs-ai' && game.turn === 'b') return;

    if (selectedSq) {
      if (legalMoves.includes(sq)) {
        const piece = game.get(selectedSq);
        if (piece?.type === 'p') {
          const toRank = parseInt(sq[1]);
          if ((piece.color === 'w' && toRank === 8) || (piece.color === 'b' && toRank === 1)) {
            setPromotionPending({ from: selectedSq, to: sq });
            setSelectedSq(null);
            setLegalMoves([]);
            return;
          }
        }

        const result = applyMove(game, selectedSq, sq);
        setSelectedSq(null);
        setLegalMoves([]);

        if (result && gameMode === 'vs-ai' && !result.newGame.isGameOver()) {
          makeAIMove(result.newGame);
        }
      } else {
        const piece = game.get(sq);
        if (piece && piece.color === game.turn) {
          setSelectedSq(sq);
          setLegalMoves(game.getLegalMoves(sq).map(m => m.to));
        } else {
          setSelectedSq(null);
          setLegalMoves([]);
        }
      }
    } else {
      const piece = game.get(sq);
      if (piece && piece.color === game.turn) {
        setSelectedSq(sq);
        setLegalMoves(game.getLegalMoves(sq).map(m => m.to));
        if (status === 'idle') setStatus('playing');
      }
    }
  }, [game, selectedSq, legalMoves, aiThinking, gameMode, gameOver, applyMove, makeAIMove, status]);

  const handlePromotion = useCallback((promotionPiece: string) => {
    if (!promotionPending) return;
    const result = applyMove(game, promotionPending.from, promotionPending.to, promotionPiece);
    setPromotionPending(null);
    if (result && gameMode === 'vs-ai' && !result.newGame.isGameOver()) {
      makeAIMove(result.newGame);
    }
  }, [promotionPending, game, applyMove, gameMode, makeAIMove]);

  const handleSetMode = useCallback((mode: string) => {
    setGameMode(mode);
    resetGame();
  }, [resetGame]);

  return (
    <div style={{
      minHeight:'100vh',
      background:'var(--color-bg-primary)',
      fontFamily:"'DM Sans', sans-serif"
    }}>
      <NavBar
        gameMode={gameMode}
        onSetMode={handleSetMode}
        onReset={resetGame}
      />

      <main style={{
        display:'flex',
        padding:'20px 24px',
        gap:20,
        maxWidth:1200,
        margin:'0 auto',
        minHeight:'calc(100vh - 56px)',
        alignItems:'flex-start'
      }}>
        <div style={{flex:'0 0 70%', display:'flex', flexDirection:'column', gap:12}}>
          <PlayerCard
            color="b"
            isAI={gameMode === 'vs-ai'}
            isActive={game.turn === 'b' && !gameOver && status !== 'checkmate'}
            capturedPieces={blackCaptured}
          />

          <StatusBar
            status={status}
            turn={game.turn}
            gameMode={gameMode}
            aiDifficulty={aiDifficulty}
            onChangeDifficulty={setAiDifficulty}
            moveCount={moveHistory.length}
          />

          <div style={{position:'relative', display:'inline-block', alignSelf:'flex-start'}}>
            <ChessBoard
              game={game}
              selectedSq={selectedSq}
              legalMoves={legalMoves}
              lastMove={lastMove}
              status={status}
              onSquareClick={handleSquareClick}
              captureSquare={captureSquare}
              captureAnim={captureAnim}
              boardSize={boardSize}
            />
            <AIThinkingOverlay visible={aiThinking}/>
          </div>

          <PlayerCard
            color="w"
            isAI={false}
            isActive={game.turn === 'w' && !gameOver && status !== 'checkmate'}
            capturedPieces={whiteCaptured}
          />
        </div>

        <div style={{flex:'0 0 30%', minWidth:0, alignSelf:'stretch'}}>
          <CapturePanel
            captureEvent={captureEvent}
            moveHistory={moveHistory}
          />
        </div>
      </main>

      {promotionPending && (
        <PromotionModal
          color={game.get(promotionPending?.from)?.color || 'w'}
          onSelect={handlePromotion}
        />
      )}

      {gameOver && (
        <GameEndOverlay
          status={status}
          winner={winner}
          onReset={resetGame}
          onReview={() => setGameOver(false)}
        />
      )}
    </div>
  );
}
