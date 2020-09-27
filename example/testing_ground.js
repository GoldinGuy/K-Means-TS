"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const KMEANS = require("../kmeans.js");
const sample_input_data = [
    [1, 12, 14, 4, 25, 35, 22, 3, 14, 5, 51, 2, 23, 24, 15],
    [7, 34, 15, 34, 17, 11, 34, 2, 35, 18, 52, 34, 33, 21],
    [5, 19, 35, 17, 35, 18, 12, 45, 23, 56, 23, 45, 16, 3]
];
var sample_output = KMEANS(sample_input_data, 3, "kmeans");
console.log(JSON.stringify(sample_output));
const generateRandomArray = ({ width, height }) => Array.from({ length: height }, () => Array.from({ length: width }, () => Math.floor(Math.random() * 2)));
const input_data = generateRandomArray({ width: 15, height: 20 });
console.log(JSON.stringify(input_data));
var output = KMEANS(input_data, 3, "kmeans++");
console.log(JSON.stringify(output));
