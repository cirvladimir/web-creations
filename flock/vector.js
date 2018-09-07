window.V = {
  add: (a, b) => [a[0] + b[0], a[1] + b[1]],
  sub: (a, b) => [a[0] - b[0], a[1] - b[1]],
  len: a => Math.sqrt(a[0] * a[0] + a[1] * a[1]),
  dist: (a, b) => V.len(V.sub(a, b)),
  ang: a => Math.atan2(a[1], a[0]),
  mult: (a, x) => [a[0] * x, a[1] * x],
  toAR: a => [V.ang(a), V.len(a)],
  fromAR: a => [a[1] * Math.cos(a[0]), a[1] * Math.sin(a[0])],
  eq: (a, b) => (a[0] == b[0] && a[1] == b[1]),
  // Random vector [-x, x] x [-x. x].
  randSqr: x => [(2 * Math.random() - 1) * x, (2 * Math.random() - 1) * x],
  // Random vector on edge of disc.
  randCicle: x => V.fromAR(Math.random() * Math.PI * 2, x),
  // Returns v pointed towards desV, moved at most by angle maxMove.
  aimTo: (v, desV, maxMove) => {
    let vA = V.ang(v);
    let desVA = V.ang(desV);
    let vDelt = desVA - vA;
    if (vDelt < -Math.PI) {
      vDelt += 2 * Math.PI;
    }
    if (vDelt > Math.PI) {
      vDelt -= 2 * Math.PI;
    }

    if (Math.abs(vDelt) > maxMove) {
      vDelt = Math.sign(vDelt) * maxMove;
    }
    return V.fromAR([vA + vDelt, V.len(v)]);
  }
};
