/**
 * HintButton Class
 * Handles hint button interaction
 */
class HintButton {
    constructor(buttonId, countId) {
        this.button = document.getElementById(buttonId);
        this.countElement = document.getElementById(countId);
        this.hintsRemaining = 3;
    }

    /**
     * Initialize hint button
     */
    init() {
        if (!this.button) return;

        this.button.addEventListener('click', () => {
            if (this.hintsRemaining > 0 && this.onHint) {
                this.onHint();
            }
        });

        this.updateDisplay();
    }

    /**
     * Update hints remaining
     * @param {number} count
     */
    updateHints(count) {
        this.hintsRemaining = count;
        this.updateDisplay();
    }

    /**
     * Update button display
     */
    updateDisplay() {
        if (this.countElement) {
            this.countElement.textContent = this.hintsRemaining;
        }

        if (this.button) {
            if (this.hintsRemaining <= 0) {
                this.button.disabled = true;
                this.button.classList.add('disabled');
            } else {
                this.button.disabled = false;
                this.button.classList.remove('disabled');
            }
        }
    }

    /**
     * Set hint click handler
     * @param {Function} handler
     */
    setOnHint(handler) {
        this.onHint = handler;
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HintButton;
}