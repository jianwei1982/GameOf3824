/**
 * Formula Class
 * Manages the player's expression building and validation
 */
class Formula {
    constructor() {
        this.elements = []; // Array of NumberCards or OperatorCards
    }

    /**
     * Add an element to the formula
     * @param {NumberCard|OperatorCard} element
     */
    addElement(element) {
        // Validate: can't add two operators or two numbers in a row
        if (this.elements.length > 0) {
            const lastElement = this.elements[this.elements.length - 1];

            if (element instanceof NumberCard && lastElement instanceof NumberCard) {
                return { success: false, error: 'Cannot add two numbers in a row' };
            }

            if (element instanceof OperatorCard && lastElement instanceof OperatorCard) {
                return { success: false, error: 'Cannot add two operators in a row' };
            }
        }

        // First element can't be an operator
        if (this.elements.length === 0 && element instanceof OperatorCard) {
            return { success: false, error: 'Expression must start with a number' };
        }

        this.elements.push(element);
        return { success: true };
    }

    /**
     * Remove the last element
     * @returns {NumberCard|OperatorCard|null}
     */
    removeLast() {
        return this.elements.pop();
    }

    /**
     * Clear all elements
     */
    clear() {
        this.elements = [];
    }

    /**
     * Build expression string
     * @returns {string}
     */
    buildExpression() {
        return this.elements.map(el => el.value).join(' ');
    }

    /**
     * Check if formula is valid (has at least one number)
     * @returns {{valid: boolean, error: string|null}}
     */
    validate() {
        if (this.elements.length === 0) {
            return { valid: false, error: 'Empty expression' };
        }

        const hasNumber = this.elements.some(el => el instanceof NumberCard);
        if (!hasNumber) {
            return { valid: false, error: 'Expression must contain at least one number' };
        }

        const lastElement = this.elements[this.elements.length - 1];
        if (lastElement instanceof OperatorCard) {
            return { valid: false, error: 'Expression cannot end with an operator' };
        }

        return { valid: true, error: null };
    }

    /**
     * Evaluate the formula
     * @returns {{result: number|null, error: string|null}}
     */
    evaluate() {
        const validation = this.validate();
        if (!validation.valid) {
            return { result: null, error: validation.error };
        }

        const expr = this.buildExpression();

        if (typeof solver !== 'undefined' && solver.checkPlayerExpression) {
            const result = solver.checkPlayerExpression(expr);
            return {
                result: result.result,
                error: result.error,
                equals24: result.correct
            };
        }

        // Fallback: try native evaluation
        try {
            const evalExpr = expr
                .replace(/×/g, '*')
                .replace(/÷/g, '/');

            const result = eval(evalExpr);
            return {
                result,
                error: null,
                equals24: Math.abs(result - 24) < 0.0001
            };
        } catch (e) {
            return { result: null, error: e.message };
        }
    }

    /**
     * Get count of elements
     * @returns {number}
     */
    get length() {
        return this.elements.length;
    }

    /**
     * Check if formula is empty
     * @returns {boolean}
     */
    isEmpty() {
        return this.elements.length === 0;
    }

    /**
     * Get selected cards from this formula
     * @returns {NumberCard[]}
     */
    getSelectedCards() {
        return this.elements.filter(el => el instanceof NumberCard);
    }

    /**
     * Convert to JSON
     * @returns {Object}
     */
    toJSON() {
        return {
            elements: this.elements.map(el => el.toJSON ? el.toJSON() : { value: el.value })
        };
    }

    /**
     * Create from JSON
     * @param {Object} json
     * @returns {Formula}
     */
    static fromJSON(json) {
        const formula = new Formula();
        // Restore elements if needed
        return formula;
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Formula;
}