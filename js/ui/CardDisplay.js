/**
 * CardDisplay Class
 * Handles rendering and interaction of number cards
 */
class CardDisplay {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.onCardClick = null;
    }

    /**
     * Render cards for a card set
     * @param {CardSet} cardSet
     */
    render(cardSet) {
        if (!this.container) return;

        this.container.innerHTML = '';

        const cards = cardSet.createElements();
        cards.forEach((card, index) => {
            card.classList.add('card-entry');
            card.style.animationDelay = `${index * 0.1}s`;

            card.addEventListener('click', () => {
                if (this.onCardClick) {
                    this.onCardClick(cardSet.cards[index]);
                }
            });

            this.container.appendChild(card);
        });
    }

    /**
     * Update card visual states
     * @param {CardSet} cardSet
     */
    update(cardSet) {
        if (!this.container) return;

        const cardElements = this.container.querySelectorAll('.number-card');
        cardElements.forEach((el, index) => {
            if (cardSet.cards[index]) {
                cardSet.cards[index].updateElement(el);
            }
        });
    }

    /**
     * Set click handler
     * @param {Function} handler
     */
    setOnCardClick(handler) {
        this.onCardClick = handler;
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CardDisplay;
}