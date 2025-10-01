// ============================================
// PARTICLE SYSTEM
// ============================================
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
    }

    createExplosion(x, y, color, count = 30) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x, y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 1.0,
                color,
                size: Math.random() * 4 + 2
            });
        }
    }

    createConfetti(x, y, count = 50) {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7'];
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x, y,
                vx: (Math.random() - 0.5) * 15,
                vy: Math.random() * -10 - 5,
                life: 1.0,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 6 + 3,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.3
            });
        }
    }

    createFloatingText(x, y, text, color = '#4CAF50') {
        this.particles.push({
            x, y,
            vx: 0,
            vy: -2,
            life: 1.5,
            text,
            color,
            size: 24,
            type: 'text'
        });
    }

    update(deltaTime = 16) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            p.x += p.vx * deltaTime / 16;
            p.y += p.vy * deltaTime / 16;
            p.vy += 0.3; // gravity
            p.life -= deltaTime / 1000;

            if (p.rotation !== undefined) {
                p.rotation += p.rotationSpeed;
            }

            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    render() {
        // Clear the canvas first
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(p => {
            this.ctx.save();
            this.ctx.globalAlpha = Math.max(0, p.life);

            if (p.type === 'text') {
                this.ctx.font = `bold ${p.size}px Arial`;
                this.ctx.fillStyle = p.color;
                this.ctx.textAlign = 'center';
                this.ctx.fillText(p.text, p.x, p.y);
            } else {
                this.ctx.translate(p.x, p.y);
                if (p.rotation !== undefined) {
                    this.ctx.rotate(p.rotation);
                }
                this.ctx.fillStyle = p.color;
                this.ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
            }

            this.ctx.restore();
        });
    }
}

// ============================================
// SOUND SYSTEM
// ============================================
class SoundSystem {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.enabled = true;
        this.volume = 0.3;
    }

    playCorrect() {
        if (!this.enabled) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.frequency.setValueAtTime(523.25, this.ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, this.ctx.currentTime + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, this.ctx.currentTime + 0.2); // G5

        gain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);

        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.4);
    }

    playIncorrect() {
        if (!this.enabled) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.frequency.setValueAtTime(400, this.ctx.currentTime);
        osc.frequency.setValueAtTime(200, this.ctx.currentTime + 0.2);

        gain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);

        osc.type = 'sawtooth';
        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.3);
    }

    playPowerUp() {
        if (!this.enabled) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.frequency.setValueAtTime(200, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.2);

        gain.gain.setValueAtTime(this.volume * 0.5, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);

        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.2);
    }

    playCombo(level) {
        if (!this.enabled) return;

        const baseFreq = 440 + (level * 50);
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
        osc.frequency.setValueAtTime(baseFreq * 1.5, this.ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(this.volume * 0.6, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);

        osc.type = 'sine';
        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.3);
    }

    playAchievement() {
        if (!this.enabled) return;

        const notes = [523.25, 659.25, 783.99, 1046.50]; // C-E-G-C major arpeggio

        notes.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            const startTime = this.ctx.currentTime + (i * 0.15);
            osc.frequency.setValueAtTime(freq, startTime);

            gain.gain.setValueAtTime(this.volume * 0.4, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

            osc.start(startTime);
            osc.stop(startTime + 0.3);
        });
    }

    playTick() {
        if (!this.enabled) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        gain.gain.setValueAtTime(this.volume * 0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.05);
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
}

// ============================================
// ACHIEVEMENT SYSTEM
// ============================================
class AchievementSystem {
    constructor() {
        this.achievements = {
            firstBlood: { name: 'First Blood', desc: 'Get your first answer correct', unlocked: false, icon: '🎯' },
            perfectTen: { name: 'Perfect 10', desc: 'Get 10 correct in a row', unlocked: false, icon: '🔥' },
            speedDemon: { name: 'Speed Demon', desc: 'Answer correctly in under 3 seconds', unlocked: false, icon: '⚡' },
            scholar: { name: 'Poop Scholar', desc: 'Complete a game with 90%+ accuracy', unlocked: false, icon: '🎓' },
            streakMaster: { name: 'Streak Master', desc: 'Achieve a 15+ streak', unlocked: false, icon: '🌟' },
            noHelp: { name: 'No Assistance', desc: 'Complete 10 rounds without using power-ups', unlocked: false, icon: '💪' },
            completionist: { name: 'Completionist', desc: 'Finish 5 full games', unlocked: false, icon: '🏆' },
            highScore: { name: 'High Roller', desc: 'Score 5000+ points in one game', unlocked: false, icon: '💎' },
            comboKing: { name: 'Combo King', desc: 'Reach a 5x multiplier', unlocked: false, icon: '👑' },
            dedicated: { name: 'Dedicated', desc: 'Play 20 total games', unlocked: false, icon: '🎮' },
            insectExpert: { name: 'Bug Expert', desc: 'Correctly identify all insects', unlocked: false, icon: '🐛' },
            birdWatcher: { name: 'Bird Watcher', desc: 'Correctly identify all birds', unlocked: false, icon: '🦅' }
        };

        this.loadProgress();
    }

    check(achievementId, condition) {
        if (!this.achievements[achievementId]) return false;
        if (this.achievements[achievementId].unlocked) return false;

        if (condition) {
            this.achievements[achievementId].unlocked = true;
            this.saveProgress();
            return true;
        }
        return false;
    }

    getAll() {
        return Object.entries(this.achievements).map(([id, data]) => ({
            id,
            ...data
        }));
    }

    getUnlockedCount() {
        return Object.values(this.achievements).filter(a => a.unlocked).length;
    }

    saveProgress() {
        localStorage.setItem('poopGameAchievements', JSON.stringify(this.achievements));
    }

    loadProgress() {
        const saved = localStorage.getItem('poopGameAchievements');
        if (saved) {
            const loaded = JSON.parse(saved);
            Object.keys(loaded).forEach(key => {
                if (this.achievements[key]) {
                    this.achievements[key].unlocked = loaded[key].unlocked;
                }
            });
        }
    }

    reset() {
        Object.values(this.achievements).forEach(a => a.unlocked = false);
        this.saveProgress();
    }
}

