export interface KMeans {
    iterations: number;
    k: number;
    indexes: Array<number>;
    centroids: Centroids;
}
export declare type UniMultiDimensionalArray = Array<any>;
export declare type Vector = Array<number>;
export declare type Vectors = Array<Vector>;
export declare type Centroid = Array<number>;
export declare type Centroids = Array<Centroid>;
export default function kmeans(data: UniMultiDimensionalArray, k: number, init_cent?: String | Array<any>, max_it?: number): KMeans;
declare class Cluster {
    static k_means(data: Vectors, k: number): Centroids;
    static k_means_pp(data: Vectors, k: number): Centroids;
}
declare class Distance {
    static dist(x: number, y: number, sqrt?: number): number;
    static euclideanDist(x: Centroid, y: Centroid): number;
    static manhattanDist(x: Centroid, y: Centroid): number;
}
export { Cluster, Distance };
