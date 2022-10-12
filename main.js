 /*
    source code from zone b we could use 

    http://www.asahi-net.or.jp/~cs8k-cyu/browser.html
    https://github.com/abagames/crisp-game-lib/blob/master/docs/zoneb/main.js
*/ 

title = "B Drift";

description = `
   [Tap & release]  
        Turn
`;

characters = [
  `
l l
 r
l l
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

/** @type {Vector} */
let vel;
let angle;

let level;
let isLevelCleared;
let levelClearTicks;
// /** @type {{pos:Vector, radius: number}} */
// let nextCircleTarget;
// /** @type {{pos:Vector, radius: number}} */
// let nextCircle;
/** @type {{pos:Vector, radius: number}} */
let circle;
// let circleTicks;
// let multiplier;
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

    vel = vec(0.1, 0);
    angle = 0;
  }
  if (isLevelCleared) {
    //circleTicks = 99;
    //circle = { pos: vec(50, 50), radius: 120 };
    // nextCircle = { pos: vec(50, 50), radius: 60 };
    // nextCircleTarget = { pos: vec(), radius: 0 };
    // enemies = times(9 + level * 7, () => {
    //   return {
    //     pos: vec(rnd(99), rnd(99)),
    //     angle: rndi(4),
    //     speed: 0,
    //     shotTicks: rnd(200, 300),
    //     burstTicks: 0,
    //     burstCount: 0,
    //     turnTicks: 0,
    //     isReflecting: false,
    //   };
    // });
    // walls = times(19, () => {
    //   return {
    //     pos: vec(rnd(9, 89), rnd(9, 89)),
    //     width: rnd(5, 15),
    //     angle: rndi(2),
    //   };
    // });
    // bullets = [];
    player = {
      pos: vec(50, 10),
      angle: 3,
      speed: 0,
      isReflecting: false,
      shotTicks: 0,
    };
    level++;
    isLevelCleared = false;
    multiplier = 1;
  }
  // circleTicks--;
  // if (circleTicks === 9) {
  //   nextCircleTarget.radius = nextCircle.radius - 10;
  //   nextCircleTarget.pos.set(nextCircle.pos);
  //   for (let i = 0; i < 99; i++) {
  //     nextCircleTarget.pos.set(rnd(10, 90), rnd(10, 90));
  //     if (
  //       nextCircleTarget.pos.distanceTo(nextCircle.pos) <
  //       nextCircle.radius - nextCircleTarget.radius
  //     ) {
  //       break;
  //     }
  //   }
  // }
  // if (circleTicks < 0) {
  //   circleTicks = 600;
  // }
  // if (circleTicks < 9) {
  //   nextCircle.pos.add(
  //     (nextCircleTarget.pos.x - nextCircle.pos.x) / (circleTicks + 1),
  //     (nextCircleTarget.pos.y - nextCircle.pos.y) / (circleTicks + 1)
  //   );
  //   nextCircle.radius +=
  //     (nextCircleTarget.radius - nextCircle.radius) / (circleTicks + 1);
  // }
  // if (nextCircle.radius < 60) {
  //   // setting outer circle
  //   color("light_black");
  //   arc(50, 50, 50, 3);
  //   // if statement below deals with shrinking the blue circle
  //   if (circleTicks > 9) {
  //     circle.pos.add(
  //       (nextCircle.pos.x - circle.pos.x) / circleTicks,
  //       (nextCircle.pos.y - circle.pos.y) / circleTicks
  //     );
  //     circle.radius += (nextCircle.radius - circle.radius) / circleTicks;
  //   }
  //   // setting inner circle
  //   color("blue");
  //   arc(50, 50, 30, 3);
  // }
  const center = vec(50, 50);
  const cr = 15;

  // setting outer circle
  color("light_black");
  arc(center, 50, 3);
  // setting inner circle
  arc(center, 30, 3);
  // draw character
  color("black");
  const c = char("a", player.pos);
  
  if (input.isPressed){
    vel.mul(0.7);                        // slow down 
    vel.addWithAngle(angle, 0.1);        // turn
    angle = turnTo(angle, center, 0.02); // towards the center of the screen
    color("light_red");
    particle(player.pos, 3, 1, center.angleTo(player.pos), 0.4);
  }

  // constant speed being applied to player
  vel.mul(1); 
  // update player pos
  player.pos.add(vel.x * difficulty * 1.2, vel.y * difficulty* 1.2); 

  // supposed to reflect player sprite? not working 
  // if (player.pos.x < 0) {
  //   reflect(0);
  // }
  // if (player.pos.x > 99) {
  //   reflect(PI);
  // }
  // if (player.pos.y < 0) {
  //   reflect(PI / 2);
  // }
  // if (player.pos.y > 99) {
  //   reflect(-PI / 2);
  // }
  
  // game over  
  if (player.pos.distanceTo(center) < 30 || player.pos.distanceTo(center) > 50) {
    end();
  }

  //player.pos.add(av[0] * player.speed, av[1] * player.speed);

  // checkCircleReflect(player);
  // color("black");
  // char("b", player.pos.x + av[0] * 2, player.pos.y + av[1] * 2, {
  //   rotation: player.angle,
  // });
  // color("blue");
  // const c = char("a", player.pos, { rotation: player.angle }).isColliding;
  // if (
  //   c.char.c ||
  //   circle.radius < 1 ||
  //   player.pos.distanceTo(circle.pos) > circle.radius * 1.05
  // ) {
  //   play("lucky");
  //   end();
  // }
  //player.pos.clamp(0, 99, 0, 99);

  // if (c.rect.yellow || !player.pos.isInRect(0, 0, 99, 99)) {
  //   if (!player.isReflecting) {
  //     player.angle += 2;
  //     player.isReflecting = true;
  //   }
  // } else {
  //   player.isReflecting = false;
  // }

  //player.angle = wrap(player.angle, 0, 4);

  // if (levelClearTicks <= -60 && enemies.length === 0) {
  //   play("powerUp");
  //   levelClearTicks = 60;
  // }
  // if (levelClearTicks > 0) {
  //   color("black");
  //   text("WINNER!", 30, 50);
  //   levelClearTicks--;
  //   if (levelClearTicks === 0) {
  //     isLevelCleared = true;
  //   }
  // } else if (levelClearTicks > -60) {
  //   color("black");
  //   text(`LEVEL ${level}`, 30, 50);
  //   levelClearTicks--;
  // }

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

  function turnTo(a, p, v) {
    let at = player.pos.angleTo(p);
    let o = wrap(a - at, -PI, PI);
    if (abs(o) < v) {
      return at;
    } else if (o > 0) {
      return a - v;
    } else {
      return a + v;
    }
  }

  function reflect(n) {
    const r = wrap(angle + PI - n, -PI, PI);
    if (abs(r) < PI / 2) {
      angle = angle + PI - r * 2;
    }
    const s = vel.length;
    vel.set(0, 0).addWithAngle(angle, s / 2);
    play("select");
    addingScore = 1;
  }
}
addEventListener("load", onLoad);