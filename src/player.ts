export enum Direction {
  North = 0,
  East  = 1,
  South = 2,
  West  = 3,
}

export const DIRECTION_NAMES: Record<Direction, string> = {
  [Direction.North]: 'North',
  [Direction.East]:  'East',
  [Direction.South]: 'South',
  [Direction.West]:  'West',
};

// forward vectors indexed by Direction
const FWD: [number, number][] = [
  [ 0, -1], // North
  [ 1,  0], // East
  [ 0,  1], // South
  [-1,  0], // West
];

export class Player {
  x: number;
  y: number;
  direction: Direction;

  constructor(x: number, y: number, direction: Direction = Direction.South) {
    this.x         = x;
    this.y         = y;
    this.direction = direction;
  }

  /** unit vector the player is facing */
  get forward(): [number, number] { return FWD[this.direction]; }

  /** unit vector 90° left of facing */
  get left():    [number, number] { return FWD[(this.direction + 3) % 4]; }

  /** unit vector 90° right of facing */
  get right():   [number, number] { return FWD[(this.direction + 1) % 4]; }

  turnLeft():  void { this.direction = (this.direction + 3) % 4 as Direction; }
  turnRight(): void { this.direction = (this.direction + 1) % 4 as Direction; }

  moveForward(isWall: (x: number, y: number) => boolean): boolean {
    const nx = this.x + this.forward[0];
    const ny = this.y + this.forward[1];
    if (!isWall(nx, ny)) { this.x = nx; this.y = ny; return true; }
    return false;
  }

  moveBackward(isWall: (x: number, y: number) => boolean): boolean {
    const nx = this.x - this.forward[0];
    const ny = this.y - this.forward[1];
    if (!isWall(nx, ny)) { this.x = nx; this.y = ny; return true; }
    return false;
  }
}
