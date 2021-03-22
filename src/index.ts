export interface KMeans {
  iterations: number;
  k: number;
  indexes: Array<number>;
  centroids: Centroids;
}

export type UniMultiDimensionalArray = Array<any>; // needs to be able to handle array of any size
export type Vector = Array<number>;
export type Vectors = Array<Vector>;
export type Centroid = Array<number>;
export type Centroids = Array<Centroid>;

const MAX: number = 10000;

function init(len: number, val: number, vect: Vector): Vector {
  vect = vect || [];
  for (let i = 0; i < len; i++) {
    vect[i] = val;
  }
  return vect;
}

function kmeans(
  data: UniMultiDimensionalArray,
  k: number,
  init_cent?: String | Array<any>,
  max_it?: number
): KMeans {
  let cents: Centroids = [];
  let indexes: Array<number> = [];
  let cent_moved: boolean = false;
  let iterations: number = max_it || MAX;
  let count: Vector = [];

  if (!init_cent) {
    let def_indexes: Array<boolean> = [];
    let i: number = 0;
    while (cents.length < k) {
      let idx: number = Math.floor(Math.random() * data.length);
      if (!def_indexes[idx]) {
        def_indexes[idx] = true;
        cents[i++] = data[idx];
      }
    }
  } else if (init_cent === 'kmeans') {
    cents = Cluster.k_means(data, k);
  } else if (init_cent === 'kmeans++') {
    cents = Cluster.k_means_pp(data, k);
  } else {
    cents = Array.from(init_cent);
  }

  do {
    init(k, 0, count);
    // For each value in data, find nearest centroid (Custom, multidimensional or one-dimensional)
    for (const i in data) {
      let min: number = Infinity;
      let idx: number = 0;
      for (let j = 0; j < k; j++) {
        let dist: number =
          data[0].length > 0
            ? Distance.euclideanDist(data[i], cents[j])
            : Math.abs(data[i][0] - cents[j][0]);
        if (dist <= min) {
          min = dist;
          idx = j;
        }
      }
      indexes[i] = idx; // Idx of centroid
      count[idx]++; // Num values for centroid
    }

    // Recalculate centroids
    let sum: UniMultiDimensionalArray = [];
    let old: Centroids = [];
    if (data[0].length > 0) {
      for (let j = 0; j < k; j++) {
        sum[j] = init(data[0].length, 0, sum[j]);
        old[j] = cents[j];
      }
    } else {
      for (let j = 0; j < k; j++) {
        sum[j] = 0;
        old[j] = cents[j];
      }
    }
    // If multidimensional, sum values & accumulate value on the centroid for current vector for each centroid
    if (data[0].length > 0) {
      for (let j = 0; j < k; j++) {
        cents[j] = [];
      }
      for (const i in data) {
        for (let h = 0; h < data[0].length; h++) {
          sum[indexes[i]][h] += data[i][h]; // Sum values for current centroid + Current vector
        }
      }
      // Calculate the avg for each centroid
      cent_moved = true;
      for (let j = 0; j < k; j++) {
        /* 
                sum[j] |  Sum of centroid values
                old[j] | Old centroid value
                count[j] | Num elements for centroid
                */
        let cent_j: Centroid = cents[j]; // Current centroid
        for (let h = 0; h < data[0].length; h++) {
          cent_j[h] = sum[j][h] / count[j] || 0; // Avg from new centroid
        }
        if (cent_moved) {
          for (let h = 0; h < data[0].length; h++) {
            if (old[j][h] != cent_j[h]) {
              cent_moved = false;
              break;
            }
          }
        }
      }
    }
    // If one-dimensional, sum values & for each centroid, calculate avg, then determine if centroids moved
    else {
      for (const i in data) {
        let idx: number = indexes[i];
        sum[idx] += data[i];
      }
      for (let j = 0; j < k; j++) {
        cents[j] = [sum[j] / count[j]] || [0];
      }
      cent_moved = true;
      for (let j = 0; j < k; j++) {
        if (old[j] != cents[j]) {
          cent_moved = false;
          break;
        }
      }
    }

    cent_moved = cent_moved || --iterations <= 0;
  } while (!cent_moved);

  const k_means_obj: KMeans = {
    iterations: (max_it || MAX) - iterations,
    k: k,
    indexes: indexes,
    centroids: cents,
  };
  return k_means_obj;
}

