declare module 'ml-cart' {
  import type Matrix from 'ml-matrix';

  export interface DecisionTreeOptions {
    gainFunction?: 'gini';
    splitFunction?: 'mean';
    minNumSamples?: number;
    maxDepth?: number;
    gainThreshold?: number;
  }

  export interface TreeNode {
    classify(row: number[]): Matrix;
  }

  export class DecisionTreeClassifier {
    options: DecisionTreeOptions;
    root: TreeNode;
    constructor(options?: DecisionTreeOptions | true, model?: unknown);
    train(trainingSet: number[][] | Matrix, trainingLabels: number[]): void;
    predict(toPredict: number[][] | Matrix): number[];
    toJSON(): unknown;
    static load(model: unknown): DecisionTreeClassifier;
  }

  export class DecisionTreeRegression {
    constructor(options?: DecisionTreeOptions | true, model?: unknown);
    train(trainingSet: number[][] | Matrix, trainingValues: number[]): void;
    predict(toPredict: number[][] | Matrix): number[];
    toJSON(): unknown;
    static load(model: unknown): DecisionTreeRegression;
  }
}
