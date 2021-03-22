'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var MAX = 10000;

function init(len, val, vect) {
  vect = vect || [];

  for (var i = 0; i < len; i++) {
    vect[i] = val;
  }

  return vect;
}

function kmeans(data, k, init_cent, max_it) {
  var cents = [];
  var indexes = [];
  var cent_moved = false;
  var iterations = max_it || MAX;
  var count = [];

  if (!init_cent) {
    var def_indexes = [];
    var i = 0;

    while (cents.length < k) {
      var idx = Math.floor(Math.random() * data.length);

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
    init(k, 0, count); // For each value in data, find nearest centroid (Custom, multidimensional or one-dimensional)

    for (var _i in data) {
      var min = Infinity;
      var _idx = 0;

      for (var j = 0; j < k; j++) {
        var dist = data[0].length > 0 ? Distance.euclideanDist(data[_i], cents[j]) : Math.abs(data[_i][0] - cents[j][0]);

        if (dist <= min) {
          min = dist;
          _idx = j;
        }
      }

      indexes[_i] = _idx; // Idx of centroid

      count[_idx]++; // Num values for centroid
    } // Recalculate centroids


    var sum = [];
    var old = [];

    if (data[0].length > 0) {
      for (var _j = 0; _j < k; _j++) {
        sum[_j] = init(data[0].length, 0, sum[_j]);
        old[_j] = cents[_j];
      }
    } else {
      for (var _j2 = 0; _j2 < k; _j2++) {
        sum[_j2] = 0;
        old[_j2] = cents[_j2];
      }
    } // If multidimensional, sum values & accumulate value on the centroid for current vector for each centroid


    if (data[0].length > 0) {
      for (var _j3 = 0; _j3 < k; _j3++) {
        cents[_j3] = [];
      }

      for (var _i2 in data) {
        for (var h = 0; h < data[0].length; h++) {
          sum[indexes[_i2]][h] += data[_i2][h]; // Sum values for current centroid + Current vector
        }
      } // Calculate the avg for each centroid


      cent_moved = true;

      for (var _j4 = 0; _j4 < k; _j4++) {
        /*
                sum[j] |  Sum of centroid values
                old[j] | Old centroid value
                count[j] | Num elements for centroid
                */
        var cent_j = cents[_j4]; // Current centroid

        for (var _h = 0; _h < data[0].length; _h++) {
          cent_j[_h] = sum[_j4][_h] / count[_j4] || 0; // Avg from new centroid
        }

        if (cent_moved) {
          for (var _h2 = 0; _h2 < data[0].length; _h2++) {
            if (old[_j4][_h2] != cent_j[_h2]) {
              cent_moved = false;
              break;
            }
          }
        }
      }
    } // If one-dimensional, sum values & for each centroid, calculate avg, then determine if centroids moved
    else {
        for (var _i3 in data) {
          var _idx2 = indexes[_i3];
          sum[_idx2] += data[_i3];
        }

        for (var _j5 = 0; _j5 < k; _j5++) {
          cents[_j5] = [sum[_j5] / count[_j5]] || [0];
        }

        cent_moved = true;

        for (var _j6 = 0; _j6 < k; _j6++) {
          if (old[_j6] != cents[_j6]) {
            cent_moved = false;
            break;
          }
        }
      }

    cent_moved = cent_moved || --iterations <= 0;
  } while (!cent_moved);

  var k_means_obj = {
    iterations: (max_it || MAX) - iterations,
    k: k,
    indexes: indexes,
    centroids: cents
  };
  return k_means_obj;
}

var Cluster = /*#__PURE__*/function () {
  function Cluster() {}

  // K-means initial centroid selection
  Cluster.k_means = function k_means(data, k) {
    var cents = [];
    var t = k << 2;
    var map = {};

    while (cents.length < k && t-- > 0) {
      var d = data[Math.floor(Math.random() * data.length)];
      var key = data[0].length > 0 ? d.join('_') : "" + d;

      if (!map[key]) {
        map[key] = true;
        cents.push(d);
      }
    }

    if (cents.length < k) {
      throw Error('Failed to initialize clusters');
    } else return cents;
  } // K-means++ initial centroid selection
  ;

  Cluster.k_means_pp = function k_means_pp(data, k) {
    var distance = data[0].length ? Distance.euclideanDist : Distance.dist;
    var cents = [];
    var map = {}; // Initial random centroid

    var c = data[Math.floor(Math.random() * data.length)];
    cents.push(c);
    map[data[0].length > 0 ? c.join('_') : "" + c] = true; // Get next centroids

    while (cents.length < k) {
      // Find min distances between current centroids and data points
      var distances = [];
      var probs = [];
      var d_sum = 0;

      for (var i in data) {
        var min = Infinity;

        for (var j in cents) {
          var dist = distance(data[i], cents[j]);
          if (dist <= min) min = dist;
        }

        distances[i] = min;
      } // Sum min distances


      for (var _i4 in data) {
        d_sum += distances[_i4];
      } // Probabilities/cumulative prob


      for (var _i5 in data) {
        probs[_i5] = {
          i: _i5,
          v: data[_i5],
          pr: distances[_i5] / d_sum,
          cs: 0
        };
      }

      probs.sort(function (a, b) {
        return a.pr - b.pr;
      }); // Cumulative probs

      probs[0].cs = probs[0].pr;

      for (var _i6 = 1; _i6 < data.length; _i6++) {
        probs[_i6].cs = probs[_i6 - 1].cs + probs[_i6].pr;
      } // Gets items where cum sum >= random num


      var rnd = Math.random();
      var idx = 0;

      while (idx < data.length - 1 && probs[idx++].cs < rnd) {
      }

      cents.push(probs[idx - 1].v);
    }

    return cents;
  };

  return Cluster;
}();

var Distance = /*#__PURE__*/function () {
  function Distance() {}

  // Absolute distance between two values
  // d(x, y, z) = z ? || x - y || : || x - y || * || x - y ||
  Distance.dist = function dist(x, y, sqrt) {
    var d = Math.abs(x - y);
    return sqrt ? d : d * d;
  } // The "ordinary" straight-line distance between two points in Euclidean space
  // ed((x1, y1), (x2, y2)) = || (x1, y1) – (x2, y2) ||
  ;

  Distance.euclideanDist = function euclideanDist(x, y) {
    var sum = 0;

    for (var i in x) {
      var d = (x[i] || 0) - (y[i] || 0);
      sum += d * d;
    }

    return sum;
  } // The distance between two points measured along axes at right angles
  // md((x1, y1), (x2, y2)) = | x1 – x2 | + | y1 – y2 |
  ;

  Distance.manhattanDist = function manhattanDist(x, y) {
    var sum = 0;
    var d = 0;

    for (var i in x) {
      d = (x[i] || 0) - (y[i] || 0);
      sum += d >= 0 ? d : -d;
    }

    return sum;
  };

  return Distance;
}();

exports.Cluster = Cluster;
exports.Distance = Distance;
exports.default = kmeans;
//# sourceMappingURL=kmeans-ts.cjs.development.js.map
