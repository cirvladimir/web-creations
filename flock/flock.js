const BIRD_SIZE = 10;
const COL_DIST = 10;
const OUTER_RAD = 150;

window.addEventListener("load", () => {
  let canvas = document.querySelector("canvas");
  let ctx = canvas.getContext("2d");

  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  const W = canvas.width;
  const H = canvas.height;

  let MAX_SPEED = 2;
  let animals = new Array(200).fill(0).map(() => ({
    loc: [Math.random() * W, Math.random() * H],
    vel: V.randSqr(MAX_SPEED),
    type: 0
  })).concat(new Array(0).fill(0).map(() => ({
    loc: [Math.random() * W, Math.random() * H],
    vel: V.randSqr(MAX_SPEED / 3),
    type: 1
  })));

  const COLORS = ["blue", "red"];
  const SIZES = [BIRD_SIZE, BIRD_SIZE * 3];

  let draw = () => {
    ctx.clearRect(0, 0, W, H);


    let drawAnimal = b => {
      let s = SIZES[b.type];
      ctx.fillStyle = COLORS[b.type];
      let a = V.ang(b.vel);
      ctx.beginPath();
      ctx.moveTo(b.loc[0], b.loc[1]);

      ctx.lineTo(b.loc[0] + s * Math.cos(a + Math.PI * 0.9), 
        b.loc[1] + s * Math.sin(a + Math.PI * 0.9));
      ctx.lineTo(b.loc[0] + s * Math.cos(a + Math.PI * 1.1), 
        b.loc[1] + s * Math.sin(a + Math.PI * 1.1));

      ctx.closePath();

      ctx.fill();
    };

    animals.forEach(drawAnimal);
  };

  let go = () => {

  // console.log(animals.reduce((acc, a) => acc + a.vel[0], 0));
    animals.forEach((b, i) => BRAINS[b.type](b, animals, i, W, H));
    animals.forEach(b => b.loc = V.add(b.loc, b.vel));

    draw();
    window.setTimeout(go, 10);
  };

  go();
});

let birdBrain = (b, animals, i, W, H) => {
  if (avoidEdges(b, W, H)) { return; }

  let bs = animals.filter(a => a.type == 0);

  // Swarm component.
  // 1. Keep distance.
  let closestBird = animals[0];
  let closestDist = 99999;
  animals.forEach((bo, bi) => {
    if (bi != i) {
      let d = V.dist(b.loc, bo.loc);
      if (d < closestDist) {
        closestBird = bo;
        closestDist = d;
      }
    }
  });
  if (closestDist < COL_DIST) {
    b.vel = V.aimTo(b.vel, V.sub(b.loc, closestBird.loc), 0.2);
  } else {
    let closeBirds = bs.filter((bo, bi) => (bi != i) && (V.dist(b.loc, bo.loc) < OUTER_RAD));
    if (closeBirds.length > 0) {
      // 2. Move to center.
      let avgPos = V.mult(closeBirds.reduce((acc, bo) => V.add(acc, bo.loc), [0, 0]),
        1 / closeBirds.length);
      b.vel = V.aimTo(b.vel, V.sub(avgPos, b.loc), 0.05);
      // 3. Mimic speed.
      let avgSpeed = closeBirds.reduce((acc, bo) => acc + V.len(bo.vel) / closeBirds.length, 0);
      let av = V.toAR(b.vel);
      av[1] = (av[1] * 5 + avgSpeed) / 6;
      b.vel = V.fromAR(av);

      let sumV = closeBirds.reduce((acc, bo) => V.add(acc, bo.vel), [0, 0]);
      b.vel = V.aimTo(b.vel, sumV, 0.05);
    }
  }
};

let predatorBrain = (b, animals, i, W, H) => {

};

let avoidEdges = (b, W, H) => {
  // If close to center.
  const DELT = 50;

  if ((b.loc[0] < DELT) || (b.loc[1] < DELT) ||
      (b.loc[0] > W - DELT) || (b.loc[1] > H - DELT)) {
    // Aim towards center.
    b.vel = V.aimTo(b.vel, V.sub([W / 2, H / 2], b.loc), 0.1);
    return true;
  }
  return false;
};

let BRAINS = [birdBrain, predatorBrain];
