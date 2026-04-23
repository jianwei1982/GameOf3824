/**
 * OperatorPanel Class
 * Handles operator button interactions
 */
class OperatorPanel {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.onOperatorClick = null;
    }

    /**
     * Initialize operator buttons
     */
    init() {
        if (!this.container) return;

        const buttons = this.container.querySelectorAll('.operator-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const operator = btn.dataset.operator;
                if (this.onOperatorClick) {
                    this.onOperatorClick(operator);
                }
            });
        });
    }

    /**
     * Update operator states
     */
    clearSelection() {
        if (!this.container) return;

        const buttons = this.container.querySelectorAll('.operator-btn');
        buttons.forEach(btn => {
            btn.classList.remove('selected');
        });
    }

    /**
     * Set click handler
     * @param {Function} handler
     */
    setOnOperatorClick(handler) {
        this.onOperatorClick = handler;
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OperatorPanel;
}