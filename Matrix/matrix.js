'use strict';

const fns = require('./functions.js');

const { toTriangular } = fns;
const { determinant } = fns;
const { rank } = fns;
const { transpose } = fns;
const { multiplyBy } = fns;
const { invert } = fns;
const { pow } = fns;
const { add } = fns;
const { subtract } = fns;
const { multiplication } = fns;

function Matrix(matrix, rows, columns) {
    if (!matrix) matrix = [];
    this.rows = rows || matrix.length || 1;
    this.columns = columns || matrix[0]?.length || 1;
    this.isSquare = this.rows === this.columns;
    this.matrix = new Array(this.rows);
    for (let i = 0; i < this.rows; i++) {
        const row = [];
        const instance = matrix[i] || [];
        for (let j = 0; j < this.columns; j++) {
            row[j] = instance[j] || 0;
        }
        this.matrix[i] = row;
    }
}

Matrix.prototype.det = function() {
    if (!this.isSquare) throw new Error('Matrix should be square to calculate its determinant');
    const { matrix, rows } = this;
    return determinant(matrix, rows);
};

Matrix.prototype.rank = function() {
    const { matrix, rows, columns } = this;
    return rank(matrix, rows, columns);
};

Matrix.prototype.toTriangular = function() {
    const { matrix, rows, columns } = this;
    const triangular = toTriangular(matrix, rows, columns);
    return new Matrix(triangular);
};

Matrix.prototype.transpose = function() {
    const { matrix, rows, columns } = this;
    const transposed = transpose(matrix, rows, columns);
    return new Matrix(transposed);
};

Matrix.prototype.invert = function() {
    if (!this.isSquare) throw new Error('Matrix should be square to calculate inverted one');
    const { matrix, rows } = this;
    const inverted = invert(matrix, rows);
    return new Matrix(inverted);
};

Matrix.prototype.multiplyBy = function(scalar) {
    const { matrix, rows, columns } = this;
    const multiplied = multiplyBy(matrix, scalar, rows, columns);
    return new Matrix(multiplied);
};

Matrix.prototype.pow = function(power) {
    if (!this.isSquare) throw new Error('Matrix should be square to raise it to power');
    const { matrix, rows } = this;
    const powered = pow(matrix, rows, power);
    return new Matrix(powered);
};

const addMatrices = (...matrices) => calculate(add, ...matrices);

const subtractMatrices = (...matrices) => calculate(subtract, ...matrices);

const calculate = (callback, ...matrices) => {
    const args = [];
    const { rows, columns } = matrices[0];
    for (const matrix of matrices) {
        if (!(matrix instanceof Matrix)) throw new Error('All arguments should be matrices');
        const haveSameSize = rows === matrix.rows && columns === matrix.columns;
        if (!haveSameSize) throw new Error('All matrices should have the same size');
        args.push(matrix.matrix);
    }
    const res = args.reduce((A, B) => {
        const rows = A.length;
        const columns = A[0].length;
        return callback(A, B, rows, columns);
    });
    return new Matrix(res);
};

const multiplyMatrices = (...matrices) => {
    const args = [];
    let columns = matrices[0].rows;
    for (const matrix of matrices) {
        if (!(matrix instanceof Matrix)) throw new Error('All arguments should be matrices');
        if (columns !== matrix.rows) throw new Error('The number of columns in the first matrix must be equal to' +
            ' the number of rows in the second matrix');
        else columns = matrix.columns;
        args.push(matrix.matrix);
    }
    const res = args.reduce((A, B) => {
        const rows = A.length;
        const columns = B[0].length;
        const common = B.length;
        return multiplication(A, B, rows, columns, common);
    });
    return new Matrix(res);
};

module.exports = {
    Matrix,
    addMatrices,
    subtractMatrices,
    multiplyMatrices
};
