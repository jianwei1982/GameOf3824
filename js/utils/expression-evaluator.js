/**
 * Expression Evaluator
 * Converts infix expressions to postfix and evaluates them
 */

/**
 * Convert infix expression to postfix (Reverse Polish Notation)
 * @param {string[]} tokens - Array of number and operator tokens
 * @returns {string[]} - Postfix notation tokens
 */
function infixToPostfix(tokens) {
    const output = [];
    const operators = [];
    const precedence = { '+': 1, '-': 1, '×': 2, '÷': 2, '*': 2, '/': 2 };

    for (const token of tokens) {
        if (!isNaN(parseFloat(token)) && isFinite(token)) {
            // Number
            output.push(token);
        } else if (['+', '-', '×', '÷', '*', '/'].includes(token)) {
            // Operator
            while (operators.length > 0 &&
                   ['+', '-', '×', '÷', '*', '/'].includes(operators[operators.length - 1]) &&
                   precedence[operators[operators.length - 1]] >= precedence[token]) {
                output.push(operators.pop());
            }
            operators.push(token);
        } else if (token === '(') {
            operators.push(token);
        } else if (token === ')') {
            while (operators.length > 0 && operators[operators.length - 1] !== '(') {
                output.push(operators.pop());
            }
            if (operators.length > 0) {
                operators.pop(); // Remove '('
            }
        }
    }

    while (operators.length > 0) {
        output.push(operators.pop());
    }

    return output;
}

/**
 * Evaluate a postfix expression
 * @param {string[]} postfix - Postfix notation tokens
 * @returns {{ result: number|null, error: string|null }}
 */
function evaluatePostfix(postfix) {
    const stack = [];

    for (const token of postfix) {
        if (!isNaN(parseFloat(token)) && isFinite(token)) {
            stack.push(parseFloat(token));
        } else if (['+', '-', '×', '÷', '*', '/'].includes(token)) {
            if (stack.length < 2) {
                return { result: null, error: 'Invalid expression' };
            }

            const b = stack.pop();
            const a = stack.pop();

            let result;
            switch (token) {
                case '+':
                    result = a + b;
                    break;
                case '-':
                    result = a - b;
                    break;
                case '×':
                case '*':
                    result = a * b;
                    break;
                case '÷':
                case '/':
                    if (b === 0) {
                        return { result: null, error: 'Division by zero' };
                    }
                    result = a / b;
                    break;
                default:
                    return { result: null, error: 'Unknown operator' };
            }

            stack.push(result);
        }
    }

    if (stack.length !== 1) {
        return { result: null, error: 'Invalid expression' };
    }

    return { result: stack[0], error: null };
}

/**
 * Parse a human-readable expression string into tokens
 * @param {string} expr - Expression string like "(1+2+3)*4"
 * @returns {string[]} - Array of tokens
 */
function parseExpression(expr) {
    const tokens = [];
    let currentNumber = '';

    for (let i = 0; i < expr.length; i++) {
        const char = expr[i];

        if (char >= '0' && char <= '9' || char === '.') {
            currentNumber += char;
        } else {
            if (currentNumber) {
                tokens.push(currentNumber);
                currentNumber = '';
            }

            if (char === ' ') continue;

            if (['+', '-', '×', '÷', '*', '/', '(', ')'].includes(char)) {
                // Convert * to × and / to ÷ for internal consistency
                if (char === '*') tokens.push('×');
                else if (char === '/') tokens.push('÷');
                else tokens.push(char);
            }
        }
    }

    if (currentNumber) {
        tokens.push(currentNumber);
    }

    return tokens;
}

/**
 * Main evaluation function - evaluates an expression and returns the result
 * @param {string} expr - Expression string
 * @returns {{ result: number|null, error: string|null }}
 */
function evaluate(expr) {
    if (!expr || expr.trim() === '') {
        return { result: null, error: 'Empty expression' };
    }

    try {
        const tokens = parseExpression(expr);
        const postfix = infixToPostfix(tokens);
        return evaluatePostfix(postfix);
    } catch (e) {
        return { result: null, error: e.message };
    }
}

/**
 * Check if expression equals a target value (with floating point tolerance)
 * @param {string} expr - Expression string
 * @param {number} target - Target value (default 24)
 * @param {number} tolerance - Floating point tolerance
 * @returns {{ equals: boolean, result: number|null, error: string|null }}
 */
function equals(expr, target = 24, tolerance = 0.0001) {
    const { result, error } = evaluate(expr);

    if (error) {
        return { equals: false, result: null, error };
    }

    return {
        equals: Math.abs(result - target) < tolerance,
        result,
        error: null
    };
}

/**
 * Validate if an expression has valid syntax
 * @param {string} expr - Expression string
 * @returns {{ valid: boolean, error: string|null }}
 */
function validate(expr) {
    if (!expr || expr.trim() === '') {
        return { valid: false, error: 'Empty expression' };
    }

    const tokens = parseExpression(expr);

    if (tokens.length === 0) {
        return { valid: false, error: 'No valid tokens' };
    }

    // Check for invalid patterns
    let hasNumber = false;
    let lastWasNumber = false;
    let lastWasOperator = false;

    for (const token of tokens) {
        const isNumber = !isNaN(parseFloat(token)) && isFinite(token);
        const isOperator = ['+', '-', '×', '÷'].includes(token);
        const isParen = ['(', ')'].includes(token);

        if (isNumber) {
            if (lastWasNumber) {
                return { valid: false, error: 'Consecutive numbers' };
            }
            hasNumber = true;
            lastWasNumber = true;
            lastWasOperator = false;
        } else if (isOperator) {
            if (lastWasOperator || !hasNumber) {
                return { valid: false, error: 'Invalid operator placement' };
            }
            lastWasNumber = false;
            lastWasOperator = true;
        } else if (isParen) {
            lastWasNumber = false;
            lastWasOperator = false;
        }
    }

    if (!hasNumber) {
        return { valid: false, error: 'No numbers in expression' };
    }

    if (lastWasOperator) {
        return { valid: false, error: 'Expression ends with operator' };
    }

    return { valid: true, error: null };
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { evaluate, equals, validate, parseExpression, infixToPostfix, evaluatePostfix };
}