export default kmeans;

class Cluster {
  // K-means initial centroid selection
  static k_means(data: Vectors, k: number): Centroids {
    let cents: Centroids = [];
    let t: number = k << 2;
    let map = {};
    while (cents.length < k && t-- > 0) {
      let d: Array<number> = data[Math.floor(Math.random() * data.length)];
      let key: string = data[0].length > 0 ? d.join('_') : `${d}`;
      if (!map[key]) {
        map[key] = true;
        cents.push(d);
      }
    }
    if (cents.length < k) {
      throw Error('Failed to initialize clusters');
    } else return cents;
  }

  // K-means++ initial centroid selection
  static k_means_pp(data: Vectors, k: number): Centroids {
    const distance: Function = data[0].length
      ? Distance.euclideanDist
      : Distance.dist;
    let cents: Centroids = [];
    let map = {};
    // Initial random centroid
    let c: Centroid = data[Math.floor(Math.random() * data.length)];
    cents.push(c);
    map[data[0].length > 0 ? c.join('_') : `${c}`] = true;
    // Get next centroids
    while (cents.length < k) {
      // Find min distances between current centroids and data points
      let distances: Array<number> = [];
      let probs: Array<{
        i: string;
        v: Vector;
        pr: number;
        cs: number;
      }> = [];
      let d_sum: number = 0;
      for (const i in data) {
        let min: number = Infinity;
        for (const j in cents) {
          let dist: number = distance(data[i], cents[j]);
          if (dist <= min) min = dist;
        }
        distances[i] = min;
      }
      // Sum min distances
      for (const i in data) {
        d_sum += distances[i];
      }
      // Probabilities/cumulative prob
      for (const i in data) {
        probs[i] = { i: i, v: data[i], pr: distances[i] / d_sum, cs: 0 };
      }
      probs.sort((a, b) => a.pr - b.pr);
      // Cumulative probs
      probs[0].cs = probs[0].pr;
      for (let i = 1; i < data.length; i++) {
        probs[i].cs = probs[i - 1].cs + probs[i].pr;
      }
      // Gets items where cum sum >= random num
      let rnd: number = Math.random();
      let idx: number = 0;
      while (idx < data.length - 1 && probs[idx++].cs < rnd);
      cents.push(probs[idx - 1].v);
    }
    return cents;
  }
}

class Distance {
  // Absolute distance between two values
  // d(x, y, z) = z ? || x - y || : || x - y || * || x - y ||
  static dist(x: number, y: number, sqrt?: number): number {
    const d: number = Math.abs(x - y);
    return sqrt ? d : d * d;
  }
  // The "ordinary" straight-line distance between two points in Euclidean space
  // ed((x1, y1), (x2, y2)) = || (x1, y1) – (x2, y2) ||
  static euclideanDist(x: Centroid, y: Centroid): number {
    let sum: number = 0;
    for (const i in x) {
      const d: number = (x[i] || 0) - (y[i] || 0);
      sum += d * d;
    }
    return sum;
  }
  // The distance between two points measured along axes at right angles
  // md((x1, y1), (x2, y2)) = | x1 – x2 | + | y1 – y2 |
  static manhattanDist(x: Centroid, y: Centroid): number {
    let sum: number = 0;
    let d: number = 0;
    for (const i in x) {
      d = (x[i] || 0) - (y[i] || 0);
      sum += d >= 0 ? d : -d;
    }
    return sum;
  }
}
export { Cluster, Distance };
