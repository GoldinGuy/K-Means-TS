import KMEANS from "../kmeans";
import { KMeans, Vectors } from "../kmeans";

const sample_input_data: Vectors = [
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

// K-means w/ 3 clusters & initial centroids included
var output: KMeans = KMEANS(input_data, 3, "kmeans++");
console.log(JSON.stringify(output));

// K-means w/ 4 clusters & random centroid initialization
var kmeans1: KMeans = KMEANS(input_data, 4, "kmeans");
console.log(JSON.stringify(kmeans1));

// K-means++ w/ 5 clusters
var kmeans2: KMeans = KMEANS(sample_input_data, 5, "kmeans++");
console.log(JSON.stringify(kmeans2));

// // K-means w/ 7 clusters, random centroids, and 15 max iterations
var kmeans3: KMeans = KMEANS(sample_input_data, 7, undefined, 15);
console.log(JSON.stringify(kmeans3));

const input_data_single = [
	0,
	7,
	4,
	4,
	3,
	5,
	6,
	4,
	6,
	78,
	4,
	3,
	2,
	2,
	4,
	3,
	23,
	4,
	5,
	3,
	35,
	56,
	2,
	3,
	2,
	7,
	9,
	6,
	5,
	7,
	4,
	2,
	2,
	4,
	33,
	4
];

var kmeans4: KMeans = KMEANS(input_data_single, 2, [
	[3, 1, 5],
	[7, 2, 6],
	[3, 8, 6]
]);
console.log(JSON.stringify(kmeans4));
