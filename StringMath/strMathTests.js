'use strict';

const strMath = require('./strMath.js');

const calc = strMath();

const strictEqual = (x, y, exp, fn) => {
    const res = fn(x, y);
    const err = new Error(`${res} should be equal to ${exp}`);
    if (Number.isNaN(exp)) {
        if (!Number.isNaN(res)) throw err;
    } else {
        if (res !== exp) throw err;
    }
};

try {
    // Integer numbers

    strictEqual(20, 22, 42, calc.add);
    strictEqual(62, 20, 42, calc.subtract);
    strictEqual(3, 14, 42, calc.multiply);
    strictEqual(840, 20, 42, calc.divide);

    // Negative integer numbers

    strictEqual(64, -22, 42, calc.add);
    strictEqual(20, -22, 42, calc.subtract);
    strictEqual(3, -14, -42, calc.multiply);
    strictEqual(840, -20, -42, calc.divide);

    // Float numbers

    strictEqual(20.34, 21.66, 42, calc.add);
    strictEqual(44.133, 2.133, 42, calc.subtract);
    strictEqual(16.8, 2.5, 42, calc.multiply);
    strictEqual(121.8, 2.9, 42, calc.divide);

    // Negative float numbers

    strictEqual(63.5, -21.5, 42, calc.add);
    strictEqual(-44.133, -2.133, -42, calc.subtract);
    strictEqual(16.8, -2.5, -42, calc.multiply);
    strictEqual(-121.8, 2.9, -42, calc.divide);

    // Division of integer numbers by zero

    strictEqual(42, 0, Infinity, calc.divide);
    strictEqual(-42, 0, -Infinity, calc.divide);
    strictEqual(0, 0, NaN, calc.divide);

    // Division of float numbers by zero

    strictEqual(42.2, 0, Infinity, calc.divide);
    strictEqual(16.8, 0, Infinity, calc.divide);
    strictEqual(-13.2, 0, -Infinity, calc.divide);

    // Numbers with -+Infinity

    strictEqual(1, Infinity, Infinity, calc.add);
    strictEqual(-1, Infinity, Infinity, calc.add);
    strictEqual(-Infinity, Infinity, NaN, calc.add);
    strictEqual(-Infinity, -Infinity, -Infinity, calc.add);

    strictEqual(1, Infinity, -Infinity, calc.subtract);
    strictEqual(-1, Infinity, -Infinity, calc.subtract);
    strictEqual(-Infinity, Infinity, -Infinity, calc.subtract);
    strictEqual(-Infinity, -Infinity, NaN, calc.subtract);

    strictEqual(2, Infinity, Infinity, calc.multiply);
    strictEqual(-2, Infinity, -Infinity, calc.multiply);
    strictEqual(Infinity, Infinity, Infinity, calc.multiply);
    strictEqual(Infinity, -Infinity, -Infinity, calc.multiply);

    strictEqual(Infinity, 1, Infinity, calc.divide);
    strictEqual(-Infinity, 1, -Infinity, calc.divide);
    strictEqual(1, Infinity, 0, calc.divide);
    strictEqual(Infinity, -Infinity, NaN, calc.divide);

    // Integer numbers with strings

    strictEqual('20', 22, 42, calc.add);
    strictEqual('62', 20, 42, calc.subtract);
    strictEqual('3', 14, 42, calc.multiply);
    strictEqual('840', 20, 42, calc.divide);

    // Negative integer numbers with strings

    strictEqual(64, '-22', 42, calc.add);
    strictEqual(20, '-22', 42, calc.subtract);
    strictEqual(3, '-14', -42, calc.multiply);
    strictEqual(840, '-20', -42, calc.divide);

    // Negative integer strings

    strictEqual('64', '-22', 42, calc.add);
    strictEqual('20', '-22', 42, calc.subtract);
    strictEqual('3', '-14', -42, calc.multiply);
    strictEqual('840', '-20', -42, calc.divide);

    // Float numbers with strings

    strictEqual('20.5', 21.5, 42, calc.add);
    strictEqual('44.133', 2.133, 42, calc.subtract);
    strictEqual('16.8', 2.5, 42, calc.multiply);
    strictEqual('121.8', 2.9, 42, calc.divide);

    // Negative float numbers with strings

    strictEqual(63.5, '-21.5', 42, calc.add);
    strictEqual(44.133, '2.133', 42, calc.subtract);
    strictEqual(16.8, '-2.5', -42, calc.multiply);
    strictEqual(-121.8, '2.9', -42, calc.divide);

    // Negative float strings

    strictEqual('63.5', '-21.5', 42, calc.add);
    strictEqual('44.133', '2.133', 42, calc.subtract);
    strictEqual('16.8', '-2.5', -42, calc.multiply);
    strictEqual('-121.8', '2.9', -42, calc.divide);

    // Division of integer strings by zero

    strictEqual('42', 0, Infinity, calc.divide);
    strictEqual(-42, '0', -Infinity, calc.divide);
    strictEqual('0', '0', NaN, calc.divide);

    // Division of float strings by zero

    strictEqual('42.2', 0, Infinity, calc.divide);
    strictEqual(16.8, '0', Infinity, calc.divide);
    strictEqual('-13.2', '0', -Infinity, calc.divide);

    // Strings with -+Infinity

    strictEqual(1, 'Infinity', Infinity, calc.add);
    strictEqual(-1, 'Infinity', Infinity, calc.add);
    strictEqual('-Infinity', Infinity, NaN, calc.add);
    strictEqual('-Infinity', '-Infinity', -Infinity, calc.add);

    strictEqual(1, 'Infinity', -Infinity, calc.subtract);
    strictEqual(-1, 'Infinity', -Infinity, calc.subtract);
    strictEqual('-Infinity','Infinity', -Infinity, calc.subtract);
    strictEqual('-Infinity', '-Infinity', NaN, calc.subtract);

    strictEqual(2, 'Infinity', Infinity, calc.multiply);
    strictEqual(-2, 'Infinity', -Infinity, calc.multiply);
    strictEqual(Infinity, 'Infinity', Infinity, calc.multiply);
    strictEqual(Infinity, '-Infinity', -Infinity, calc.multiply);

    strictEqual('Infinity', 1, Infinity, calc.divide);
    strictEqual(-Infinity, 1, -Infinity, calc.divide);
    strictEqual(1, 'Infinity', 0, calc.divide);
    strictEqual(Infinity, '-Infinity', NaN, calc.divide);

    // Operations with fractions

    strictEqual('14/5', '12/10', 4, calc.add);
    strictEqual('1/3', '8/6', -1, calc.subtract);
    strictEqual('3/22', '44/3', 2, calc.multiply);
    strictEqual('12/5', '8/10', 3, calc.divide);

    // Operations with fractions

    strictEqual(4.5,  '3', '15/2', calc.add);
    strictEqual(12, '6/4', '21/2', calc.subtract);
    strictEqual('3/5', '2/3', '2/5', calc.multiply);
    strictEqual(10, 3, '10/3', calc.divide);

    // Congratulations

    console.log('All tests were passed successfully!');
} catch (err) {
    console.log(err);
}
