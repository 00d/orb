import { Application, Graphics, Text } from 'pixi.js';
import { DungeonMap } from './dungeon';
import { Player, DIRECTION_NAMES } from './player';

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------
const VIEW_W   = 640;   // dungeon-view width
const VIEW_H   = 400;   // dungeon-view height
const CANVAS_H = 480;   // total canvas height (view + hud)
const MAX_DEPTH = 5;    // tiles visible ahead

// ---------------------------------------------------------------------------
// Depth frames
// ---------------------------------------------------------------------------
// FRAMES[d] defines the screen-space corridor opening at distance d from the
// player.  d=0 is the viewport edge; each successive frame shrinks toward the
// vanishing point at (320, 200).  Side-wall trapezoids at distance d span
// from FRAMES[d] (near) to FRAMES[d+1] (far).  A front wall at distance d
// fills FRAMES[d].
// ---------------------------------------------------------------------------
interface Frame { l: number; t: number; r: number; b: number; }

const FRAMES: Frame[] = [
  { l:   0, t:   0, r: 640, b: 400 }, // 0 – viewport edge
  { l: 112, t:  70, r: 528, b: 330 }, // 1
  { l: 185, t: 116, r: 455, b: 284 }, // 2
  { l: 232, t: 145, r: 408, b: 255 }, // 3
  { l: 263, t: 165, r: 377, b: 235 }, // 4
  { l: 283, t: 177, r: 357, b: 223 }, // 5 – farthest
];

// ---------------------------------------------------------------------------
// Colour helpers
// ---------------------------------------------------------------------------
const CEILING = 0x252525;
const FLOOR   = 0x1a1a15;

/** Grey value that decreases with depth.  Front walls are brighter than sides. */
function wallColor(depth: number, isFront: boolean): number {
  const base = isFront ? 150 : 115;
  const v    = Math.max(28, base - depth * 20);
  return (v << 16) | (v << 8) | v;
}

// ---------------------------------------------------------------------------
// Minimap constants
// ---------------------------------------------------------------------------
const TILE_PX     = 6;   // pixels per tile
const MINIMAP_PAD = 10;

// ---------------------------------------------------------------------------
export class DungeonRenderer {
  private gfx:      Graphics;
  private infoText: Text;

  constructor(private app: Application) {
    this.gfx = new Graphics();
    app.stage.addChild(this.gfx);

    this.infoText = new Text({
      text: '',
      style: { fontFamily: 'monospace', fontSize: 14, fill: '#cccccc' },
    });
    this.infoText.position.set(12, VIEW_H + 10);
    app.stage.addChild(this.infoText);
  }

  // -----------------------------------------------------------------------
  render(dungeon: DungeonMap, player: Player): void {
    const g = this.gfx;
    g.clear();

    // ── background ──────────────────────────────────────────────────────
    g.rect(0, 0, VIEW_W, VIEW_H / 2).fill(CEILING);
    g.rect(0, VIEW_H / 2, VIEW_W, VIEW_H / 2).fill(FLOOR);

    // ── find first wall straight ahead ──────────────────────────────────
    let wallDepth = MAX_DEPTH + 1;
    for (let d = 1; d <= MAX_DEPTH; d++) {
      if (dungeon.isWall(
        player.x + player.forward[0] * d,
        player.y + player.forward[1] * d,
      )) {
        wallDepth = d;
        break;
      }
    }

    // ── front wall ──────────────────────────────────────────────────────
    if (wallDepth <= MAX_DEPTH) {
      const f = FRAMES[wallDepth];
      g.rect(f.l, f.t, f.r - f.l, f.b - f.t).fill(wallColor(wallDepth, true));
    }

    // ── side walls (far → near) ─────────────────────────────────────────
    const limit = Math.min(wallDepth - 1, MAX_DEPTH - 1);
    for (let d = limit; d >= 0; d--) {
      const tx = player.x + player.forward[0] * d;
      const ty = player.y + player.forward[1] * d;
      const near = FRAMES[d];
      const far  = FRAMES[d + 1];

      // left
      if (dungeon.isWall(tx + player.left[0], ty + player.left[1])) {
        g.poly([
          near.l, near.t,
          far.l,  far.t,
          far.l,  far.b,
          near.l, near.b,
        ]).fill(wallColor(d + 1, false));
      }

      // right
      if (dungeon.isWall(tx + player.right[0], ty + player.right[1])) {
        g.poly([
          far.r,  far.t,
          near.r, near.t,
          near.r, near.b,
          far.r,  far.b,
        ]).fill(wallColor(d + 1, false));
      }
    }

    // ── HUD divider ─────────────────────────────────────────────────────
    g.rect(0, VIEW_H, VIEW_W, 1).fill(0x444444);

    // ── minimap ─────────────────────────────────────────────────────────
    this.renderMinimap(g, dungeon, player);

    // ── status text ─────────────────────────────────────────────────────
    this.infoText.text =
      `(${player.x}, ${player.y})  ${DIRECTION_NAMES[player.direction]}` +
      `     W/↑ fwd   S/↓ back   A/← left   D/→ right`;
  }

  // -----------------------------------------------------------------------
  private renderMinimap(g: Graphics, dungeon: DungeonMap, player: Player): void {
    const mapW  = dungeon.width  * TILE_PX;
    const mapH  = dungeon.height * TILE_PX;
    const ox    = VIEW_W - mapW - MINIMAP_PAD;
    const oy    = VIEW_H + Math.floor((CANVAS_H - VIEW_H - mapH) / 2);

    // border
    g.rect(ox - 2, oy - 2, mapW + 4, mapH + 4).fill(0x111111);

    for (let y = 0; y < dungeon.height; y++) {
      for (let x = 0; x < dungeon.width; x++) {
        const px = ox + x * TILE_PX;
        const py = oy + y * TILE_PX;

        if (x === player.x && y === player.y) {
          g.rect(px, py, TILE_PX, TILE_PX).fill(0x00ff44);
        } else if (dungeon.isWall(x, y)) {
          g.rect(px, py, TILE_PX, TILE_PX).fill(0x333333);
        } else {
          g.rect(px, py, TILE_PX, TILE_PX).fill(0x555555);
        }
      }
    }

    // direction dot — one half-tile ahead of player
    const dx = ox + (player.x + player.forward[0] * 0.5) * TILE_PX + TILE_PX / 2;
    const dy = oy + (player.y + player.forward[1] * 0.5) * TILE_PX + TILE_PX / 2;
    g.rect(dx - 1, dy - 1, 2, 2).fill(0xffff00);
  }
}
