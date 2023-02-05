'use strict';

const parseFraction = (fraction) => {
    const wasParsed = Array.isArray(fraction);
    if (wasParsed) return fraction;
    const res = [1, 1];
    const args = fixSign(fraction).split('/');
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg === undefined) break;
        const isInfinity = arg === 'Infinity' || arg === '-Infinity';
        if (isInfinity) {
            const isNegative = arg.includes('-');
            res[i] *= isNegative ? -Infinity : Infinity;
        } else {
            const isFloat = arg.includes('.');
            if (isFloat) {
                const float = Number.parseFloat(arg);
                const parsedFloat = toFraction(float);
                const isDenominator = i === 1;
                if (isDenominator) parsedFloat.reverse();
                res[0] *= parsedFloat[0];
                res[1] *= parsedFloat[1];
            } else {
                const integer = Number.parseInt(arg);
                res[i] *= integer;
            }
        }
    }
    return res;
};

const parseResult = (result) => {
    const numerator = result[0];
    const denominator = result[1];
    const res = numerator / denominator;
    const isValid = Number.isInteger(res) || Number.isNaN(res) || !Number.isFinite(res);
    if (isValid) {
        return res;
    } else {
        const args = abbreviation(result);
        const fraction = `${args[0]}/${args[1]}`;
        return fixSign(fraction);
    }
};

const fixSign = (fraction) => {
    const stringed = fraction.toString();
    const isNegative = stringed.includes('-');
    if (isNegative) {
        const negativeNumerator = stringed.indexOf('-');
        const negativeDenominator = stringed.lastIndexOf('-');
        const unsigned = stringed.replaceAll('-', '');
        const isPositive = negativeNumerator !== negativeDenominator;
        if (isPositive) return unsigned;
        else return `-${unsigned}`;
    } else {
        return stringed;
    }
};

const toFraction = (float, denominators = [2, 4, 5, 6, 8, 10]) => {
    for (const denominator of denominators) {
        const numerator = float * denominator;
        if (Number.isInteger(numerator)) return [numerator, denominator];
    }
    const searchedDenominators = denominators.map(x => x * 10);
    return toFraction(float, searchedDenominators);
};

const abbreviation = (fraction) => {
    const arg1 = fraction[0];
    const arg2 = fraction[1];
    if (arg1 === 1 || arg2 === 1) return fraction;
    for (let i = 9; i > 1; i--) {
        const res1 = arg1 / i;
        const res2 = arg2 / i;
        if (Number.isInteger(res1) && Number.isInteger(res2)) {
            const res = [res1, res2];
            return abbreviation(res);
        }
    }
    return fraction;
};

const commonMultiplier = (x1, x2) => {
    const max = Math.max(x1, x2);
    const isSimple = x1 === 1 || x2 === 1 || x1 === x2;
    if (isSimple) return max;
    const min = Math.min(x1, x2);
    for (let i = 1; i <= max; i++) {
        const multiplier = min * i;
        const res = multiplier / max;
        if (Number.isInteger(res)) {
            return multiplier;
        }
    }
};

const addition = (x1, x2) => {
    const args1 = parseFraction(x1);
    const args2 = parseFraction(x2);
    const numerators = [args1[0], args2[0]];
    const denominators = [args1[1], args2[1]];
    for (let i = 0; i < denominators.length; i++) {
        const denominator = denominators[i];
        const isInvalid = !Number.isFinite(denominator) || denominator === 0;
        if (isInvalid) {
            numerators[i] /= denominator;
            denominators[i] = 1;
        }
    }
    const commonDenominator = commonMultiplier(denominators[0], denominators[1]);
    const numerator1 = numerators[0] * (commonDenominator / denominators[0]);
    const numerator2 = numerators[1] * (commonDenominator / denominators[1]);
    const numerator = numerator1 + numerator2;
    const res = [numerator, commonDenominator];
    return parseResult(res);
};

const subtraction = (x1, x2) => {
    const args1 = parseFraction(x1);
    const args2 = parseFraction(x2);
    args2[0] *= -1;
    return addition(args1, args2);
}

const multiplication = (x1, x2) => {
    const args1 = parseFraction(x1);
    const args2 = parseFraction(x2);
    const numerator = args1[0] * args2[0];
    const denominator = args1[1] * args2[1];
    const res = [numerator, denominator];
    return parseResult(res);
};

const division = (x1, x2) => {
    const numerator = parseFraction(x1);
    const denominator = parseFraction(x2);
    denominator.reverse();
    return multiplication(numerator, denominator);
};

const calculate = (mathOperator, strMathOperator, args) => {
    for (const arg of args) {
        const isValid = typeof arg === 'number' || typeof arg === 'string';
        if (!isValid) throw new Error('Types of passed arguments should be numbers or strings');
        if (typeof arg === 'number' && Number.isNaN(arg)) return NaN;
        if (typeof arg === 'string' && arg.includes('NaN')) return NaN;
    }
    return args.reduce((x1, x2) => {
        const isNumbers = typeof x1 === 'number' && typeof x2 === 'number';
        if (isNumbers) {
            const res = mathOperator(x1, x2);
            const isValid = (Number.isInteger(res) || Number.isNaN(res) || !Number.isFinite(res));
            if (isValid) return res;
            return strMathOperator(x1, x2);
        } else {
            return strMathOperator(x1, x2);
        }
    });
};

const strMath = () => {
    return {
        add : (...args) => {
            const toAdd = (x1, x2) => x1 + x2;
            return calculate(toAdd, addition, args);
        },
        subtract : (...args) => {
            const toSubtract = (x1, x2) => x1 - x2;
            return calculate(toSubtract, subtraction, args);
        },
        multiply : (...args) => {
            const toMultiply = (x1, x2) => x1 * x2;
            return calculate(toMultiply, multiplication, args);
        },
        divide : (...args) => {
            const toDivide = (x1, x2) => x1 / x2;
            return calculate(toDivide, division, args);
        },
    };
};

module.exports = strMath;
