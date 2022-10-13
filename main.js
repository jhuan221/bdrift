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
l l
 r
l l
`
];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 15,
};

/**
 * @type {{
 * pos: Vector, angle: number
 * }}
 */
let player;

/** @type {Vector} */
let vel;
let angle;

let level;
/** @type {{pos:Vector, radius: number}} */
let circle;

function update() {
  if (!ticks) {
    level = 0;
    isLevelCleared = true;
    levelClearTicks = 0;

    vel = vec(0.1, 0);
    angle = 0;

    player = {
      pos: vec(50, 10),
      angle: 3
    };
  }
  
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
    angle = turnTo(angle, center, 0.02* sqrt(difficulty)); // towards the center of the screen
    color("light_red");
    particle(player.pos, 3, 1, center.angleTo(player.pos), 0.4);
  }

  // constant speed being applied to player
  vel.mul(1); 
  // update player pos
  player.pos.add(vel.x * difficulty * 1.2, vel.y * difficulty* 1.2); 

  // game over  
  if (player.pos.distanceTo(center) < 30 || player.pos.distanceTo(center) > 50) {
    end();
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
}
addEventListener("load", onLoad);