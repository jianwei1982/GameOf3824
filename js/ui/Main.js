/**
 * Main.js - Entry point that ties everything together
 */

// Wait for DOM and all modules to be ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing game...');
    alert('游戏加载中...');
    try {
        initGame();
        alert('游戏初始化完成！');
    } catch (e) {
        console.error('Error initializing game:', e);
        alert('错误: ' + e.message);
    }
});

function initGame() {
    console.log('initGame called');
    alert('initGame 运行了');
    // Make solver available globally
    window.solver24 = {
        hasSolution: hasSolution,
        getSolution: getSolution,
        checkPlayerExpression: checkPlayerExpression,
        generateHint: generateHint
    };

    // Get UI elements
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const timerDisplay = document.getElementById('timer-display');
    const scoreDisplay = document.getElementById('score');
    const starsDisplay = document.getElementById('stars');
    const progressDisplay = document.getElementById('progress');
    const timerDisplayElement = document.getElementById('time-remaining');
    const numberCardsContainer = document.getElementById('number-cards');
    const formulaPreview = document.getElementById('formula-preview');
    const operatorCards = document.getElementById('operator-cards');
    const feedbackEl = document.getElementById('feedback');
    const hintCountEl = document.getElementById('hint-count');

    // Game state
    let gameState = {
        mode: 'classic',
        score: 0,
        stars: 0,
        hintsRemaining: 3,
        currentSetIndex: 0,
        totalSets: 10,
        timeRemaining: 60,
        isGameOver: false,
        startTime: null,
        currentCards: [],
        currentFormula: []
    };

    let timerInterval = null;

    // Generate random cards
    function generateCards() {
        const cards = [];
        for (let i = 0; i < 4; i++) {
            cards.push(Math.floor(Math.random() * 13) + 1);
        }
        return cards;
    }

    // Render cards to DOM
    function renderCards() {
        numberCardsContainer.innerHTML = '';
        gameState.currentCards.forEach((value, index) => {
            const card = document.createElement('div');
            card.className = 'number-card card-entry';
            card.textContent = value;
            card.dataset.index = index;
            card.style.animationDelay = `${index * 0.1}s`;
            card.addEventListener('click', () => selectCard(index));
            numberCardsContainer.appendChild(card);
        });
    }

    // Handle card selection
    function selectCard(index) {
        const cards = numberCardsContainer.querySelectorAll('.number-card');
        cards[index].classList.toggle('selected');
        gameState.currentFormula.push({ type: 'number', value: gameState.currentCards[index] });
        updateFormulaDisplay();
    }

    // Handle operator selection
    function setupOperatorButtons() {
        const buttons = operatorCards.querySelectorAll('.operator-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const op = btn.dataset.operator;
                gameState.currentFormula.push({ type: 'operator', value: op });
                updateFormulaDisplay();
            });
        });
    }

    // Update formula display
    function updateFormulaDisplay() {
        if (gameState.currentFormula.length === 0) {
            formulaPreview.innerHTML = '<span class="empty">点击数字和运算符卡片开始</span>';
            return;
        }

        let html = '';
        gameState.currentFormula.forEach(item => {
            if (item.type === 'number') {
                html += `<span class="number">${item.value}</span> `;
            } else {
                html += `<span class="operator">${item.value}</span> `;
            }
        });
        formulaPreview.innerHTML = html;
    }

    // Confirm answer
    function confirmAnswer() {
        if (gameState.currentFormula.length === 0) return;

        // Build expression string
        let expr = '';
        gameState.currentFormula.forEach(item => {
            expr += item.value + ' ';
        });
        expr = expr.trim().replace(/\s+/g, '');

        // Try to evaluate
        try {
            // Replace operators for evaluation
            const evalExpr = expr.replace(/×/g, '*').replace(/÷/g, '/');
            const result = eval(evalExpr);

            if (Math.abs(result - 24) < 0.001) {
                // Correct!
                const timeSpent = gameState.startTime ? Math.floor((Date.now() - gameState.startTime) / 1000) : 0;
                const points = 100 + Math.max(0, Math.round(50 * (1 - timeSpent / 30)));
                gameState.score += points;

                showFeedback('success', `太棒了！+${points}分`);

                // Next card set
                setTimeout(nextCardSet, 1500);
            } else {
                // Wrong
                const solution = getSolution(gameState.currentCards);
                showFeedback('error', `答案: ${solution}`, true);
                setTimeout(nextCardSet, 2000);
            }
        } catch (e) {
            showFeedback('error', '算式格式不正确');
        }
    }

    // Clear formula
    function clearFormula() {
        gameState.currentFormula = [];
        renderCards();
        updateFormulaDisplay();
    }

    // Change cards
    function changeCards() {
        gameState.currentCards = generateCards();
        gameState.currentFormula = [];
        renderCards();
        updateFormulaDisplay();
    }

    // Declare no solution
    function declareNoSolution() {
        const result = hasSolution(gameState.currentCards);
        if (!result.solvable) {
            gameState.score += 50;
            showFeedback('success', '正确！确实无解！');
        } else {
            showFeedback('error', '其实有解哦！再想想~', true);
        }
        setTimeout(nextCardSet, 2000);
    }

    // Use hint
    function useHint() {
        if (gameState.hintsRemaining <= 0) {
            showFeedback('info', '提示已用完');
            return;
        }
        gameState.hintsRemaining--;
        hintCountEl.textContent = gameState.hintsRemaining;

        const hint = generateHint(gameState.currentCards, getSolution(gameState.currentCards));
        showFeedback('info', hint, false, true);
    }

    // Show feedback
    function showFeedback(type, message, showSolution = false, isHint = false) {
        let content = `<div class="feedback-content">${message}</div>`;
        feedbackEl.innerHTML = content;
        feedbackEl.className = `feedback ${type}`;
        feedbackEl.classList.remove('hidden');

        setTimeout(() => {
            feedbackEl.classList.add('hidden');
        }, showSolution ? 3000 : 2000);
    }

    // Next card set
    function nextCardSet() {
        gameState.currentSetIndex++;
        gameState.currentFormula = [];

        if (gameState.currentSetIndex >= gameState.totalSets) {
            endGame();
            return;
        }

        gameState.currentCards = generateCards();
        gameState.startTime = Date.now();
        renderCards();
        updateFormulaDisplay();

        // Update UI
        if (progressDisplay) {
            progressDisplay.textContent = `${gameState.currentSetIndex}/${gameState.totalSets}`;
        }
        if (scoreDisplay) {
            scoreDisplay.textContent = gameState.score;
        }
    }

    // End game
    function endGame() {
        gameState.isGameOver = true;
        if (timerInterval) {
            clearInterval(timerInterval);
        }

        // Calculate stars
        const accuracy = gameState.score / (gameState.totalSets * 150);
        let stars = 1;
        if (accuracy >= 0.6) stars = 2;
        if (accuracy >= 0.8) stars = 3;
        gameState.stars = stars;

        // Show end screen
        gameScreen.classList.remove('active');
        document.getElementById('end-screen').classList.add('active');
        document.getElementById('final-score').textContent = gameState.score;
        document.getElementById('final-stars').textContent = stars;
    }

    // Start game
    function startGame(mode) {
        gameState.mode = mode;
        gameState.score = 0;
        gameState.stars = 0;
        gameState.hintsRemaining = 3;
        gameState.currentSetIndex = 0;
        gameState.timeRemaining = 60;
        gameState.isGameOver = false;
        gameState.currentFormula = [];

        // Show game screen
        startScreen.classList.remove('active');
        gameScreen.classList.add('active');

        // Show timer for speed mode
        if (mode === 'speed') {
            timerDisplay.classList.remove('hidden');
            gameState.timeRemaining = 60;
            timerInterval = setInterval(() => {
                gameState.timeRemaining--;
                if (timerDisplayElement) {
                    timerDisplayElement.textContent = gameState.timeRemaining;
                    timerDisplayElement.classList.remove('warning', 'danger');
                    if (gameState.timeRemaining <= 5) {
                        timerDisplayElement.classList.add('danger');
                    } else if (gameState.timeRemaining <= 10) {
                        timerDisplayElement.classList.add('warning');
                    }
                }
                if (gameState.timeRemaining <= 0) {
                    clearInterval(timerInterval);
                    endGame();
                }
            }, 1000);
        } else {
            timerDisplay.classList.add('hidden');
        }

        // Reset UI
        if (hintCountEl) hintCountEl.textContent = '3';
        gameState.currentCards = generateCards();
        gameState.startTime = Date.now();
        renderCards();
        updateFormulaDisplay();

        if (progressDisplay) progressDisplay.textContent = '0/10';
        if (scoreDisplay) scoreDisplay.textContent = '0';
    }

    // Setup button handlers
    document.getElementById('btn-classic').addEventListener('click', () => startGame('classic'));
    document.getElementById('btn-speed').addEventListener('click', () => startGame('speed'));
    document.getElementById('btn-confirm').addEventListener('click', confirmAnswer);
    document.getElementById('btn-clear').addEventListener('click', clearFormula);
    document.getElementById('btn-change').addEventListener('click', changeCards);
    document.getElementById('btn-no-solution').addEventListener('click', declareNoSolution);
    document.getElementById('btn-hint').addEventListener('click', useHint);

    // Game over screen buttons
    document.getElementById('btn-restart').addEventListener('click', () => {
        document.getElementById('end-screen').classList.remove('active');
        gameScreen.classList.add('active');
        startGame(gameState.mode);
    });

    document.getElementById('btn-home').addEventListener('click', () => {
        document.getElementById('end-screen').classList.remove('active');
        startScreen.classList.add('active');
    });

    // Initialize operator buttons
    setupOperatorButtons();

    console.log('Game initialized!');
}

