/**
 * ScoreCalculator Class
 * Calculates scores based on correctness and speed
 */
class ScoreCalculator {
    constructor() {
        this.baseScore = 100; // Base points for correct answer
        this.timeBonusMax = 50; // Maximum time bonus
        this.timeThreshold = 30; // Seconds for maximum bonus
    }

    /**
     * Calculate score for a correct answer
     * @param {boolean} correct - Whether the answer is correct
     * @param {number} timeSpent - Time spent in seconds
     * @returns {number} - Points earned
     */
    calculateScore(correct, timeSpent = 0) {
        if (!correct) {
            return 0;
        }

        let score = this.baseScore;

        // Add time bonus for speed
        if (timeSpent > 0 && timeSpent < this.timeThreshold) {
            const bonusRatio = 1 - (timeSpent / this.timeThreshold);
            const timeBonus = Math.round(this.timeBonusMax * bonusRatio);
            score += timeBonus;
        }

        return score;
    }

    /**
     * Calculate star rating based on performance
     * @param {number} correctCount - Number of correct answers
     * @param {number} totalQuestions - Total number of questions
     * @param {number} totalTime - Total time spent in seconds
     * @returns {number} - Stars (1-3)
     */
    calculateStars(correctCount, totalQuestions, totalTime = 0) {
        const accuracy = correctCount / totalQuestions;

        // 1 star: at least 1 correct
        let stars = 1;

        // 2 stars: >= 60% correct
        if (accuracy >= 0.6) {
            stars = 2;
        }

        // 3 stars: >= 80% correct OR perfect score
        if (accuracy >= 0.8 || correctCount === totalQuestions) {
            stars = 3;
        }

        // Bonus: fast completion in speed mode
        if (totalTime > 0 && totalQuestions > 0) {
            const avgTime = totalTime / totalQuestions;
            if (avgTime < 8 && stars < 3) {
                stars = Math.min(3, stars + 1);
            }
        }

        return stars;
    }

    /**
     * Calculate score for speed mode
     * @param {number} questionsAnswered - Number of questions answered correctly
     * @param {number} totalTime - Total time spent
     * @returns {number}
     */
    calculateSpeedScore(questionsAnswered, totalTime) {
        // Base score per question
        let score = questionsAnswered * this.baseScore;

        // Bonus for efficiency (questions per second)
        if (totalTime > 0) {
            const efficiency = questionsAnswered / totalTime;
            const efficiencyBonus = Math.round(efficiency * 100);
            score += efficiencyBonus;
        }

        return score;
    }

    /**
     * Get score breakdown
     * @param {boolean} correct
     * @param {number} timeSpent
     * @returns {Object}
     */
    getScoreBreakdown(correct, timeSpent = 0) {
        if (!correct) {
            return {
                baseScore: 0,
                timeBonus: 0,
                total: 0
            };
        }

        const baseScore = this.baseScore;
        let timeBonus = 0;

        if (timeSpent > 0 && timeSpent < this.timeThreshold) {
            const bonusRatio = 1 - (timeSpent / this.timeThreshold);
            timeBonus = Math.round(this.timeBonusMax * bonusRatio);
        }

        return {
            baseScore,
            timeBonus,
            total: baseScore + timeBonus
        };
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScoreCalculator;
}