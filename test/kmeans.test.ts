import kmeans from '../src';

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
  4,
];

describe('test_kmeans', () => {
  it('successfully generates clusters w/ max iterations', () => {
    expect(
      kmeans(input_data_single, 2, [
        [3, 1, 5],
        [7, 2, 6],
        [3, 8, 6],
      ])
    ).toHaveProperty('iterations', 10000);
  });
});

describe('test_kmeans', () => {
  it('successfully generates 2 clusters', () => {
    expect(
      kmeans(input_data_single, 2, [
        [3, 1, 5],
        [7, 2, 6],
        [3, 8, 6],
      ])
    ).toHaveProperty('k', 2);
  });
});
