# K-Means-TS

💹 [K-means](https://en.wikipedia.org/wiki/K-means_clustering) and [k-means++](https://en.wikipedia.org/wiki/K-means%2B%2B) clustering implementation for multiple dimensions of data. A Typescript rewrite of [Skmeans-JS](https://github.com/solzimer/skmeans#readme)

## Functionality & Params

<!-- #### KMEANS(input_data, k, [type], [centroids], [iterations]) -->

| Param               | Description                                                                                                                    | Sample Type                                  | Required |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------- | -------- |
| `Input Data`        | Array of values to be clustered. Can be multi-dimensional                                                                      | `Array<number>`, `Array<Array<number>>`, etc | Yes      |
| `K`                 | Num clusters                                                                                                                   | `number`                                     | Yes      |
| `Centroids`         | Initializes centroids. `Kmeans` for random, `Kmeans++` for the K-means++ algorithm. Will attempt to find them if not provided. | `String`                                     | Optional |
| `Iterations`        | Max num of iterations. Default is `10000`                                                                                      | `number`                                     | Optional |
| `Distance Function` | Custom function to determine distance between 2 points, returns num                                                            | `Function`                                   | Optional |

Returns the following object:

| Return value | Description                                          | Sample type            |
| ------------ | ---------------------------------------------------- | ---------------------- |
| `Iterations` | Num iterations undergone                             | `number`               |
| `K`          | Num clusters                                         | `number`               |
| `Centroids`  | Centroid values for each cluster                     | `Array<number>`        |
| `Indexes`    | Index of centroid for each value of input_data array | `Array<Array<number>>` |

## Development setup

Simply clone the repository, then run

```
--ts-config init
```

This will create a `tsconfig.json` file. Ensure you have the following settings:

```
"target": "ES6"
"module": "commonjs"
"downlevelIteration": true
```

If you are using VSCode, click `Ctrl-Shift-B` and then `tsc:watch`, which will auto-compile TS to JS

## Usage

### In this project - Node.js

You can use this K-Means implementation by compiling it to JS, and then running it in the terminal with `node FileName.js`

Alternatively, you can install the awesome VSCode extension [Code Runner](https://marketplace.visualstudio.com/items?itemName=formulahendry.code-runner), which is very convenient

### In other projects

Simply import it using the following

```typescript
const KMEANS: Function = require("./<directory>/kmeans.js");
```

If you want to access the Utils or interfaces within the file, use

```typescript
import { KMeans, Utils } from "./<directory>/kmeans";
```

Then test it!

```javascript
var input_data: Array<Array<number>> = [
	[1, 12, 14, 4, 25, 35, 22, 3, 14, 5, 51, 2, 23, 24, 15],
	[7, 34, 15, 34, 17, 11, 34, 2, 35, 18, 52, 34, 33, 21],
	[5, 19, 35, 17, 35, 18, 12, 45, 23, 56, 23, 45, 16, 3]
];
var output: Array<Array<number>> = KMEANS(input_data, 5, "kmeans++");
```

Results

```javascript
{
	it: 2,
	k: 3,
	idxs: [ 2, 0, 0, 2, 1, 1, 1, 2, 0, 2, 0, 2, 1, 1, 0 ],
	centroids: [ 13, 23, 3 ]
}
```

## Examples

```javascript
// k-means with 3 clusters. Random initialization
var res = skmeans(data, 3);

// k-means with 3 clusters. Initial centroids provided
var res = skmeans(data, 3, [1, 5, 9]);

// k-means with 3 clusters. k-means++ cluster initialization
var res = skmeans(data, 3, "kmpp");

// k-means with 3 clusters. Random initialization. 10 max iterations
var res = skmeans(data, 3, null, 10);

// k-means with 3 clusters. Custom distance function
var res = skmeans(data, 3, null, null, (x1, x2) => Math.abs(x1 - x2));

// Test new point
var res = skmeans(data, 3, null, 10);
res.test(6);

// Test new point with custom distance
var res = skmeans(data, 3, null, 10);
res.test(6, (x1, x2) => Math.abs(x1 - x2));
```

## Contributing

1. Fork K-Means-TS [here](https://github.com/GoldinGuy/K-Means-TS/fork)
2. Create a feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

## Meta

Adapted from [@Solzimer](https://github.com/solzimer)'s [Skmeans-JS](https://github.com/solzimer/skmeans#readme) by [@GoldinGuy](https://github.com/GoldinGuy)

<!-- Distributed under the GNU AGPLv3 license. See [LICENSE](https://github.com/GoldinGuy/PearDrop/blob/master/LICENSE) for more information. -->
