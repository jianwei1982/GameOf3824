/**
 * NumberCard Class
 * Represents a single number card in the game
 */
class NumberCard {
    constructor(value, id = null) {
        this.value = value; // 1-13
        this.selected = false;
        this.id = id || `num-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Select this card
     */
    select() {
        this.selected = true;
    }

    /**
     * Deselect this card
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
     * Check if this card is selectable
     */
    isSelectable() {
        return !this.selected;
    }

    /**
     * Create DOM element for this card
     * @returns {HTMLElement}
     */
    createElement() {
        const card = document.createElement('div');
        card.className = 'number-card';
        card.textContent = this.value;
        card.dataset.id = this.id;
        card.dataset.value = this.value;

        if (this.selected) {
            card.classList.add('selected');
        }

        return card;
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
     * Create a clone of this card
     * @returns {NumberCard}
     */
    clone() {
        const clone = new NumberCard(this.value, this.id + '-clone');
        clone.selected = this.selected;
        return clone;
    }

    /**
     * Convert to JSON for storage
     * @returns {Object}
     */
    toJSON() {
        return {
            id: this.id,
            value: this.value,
            selected: this.selected
        };
    }

    /**
     * Create from JSON
     * @param {Object} json
     * @returns {NumberCard}
     */
    static fromJSON(json) {
        const card = new NumberCard(json.value, json.id);
        card.selected = json.selected || false;
        return card;
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NumberCard;
}