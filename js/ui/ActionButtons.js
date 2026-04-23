/**
 * ActionButtons Class
 * Handles action button interactions (confirm, clear, change, no solution)
 */
class ActionButtons {
    constructor() {
        this.buttons = {};
    }

    /**
     * Initialize action buttons
     */
    init() {
        this.buttons.confirm = document.getElementById('btn-confirm');
        this.buttons.clear = document.getElementById('btn-clear');
        this.buttons.change = document.getElementById('btn-change');
        this.buttons.noSolution = document.getElementById('btn-no-solution');

        // Bind click handlers
        if (this.buttons.confirm) {
            this.buttons.confirm.addEventListener('click', () => {
                if (this.onConfirm) this.onConfirm();
            });
        }

        if (this.buttons.clear) {
            this.buttons.clear.addEventListener('click', () => {
                if (this.onClear) this.onClear();
            });
        }

        if (this.buttons.change) {
            this.buttons.change.addEventListener('click', () => {
                if (this.onChange) this.onChange();
            });
        }

        if (this.buttons.noSolution) {
            this.buttons.noSolution.addEventListener('click', () => {
                if (this.onNoSolution) this.onNoSolution();
            });
        }
    }

    /**
     * Set confirm handler
     * @param {Function} handler
     */
    setOnConfirm(handler) {
        this.onConfirm = handler;
    }

    /**
     * Set clear handler
     * @param {Function} handler
     */
    setOnClear(handler) {
        this.onClear = handler;
    }

    /**
     * Set change (new cards) handler
     * @param {Function} handler
     */
    setOnChange(handler) {
        this.onChange = handler;
    }

    /**
     * Set no solution handler
     * @param {Function} handler
     */
    setOnNoSolution(handler) {
        this.onNoSolution = handler;
    }

    /**
     * Enable/disable all buttons
     * @param {boolean} enabled
     */
    setEnabled(enabled) {
        Object.values(this.buttons).forEach(btn => {
            if (btn) {
                btn.disabled = !enabled;
            }
        });
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ActionButtons;
}