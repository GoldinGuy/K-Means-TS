"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MAX = 10000;
function init(len, val, vect) {
    vect = vect || [];
    for (let i = 0; i < len; i++) {
        vect[i] = val;
    }
    return vect;
}
function kmeans(data, k, type, max_it, fn_dist) {
    let cents = [];
    let indexes = [];
    var cent_moved = false;
    let iterations = max_it || MAX;
    var count = [];
    if (!type) {
        let def_indexes = {};
        let i = 0;
        while (cents.length < k) {
            let idx = Math.floor(Math.random() * data.length);
            if (!def_indexes[idx]) {
                def_indexes[idx] = true;
                cents[i++] = data[idx];
            }
        }
    }
    else if (type === "kmeans") {
        cents = Cluster.k_means(data, k);
    }
    else if (type === "kmeans++") {
        cents = Cluster.k_means_pp(data, k, fn_dist);
    }
    do {
        init(k, 0, count);
        // For each value in data, find the nearest centroid (Custom, multidimensional or unidimensional)
        for (const i in data) {
            let min = Infinity;
            let idx = 0;
            for (let j = 0; j < k; j++) {
                let dist = fn_dist
                    ? fn_dist(data[i], cents[j])
                    : data[0].length > 0
                        ? Distance.euclideanDist(data[i], cents[j])
                        : Math.abs(data[i][0] - cents[j][0]);
                if (dist <= min) {
                    min = dist;
                    idx = j;
                }
            }
            indexes[i] = idx; // Index of selected centroid
            count[idx]++; // Num values for centroid
        }
        // Recalculate centroids
        let sum = [];
        let old = [];
        if (data[0].length > 0) {
            for (let j = 0; j < k; j++) {
                sum[j] = init(data[0].length, 0, sum[j]);
                old[j] = cents[j];
            }
        }
        else {
            for (let j = 0; j < k; j++) {
                sum[j] = 0;
                old[j] = cents[j];
            }
        }
        // If multidimensional, sum values and accumulate value on the centroid for current vector for each centroid
        if (data[0].length > 0) {
            for (let j = 0; j < k; j++) {
                cents[j] = [];
            }
            for (const i in data) {
                for (let h = 0; h < data[0].length; h++) {
                    sum[indexes[i]][h] += data[i][h]; // Sum values for current centroid + Current vector
                }
            }
            // Calculate the average for each centroid
            cent_moved = true;
            for (let j = 0; j < k; j++) {
                /*
                sum[j] |  Accumulated centroid values
                old[j] | Old centroid value
                count[j] | Number of elements for this centroid
                */
                let cent_j = cents[j]; // Current centroid
                for (let h = 0; h < data[0].length; h++) {
                    cent_j[h] = sum[j][h] / count[j] || 0; // New avg from new centroid
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
        // If unidimensional, sum values and for each centroid, calculate avg, then determine if centroids moved
        else {
            for (const i in data) {
                let idx = indexes[i];
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
    const k_means_obj = {
        it: (max_it || MAX) - iterations,
        k: k,
        indexes: indexes,
        centroids: cents
    };
    return k_means_obj;
}
module.exports = kmeans;
class Cluster {
    // K-means initial centroid selection
    static k_means(data, k) {
        let cents = [];
        let t = k << 2;
        let map = {};
        while (cents.length < k && t-- > 0) {
            let d = data[Math.floor(Math.random() * data.length)];
            let key = data[0].length > 0 ? d.join("_") : `${d}`;
            if (!map[key]) {
                map[key] = true;
                cents.push(d);
            }
        }
        if (cents.length < k) {
            throw Error("Error initializing clusters");
        }
        else
            return cents;
    }
    // K-means++ initial centroid selection
    static k_means_pp(data, k, fn_dist) {
        const distance = fn_dist || (data[0].length ? Distance.euclideanDist : Distance.dist);
        let cents = [];
        let map = {};
        // Initial random centroid
        let c = data[Math.floor(Math.random() * data.length)];
        let key = data[0].length > 0 ? c.join("_") : `${c}`;
        cents.push(c);
        map[key] = true;
        // Get next centroids
        while (cents.length < k) {
            // Find min distances between current centroids and data points
            let distances = [];
            let prs = [];
            let d_sum = 0;
            for (const i in data) {
                let min = Infinity;
                for (const j in cents) {
                    let dist = distance(data[i], cents[j]);
                    if (dist <= min)
                        min = dist;
                }
                distances[i] = min;
            }
            // Sum min distances
            for (const i in data) {
                d_sum += distances[i];
            }
            // Probabilities/cumulative prob
            for (const i in data) {
                prs[i] = { i: i, v: data[i], pr: distances[i] / d_sum, cs: 0 };
            }
            prs.sort((a, b) => a.pr - b.pr);
            // Cumulative probabilities
            prs[0].cs = prs[0].pr;
            for (let i = 1; i < data.length; i++) {
                prs[i].cs = prs[i - 1].cs + prs[i].pr;
            }
            // Gets items where cum sum >= random num
            let rnd = Math.random();
            let idx = 0;
            while (idx < data.length - 1 && prs[idx++].cs < rnd)
                ;
            cents.push(prs[idx - 1].v);
        }
        return cents;
    }
}
class Distance {
    // The "ordinary" straight-line distance between two points in Euclidean space
    // ed((x1, y1), (x2, y2)) = || (x1, y1) – (x2, y2) ||
    static euclideanDist(x, y) {
        let sum = 0;
        for (const i in x) {
            const d = (x[i] || 0) - (y[i] || 0);
            sum += d * d;
        }
        return sum;
    }
    // The distance between two points measured along axes at right angles
    // md((x1, y1), (x2, y2)) = | x1 – x2 | + | y1 – y2 |
    static manhattanDist(x, y) {
        let sum = 0;
        let d = 0;
        for (const i in x) {
            d = (x[i] || 0) - (y[i] || 0);
            sum += d >= 0 ? d : -d;
        }
        return sum;
    }
    // Absolute distance between two values
    // d(x, y, z) = z ? || x - y || : || x - y || * || x - y ||
    static dist(x, y, sqrt) {
        const d = Math.abs(x - y);
        return sqrt ? d : d * d;
    }
}
