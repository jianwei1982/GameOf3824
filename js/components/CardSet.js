/**
 * CardSet Class
 * Manages a set of 4 number cards
 */
class CardSet {
    constructor() {
        this.cards = [];
        this.id = `cardset-${Date.now()}`;
        this.solution = null;
        this.isSolvable = true;
    }

    /**
     * Generate 4 random cards
     * @param {number} min - Minimum value (default 1)
     * @param {number} max - Maximum value (default 13)
     */
    generate(min = 1, max = 13) {
        this.cards = [];
        for (let i = 0; i < 4; i++) {
            const value = Math.floor(Math.random() * (max - min + 1)) + min;
            this.cards.push(new NumberCard(value));
        }

        // Check if solvable
        const values = this.cards.map(c => c.value);
        this.checkSolvability(values);

        return this;
    }

    /**
     * Set specific cards (for testing or replay)
     * @param {number[]} values - Array of 4 numbers
     */
    setCards(values) {
        if (!values || values.length !== 4) {
            throw new Error('CardSet requires exactly 4 values');
        }

        this.cards = values.map((v, i) => new NumberCard(v, `card-${i}`));
        this.checkSolvability(values);

        return this;
    }

    /**
     * Check if the current set has a solution
     * @param {number[]} values
     */
    checkSolvability(values) {
        try {
            // Try to use the global solver if available
            if (typeof window.solver24 !== 'undefined') {
                const result = window.solver24.hasSolution(values);
                this.isSolvable = result.solvable;
                this.solution = result.solution;
                return;
            }
        } catch (e) {
            console.log('Solver not available yet');
        }
        // If solver not loaded, assume solvable
        this.isSolvable = true;
        this.solution = null;
    }

    /**
     * Get card values as array
     * @returns {number[]}
     */
    getValues() {
        return this.cards.map(c => c.value);
    }

    /**
     * Shuffle current cards
     */
    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
        return this;
    }

    /**
     * Get a card by ID
     * @param {string} id
     * @returns {NumberCard|undefined}
     */
    getCardById(id) {
        return this.cards.find(c => c.id === id);
    }

    /**
     * Get a card by value
     * @param {number} value
     * @returns {NumberCard|undefined}
     */
    getCardByValue(value) {
        return this.cards.find(c => c.value === value);
    }

    /**
     * Create DOM elements for all cards
     * @returns {HTMLElement[]}
     */
    createElements() {
        return this.cards.map(card => card.createElement());
    }

    /**
     * Reset all card selections
     */
    resetSelections() {
        this.cards.forEach(c => c.deselect());
    }

    /**
     * Convert to JSON
     * @returns {Object}
     */
    toJSON() {
        return {
            id: this.id,
            cards: this.cards.map(c => c.toJSON()),
            solution: this.solution,
            isSolvable: this.isSolvable
        };
    }

    /**
     * Create from JSON
     * @param {Object} json
     * @returns {CardSet}
     */
    static fromJSON(json) {
        const set = new CardSet();
        set.id = json.id;
        set.cards = json.cards.map(c => NumberCard.fromJSON(c));
        set.solution = json.solution;
        set.isSolvable = json.isSolvable;
        return set;
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CardSet;
}