// ============================================
// GAME STATE MANAGER
// ============================================
class GameState {
    constructor() {
        this.score = 0;
        this.streak = 0;
        this.bestStreak = 0;
        this.multiplier = 1;
        this.currentRound = 0;
        this.totalRounds = 40;
        this.correctAnswers = 0;
        this.totalGamesPlayed = 0;
        this.highScore = 0;
        this.currentAnimal = null;
        this.choices = [];
        this.gameAnimals = [];
        this.fiftyFiftyUsed = false;
        this.hintUsed = false;
        this.roundsWithoutPowerups = 0;
        this.answerStartTime = 0;
        this.categoriesCorrect = {
            insect: 0,
            bird: 0,
            farm: 0,
            reptile: 0,
            wild: 0,
            common: 0
        };

        this.loadStats();
    }

    addScore(points) {
        const actualPoints = Math.floor(points * this.multiplier);
        this.score += actualPoints;
        return actualPoints;
    }

    increaseMultiplier() {
        this.multiplier = Math.min(5, this.multiplier + 0.5);
    }

    resetMultiplier() {
        this.multiplier = 1;
    }

    saveStats() {
        const stats = {
            totalGamesPlayed: this.totalGamesPlayed,
            highScore: this.highScore
        };
        localStorage.setItem('poopGameStats', JSON.stringify(stats));
    }

    loadStats() {
        const saved = localStorage.getItem('poopGameStats');
        if (saved) {
            const stats = JSON.parse(saved);
            this.totalGamesPlayed = stats.totalGamesPlayed || 0;
            this.highScore = stats.highScore || 0;
        }
    }

    incrementGamesPlayed() {
        this.totalGamesPlayed++;
        if (this.score > this.highScore) {
            this.highScore = this.score;
        }
        this.saveStats();
    }
}

// ============================================
// MAIN GAME CLASS
// ============================================
class PoopGame {
    constructor() {
        this.state = new GameState();
        this.particles = null;
        this.sounds = new SoundSystem();
        this.achievements = new AchievementSystem();
        this.animationFrame = null;
        this.lastTime = 0;
        this.timerInterval = null;

        this.initializeElements();
        this.attachEventListeners();
        this.updateAchievementDisplay();
        this.startAnimationLoop();
    }

    initializeElements() {
        // Screens
        this.startScreen = document.getElementById('start-screen');
        this.gameScreen = document.getElementById('game-screen');
        this.endScreen = document.getElementById('end-screen');
        this.achievementScreen = document.getElementById('achievement-screen');

        // Game elements
        this.scoreEl = document.getElementById('score');
        this.streakEl = document.getElementById('streak');
        this.multiplierEl = document.getElementById('multiplier');
        this.roundEl = document.getElementById('round');
        this.timerEl = document.getElementById('timer');
        this.poopCanvas = document.getElementById('poop-canvas');
        this.particleCanvas = document.getElementById('particle-canvas');
        this.ctx = this.poopCanvas.getContext('2d');
        this.choiceButtons = document.querySelectorAll('.choice-btn');
        this.feedbackEl = document.getElementById('feedback');
        this.feedbackTitle = document.getElementById('feedback-title');
        this.feedbackText = document.getElementById('feedback-text');
        this.funFactEl = document.getElementById('fun-fact');
        this.hintText = document.getElementById('hint-text');
        this.hintBtn = document.getElementById('hint-btn');
        this.fiftyFiftyBtn = document.getElementById('fifty-fifty-btn');
        this.soundToggle = document.getElementById('sound-toggle');

        // End screen elements
        this.finalScoreEl = document.getElementById('final-score');
        this.correctCountEl = document.getElementById('correct-count');
        this.bestStreakEl = document.getElementById('best-streak');
        this.accuracyEl = document.getElementById('accuracy');
        this.rankEl = document.getElementById('rank');
        this.highScoreEl = document.getElementById('high-score-display');
        this.newAchievementsEl = document.getElementById('new-achievements');

        // Initialize particle system
        this.particles = new ParticleSystem(this.particleCanvas);

        // Set particle canvas size
        this.resizeParticleCanvas();
        window.addEventListener('resize', () => this.resizeParticleCanvas());
    }

