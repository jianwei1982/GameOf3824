/**
 * Timer Class
 * Manages countdown timer for speed mode
 */
class Timer {
    constructor(duration = 60) {
        this.duration = duration;
        this.remaining = duration;
        this.isRunning = false;
        this.intervalId = null;
        this.callbacks = {
            onTick: null,
            onWarning: null,
            onDanger: null,
            onComplete: null
        };
    }

    /**
     * Start the timer
     * @param {Function} onTick - Called every second
     */
    start(onTick = null) {
        if (this.isRunning) return;

        if (onTick) {
            this.callbacks.onTick = onTick;
        }

        this.isRunning = true;
        this.intervalId = setInterval(() => {
            this.remaining--;

            if (this.callbacks.onTick) {
                this.callbacks.onTick(this.remaining);
            }

            // Warning at 10 seconds
            if (this.remaining === 10 && this.callbacks.onWarning) {
                this.callbacks.onWarning();
            }

            // Danger at 5 seconds
            if (this.remaining === 5 && this.callbacks.onDanger) {
                this.callbacks.onDanger();
            }

            // Timer complete
            if (this.remaining <= 0) {
                this.stop();
                if (this.callbacks.onComplete) {
                    this.callbacks.onComplete();
                }
            }
        }, 1000);
    }

    /**
     * Stop the timer
     */
    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.isRunning = false;
    }

    /**
     * Reset the timer
     */
    reset(duration = null) {
        this.stop();
        this.duration = duration || this.duration;
        this.remaining = this.duration;
    }

    /**
     * Pause the timer
     */
    pause() {
        this.stop();
    }

    /**
     * Resume the timer
     */
    resume() {
        if (this.remaining > 0) {
            this.start();
        }
    }

    /**
     * Set callback for tick
     * @param {Function} callback
     */
    onTick(callback) {
        this.callbacks.onTick = callback;
    }

    /**
     * Set callback for warning (10 seconds)
     * @param {Function} callback
     */
    onWarning(callback) {
        this.callbacks.onWarning = callback;
    }

    /**
     * Set callback for danger (5 seconds)
     * @param {Function} callback
     */
    onDanger(callback) {
        this.callbacks.onDanger = callback;
    }

    /**
     * Set callback for completion
     * @param {Function} callback
     */
    onComplete(callback) {
        this.callbacks.onComplete = callback;
    }

    /**
     * Get remaining time
     * @returns {number}
     */
    getRemaining() {
        return this.remaining;
    }

    /**
     * Check if timer is running
     * @returns {boolean}
     */
    getIsRunning() {
        return this.isRunning;
    }

    /**
     * Format time as MM:SS
     * @returns {string}
     */
    formatTime() {
        const minutes = Math.floor(this.remaining / 60);
        const seconds = this.remaining % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Timer;
}