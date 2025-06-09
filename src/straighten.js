export default function(links = []) {
  let nDim,
    nodes = [],
    id = (node => node.index),
    strength = 1,
    considerAlpha = false;

  const segments = [];

  function force(alpha) {
    const k = strength * (considerAlpha ? alpha : 1);
    segments.forEach(nodes => {
      const lr = linearRegression(nodes, nDim);

      nodes.forEach(node => {
        const target = closestPointOnLine(lr, node, nDim);
        node.vx += (target.x - node.x) * k;
        node.vy += (target.y - node.y) * k;
      });
    });
  }

  function initialize() {
    const nodesById = new Map(nodes.map((d, i) => [id(d, i, nodes), d]));
    const linksByNode = new Map();

    links.forEach(link => {
      if (typeof link.source !== "object") link.source = nodesById.get(link.source) || link.source;
      if (typeof link.target !== "object") link.target = nodesById.get(link.target) || link.target;

      [link.source, link.target].forEach(node => {
        !linksByNode.has(node) && linksByNode.set(node, []);
        linksByNode.get(node).push(link);
      });
    });

    segments.length = 0; // clear segments
    const visited = new Set();
    const traverseSingleLinks = (node, dir, accNodes = new Set()) => {
      accNodes.add(node);
      const links = linksByNode.get(node);
      if (new Set(links.map(l => [l.source, l.target].flat())).size !== 2) return [node];

      const nextNode = links
        .filter(l => !visited.has(l))
        .map(link => {
          visited.add(link);
          return link[dir];
        })
        .filter(node => !accNodes.has(node))[0] || null;

      return [node, ...(nextNode ? traverseSingleLinks(nextNode, dir, accNodes) : [])];
    }
    links.forEach(link => {
      if(visited.has(link)) return;
      visited.add(link);

      const segment = [
        ...traverseSingleLinks(link.source, 'source').reverse(),
        ...traverseSingleLinks(link.target, 'target')
      ];

      segment.length > 2 && new Set(segment).size === segment.length && segments.push(segment);
    });
  }

  force.initialize = function(initNodes, ...args) {
    nodes = initNodes;
    nDim = args.find(arg => [1, 2, 3].includes(arg)) || 2;
    initialize();
  };

  force.links = function(_) {
    return arguments.length ? (links = _, initialize(), force) : links;
  };

  force.id = function(_) {
    return arguments.length ? (id = _, force) : id;
  };

  force.strength = function(_) {
    return arguments.length ? (strength =  _, force) : strength;
  };

  force.considerAlpha = function(_) {
    return arguments.length ? (considerAlpha =  _, force) : considerAlpha;
  };

  return force;
}

//

function linearRegression(pnts, nDim = 2) {
  if (pnts.length < 2) {
    throw new Error("At least two points are required for linear regression.");
  }

  const dims = ['x', nDim > 1 ? 'y' : null, nDim > 2 ? 'z' : null].filter(d => d);

  // Compute mean point
  const mean = Object.fromEntries(dims.map(dim => [dim, pnts.map(p => p[dim]).reduce((agg, n) => agg + n, 0) / pnts.length]));

  // Compute covariance matrix
  let Sxx = 0, Sxy = 0, Sxz = 0;
  let Syy = 0, Syz = 0, Szz = 0;
  for (const p of pnts) {
    const d = Object.fromEntries(dims.map(dim => [dim, p[dim] - mean[dim]]));
    Sxx += d.x * d.x;
    if(nDim > 1) {
      Sxy += d.x * d.y;
      Syy += d.y * d.y;
    }
    if (nDim > 2) {
      Sxz += d.x * d.z;
      Syz += d.y * d.z;
      Szz += d.z * d.z;
    }
  }

  const covarianceMatrix = [
    [Sxx, Sxy, Sxz],
    [Sxy, Syy, Syz],
    [Sxz, Syz, Szz],
  ];

  function powerIteration(A, numIter = 100) {
    let b = [1, 1, 1];
    for (let k = 0; k < numIter; k++) {
      const Ab = [
        A[0][0] * b[0] + A[0][1] * b[1] + A[0][2] * b[2],
        A[1][0] * b[0] + A[1][1] * b[1] + A[1][2] * b[2],
        A[2][0] * b[0] + A[2][1] * b[1] + A[2][2] * b[2],
      ];
      const norm = Math.hypot(...Ab);
      b = Ab.map(val => val / norm);
    }
    return b;
  }

  const direction = powerIteration(covarianceMatrix);

  return {
    point: mean, // point on the line (center)
    direction: Object.fromEntries(dims.map((dim, idx) => ([dim, direction[idx]]))) // direction vector (normalized)
  };
}

function closestPointOnLine(line, point, nDim) {
  const dims = ['x', nDim > 1 ? 'y' : null, nDim > 2 ? 'z' : null].filter(d => d);

  const p = line.point;
  const d = line.direction;

  const qMinusP = Object.fromEntries(dims.map(dim => [dim, point[dim] - p[dim]]));

  // Dot product (q - p) · d
  const dotNumerator = dims.reduce((agg, dim) => agg + qMinusP[dim] * d[dim], 0);

  // Dot product d · d (magnitude squared)
  const dotDenominator = dims.reduce((agg, dim) => agg + d[dim] * d[dim], 0);

  // Scalar projection t
  const t = dotDenominator === 0 ? 0 : dotNumerator / dotDenominator;

  // Closest point = p + t * d
  return Object.fromEntries(dims.map(dim => [dim, p[dim] + t * d[dim]]));
}