// Make solver functions available globally
function hasSolution(cardValues) {
    if (!cardValues || cardValues.length !== 4) {
        return { solvable: false, solution: null };
    }

    const TARGET = 24;
    const TOLERANCE = 0.0001;

    function permutations(arr) {
        if (arr.length <= 1) return [arr];
        const result = [];
        for (let i = 0; i < arr.length; i++) {
            const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
            const restPerms = permutations(rest);
            for (const perm of restPerms) {
                result.push([arr[i], ...perm]);
            }
        }
        return result;
    }

    function applyOp(a, op, b) {
        switch (op) {
            case '+': return a + b;
            case '-': return a - b;
            case '×': return a * b;
            case '÷': return b !== 0 ? a / b : null;
            default: return null;
        }
    }

    function checkCombination(numbers, ops) {
        const [a, b, c, d] = numbers;
        const [op1, op2, op3] = ops;

        const expressions = [
            `(${a}${op1}${b})${op2}(${c}${op3}${d})`,
            `(${a}${op1}(${b}${op2}${c}))${op3}${d}`,
            `${a}${op1}(${b}${op2}(${c}${op3}${d}))`,
            `${a}${op1}((${b}${op2}${c})${op3}${d})`,
            `(${a}${op1}${b}${op1}${c})${op2}${d}`
        ];

        for (const expr of expressions) {
            try {
                const safeExpr = expr.replace(/×/g, '*').replace(/÷/g, '/');
                if (safeExpr.includes('/0')) continue;
                const result = new Function(`return ${safeExpr}`)();
                if (Math.abs(result - TARGET) < TOLERANCE) {
                    return { solvable: true, solution: expr };
                }
            } catch (e) {
                continue;
            }
        }
        return { solvable: false, solution: null };
    }

    const numberPerms = permutations(cardValues);
    const ops = ['+', '-', '×', '÷'];

    for (const nums of numberPerms) {
        for (let i = 0; i < ops.length; i++) {
            for (let j = 0; j < ops.length; j++) {
                for (let k = 0; k < ops.length; k++) {
                    const result = checkCombination(nums, [ops[i], ops[j], ops[k]]);
                    if (result.solvable) return result;
                }
            }
        }
    }

    return { solvable: false, solution: null };
}

