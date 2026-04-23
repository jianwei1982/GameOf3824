/**
 * HintGenerator Class
 * Generates hints for players
 */
class HintGenerator {
    constructor() {
        this.messages = {
            general: [
                '尝试改变运算顺序',
                '注意使用括号',
                '乘法可以快速累加',
                '除法可以用来调整数字'
            ],
            multiplication: [
                '这道题需要用到乘法',
                '想想如何让数字变大'
            ],
            division: [
                '试试用除法来调整数字',
                '注意除法的顺序'
            ],
            parentheses: [
                '需要用到括号来改变顺序',
                '尝试不同的括号位置'
            ],
            noSolution: [
                '这组牌可能真的无解',
                '可以尝试宣布"无解"'
            ]
        };
    }

    /**
     * Generate a hint for the current card set
     * @param {number[]} cardValues - The 4 card values
     * @param {string} solution - The solution if known
     * @returns {string}
     */
    generate(cardValues, solution = null) {
        // If no solution, return generic hint
        if (!solution) {
            return this.getRandomMessage('noSolution');
        }

        // Analyze the solution to provide relevant hint
        const hasMultiplication = solution.includes('×');
        const hasDivision = solution.includes('÷');
        const hasParentheses = solution.includes('(');

        // Prioritize hints based on solution characteristics
        if (hasParentheses) {
            return this.getRandomMessage('parentheses');
        }

        if (hasDivision) {
            return this.getRandomMessage('division');
        }

        if (hasMultiplication) {
            return this.getRandomMessage('multiplication');
        }

        return this.getRandomMessage('general');
    }

    /**
     * Get a random message from a category
     * @param {string} category
     * @returns {string}
     */
    getRandomMessage(category) {
        const messages = this.messages[category] || this.messages.general;
        return messages[Math.floor(Math.random() * messages.length)];
    }

    /**
     * Add custom message to a category
     * @param {string} category
     * @param {string} message
     */
    addMessage(category, message) {
        if (!this.messages[category]) {
            this.messages[category] = [];
        }
        this.messages[category].push(message);
    }

    /**
     * Get remaining hint text based on solution
     * @param {string} solution
     * @returns {string}
     */
    getPartialHint(solution) {
        // Only show partial information
        if (!solution) {
            return '这道题有解，加油！';
        }

        // Hide part of the solution
        const parts = solution.split(/\(|\)|([+\-×÷])/g).filter(p => p && !p.match(/^$/));

        if (parts.length > 2) {
            return `答案的一部分是: ${parts[0]} ${parts[1]} ...`;
        }

        return '仔细思考运算顺序';
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HintGenerator;
}