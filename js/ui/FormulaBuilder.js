/**
 * FormulaBuilder Class
 * Displays the formula being built
 */
class FormulaBuilder {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    /**
     * Update formula display
     * @param {string} formula - The formula string
     */
    update(formula) {
        if (!this.container) return;

        if (!formula || formula.trim() === '') {
            this.container.innerHTML = '<span class="empty">点击数字和运算符卡片开始</span>';
            return;
        }

        // Format the formula with styling
        const formatted = this.formatFormula(formula);
        this.container.innerHTML = formatted;
    }

    /**
     * Format formula with HTML
     * @param {string} formula
     * @returns {string}
     */
    formatFormula(formula) {
        const parts = formula.split(/\s+/);
        return parts.map(part => {
            if (/^[+\-×÷]$/.test(part)) {
                return `<span class="operator">${part}</span>`;
            } else if (/^\d+$/.test(part)) {
                return `<span class="number">${part}</span>`;
            }
            return part;
        }).join(' ');
    }

    /**
     * Show validation error
     * @param {string} error
     */
    showError(error) {
        if (!this.container) return;
        this.container.classList.add('error');
        setTimeout(() => {
            this.container.classList.remove('error');
        }, 500);
    }

    /**
     * Clear formula display
     */
    clear() {
        this.update('');
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FormulaBuilder;
}