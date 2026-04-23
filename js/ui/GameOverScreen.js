/**
 * GameOverScreen Class
 * Handles game over screen display
 */
class GameOverScreen {
    constructor() {
        this.screen = document.getElementById('end-screen');
        this.finalScoreElement = document.getElementById('final-score');
        this.finalStarsElement = document.getElementById('final-stars');
    }

    /**
     * Show game over screen
     * @param {number} score - Final score
     * @param {number} stars - Stars earned (1-3)
     */
    show(score, stars) {
        if (!this.screen) return;

        if (this.finalScoreElement) {
            this.finalScoreElement.textContent = score;
        }

        if (this.finalStarsElement) {
            // Generate star icons
            let starsText = '';
            for (let i = 0; i < 3; i++) {
                starsText += i < stars ? '⭐' : '☆';
            }
            this.finalStarsElement.textContent = stars;
            this.finalStarsElement.nextElementSibling.textContent = starsText;
        }

        // Show screen
        document.getElementById('game-screen').classList.remove('active');
        this.screen.classList.add('active');

        // Add animation
        this.screen.classList.add('fade-in-up');
    }

    /**
     * Hide game over screen
     */
    hide() {
        if (this.screen) {
            this.screen.classList.remove('active');
        }
    }

    /**
     * Initialize buttons
     */
    init() {
        const restartBtn = document.getElementById('btn-restart');
        const homeBtn = document.getElementById('btn-home');

        if (restartBtn) {
            restartBtn.addEventListener('click', () => {
                if (this.onRestart) this.onRestart();
            });
        }

        if (homeBtn) {
            homeBtn.addEventListener('click', () => {
                if (this.onHome) this.onHome();
            });
        }
    }

    /**
     * Set restart handler
     * @param {Function} handler
     */
    setOnRestart(handler) {
        this.onRestart = handler;
    }

    /**
     * Set home handler
     * @param {Function} handler
     */
    setOnHome(handler) {
        this.onHome = handler;
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameOverScreen;
}