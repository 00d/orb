export enum TileType {
  Wall  = 0,
  Floor = 1,
}

export class DungeonMap {
  readonly width:  number;
  readonly height: number;
  private grid: TileType[][];

  constructor(grid: TileType[][]) {
    this.grid   = grid;
    this.height = grid.length;
    this.width  = grid[0]?.length ?? 0;
  }

  getTile(x: number, y: number): TileType {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return TileType.Wall;
    return this.grid[y][x];
  }

  isWall(x: number, y: number): boolean {
    return this.getTile(x, y) === TileType.Wall;
  }
}

// ---------------------------------------------------------------------------
// Sample dungeon — a nested-loop maze with an outer ring corridor.
// Player spawns at (1,1).  Explore east along row 1, or south into the maze.
// ---------------------------------------------------------------------------
export function createSampleDungeon(): DungeonMap {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const W = TileType.Wall, F = TileType.Floor;
  // prettier-ignore
  const grid: TileType[][] = [
    [W,W,W,W,W,W,W,W,W,W,W,W,W],   // 0
    [W,F,F,F,F,F,F,F,F,F,F,F,W],   // 1  outer ring
    [W,F,W,W,W,W,W,W,W,W,W,F,W],   // 2
    [W,F,W,F,F,F,W,F,F,F,W,F,W],   // 3  inner ring
    [W,F,W,F,W,F,W,F,W,F,W,F,W],   // 4
    [W,F,W,F,W,F,F,F,W,F,W,F,W],   // 5  bridge across centre
    [W,F,W,F,W,W,W,W,W,F,W,F,W],   // 6
    [W,F,W,F,F,F,F,F,F,F,W,F,W],   // 7  inner ring bottom
    [W,F,W,W,W,W,W,W,W,W,W,F,W],   // 8
    [W,F,F,F,F,F,F,F,F,F,F,F,W],   // 9  outer ring
    [W,W,W,W,W,W,W,W,W,W,W,W,W],   // 10
  ];
  return new DungeonMap(grid);
}
