/**
 * GameEngine Class
 * Main game controller that coordinates all components
 */
class GameEngine {
    constructor() {
        this.state = new GameState();
        this.currentCardSet = new CardSet();
        this.formula = new Formula();
        this.scoreCalculator = new ScoreCalculator();
        this.timer = null;
        this.hintGenerator = new HintGenerator();
        this.startTime = null;

        // UI references (set by Main)
        this.ui = {};
    }

    /**
     * Initialize the game
     * @param {Object} ui - UI controller reference
     */
    init(ui) {
        this.ui = ui;
    }

    /**
     * Start a new game
     * @param {string} mode - 'classic' or 'speed'
     */
    startGame(mode) {
        if (mode === 'speed') {
            this.state.startSpeed();
            this.timer = new Timer(60);
        } else {
            this.state.startClassic();
            this.timer = null;
        }

        this.startTime = Date.now();
        this.loadNewCardSet();

        // Start timer for speed mode
        if (this.timer) {
            this.timer.onTick((remaining) => {
                this.state.updateTime(remaining);
                if (this.ui.updateTimer) {
                    this.ui.updateTimer(remaining);
                }
            });

            this.timer.onComplete(() => {
                this.endGame();
            });

            this.timer.start();
        }
    }

    /**
     * Load a new card set
     */
    loadNewCardSet() {
        this.currentCardSet.generate();
        this.formula.clear();

        // If unsolvable, try again (up to 10 times)
        let attempts = 0;
        while (!this.currentCardSet.isSolvable && attempts < 10) {
            this.currentCardSet.generate();
            attempts++;
        }

        if (this.ui.updateCards) {
            this.ui.updateCards(this.currentCardSet);
        }

        if (this.ui.updateFormula) {
            this.ui.updateFormula('');
        }

        if (this.ui.updateProgress) {
            this.ui.updateProgress(this.state.currentSetIndex, this.state.totalSets);
        }

        if (this.ui.updateHints) {
            this.ui.updateHints(this.state.hintsRemaining);
        }
    }

    /**
     * Handle card selection
     * @param {NumberCard} card
     */
    selectCard(card) {
        card.toggle();
        this.formula.addElement(card);

        if (this.ui.updateFormula) {
            this.ui.updateFormula(this.formula.buildExpression());
        }

        if (this.ui.updateCardDisplay) {
            this.ui.updateCardDisplay(this.currentCardSet);
        }
    }

    /**
     * Handle operator selection
     * @param {string} operator
     */
    selectOperator(operator) {
        const operatorCard = new OperatorCard(operator);
        const result = this.formula.addElement(operatorCard);

        if (!result.success) {
            if (this.ui.showFeedback) {
                this.ui.showFeedback('error', result.error);
            }
            return false;
        }

        if (this.ui.updateFormula) {
            this.ui.updateFormula(this.formula.buildExpression());
        }

        return true;
    }

    /**
     * Clear the current formula
     */
    clearFormula() {
        this.formula.clear();
        this.currentCardSet.resetSelections();

        if (this.ui.updateFormula) {
            this.ui.updateFormula('');
        }

        if (this.ui.updateCardDisplay) {
            this.ui.updateCardDisplay(this.currentCardSet);
        }
    }

    /**
     * Confirm and check the answer
     */
    confirmAnswer() {
        const validation = this.formula.validate();
        if (!validation.valid) {
            if (this.ui.showFeedback) {
                this.ui.showFeedback('error', validation.error);
            }
            return;
        }

        const result = this.formula.evaluate();

        if (result.error) {
            if (this.ui.showFeedback) {
                this.ui.showFeedback('error', result.error);
            }
            return;
        }

        const timeSpent = this.startTime ? Math.floor((Date.now() - this.startTime) / 1000) : 0;

        if (result.equals24) {
            // Correct answer
            const points = this.scoreCalculator.calculateScore(true, timeSpent);
            this.state.addScore(points);

            if (this.ui.showFeedback) {
                this.ui.showFeedback('success', `太棒了！+${points}分`);
            }

            // Move to next set
            this.nextSet();
        } else {
            // Wrong answer - show solution
            const solution = this.currentCardSet.solution || '无解';
            if (this.ui.showFeedback) {
                this.ui.showFeedback('error', `答案: ${solution}`, true);
            }

            // Still move to next set
            this.nextSet();
        }
    }

    /**
     * Move to the next card set
     */
    nextSet() {
        this.state.nextSet();
        this.startTime = Date.now();

        if (this.state.isGameOver) {
            this.endGame();
        } else {
            this.loadNewCardSet();
        }
    }

    /**
     * Change (shuffle) current cards
     */
    changeCards() {
        this.loadNewCardSet();
    }

    /**
     * Declare no solution
     */
    declareNoSolution() {
        const isActuallyUnsolvable = !this.currentCardSet.isSolvable;

        if (isActuallyUnsolvable) {
            if (this.ui.showFeedback) {
                this.ui.showFeedback('success', '正确！确实无解！');
            }
            this.state.addScore(50); // Smaller bonus for no solution
        } else {
            if (this.ui.showFeedback) {
                this.ui.showFeedback('error', '其实有解哦！再想想~', true);
            }
        }

        this.nextSet();
    }

    /**
     * Use a hint
     */
    useHint() {
        if (!this.state.useHint()) {
            if (this.ui.showFeedback) {
                this.ui.showFeedback('info', '提示已用完');
            }
            return;
        }

        const cardValues = this.currentCardSet.getValues();
        const solution = this.currentCardSet.solution;
        const hint = this.hintGenerator.generate(cardValues, solution);

        if (this.ui.showFeedback) {
            this.ui.showFeedback('info', hint, false, true);
        }

        if (this.ui.updateHints) {
            this.ui.updateHints(this.state.hintsRemaining);
        }
    }

    /**
     * End the game
     */
    endGame() {
        if (this.timer) {
            this.timer.stop();
        }

        this.state.endGame();

        // Calculate final stars
        const duration = this.startTime ? Math.floor((Date.now() - this.startTime) / 1000) : 0;
        const correctCount = Math.floor(this.state.score / 100); // Approximate
        this.state.calculateStars(correctCount, duration);

        if (this.ui.showGameOver) {
            this.ui.showGameOver(this.state.score, this.state.stars);
        }
    }

    /**
     * Get current game state
     * @returns {GameState}
     */
    getState() {
        return this.state;
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameEngine;
}