/**
 * FeedbackSystem Class
 * Handles visual and audio feedback
 */
class FeedbackSystem {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.sounds = {
            correct: null,
            wrong: null,
            click: null,
            win: null
        };
        this.soundEnabled = true;
    }

    /**
     * Show feedback message
     * @param {string} type - 'success', 'error', 'info'
     * @param {string} message - Feedback message
     * @param {boolean} showSolution - Whether to show solution
     * @param {boolean} isHint - Whether this is a hint
     */
    show(type, message, showSolution = false, isHint = false) {
        if (!this.container) return;

        // Clear previous timeout
        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        // Build message content
        let content = `<div class="feedback-content">${message}</div>`;

        if (showSolution && !isHint) {
            content += '<div class="solution"></div>';
        }

        this.container.innerHTML = content;
        this.container.className = `feedback ${type}`;
        this.container.classList.remove('hidden');

        // Play appropriate sound
        if (this.soundEnabled) {
            if (type === 'success') {
                this.playSound('correct');
            } else if (type === 'error') {
                this.playSound('wrong');
            }
        }

        // Add animation class
        if (type === 'success') {
            this.container.classList.add('correct-animation');
        } else if (type === 'error') {
            this.container.classList.add('wrong-animation');
        }

        // Auto-hide after delay
        this.timeout = setTimeout(() => {
            this.hide();
        }, showSolution ? 3000 : 2000);
    }

    /**
     * Hide feedback
     */
    hide() {
        if (!this.container) return;

        this.container.classList.add('hidden');
        this.container.innerHTML = '';
    }

    /**
     * Show success feedback
     * @param {string} message
     */
    success(message) {
        this.show('success', message);
    }

    /**
     * Show error feedback
     * @param {string} message
     * @param {boolean} showSolution
     */
    error(message, showSolution = false) {
        this.show('error', message, showSolution);
    }

    /**
     * Show info feedback
     * @param {string} message
     */
    info(message) {
        this.show('info', message);
    }

    /**
     * Toggle sound
     * @param {boolean} enabled
     */
    setSoundEnabled(enabled) {
        this.soundEnabled = enabled;
    }

    /**
     * Play a sound effect
     * @param {string} name
     */
    playSound(name) {
        const sound = this.sounds[name];
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(() => {});
        }
    }

    /**
     * Load sound effects
     * @param {Object} sources - { correct: url, wrong: url, click: url, win: url }
     */
    loadSounds(sources) {
        for (const [name, src] of Object.entries(sources)) {
            if (src) {
                const audio = new Audio(src);
                audio.preload = 'auto';
                this.sounds[name] = audio;
            }
        }
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FeedbackSystem;
}