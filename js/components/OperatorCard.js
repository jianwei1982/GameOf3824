/**
 * OperatorCard Class
 * Represents an operator card (+, -, ×, ÷)
 */
class OperatorCard {
    static OPERATORS = ['+', '-', '×', '÷'];

    constructor(operator, id = null) {
        if (!OperatorCard.OPERATORS.includes(operator)) {
            throw new Error(`Invalid operator: ${operator}`);
        }
        this.operator = operator;
        this.selected = false;
        this.id = id || `op-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Select this operator
     */
    select() {
        this.selected = true;
    }

    /**
     * Deselect this operator
     */
    deselect() {
        this.selected = false;
    }

    /**
     * Toggle selection state
     */
    toggle() {
        this.selected = !this.selected;
    }

    /**
     * Get display symbol
     * @returns {string}
     */
    getDisplaySymbol() {
        return this.operator;
    }

    /**
     * Create DOM element for this operator
     * @returns {HTMLElement}
     */
    createElement() {
        const btn = document.createElement('button');
        btn.className = 'operator-btn';
        btn.textContent = this.operator;
        btn.dataset.operator = this.operator;
        btn.dataset.id = this.id;
        btn.setAttribute('aria-label', `运算符 ${this.operator}`);

        if (this.selected) {
            btn.classList.add('selected');
        }

        return btn;
    }

    /**
     * Update the DOM element based on current state
     * @param {HTMLElement} element
     */
    updateElement(element) {
        if (this.selected) {
            element.classList.add('selected');
        } else {
            element.classList.remove('selected');
        }
    }

    /**
     * Convert to JSON for storage
     * @returns {Object}
     */
    toJSON() {
        return {
            id: this.id,
            operator: this.operator,
            selected: this.selected
        };
    }

    /**
     * Create from JSON
     * @param {Object} json
     * @returns {OperatorCard}
     */
    static fromJSON(json) {
        const card = new OperatorCard(json.operator, json.id);
        card.selected = json.selected || false;
        return card;
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OperatorCard;
}