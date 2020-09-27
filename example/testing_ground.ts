const KMEANS: Function = require("../kmeans.js");
import { KMeans } from "../kmeans";

const sample_input_data: Array<Array<number>> = [
	[1, 12, 14, 4, 25, 35, 22, 3, 14, 5, 51, 2, 23, 24, 15],
	[7, 34, 15, 34, 17, 11, 34, 2, 35, 18, 52, 34, 33, 21],
	[5, 19, 35, 17, 35, 18, 12, 45, 23, 56, 23, 45, 16, 3]
];
var sample_output: KMeans = KMEANS(sample_input_data, 3, "kmeans");
console.log(JSON.stringify(sample_output));

// generate random 2D array to test w/
const generateRandomArray = (w: number, h: number) =>
	Array.from({ length: h }, () =>
		Array.from({ length: w }, () => Math.floor(Math.random() * 2))
	);

const input_data = generateRandomArray(15, 20);
console.log(JSON.stringify(input_data));

var output: KMeans = KMEANS(input_data, 3, "kmeans++");
console.log(JSON.stringify(output));
