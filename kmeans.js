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
function kmeans(data, k, init_cent, max_it, fn_dist) {
    let cents = [];
    let indexes = [];
    let cent_moved = false;
    let iterations = max_it || MAX;
    let count = [];
    if (!init_cent) {
        let def_indexes = [];
        let i = 0;
        while (cents.length < k) {
            let idx = Math.floor(Math.random() * data.length);
            if (!def_indexes[idx]) {
                def_indexes[idx] = true;
                cents[i++] = data[idx];
            }
        }
    }
    else if (init_cent === "kmeans") {
        cents = Cluster.k_means(data, k);
    }
    else if (init_cent === "kmeans++") {
        cents = Cluster.k_means_pp(data, k, fn_dist);
    }
    else {
        cents = Array.from(init_cent);
    }
    do {
        init(k, 0, count);
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
            indexes[i] = idx;
            count[idx]++;
        }
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
        if (data[0].length > 0) {
            for (let j = 0; j < k; j++) {
                cents[j] = [];
            }
            for (const i in data) {
                for (let h = 0; h < data[0].length; h++) {
                    sum[indexes[i]][h] += data[i][h];
                }
            }
            cent_moved = true;
            for (let j = 0; j < k; j++) {
                let cent_j = cents[j];
                for (let h = 0; h < data[0].length; h++) {
                    cent_j[h] = sum[j][h] / count[j] || 0;
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
        iterations: (max_it || MAX) - iterations,
        k: k,
        indexes: indexes,
        centroids: cents
    };
    return k_means_obj;
}
module.exports = kmeans;
class Cluster {
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
    static k_means_pp(data, k, fn_dist) {
        const distance = fn_dist || (data[0].length ? Distance.euclideanDist : Distance.dist);
        let cents = [];
        let map = {};
        let c = data[Math.floor(Math.random() * data.length)];
        let key = data[0].length > 0 ? c.join("_") : `${c}`;
        cents.push(c);
        map[key] = true;
        while (cents.length < k) {
            let distances = [];
            let probs = [];
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
            for (const i in data) {
                d_sum += distances[i];
            }
            for (const i in data) {
                probs[i] = { i: i, v: data[i], pr: distances[i] / d_sum, cs: 0 };
            }
            probs.sort((a, b) => a.pr - b.pr);
            probs[0].cs = probs[0].pr;
            for (let i = 1; i < data.length; i++) {
                probs[i].cs = probs[i - 1].cs + probs[i].pr;
            }
            let rnd = Math.random();
            let idx = 0;
            while (idx < data.length - 1 && probs[idx++].cs < rnd)
                ;
            cents.push(probs[idx - 1].v);
        }
        return cents;
    }
}
class Distance {
    static dist(x, y, sqrt) {
        const d = Math.abs(x - y);
        return sqrt ? d : d * d;
    }
    static euclideanDist(x, y) {
        let sum = 0;
        for (const i in x) {
            const d = (x[i] || 0) - (y[i] || 0);
            sum += d * d;
        }
        return sum;
    }
    static manhattanDist(x, y) {
        let sum = 0;
        let d = 0;
        for (const i in x) {
            d = (x[i] || 0) - (y[i] || 0);
            sum += d >= 0 ? d : -d;
        }
        return sum;
    }
}
