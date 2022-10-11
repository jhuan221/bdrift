 /*
    source code from zone b we could use 

    http://www.asahi-net.or.jp/~cs8k-cyu/browser.html
    https://github.com/abagames/crisp-game-lib/blob/master/docs/zoneb/main.js
*/ 

title = "B Drift";

description = `
  [Tap/Release]  
       Turn
`;

characters = [
  `
l
ll
ll
l
`,
  `
llll
`,
  `
lll
`,
  `
lll
`,
];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 15,
};

// /**
//  * @type {{
//  * pos: Vector, angle: number, speed: number,
//  * shotTicks: number, burstTicks: number, burstCount: number
//  * turnTicks: number,
//  * isReflecting: boolean
//  * }[]}
//  */
// let enemies;
// /** @type {{pos: Vector, width: number, angle: number}[]} */
// // let walls;
// /** @type {{pos: Vector, angle: number, range: number, side: "player" | "enemy"}[]} */
// let bullets;
/**
 * @type {{
 * pos: Vector, angle: number, speed: number,
 * isReflecting: boolean, shotTicks: number
 * }}
 */
let player;
let level;
let isLevelCleared;
let levelClearTicks;
/** @type {{pos:Vector, radius: number}} */
let nextCircleTarget;
/** @type {{pos:Vector, radius: number}} */
let nextCircle;
/** @type {{pos:Vector, radius: number}} */
let circle;
let circleTicks;
let multiplier;
const angleVels = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];
const shownRange = 30;

function update() {
  if (!ticks) {
    level = 0;
    isLevelCleared = true;
    levelClearTicks = 0;
  }
  if (isLevelCleared) {
    circleTicks = 99;
    circle = { pos: vec(50, 50), radius: 120 };
    nextCircle = { pos: vec(50, 50), radius: 60 };
    nextCircleTarget = { pos: vec(), radius: 0 };
    player = {
      pos: vec(50, 80),
      angle: 3,
      speed: 0,
      isReflecting: false,
      shotTicks: 0,
    };
    level++;
    isLevelCleared = false;
    multiplier = 1;
  }
  circleTicks--;
  if (circleTicks === 9) {
    nextCircleTarget.radius = nextCircle.radius - 10;
    nextCircleTarget.pos.set(nextCircle.pos);
    for (let i = 0; i < 99; i++) {
      nextCircleTarget.pos.set(rnd(10, 90), rnd(10, 90));
      if (
        nextCircleTarget.pos.distanceTo(nextCircle.pos) <
        nextCircle.radius - nextCircleTarget.radius
      ) {
        break;
      }
    }
  }
  if (circleTicks < 0) {
    circleTicks = 600;
  }
  if (circleTicks < 9) {
    nextCircle.pos.add(
      (nextCircleTarget.pos.x - nextCircle.pos.x) / (circleTicks + 1),
      (nextCircleTarget.pos.y - nextCircle.pos.y) / (circleTicks + 1)
    );
    nextCircle.radius +=
      (nextCircleTarget.radius - nextCircle.radius) / (circleTicks + 1);
  }
    // setting outer circle
    color("light_black");
    arc(50, 50, 50, 3);
    
    // setting inner circle
    color("blue");
    arc(50, 50, 30, 3);
  const av = angleVels[player.angle];
  player.speed += ((input.isPressed ? 0 : 3) - player.speed) * 0.1;
  if (input.isJustReleased) {
    if (player.speed > 0.04) {
      play("laser");
      player.angle = wrap(player.angle + 1, 0, 4);
    }
  }
  player.pos.add(av[0] * player.speed, av[1] * player.speed);
  checkCircleReflect(player);
  color("black");
  char("b", player.pos.x + av[0] * 2, player.pos.y + av[1] * 2, {
    rotation: player.angle,
  });
  color("blue");
  const c = char("a", player.pos, { rotation: player.angle }).isColliding;
  if (
    c.char.c ||
    circle.radius < 1 ||
    player.pos.distanceTo(circle.pos) > circle.radius * 1.05
  ) {
    play("lucky");
    end();
  }
  player.pos.clamp(0, 99, 0, 99);
  player.angle = wrap(player.angle, 0, 4);
  if (levelClearTicks <= -60 && enemies.length === 0) {
    play("powerUp");
    levelClearTicks = 60;
  }
  if (levelClearTicks > 0) {
    color("black");
    text("WINNER!", 30, 50);
    levelClearTicks--;
    if (levelClearTicks === 0) {
      isLevelCleared = true;
    }
  } else if (levelClearTicks > -60) {
    color("black");
    text(`LEVEL ${level}`, 30, 50);
    levelClearTicks--;
  }

  /*
  checks if player is colliding with the blue circle
  if collides flip player 180 degrees, creating a bounce back in the opposite direction 
  */
  function checkCircleReflect(o) {
    if (o.pos.distanceTo(circle.pos) < circle.radius) {
      return;
    }
    const a = o.pos.angleTo(circle.pos);
    if (a < (-PI / 4) * 3 || a > (PI / 4) * 3) {
      o.angle = 2;
    } else if (a > PI / 4) {
      o.angle = 1;
    } else if (a < -PI / 4) {
      o.angle = 3;
    } else {
      o.angle = 0;
    }
  }
}
addEventListener("load", onLoad);