/**
 * GameState Class
 * Manages the overall game state
 */
class GameState {
    constructor() {
        this.mode = 'classic'; // 'classic' or 'speed'
        this.score = 0;
        this.stars = 0;
        this.hintsRemaining = 3;
        this.currentSetIndex = 0;
        this.totalSets = 10;
        this.timeRemaining = 60; // seconds for speed mode
        this.isGameOver = false;
        this.gameStartTime = null;
    }

    /**
     * Start classic mode
     */
    startClassic() {
        this.mode = 'classic';
        this.reset();
    }

    /**
     * Start speed mode
     */
    startSpeed() {
        this.mode = 'speed';
        this.reset();
    }

    /**
     * Reset game state
     */
    reset() {
        this.score = 0;
        this.stars = 0;
        this.hintsRemaining = 3;
        this.currentSetIndex = 0;
        this.timeRemaining = 60;
        this.isGameOver = false;
        this.gameStartTime = Date.now();
    }

    /**
     * Move to next card set
     */
    nextSet() {
        this.currentSetIndex++;

        // Check if game is over
        if (this.currentSetIndex >= this.totalSets) {
            this.endGame();
        }

        return this.currentSetIndex;
    }

    /**
     * Use a hint
     * @returns {boolean} - true if hint was used, false if no hints remaining
     */
    useHint() {
        if (this.hintsRemaining > 0) {
            this.hintsRemaining--;
            return true;
        }
        return false;
    }

    /**
     * Add score
     * @param {number} points
     */
    addScore(points) {
        this.score += points;
    }

    /**
     * Calculate and set stars based on performance
     * @param {number} correctCount - Number of correct answers
     * @param {number} totalTime - Total time taken in seconds
     */
    calculateStars(correctCount, totalTime) {
        // Base: 1 star for any correct answer
        let stars = 1;

        // Bonus stars based on performance
        const accuracy = correctCount / this.totalSets;

        // 2 stars: >60% correct
        if (accuracy >= 0.6) {
            stars = 2;
        }

        // 3 stars: >80% correct
        if (accuracy >= 0.8) {
            stars = 3;
        }

        // Adjust based on time in speed mode
        if (this.mode === 'speed' && totalTime > 0) {
            const avgTimePerQuestion = totalTime / this.currentSetIndex;
            if (avgTimePerQuestion < 10 && stars < 3) {
                stars = Math.min(3, stars + 1);
            }
        }

        this.stars = stars;
    }

    /**
     * Update time remaining
     * @param {number} seconds
     */
    updateTime(seconds) {
        this.timeRemaining = seconds;
        if (this.timeRemaining <= 0) {
            this.endGame();
        }
    }

    /**
     * End the game
     */
    endGame() {
        this.isGameOver = true;
    }

    /**
     * Get progress percentage
     * @returns {number}
     */
    getProgress() {
        return Math.round((this.currentSetIndex / this.totalSets) * 100);
    }

    /**
     * Get game duration in seconds
     * @returns {number}
     */
    getDuration() {
        if (!this.gameStartTime) return 0;
        return Math.floor((Date.now() - this.gameStartTime) / 1000);
    }

    /**
     * Check if player can continue
     * @returns {boolean}
     */
    canContinue() {
        if (this.isGameOver) return false;
        if (this.mode === 'speed' && this.timeRemaining <= 0) return false;
        if (this.mode === 'classic' && this.currentSetIndex >= this.totalSets) return false;
        return true;
    }

    /**
     * Convert to JSON
     * @returns {Object}
     */
    toJSON() {
        return {
            mode: this.mode,
            score: this.score,
            stars: this.stars,
            hintsRemaining: this.hintsRemaining,
            currentSetIndex: this.currentSetIndex,
            totalSets: this.totalSets,
            timeRemaining: this.timeRemaining,
            isGameOver: this.isGameOver,
            gameStartTime: this.gameStartTime
        };
    }

    /**
     * Create from JSON
     * @param {Object} json
     * @returns {GameState}
     */
    static fromJSON(json) {
        const state = new GameState();
        state.mode = json.mode || 'classic';
        state.score = json.score || 0;
        state.stars = json.stars || 0;
        state.hintsRemaining = json.hintsRemaining ?? 3;
        state.currentSetIndex = json.currentSetIndex || 0;
        state.totalSets = json.totalSets || 10;
        state.timeRemaining = json.timeRemaining ?? 60;
        state.isGameOver = json.isGameOver || false;
        state.gameStartTime = json.gameStartTime || null;
        return state;
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameState;
}