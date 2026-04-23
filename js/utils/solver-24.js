/**
 * 24 Point Solver
 * Uses brute force to check if a set of 4 numbers can make 24
 */

const TARGET = 24;
const TOLERANCE = 0.0001;

/**
 * Generate all possible permutations of an array
 * @param {number[]} arr - Array of numbers
 * @returns {number[][]} - All permutations
 */
function permutations(arr) {
    if (arr.length <= 1) return [arr];

    const result = [];
    for (let i = 0; i < arr.length; i++) {
        const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
        const restPerms = permutations(rest);
        for (const perm of restPerms) {
            result.push([arr[i], ...perm]);
        }
    }
    return result;
}

/**
 * Generate all possible operator combinations
 * @returns {string[][]} - All combinations of 3 operators
 */
function operatorCombinations() {
    const ops = ['+', '-', '×', '÷'];
    const result = [];

    for (let i = 0; i < ops.length; i++) {
        for (let j = 0; j < ops.length; j++) {
            for (let k = 0; k < ops.length; k++) {
                result.push([ops[i], ops[j], ops[k]]);
            }
        }
    }

    return result;
}

/**
 * Apply an operator to two numbers
 * @param {number} a - First number
 * @param {number} op - Operator
 * @param {number} b - Second number
 * @returns {number|null} - Result or null if invalid
 */
function applyOp(a, op, b) {
    switch (op) {
        case '+': return a + b;
        case '-': return a - b;
        case '×': return a * b;
        case '÷': return b !== 0 ? a / b : null;
        default: return null;
    }
}

/**
 * Generate all possible expression structures
 * Using parentheses in different positions:
 * 1. ((a op b) op c) op d
 * 2. (a op (b op c)) op d
 * 3. a op ((b op c) op d)
 * 4. a op (b op (c op d))
 * 5. (a op b) op (c op d)
 * @param {number[]} nums - 4 numbers
 * @param {string[]} ops - 3 operators
 * @returns {string[]} - All possible expressions
 */
function generateExpressions(nums, ops) {
    const [a, b, c, d] = nums;
    const [op1, op2, op3] = ops;

    const expressions = [];

    // 1. ((a op b) op c) op d
    expressions.push(`((${a}${op1}${b})${op2}${c})${op3}${d}`);

    // 2. (a op (b op c)) op d
    expressions.push(`(${a}${op1}(${b}${op2}${c}))${op3}${d}`);

    // 3. a op ((b op c) op d)
    expressions.push(`${a}${op1}((${b}${op2}${c})${op3}${d})`);

    // 4. a op (b op (c op d))
    expressions.push(`${a}${op1}(${b}${op2}(${c}${op3}${d}))`);

    // 5. (a op b) op (c op d)
    expressions.push(`(${a}${op1}${b})${op2}(${c}${op3}${d})`);

    return expressions;
}

/**
 * Check if any expression using the given numbers and operators equals target
 * @param {number[]} numbers - Array of 4 numbers
 * @param {string[]} operators - Array of 3 operators
 * @returns {{ solvable: boolean, solution: string|null }}
 */
function checkCombination(numbers, operators) {
    const expressions = generateExpressions(numbers, operators);

    for (const expr of expressions) {
        try {
            // Use Function for safe evaluation
            const safeExpr = expr
                .replace(/×/g, '*')
                .replace(/÷/g, '/')
                .replace(/-/g, '-');

            // Check for division by zero before evaluating
            if (safeExpr.includes('/0') || safeExpr.includes('/ 0')) {
                continue;
            }

            // eslint-disable-next-line no-new-func
            const result = new Function(`return ${safeExpr}`)();

            if (Math.abs(result - TARGET) < TOLERANCE) {
                return { solvable: true, solution: expr };
            }
        } catch (e) {
            continue;
        }
    }

    return { solvable: false, solution: null };
}

/**
 * Check if a set of 4 numbers has any solution to make 24
 * @param {number[]} cardValues - Array of 4 numbers (1-13)
 * @returns {{ solvable: boolean, solution: string|null }}
 */
function hasSolution(cardValues) {
    if (!cardValues || cardValues.length !== 4) {
        return { solvable: false, solution: null };
    }

    // Generate all permutations of the 4 numbers
    const numberPerms = permutations(cardValues);

    // Generate all combinations of operators
    const operatorCombs = operatorCombinations();

    // Try all combinations
    for (const nums of numberPerms) {
        for (const ops of operatorCombs) {
            const { solvable, solution } = checkCombination(nums, ops);
            if (solvable) {
                return { solvable: true, solution };
            }
        }
    }

    return { solvable: false, solution: null };
}

/**
 * Get one valid solution for making 24
 * @param {number[]} cardValues - Array of 4 numbers
 * @returns {string|null} - A valid expression or null if no solution
 */
function getSolution(cardValues) {
    return hasSolution(cardValues).solution;
}

/**
 * Check if a player's expression equals 24
 * @param {string} expression - Player's expression
 * @returns {{ correct: boolean, result: number|null, error: string|null }}
 */
function checkPlayerExpression(expression) {
    if (!expression) {
        return { correct: false, result: null, error: 'Empty expression' };
    }

    try {
        // Convert to safe eval format
        const safeExpr = expression
            .replace(/×/g, '*')
            .replace(/÷/g, '/');

        // Check for division by zero
        if (safeExpr.includes('/0') || safeExpr.includes('/ 0')) {
            return { correct: false, result: null, error: 'Division by zero' };
        }

        // eslint-disable-next-line no-new-func
        const result = new Function(`return ${safeExpr}`)();

        if (isNaN(result) || !isFinite(result)) {
            return { correct: false, result: null, error: 'Invalid result' };
        }

        const correct = Math.abs(result - TARGET) < TOLERANCE;
        return { correct, result, error: null };
    } catch (e) {
        return { correct: false, result: null, error: e.message };
    }
}

/**
 * Generate a hint based on the current card set
 * @param {number[]} cardValues - Array of 4 numbers
 * @returns {string} - A hint string
 */
function generateHint(cardValues) {
    const solution = getSolution(cardValues);

    if (!solution) {
        return '这组牌可能无解，可以尝试宣布"无解"';
    }

    // Provide a partial hint based on the solution
    const parts = solution.split(/\(|\)|([+\-×÷])/g).filter(p => p && !p.match(/^$/));

    // Give a vague hint about the structure
    if (solution.includes('(')) {
        return '提示：需要使用括号来改变运算顺序';
    }

    const operators = solution.match(/[+\-×÷]/g);
    if (operators) {
        const opCount = operators.filter(op => op === '×' || op === '÷').length;
        if (opCount >= 2) {
            return '提示：尝试使用乘法和除法';
        }
        if (opCount === 1) {
            return '提示：需要用到乘法或除法';
        }
        return '提示：主要使用加法和减法';
    }

    return '提示：仔细想想数字的组合';
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { hasSolution, getSolution, checkPlayerExpression, generateHint };
}