function getSolution(cardValues) {
    return hasSolution(cardValues).solution;
}

function checkPlayerExpression(expression) {
    if (!expression) {
        return { correct: false, result: null, error: 'Empty expression' };
    }

    try {
        const safeExpr = expression.replace(/×/g, '*').replace(/÷/g, '/');
        if (safeExpr.includes('/0')) {
            return { correct: false, result: null, error: 'Division by zero' };
        }

        const result = new Function(`return ${safeExpr}`)();

        if (isNaN(result) || !isFinite(result)) {
            return { correct: false, result: null, error: 'Invalid result' };
        }

        const correct = Math.abs(result - 24) < 0.0001;
        return { correct, result, error: null };
    } catch (e) {
        return { correct: false, result: null, error: e.message };
    }
}

function generateHint(cardValues, solution) {
    if (!solution) {
        return '这组牌可能无解，可以尝试宣布"无解"';
    }

    const hasParentheses = solution.includes('(');
    const hasDivision = solution.includes('÷');
    const hasMultiplication = solution.includes('×');

    if (hasParentheses) return '提示：需要使用括号来改变运算顺序';
    if (hasDivision) return '提示：试试用除法来调整数字';
    if (hasMultiplication) return '提示：尝试使用乘法';

    return '提示：仔细想想数字的组合';
}