    attachEventListeners() {
        // Start game button
        document.getElementById('start-game-btn')?.addEventListener('click', () => {
            this.startGame();
        });

        // Choice buttons
        this.choiceButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (!btn.disabled) {
                    this.checkAnswer(parseInt(e.currentTarget.dataset.choice));
                }
            });
        });

        // Power-up buttons
        this.hintBtn.addEventListener('click', () => this.useHint());
        this.fiftyFiftyBtn.addEventListener('click', () => this.useFiftyFifty());

        // Next button
        document.getElementById('next-btn').addEventListener('click', () => this.nextRound());

        // Play again button
        document.getElementById('play-again-btn').addEventListener('click', () => this.resetGame());

        // Back button
        document.getElementById('back-btn')?.addEventListener('click', () => this.resetGame());

        // Sound toggle
        this.soundToggle?.addEventListener('click', () => {
            const enabled = this.sounds.toggle();
            this.soundToggle.textContent = enabled ? '🔊' : '🔇';
        });

        // Achievement button
        document.getElementById('achievement-btn')?.addEventListener('click', () => {
            this.showAchievements();
        });

        document.getElementById('achievement-back-btn')?.addEventListener('click', () => {
            this.hideAchievements();
        });
    }


    resizeParticleCanvas() {
        this.particleCanvas.width = window.innerWidth;
        this.particleCanvas.height = window.innerHeight;
    }

    startAnimationLoop() {
        const animate = (currentTime) => {
            const deltaTime = currentTime - this.lastTime;
            this.lastTime = currentTime;

            this.particles.update(deltaTime);
            this.particles.render();

            this.animationFrame = requestAnimationFrame(animate);
        };

        this.animationFrame = requestAnimationFrame(animate);
    }

    startGame() {
        // Use all animals for the game
        const animalPool = [...animalData];

        // Shuffle and select animals
        this.state.gameAnimals = this.shuffleArray(animalPool).slice(0, this.state.totalRounds);

        // Reset state
        this.state.currentRound = 0;
        this.state.score = 0;
        this.state.streak = 0;
        this.state.multiplier = 1;
        this.state.correctAnswers = 0;
        this.state.roundsWithoutPowerups = 0;
        this.state.categoriesCorrect = {
            insect: 0, bird: 0, farm: 0, reptile: 0, wild: 0, common: 0
        };
        this.newAchievementsThisGame = [];

        // Show game screen
        this.startScreen.classList.remove('active');
        this.gameScreen.classList.add('active');

        // Hide timer (no timed mode)
        this.timerEl.parentElement.style.display = 'none';

        this.nextRound();
    }

    nextRound() {
        if (this.state.currentRound >= this.state.totalRounds) {
            this.endGame();
            return;
        }

        // Stop any existing timer
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        // Reset round state
        this.state.fiftyFiftyUsed = false;
        this.state.hintUsed = false;
        this.hintText.classList.add('hidden');
        this.feedbackEl.classList.add('hidden');

        // Enable buttons
        this.choiceButtons.forEach(btn => {
            btn.disabled = false;
            btn.classList.remove('correct', 'incorrect', 'eliminated');
        });
        this.hintBtn.disabled = false;
        this.fiftyFiftyBtn.disabled = false;

        // Get current animal
        this.state.currentAnimal = this.state.gameAnimals[this.state.currentRound];
        this.state.currentRound++;
        this.state.answerStartTime = Date.now();

        // Update round display
        this.updateDisplay();

        // Draw poop
        this.drawPoop(this.state.currentAnimal);

        // Setup choices
        this.setupChoices();
    }

    startTimer() {
        this.state.timeLeft = 20;
        this.updateTimerDisplay();

        this.timerInterval = setInterval(() => {
            this.state.timeLeft--;
            this.updateTimerDisplay();

            if (this.state.timeLeft <= 5) {
                this.sounds.playTick();
            }

            if (this.state.timeLeft <= 0) {
                clearInterval(this.timerInterval);
                this.handleTimeOut();
            }
        }, 1000);
    }

    updateTimerDisplay() {
        if (this.timerEl) {
            this.timerEl.textContent = this.state.timeLeft;
            if (this.state.timeLeft <= 5) {
                this.timerEl.style.color = '#ff4757';
                this.timerEl.style.animation = 'pulse 0.5s infinite';
            } else {
                this.timerEl.style.color = '#4CAF50';
                this.timerEl.style.animation = 'none';
            }
        }
    }

    handleTimeOut() {
        this.choiceButtons.forEach(btn => btn.disabled = true);

        // Show correct answer
        this.choiceButtons.forEach((btn, idx) => {
            if (this.state.choices[idx].name === this.state.currentAnimal.name) {
                btn.classList.add('correct');
            }
        });

        this.state.streak = 0;
        this.state.multiplier = 1;
        this.updateDisplay();
        this.showFeedback(false, true);
        this.sounds.playIncorrect();
    }

    drawPoop(animal) {
        const ctx = this.ctx;
        const canvas = this.poopCanvas;

        // Clear canvas with beige background
        ctx.fillStyle = '#f5f5dc';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Center position
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        // Better normalization - make poops larger and more visible
        const minScale = 1.0;
        const maxScale = 1.8;
        const normalizedSize = Math.log(animal.poopSize + 10) / Math.log(110);
        const scale = minScale + normalizedSize * (maxScale - minScale);

        // Set base color
        ctx.fillStyle = animal.poopColor;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2.5;

        // Draw based on shape - no shadow, it looks dumb
        const drawMethod = `draw${animal.poopShape.charAt(0).toUpperCase() + animal.poopShape.slice(1)}`;
        if (typeof this[drawMethod] === 'function') {
            this[drawMethod](ctx, centerX, centerY, scale, animal.poopColor);
        } else {
            this.drawGenericPoop(ctx, centerX, centerY, scale, animal.poopColor);
        }
    }

    createGradient(ctx, x, y, radius, baseColor) {
        const gradient = ctx.createRadialGradient(x - radius * 0.3, y - radius * 0.3, 0, x, y, radius);

        // Lighten color for highlight
        const r = parseInt(baseColor.slice(1, 3), 16);
        const g = parseInt(baseColor.slice(3, 5), 16);
        const b = parseInt(baseColor.slice(5, 7), 16);

        const highlightColor = `rgb(${Math.min(255, r + 40)}, ${Math.min(255, g + 40)}, ${Math.min(255, b + 40)})`;
        const shadowColor = `rgb(${Math.max(0, r - 30)}, ${Math.max(0, g - 30)}, ${Math.max(0, b - 30)})`;

        gradient.addColorStop(0, highlightColor);
        gradient.addColorStop(0.5, baseColor);
        gradient.addColorStop(1, shadowColor);

        return gradient;
    }

    addTexture(ctx, x, y, width, height, density = 50) {
        ctx.save();
        ctx.globalAlpha = 0.15;
        ctx.fillStyle = '#3e2817';

        for (let i = 0; i < density; i++) {
            const tx = x + (Math.random() - 0.5) * width;
            const ty = y + (Math.random() - 0.5) * height;
            const size = Math.random() * 2 + 0.5;

            ctx.beginPath();
            ctx.arc(tx, ty, size, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }

    setupChoices() {
        // Get wrong choices
        const wrongAnimals = this.getWrongChoices(this.state.currentAnimal, 3);

        // Combine with correct answer
        this.state.choices = [this.state.currentAnimal, ...wrongAnimals];

        // Shuffle choices
        this.state.choices = this.shuffleArray(this.state.choices);

        // Update buttons
        this.choiceButtons.forEach((btn, index) => {
            const animal = this.state.choices[index];
            const img = btn.querySelector('.animal-img');
            const name = btn.querySelector('.animal-name');

            img.textContent = this.getAnimalEmoji(animal.name);
            img.style.fontSize = '60px';
            img.style.width = '80px';
            img.style.height = '80px';
            img.style.display = 'flex';
            img.style.alignItems = 'center';
            img.style.justifyContent = 'center';
            img.alt = animal.name;
            name.textContent = animal.name;
        });
    }

    checkAnswer(choiceIndex) {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        const answerTime = (Date.now() - this.state.answerStartTime) / 1000;
        const selectedAnimal = this.state.choices[choiceIndex];
        const correct = selectedAnimal.name === this.state.currentAnimal.name;

        // Disable all buttons
        this.choiceButtons.forEach(btn => btn.disabled = true);

        // Get button position for particles
        const selectedButton = this.choiceButtons[choiceIndex];
        const rect = selectedButton.getBoundingClientRect();
        const canvasRect = this.particleCanvas.getBoundingClientRect();
        const particleX = rect.left + rect.width / 2 - canvasRect.left;
        const particleY = rect.top + rect.height / 2 - canvasRect.top;

        // Show result
        if (correct) {
            selectedButton.classList.add('correct');
            this.handleCorrectAnswer(answerTime, particleX, particleY);
        } else {
            selectedButton.classList.add('incorrect');
            // Show correct answer
            this.choiceButtons.forEach((btn, idx) => {
                if (this.state.choices[idx].name === this.state.currentAnimal.name) {
                    btn.classList.add('correct');
                }
            });
            this.handleIncorrectAnswer(particleX, particleY);
        }

        // Show feedback
        this.showFeedback(correct, false, answerTime);
    }

    handleCorrectAnswer(answerTime, x, y) {
        this.state.correctAnswers++;
        this.state.streak++;

        if (this.state.streak > this.state.bestStreak) {
            this.state.bestStreak = this.state.streak;
        }

        // Track category
        this.state.categoriesCorrect[this.state.currentAnimal.category]++;

        // Calculate points
        let points = 100;
        if (this.state.hintUsed) points -= 50;
        if (this.state.fiftyFiftyUsed) points -= 25;

        // Streak bonus
        points += this.state.streak * 10;

        // Increase multiplier
        if (this.state.streak % 3 === 0) {
            this.state.increaseMultiplier();
            this.sounds.playCombo(this.state.multiplier);
            this.particles.createFloatingText(
                this.particleCanvas.width / 2,
                100,
                `${this.state.multiplier}x MULTIPLIER!`,
                '#6c5ce7'
            );
        }

        const actualPoints = this.state.addScore(points);

        // Track powerup-free rounds
        if (!this.state.hintUsed && !this.state.fiftyFiftyUsed) {
            this.state.roundsWithoutPowerups++;
        }

        // Particles and sound
        this.particles.createConfetti(x, y, 40);
        this.particles.createFloatingText(x, y, `+${actualPoints}`, '#4CAF50');
        this.sounds.playCorrect();

        // Check achievements
        this.checkAchievements(answerTime);

        this.updateDisplay();
    }

    handleIncorrectAnswer(x, y) {
        this.state.streak = 0;
        this.state.resetMultiplier();
        this.particles.createExplosion(x, y, '#f44336', 20);
        this.sounds.playIncorrect();
        this.updateDisplay();
    }

    showFeedback(correct, timeout = false, answerTime = 0) {
        this.feedbackEl.classList.remove('hidden');

        if (timeout) {
            this.feedbackTitle.textContent = 'Time\'s Up! ⏰';
            this.feedbackTitle.className = 'incorrect';
            this.feedbackText.textContent = `The correct answer was ${this.state.currentAnimal.name}!`;
        } else if (correct) {
            let title = 'Correct! 🎉';
            if (answerTime < 3) title = 'Lightning Fast! ⚡';
            if (this.state.streak >= 5) title = `${this.state.streak} Streak! 🔥`;

            this.feedbackTitle.textContent = title;
            this.feedbackTitle.className = 'correct';
            this.feedbackText.textContent = `That's ${this.state.currentAnimal.name} poop!`;
        } else {
            this.feedbackTitle.textContent = 'Wrong! 😅';
            this.feedbackTitle.className = 'incorrect';
            this.feedbackText.textContent = `That was ${this.state.currentAnimal.name} poop!`;
        }

        this.funFactEl.textContent = `💡 ${this.state.currentAnimal.funFact}`;
    }

    useHint() {
        if (!this.state.hintUsed) {
            this.state.hintUsed = true;
            this.hintBtn.disabled = true;
            this.hintText.textContent = `💡 Hint: ${this.state.currentAnimal.hint}`;
            this.hintText.classList.remove('hidden');
            this.sounds.playPowerUp();
            this.state.roundsWithoutPowerups = 0;
        }
    }

    useFiftyFifty() {
        if (!this.state.fiftyFiftyUsed) {
            this.state.fiftyFiftyUsed = true;
            this.fiftyFiftyBtn.disabled = true;

            // Find wrong answers
            const wrongIndices = [];
            this.state.choices.forEach((animal, idx) => {
                if (animal.name !== this.state.currentAnimal.name) {
                    wrongIndices.push(idx);
                }
            });

            // Eliminate 2 wrong answers
            const toEliminate = this.shuffleArray(wrongIndices).slice(0, 2);
            toEliminate.forEach(idx => {
                this.choiceButtons[idx].classList.add('eliminated');
                this.choiceButtons[idx].disabled = true;
            });

            this.sounds.playPowerUp();
            this.state.roundsWithoutPowerups = 0;
        }
    }

    checkAchievements(answerTime) {
        const centerX = this.particleCanvas.width / 2;

        // First Blood
        if (this.achievements.check('firstBlood', this.state.correctAnswers === 1)) {
            this.showAchievementUnlock('firstBlood', centerX, 150);
        }

        // Perfect Ten
        if (this.achievements.check('perfectTen', this.state.streak === 10)) {
            this.showAchievementUnlock('perfectTen', centerX, 150);
        }

        // Speed Demon
        if (this.achievements.check('speedDemon', answerTime < 3)) {
            this.showAchievementUnlock('speedDemon', centerX, 150);
        }

        // Streak Master
        if (this.achievements.check('streakMaster', this.state.streak >= 15)) {
            this.showAchievementUnlock('streakMaster', centerX, 150);
        }

        // No Help
        if (this.achievements.check('noHelp', this.state.roundsWithoutPowerups >= 10)) {
            this.showAchievementUnlock('noHelp', centerX, 150);
        }

        // Combo King
        if (this.achievements.check('comboKing', this.state.multiplier >= 5)) {
            this.showAchievementUnlock('comboKing', centerX, 150);
        }
    }

    showAchievementUnlock(achievementId, x, y) {
        const achievement = this.achievements.achievements[achievementId];
        this.particles.createFloatingText(x, y, `${achievement.icon} ${achievement.name}`, '#ffd700');
        this.sounds.playAchievement();
        this.newAchievementsThisGame = this.newAchievementsThisGame || [];
        this.newAchievementsThisGame.push(achievement);
    }

    updateDisplay() {
        this.scoreEl.textContent = this.state.score;
        this.streakEl.textContent = this.state.streak;
        this.multiplierEl.textContent = `${this.state.multiplier}x`;
        this.roundEl.textContent = `${this.state.currentRound}/${this.state.totalRounds}`;

        // Visual feedback for multiplier
        if (this.state.multiplier > 1) {
            this.multiplierEl.style.color = '#f9ca24';
            this.multiplierEl.style.animation = 'pulse 0.5s infinite';
        } else {
            this.multiplierEl.style.color = 'white';
            this.multiplierEl.style.animation = 'none';
        }
    }

    endGame() {
        this.state.incrementGamesPlayed();

        this.gameScreen.classList.remove('active');
        this.endScreen.classList.add('active');

        const accuracy = Math.round((this.state.correctAnswers / this.state.totalRounds) * 100);

        this.finalScoreEl.textContent = this.state.score;
        this.correctCountEl.textContent = this.state.correctAnswers;
        this.bestStreakEl.textContent = this.state.bestStreak;
        this.accuracyEl.textContent = accuracy;
        this.highScoreEl.textContent = this.state.highScore;

        // Determine rank
        let rank = '';
        if (accuracy >= 90) rank = '🏆 Poop Professor!';
        else if (accuracy >= 75) rank = '🥇 Scat Scholar!';
        else if (accuracy >= 60) rank = '🥈 Dropping Detective!';
        else if (accuracy >= 40) rank = '🥉 Poop Pupil!';
        else rank = '💩 Keep Studying Those Poops!';

        this.rankEl.textContent = rank;

        // Show new high score
        if (this.state.score === this.state.highScore && this.state.score > 0) {
            this.highScoreEl.style.animation = 'pulse 1s infinite';
            this.highScoreEl.style.color = '#ffd700';
        }

        // Check end-game achievements
        if (this.achievements.check('scholar', accuracy >= 90)) {
            this.showAchievementUnlock('scholar', this.particleCanvas.width / 2, 200);
        }

        if (this.achievements.check('highScore', this.state.score >= 5000)) {
            this.showAchievementUnlock('highScore', this.particleCanvas.width / 2, 200);
        }

        if (this.achievements.check('completionist', this.state.totalGamesPlayed >= 5)) {
            this.showAchievementUnlock('completionist', this.particleCanvas.width / 2, 200);
        }

        if (this.achievements.check('dedicated', this.state.totalGamesPlayed >= 20)) {
            this.showAchievementUnlock('dedicated', this.particleCanvas.width / 2, 200);
        }

        // Check category achievements
        const insectAnimals = animalData.filter(a => a.category === 'insect');
        if (this.state.categoriesCorrect.insect >= insectAnimals.length &&
            this.achievements.check('insectExpert', true)) {
            this.showAchievementUnlock('insectExpert', this.particleCanvas.width / 2, 200);
        }

        const birdAnimals = animalData.filter(a => a.category === 'bird');
        if (this.state.categoriesCorrect.bird >= birdAnimals.length &&
            this.achievements.check('birdWatcher', true)) {
            this.showAchievementUnlock('birdWatcher', this.particleCanvas.width / 2, 200);
        }

        // Display new achievements
        if (this.newAchievementsThisGame && this.newAchievementsThisGame.length > 0) {
            this.newAchievementsEl.innerHTML = '<h3>🎉 New Achievements Unlocked!</h3>' +
                this.newAchievementsThisGame.map(a =>
                    `<div class="achievement-item unlocked">
                        <span class="achievement-icon">${a.icon}</span>
                        <div>
                            <strong>${a.name}</strong>
                            <p>${a.desc}</p>
                        </div>
                    </div>`
                ).join('');
        } else {
            this.newAchievementsEl.innerHTML = '';
        }

        this.updateAchievementDisplay();
    }

    resetGame() {
        this.endScreen.classList.remove('active');
        this.achievementScreen?.classList.remove('active');
        this.startScreen.classList.add('active');

        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        // Reset state
        this.state.score = 0;
        this.state.streak = 0;
        this.state.bestStreak = 0;
        this.state.multiplier = 1;
        this.state.currentRound = 0;
        this.state.correctAnswers = 0;
        this.state.roundsWithoutPowerups = 0;
        this.updateDisplay();
    }

    showAchievements() {
        this.startScreen.classList.remove('active');
        this.achievementScreen.classList.add('active');
        this.updateAchievementDisplay();
    }

    hideAchievements() {
        this.achievementScreen.classList.remove('active');
        this.startScreen.classList.add('active');
    }

    updateAchievementDisplay() {
        const container = document.getElementById('achievement-list');
        if (!container) return;

        const achievements = this.achievements.getAll();
        const unlockedCount = this.achievements.getUnlockedCount();

        document.getElementById('achievement-count').textContent =
            `${unlockedCount} / ${achievements.length}`;

        container.innerHTML = achievements.map(a =>
            `<div class="achievement-item ${a.unlocked ? 'unlocked' : 'locked'}">
                <span class="achievement-icon">${a.unlocked ? a.icon : '🔒'}</span>
                <div>
                    <strong>${a.unlocked ? a.name : '???'}</strong>
                    <p>${a.unlocked ? a.desc : 'Hidden achievement'}</p>
                </div>
            </div>`
        ).join('');
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    getWrongChoices(correctAnimal, count) {
        const sameCategory = animalData.filter(a =>
            a.category === correctAnimal.category && a.name !== correctAnimal.name
        );

        const otherAnimals = animalData.filter(a =>
            a.category !== correctAnimal.category && a.name !== correctAnimal.name
        );

        const choices = [];
        if (sameCategory.length > 0) {
            choices.push(sameCategory[Math.floor(Math.random() * sameCategory.length)]);
        }

        const remaining = this.shuffleArray(otherAnimals);
        while (choices.length < count) {
            choices.push(remaining.pop());
        }

        return this.shuffleArray(choices).slice(0, count);
    }

    getAnimalEmoji(animalName) {
        const emojiMap = {
            'Earwig': '🐛', 'Caterpillar': '🐛', 'Cricket': '🦗', 'Beetle': '🪲',
            'Pigeon': '🕊️', 'Seagull': '🦅', 'Owl': '🦉', 'Parrot': '🦜', 'Chicken': '🐔',
            'Cow': '🐄', 'Horse': '🐴', 'Pig': '🐷', 'Sheep': '🐑', 'Goat': '🐐', 'Llama': '🦙',
            'Alligator': '🐊', 'Snake': '🐍', 'Iguana': '🦎', 'Turtle': '🐢', 'Gecko': '🦎',
            'Elephant': '🐘', 'Tiger': '🐅', 'Giraffe': '🦒', 'Hippo': '🦛', 'Rhino': '🦏',
            'Koala': '🐨', 'Panda': '🐼', 'Wombat': '🦫',
            'Dog': '🐕', 'Cat': '🐈', 'Rabbit': '🐰', 'Mouse': '🐭', 'Rat': '🐀',
            'Squirrel': '🐿️', 'Deer': '🦌', 'Fox': '🦊', 'Raccoon': '🦝', 'Bat': '🦇'
        };
        return emojiMap[animalName] || '🐾';
    }

    // POOP DRAWING METHODS (keeping existing ones)
    drawDots(ctx, x, y, scale) {
        for (let i = 0; i < 30; i++) {
            const angle = (i / 5) * Math.PI * 2 + Math.random() * 0.5;
            const distance = Math.random() * 40 * scale;
            const dotX = x + Math.cos(angle) * distance;
            const dotY = y + Math.sin(angle) * distance;
            ctx.beginPath();
            ctx.arc(dotX, dotY, 1.5 * scale, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    drawPellets(ctx, x, y, scale, baseColor) {
        const positions = [
            [0, 0], [-15, -10], [15, -10], [-10, 10], [10, 10],
            [-20, 0], [20, 0], [0, -15], [0, 15], [-8, -8], [8, 8]
        ];
        positions.forEach(([dx, dy]) => {
            const pelletX = x + dx * scale;
            const pelletY = y + dy * scale;

            // Gradient for each pellet
            ctx.fillStyle = this.createGradient(ctx, pelletX, pelletY, 7 * scale, baseColor);

            ctx.beginPath();
            ctx.ellipse(pelletX, pelletY, 7 * scale, 5 * scale, Math.random() * Math.PI, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Mini texture on each pellet
            this.addTexture(ctx, pelletX, pelletY, 14 * scale, 10 * scale, 5);
        });
    }

    drawLog(ctx, x, y, scale) {
        ctx.beginPath();
        ctx.moveTo(x - 40 * scale, y - 10 * scale);
        ctx.bezierCurveTo(
            x - 20 * scale, y - 15 * scale,
            x + 20 * scale, y - 15 * scale,
            x + 40 * scale, y - 5 * scale
        );
        ctx.bezierCurveTo(
            x + 45 * scale, y + 5 * scale,
            x + 20 * scale, y + 15 * scale,
            x - 30 * scale, y + 10 * scale
        );
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    drawSplat(ctx, x, y, scale) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const radius = (30 + Math.random() * 20) * scale;
            const px = x + Math.cos(angle) * radius;
            const py = y + Math.sin(angle) * radius;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#333333';
        ctx.beginPath();
        ctx.arc(x, y, 10 * scale, 0, Math.PI * 2);
        ctx.fill();
    }

    drawPatty(ctx, x, y, scale, baseColor) {
        // Large flat cow patty with realistic texture
        ctx.fillStyle = this.createGradient(ctx, x, y, 55 * scale, baseColor);

        ctx.beginPath();
        ctx.ellipse(x, y, 55 * scale, 35 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Heavy texture for cow patty
        this.addTexture(ctx, x, y, 110 * scale, 70 * scale, 80);

        // Add concentric rings for wetness
        ctx.save();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.2;
        ctx.beginPath();
        ctx.ellipse(x, y, 40 * scale, 25 * scale, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(x, y, 25 * scale, 15 * scale, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // Add cracks/variation
        ctx.save();
        ctx.strokeStyle = '#4a3c28';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.3;
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.moveTo(x + (Math.random() - 0.5) * 80 * scale, y);
            ctx.lineTo(x + (Math.random() - 0.5) * 80 * scale, y + (Math.random() - 0.5) * 40 * scale);
            ctx.stroke();
        }
        ctx.restore();
    }

    drawBalls(ctx, x, y, scale, baseColor) {
        const positions = [
            [0, 0], [-20, -15], [20, -15], [-15, 15], [15, 15], [0, -25], [0, 20]
        ];
        positions.forEach(([dx, dy]) => {
            const ballX = x + dx * scale;
            const ballY = y + dy * scale;

            // Gradient for spherical effect
            ctx.fillStyle = this.createGradient(ctx, ballX, ballY, 15 * scale, baseColor);

            ctx.beginPath();
            ctx.arc(ballX, ballY, 15 * scale, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Texture
            this.addTexture(ctx, ballX, ballY, 30 * scale, 30 * scale, 15);

            // Highlight
            ctx.save();
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.beginPath();
            ctx.arc(ballX - 5 * scale, ballY - 5 * scale, 6 * scale, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
    }

    drawCube(ctx, x, y, scale, baseColor) {
        // Wombat's distinctive cube poop - enhanced 3D
        const size = 30 * scale;

        // Front face with gradient
        ctx.fillStyle = this.createGradient(ctx, x, y, size, baseColor);
        ctx.fillRect(x - size/2, y - size/2, size, size);
        ctx.strokeRect(x - size/2, y - size/2, size, size);

        // Add texture to front
        this.addTexture(ctx, x, y, size, size, 25);

        // Top face - lighter
        const r = parseInt(baseColor.slice(1, 3), 16);
        const g = parseInt(baseColor.slice(3, 5), 16);
        const b = parseInt(baseColor.slice(5, 7), 16);
        const topColor = `rgb(${Math.min(255, r + 30)}, ${Math.min(255, g + 30)}, ${Math.min(255, b + 30)})`;

        ctx.fillStyle = topColor;
        ctx.beginPath();
        ctx.moveTo(x - size/2, y - size/2);
        ctx.lineTo(x - size/4, y - size/1.3);
        ctx.lineTo(x + size/1.3, y - size/1.3);
        ctx.lineTo(x + size/2, y - size/2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Right face - darker
        const sideColor = `rgb(${Math.max(0, r - 30)}, ${Math.max(0, g - 30)}, ${Math.max(0, b - 30)})`;
        ctx.fillStyle = sideColor;
        ctx.beginPath();
        ctx.moveTo(x + size/2, y - size/2);
        ctx.lineTo(x + size/1.3, y - size/1.3);
        ctx.lineTo(x + size/1.3, y + size/3);
        ctx.lineTo(x + size/2, y + size/2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Add edge highlights
        ctx.save();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.moveTo(x - size/2, y - size/2);
        ctx.lineTo(x - size/4, y - size/1.3);
        ctx.stroke();
        ctx.restore();
    }

    drawTube(ctx, x, y, scale) {
        ctx.beginPath();
        ctx.moveTo(x - 35 * scale, y - 8 * scale);
        ctx.lineTo(x + 35 * scale, y - 8 * scale);
        ctx.arc(x + 35 * scale, y, 8 * scale, -Math.PI/2, Math.PI/2);
        ctx.lineTo(x - 35 * scale, y + 8 * scale);
        ctx.arc(x - 35 * scale, y, 8 * scale, Math.PI/2, -Math.PI/2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    drawTwist(ctx, x, y, scale) {
        ctx.beginPath();
        ctx.moveTo(x - 30 * scale, y);
        for (let i = 0; i <= 20; i++) {
            const t = i / 20;
            const px = x + (t - 0.5) * 60 * scale;
            const py = y + Math.sin(t * Math.PI * 4) * 10 * scale;
            ctx.lineTo(px, py);
        }
        ctx.lineWidth = 10 * scale;
        ctx.stroke();
    }

    drawSpray(ctx, x, y, scale) {
        for (let i = 0; i < 30; i++) {
            const angle = (Math.random() - 0.5) * Math.PI;
            const distance = Math.random() * 50 * scale;
            const size = Math.random() * 8 * scale;
            ctx.beginPath();
            ctx.arc(
                x + Math.cos(angle) * distance,
                y + Math.sin(angle) * distance,
                size, 0, Math.PI * 2
            );
            ctx.fill();
        }
    }

    drawBeans(ctx, x, y, scale) {
        for (let i = 0; i < 10; i++) {
            const beanX = x + (Math.random() - 0.5) * 60 * scale;
            const beanY = y + (Math.random() - 0.5) * 60 * scale;
            ctx.beginPath();
            ctx.ellipse(beanX, beanY, 10 * scale, 6 * scale, Math.random() * Math.PI, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        }
    }

    drawRice(ctx, x, y, scale) {
        const positions = [];
        for (let i = 0; i < 20; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const distance = (10 + Math.random() * 25) * scale;
            positions.push([
                x + Math.cos(angle) * distance,
                y + Math.sin(angle) * distance
            ]);
        }

        positions.forEach(([rx, ry]) => {
            ctx.save();
            ctx.translate(rx, ry);
            ctx.rotate(Math.random() * Math.PI);
            ctx.beginPath();
            ctx.ellipse(0, 0, 5 * scale, 2 * scale, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
    }

    drawBoulder(ctx, x, y, scale) {
        ctx.beginPath();
        ctx.arc(x, y, 45 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.arc(x - 5 * scale, y - 5 * scale, 35 * scale, 0, Math.PI * 2);
        ctx.stroke();

        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.moveTo(x - 25 * scale, y - 15 * scale);
        ctx.lineTo(x, y);
        ctx.lineTo(x + 15 * scale, y + 25 * scale);
        ctx.stroke();
        ctx.globalAlpha = 1;
    }

    drawCrumble(ctx, x, y, scale) {
        for (let i = 0; i < 25; i++) {
            const crumbX = x + (Math.random() - 0.5) * 80 * scale;
            const crumbY = y + (Math.random() - 0.5) * 80 * scale;
            const size = Math.random() * 5 * scale + 2;
            ctx.beginPath();
            ctx.arc(crumbX, crumbY, size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    drawGenericPoop(ctx, x, y, scale) {
        ctx.beginPath();
        ctx.arc(x, y + 20 * scale, 30 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.arc(x, y, 25 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.arc(x, y - 15 * scale, 20 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.arc(x + 5 * scale, y - 25 * scale, 10 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }

    drawDoglog(ctx, x, y, scale, baseColor) {
        // Use gradient for 3D effect
        ctx.fillStyle = this.createGradient(ctx, x, y, 50 * scale, baseColor);

        ctx.beginPath();
        ctx.moveTo(x - 35 * scale, y);
        ctx.bezierCurveTo(
            x - 30 * scale, y - 12 * scale,
            x - 10 * scale, y - 10 * scale,
            x + 5 * scale, y - 8 * scale
        );
        ctx.bezierCurveTo(
            x + 15 * scale, y - 6 * scale,
            x + 25 * scale, y - 4 * scale,
            x + 35 * scale, y
        );
        ctx.bezierCurveTo(
            x + 30 * scale, y + 8 * scale,
            x + 10 * scale, y + 12 * scale,
            x - 35 * scale, y + 5 * scale
        );
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Add texture
        this.addTexture(ctx, x, y, 70 * scale, 20 * scale, 40);

        // Segment lines
        ctx.save();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.moveTo(x - 10 * scale, y - 10 * scale);
        ctx.lineTo(x - 10 * scale, y + 8 * scale);
        ctx.moveTo(x + 10 * scale, y - 8 * scale);
        ctx.lineTo(x + 10 * scale, y + 10 * scale);
        ctx.stroke();
        ctx.restore();
    }

    drawCatlog(ctx, x, y, scale) {
        for (let i = 0; i < 3; i++) {
            const offsetX = (i - 1) * 20 * scale;
            const offsetY = (i - 1) * 5 * scale;

            ctx.beginPath();
            ctx.moveTo(x + offsetX - 12 * scale, y + offsetY - 4 * scale);
            ctx.lineTo(x + offsetX + 12 * scale, y + offsetY - 4 * scale);
            ctx.arc(x + offsetX + 12 * scale, y + offsetY, 4 * scale, -Math.PI/2, Math.PI/2);
            ctx.lineTo(x + offsetX - 12 * scale, y + offsetY + 4 * scale);
            ctx.arc(x + offsetX - 12 * scale, y + offsetY, 4 * scale, Math.PI/2, -Math.PI/2);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }

        ctx.globalAlpha = 0.2;
        for (let i = 0; i < 10; i++) {
            ctx.fillRect(
                x + (Math.random() - 0.5) * 40 * scale,
                y + (Math.random() - 0.5) * 20 * scale,
                3 * scale, 3 * scale
            );
        }
        ctx.globalAlpha = 1;
    }

    drawTigerlog(ctx, x, y, scale) {
        ctx.beginPath();
        ctx.moveTo(x - 40 * scale, y - 5 * scale);

        for (let i = 0; i <= 4; i++) {
            const segX = x - 40 * scale + (i * 20 * scale);
            const segY = y + Math.sin(i) * 8 * scale;
            if (i === 0) {
                ctx.moveTo(segX, segY - 8 * scale);
            } else {
                ctx.quadraticCurveTo(
                    segX - 10 * scale, segY - 10 * scale,
                    segX, segY - 8 * scale
                );
            }
        }

        for (let i = 4; i >= 0; i--) {
            const segX = x - 40 * scale + (i * 20 * scale);
            const segY = y + Math.sin(i) * 8 * scale;
            ctx.quadraticCurveTo(
                segX + 10 * scale, segY + 10 * scale,
                segX, segY + 8 * scale
            );
        }

        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.strokeStyle = '#8b7355';
        ctx.lineWidth = 1;
        for (let i = 0; i < 15; i++) {
            const hairX = x + (Math.random() - 0.5) * 60 * scale;
            const hairY = y + (Math.random() - 0.5) * 10 * scale;
            ctx.beginPath();
            ctx.moveTo(hairX, hairY);
            ctx.lineTo(hairX + 5 * scale, hairY + 2 * scale);
            ctx.stroke();
        }
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
    }

    drawPiglog(ctx, x, y, scale) {
        const clumps = [
            { x: -20, y: 0, size: 25 },
            { x: 0, y: -5, size: 20 },
            { x: 15, y: 3, size: 22 },
            { x: -5, y: 8, size: 18 }
        ];

        clumps.forEach(clump => {
            ctx.beginPath();
            ctx.arc(x + clump.x * scale, y + clump.y * scale, clump.size * scale * 0.7, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.beginPath();
        ctx.ellipse(x, y, 35 * scale, 18 * scale, 0, 0, Math.PI * 2);
        ctx.globalAlpha = 0.3;
        ctx.stroke();
        ctx.globalAlpha = 1;
    }

    drawPandalog(ctx, x, y, scale) {
        for (let i = 0; i < 2; i++) {
            const offsetY = i * 25 * scale;

            ctx.beginPath();
            ctx.ellipse(x, y + offsetY, 25 * scale, 12 * scale, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            ctx.strokeStyle = '#8fbc8f';
            ctx.lineWidth = 1.5;
            for (let j = 0; j < 8; j++) {
                const fiberX = x + (Math.random() - 0.5) * 40 * scale;
                const fiberY = y + offsetY + (Math.random() - 0.5) * 15 * scale;
                ctx.beginPath();
                ctx.moveTo(fiberX - 8 * scale, fiberY);
                ctx.lineTo(fiberX + 8 * scale, fiberY);
                ctx.stroke();
            }

            ctx.fillStyle = '#c0d890';
            for (let j = 0; j < 4; j++) {
                ctx.fillRect(
                    x + (Math.random() - 0.5) * 30 * scale,
                    y + offsetY + (Math.random() - 0.5) * 10 * scale,
                    6 * scale, 3 * scale
                );
            }
            ctx.fillStyle = '#5a6b3b';
        }
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
    }

    drawHorseballs(ctx, x, y, scale) {
        const positions = [
            [0, -15], [-12, -8], [12, -8],
            [-18, 0], [0, 0], [18, 0],
            [-12, 8], [12, 8], [0, 15],
            [-6, -10], [6, -10]
        ];

        positions.forEach(([dx, dy]) => {
            ctx.beginPath();
            ctx.arc(x + dx * scale, y + dy * scale, 10 * scale, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            ctx.globalAlpha = 0.3;
            ctx.beginPath();
            ctx.arc(x + dx * scale - 3 * scale, y + dy * scale - 3 * scale, 6 * scale, 0, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = 1;
        });
    }

    drawElephantboulder(ctx, x, y, scale, baseColor) {
        // Massive fibrous ball with visible plant matter
        ctx.fillStyle = this.createGradient(ctx, x, y, 50 * scale, baseColor);

        ctx.beginPath();
        ctx.arc(x, y, 50 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Heavy texture for fibrous look
        this.addTexture(ctx, x, y, 100 * scale, 100 * scale, 100);

        // Add fiber rings
        ctx.save();
        ctx.strokeStyle = '#6b5a3a';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.3;
        for (let r = 45; r > 10; r -= 12) {
            ctx.beginPath();
            ctx.arc(x, y, r * scale, 0, Math.PI * 2);
            ctx.stroke();
        }
        ctx.restore();

        // Plant matter chunks with gradient
        ctx.save();
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const dist = 15 + Math.random() * 25;
            const chunkX = x + Math.cos(angle) * dist * scale;
            const chunkY = y + Math.sin(angle) * dist * scale;

            ctx.fillStyle = `rgba(164, 145, 109, ${0.5 + Math.random() * 0.3})`;
            ctx.beginPath();
            ctx.ellipse(chunkX, chunkY, 6 * scale, 3 * scale, angle, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();

        // Highlight for wetness
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.beginPath();
        ctx.ellipse(x - 15 * scale, y - 15 * scale, 20 * scale, 15 * scale, -0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    drawCapsule(ctx, x, y, scale) {
        for (let i = 0; i < 8; i++) {
            const dx = (Math.random() - 0.5) * 50 * scale;
            const dy = (Math.random() - 0.5) * 40 * scale;
            const angle = Math.random() * Math.PI;

            ctx.save();
            ctx.translate(x + dx, y + dy);
            ctx.rotate(angle);

            ctx.beginPath();
            ctx.moveTo(-7 * scale, 0);
            ctx.quadraticCurveTo(-7 * scale, -3 * scale, -4 * scale, -3 * scale);
            ctx.lineTo(4 * scale, -3 * scale);
            ctx.quadraticCurveTo(7 * scale, -3 * scale, 7 * scale, 0);
            ctx.quadraticCurveTo(7 * scale, 3 * scale, 4 * scale, 3 * scale);
            ctx.lineTo(-4 * scale, 3 * scale);
            ctx.quadraticCurveTo(-7 * scale, 3 * scale, -7 * scale, 0);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            ctx.restore();
        }
    }

    drawPellet(ctx, x, y, scale) {
        ctx.beginPath();
        ctx.ellipse(x, y, 15 * scale, 10 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        const originalFill = ctx.fillStyle;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(x + 10 * scale, y - 5 * scale, 8 * scale, 6 * scale, Math.PI/4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = originalFill;
    }

    drawBolus(ctx, x, y, scale) {
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.ellipse(x + (i - 1) * 25 * scale, y, 20 * scale, 15 * scale, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        }
    }

    drawCylinder(ctx, x, y, scale) {
        for (let i = 0; i < 12; i++) {
            const cx = x + (Math.random() - 0.5) * 60 * scale;
            const cy = y + (Math.random() - 0.5) * 50 * scale;

            ctx.beginPath();
            ctx.rect(cx - 4 * scale, cy - 2 * scale, 8 * scale, 4 * scale);
            ctx.fill();
            ctx.stroke();
        }
    }

    drawBlob(ctx, x, y, scale) {
        ctx.beginPath();
        ctx.ellipse(x, y + 5 * scale, 20 * scale, 15 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        const originalFill = ctx.fillStyle;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(x, y - 5 * scale, 15 * scale, 10 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = originalFill;
    }
}

// Start the game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new PoopGame();
});
