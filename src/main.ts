import { Application } from 'pixi.js';
import { createSampleDungeon } from './dungeon';
import { Player, Direction }    from './player';
import { DungeonRenderer }      from './renderer';

const CANVAS_W = 640;
const CANVAS_H = 480;

async function main() {
  const app = new Application();
  await app.init({ width: CANVAS_W, height: CANVAS_H, backgroundColor: 0x000000 });

  const root = document.getElementById('game');
  if (!root) throw new Error('Missing #game element');
  root.appendChild(app.canvas);

  const dungeon  = createSampleDungeon();
  const player   = new Player(1, 1, Direction.East);
  const renderer = new DungeonRenderer(app);

  // ---------------------------------------------------------------------------
  // Input — record keys pressed *this* frame so each press fires exactly once.
  // ---------------------------------------------------------------------------
  const held    = new Set<string>();
  const pressed = new Set<string>();   // populated on keydown, cleared after tick

  window.addEventListener('keydown', (e) => {
    const k = e.key.toLowerCase();
    if (!held.has(k)) pressed.add(k);
    held.add(k);
    if (['arrowup','arrowdown','arrowleft','arrowright',' '].includes(k)) e.preventDefault();
  });
  window.addEventListener('keyup', (e) => {
    held.delete(e.key.toLowerCase());
  });

  const isWall = (x: number, y: number) => dungeon.isWall(x, y);

  // ---------------------------------------------------------------------------
  // Game loop
  // ---------------------------------------------------------------------------
  app.ticker.add(() => {
    if (pressed.has('w') || pressed.has('arrowup'))    player.moveForward(isWall);
    if (pressed.has('s') || pressed.has('arrowdown'))  player.moveBackward(isWall);
    if (pressed.has('a') || pressed.has('arrowleft'))  player.turnLeft();
    if (pressed.has('d') || pressed.has('arrowright')) player.turnRight();

    pressed.clear();
    renderer.render(dungeon, player);
  });
}

main();
