'use strict';

const toTriangular = (matrix, rows, columns = rows) => {
    const res = [];
    matrix.forEach(row => {
        const copy = row.slice(0);
        res.push(copy);
    });
    for (let i = 0; i < rows; i++) {
        const currentRow = res[i];
        const currentElem = currentRow[i];
        for (let j = i + 1; j < rows; j++) {
            const nextRow = res[j];
            const nextElem = nextRow[i];
            const multiplier = (nextElem / currentElem);
            if (multiplier !== 0) {
                if (!Number.isFinite(multiplier) || Number.isNaN(multiplier)) {
                    res[i] = nextRow;
                    res[j] = currentRow.map(x => x * -1);
                    i--;
                    break;
                } else {
                    const multiplied = currentRow.map(x => x * multiplier * -1);
                    for (let k = 0; k < columns; k++) {
                        nextRow[k] += multiplied[k];
                    }
                }
            }
        }
    }
    return res;
};

const det = (matrix, size) => {
    const triangular = toTriangular(matrix, size);
    let res = 1;
    for (let i = 0; i < size; i++) {
        const elem = triangular[i][i];
        res *= elem;
    }
    return res;
};

const det2x2 = (matrix) => {
    let res = 0;
    res += matrix[0][0] * matrix[1][1];
    res += -matrix[0][1] * matrix[1][0];
    return res;
};

const det3x3 = (matrix) => {
    let res = 0;
    res += matrix[0][0] * matrix[1][1] * matrix[2][2];
    res += matrix[0][1] * matrix[1][2] * matrix[2][0];
    res += matrix[0][2] * matrix[1][0] * matrix[2][1];
    res += -matrix[0][2] * matrix[1][1] * matrix[2][0];
    res += -matrix[0][0] * matrix[1][2] * matrix[2][1];
    res += -matrix[0][1] * matrix[1][0] * matrix[2][2];
    return res;
};


const determinants = {
    0 : (matrix, size) => det(matrix, size),
    1 : (matrix) => matrix[0][0],
    2 : (matrix) => det2x2(matrix),
    3 : (matrix) => det3x3(matrix),
};

const determinant = (matrix, size) => {
    const fn = determinants[size] || determinants[0];
    const res = fn(matrix, size);
    return res;
};

const rank = (matrix, rows, columns) => {
    let res = 0;
    const triangular = toTriangular(matrix, rows, columns);
    triangular.forEach(row => {
        const isNonZero = row.some(elem => elem !== 0);
        res += isNonZero ? 1 : 0;
    });
    return res;
};

const transpose = (matrix, rows, columns) => {
    const res = new Array(columns);
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            res[j] = res[j] || [];
            res[j][i] = matrix[i][j];
        }
    }
    return res;
};

const multiplyBy = (matrix, scalar, rows, columns = rows) => {
    const res = new Array(rows);
    for (let i = 0; i < rows; i++) {
        res[i] = res[i] || [];
        for (let j = 0; j < columns; j++) {
            res[i][j] = matrix[i][j] * scalar;
        }
    }
    return res;
};

const minors = (matrix, size) => {
    const res = new Array(size);
    for (let i = 0; i < size; i++) {
        const firstPart = matrix.slice(0, i);
        const secondPart = matrix.slice(i + 1, size);
        const rows = firstPart.concat(secondPart);
        for (let j = 0; j < size; j++) {
            res[j] = res[j] || [];
            const lowerRankMatrix = [];
            for (const row of rows) {
                const firstPart = row.slice(0, j);
                const secondPart = row.slice(j + 1, size);
                const newRow = firstPart.concat(secondPart);
                lowerRankMatrix.push(newRow);
            }
            const fn = determinants[size - 1] || determinants[0];
            const determinant = fn(lowerRankMatrix, size - 1);
            const elem = (-1) ** (i + j) * determinant;
            res[j][i] = elem;
        }
    }
    return res;
};

const invert = (matrix, size) => {
    const det = determinant(matrix, size);
    if (det === 0) throw new Error('Singular matrix can‘t be inverted');
    const adjoint = minors(matrix, size);
    const res = multiplyBy(adjoint, 1 / det, size);
    return res;
};

const pow = (matrix, rows, power) => {
    let res = matrix;
    for (let i = 1; i < power; i++) {
        res = multiplication(res, matrix, rows);
    }
    return res;
};

const add = (A, B, rows, columns) => {
    const res = new Array(rows);
    for (let i = 0; i < rows; i++) {
        res[i] = res[i] || [];
        for (let j = 0; j < columns; j++) {
            res[i][j] = A[i][j] + B[i][j];
        }
    }
    return res;
};

const subtract = (A, B, rows, columns) => {
    const res = new Array(rows);
    for (let i = 0; i < rows; i++) {
        res[i] = res[i] || [];
        for (let j = 0; j < columns; j++) {
            res[i][j] = A[i][j] - B[i][j];
        }
    }
    return res;
};

const multiplication = (A, B, rows, common = rows, columns = rows) => {
    const res = new Array(rows);
    for (let j = 0; j < columns; j++) {
        for (let i = 0; i < rows; i++) {
            res[i] = res[i] || [];
            res[i][j] = 0;
            for (let k = 0; k < common; k++) {
                res[i][j] += A[i][k] * B[k][j];
            }
        }
    }
    return res;
};

module.exports = {
    toTriangular,
    determinant,
    rank,
    transpose,
    multiplyBy,
    invert,
    pow,
    add,
    subtract,
    multiplication
};
