class PoopGame {
    constructor() {
        this.score = 0;
        this.streak = 0;
        this.bestStreak = 0;
        this.currentRound = 0;
        this.totalRounds = 40;
        this.correctAnswers = 0;
        this.difficulty = 'medium';
        this.currentAnimal = null;
        this.choices = [];
        this.gameAnimals = [];
        this.fiftyFiftyUsed = false;
        this.hintUsed = false;
        
        this.initializeElements();
        this.attachEventListeners();
    }
    
    initializeElements() {
        // Screens
        this.startScreen = document.getElementById('start-screen');
        this.gameScreen = document.getElementById('game-screen');
        this.endScreen = document.getElementById('end-screen');
        
        // Game elements
        this.scoreEl = document.getElementById('score');
        this.streakEl = document.getElementById('streak');
        this.roundEl = document.getElementById('round');
        this.poopCanvas = document.getElementById('poop-canvas');
        this.ctx = this.poopCanvas.getContext('2d');
        this.choiceButtons = document.querySelectorAll('.choice-btn');
        this.feedbackEl = document.getElementById('feedback');
        this.feedbackTitle = document.getElementById('feedback-title');
        this.feedbackText = document.getElementById('feedback-text');
        this.funFactEl = document.getElementById('fun-fact');
        this.hintText = document.getElementById('hint-text');
        this.hintBtn = document.getElementById('hint-btn');
        this.fiftyFiftyBtn = document.getElementById('fifty-fifty-btn');
        
        // End screen elements
        this.finalScoreEl = document.getElementById('final-score');
        this.correctCountEl = document.getElementById('correct-count');
        this.bestStreakEl = document.getElementById('best-streak');
        this.accuracyEl = document.getElementById('accuracy');
        this.rankEl = document.getElementById('rank');
    }
    
    attachEventListeners() {
        // Difficulty buttons
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.difficulty = e.currentTarget.dataset.difficulty;
                this.startGame();
            });
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
    }
    
    startGame() {
        // Get animals based on difficulty
        let animalPool;
        if (this.difficulty === 'easy') {
            animalPool = animalData.filter(a => a.difficulty === 'easy' || 
                (a.difficulty === 'medium' && a.category === 'common'));
        } else if (this.difficulty === 'medium') {
            animalPool = animalData.filter(a => a.difficulty !== 'hard');
        } else {
            animalPool = [...animalData];
        }
        
        // Shuffle and select 40 animals
        this.gameAnimals = this.shuffleArray(animalPool).slice(0, this.totalRounds);
        
        // Start first round
        this.currentRound = 0;
        this.score = 0;
        this.streak = 0;
        this.correctAnswers = 0;
        
        // Show game screen
        this.startScreen.classList.remove('active');
        this.gameScreen.classList.add('active');
        
        this.nextRound();
    }
    
    nextRound() {
        if (this.currentRound >= this.totalRounds) {
            this.endGame();
            return;
        }
        
        // Reset round state
        this.fiftyFiftyUsed = false;
        this.hintUsed = false;
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
        this.currentAnimal = this.gameAnimals[this.currentRound];
        this.currentRound++;
        
        // Update round display
        this.roundEl.textContent = `${this.currentRound}/${this.totalRounds}`;
        
        // Draw poop
        this.drawPoop(this.currentAnimal);
        
        // Setup choices
        this.setupChoices();
    }
    
    drawPoop(animal) {
        const ctx = this.ctx;
        const canvas = this.poopCanvas;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Center position
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        // Better normalization - keep all poops clearly visible with good margin
        // Map poop size (1-100) to a tighter scale (0.8-1.8)
        const minScale = 0.8;
        const maxScale = 1.8;
        // Use logarithmic scaling for better distribution
        const normalizedSize = Math.log(animal.poopSize + 10) / Math.log(110);
        const scale = minScale + normalizedSize * (maxScale - minScale);
        
        // Set color
        ctx.fillStyle = animal.poopColor;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        
        // Draw based on shape
        switch(animal.poopShape) {
            case 'dots':
                this.drawDots(ctx, centerX, centerY, scale);
                break;
            case 'pellets':
                this.drawPellets(ctx, centerX, centerY, scale);
                break;
            case 'log':
                this.drawLog(ctx, centerX, centerY, scale);
                break;
            case 'doglog':
                this.drawDogLog(ctx, centerX, centerY, scale);
                break;
            case 'catlog':
                this.drawCatLog(ctx, centerX, centerY, scale);
                break;
            case 'tigerlog':
                this.drawTigerLog(ctx, centerX, centerY, scale);
                break;
            case 'piglog':
                this.drawPigLog(ctx, centerX, centerY, scale);
                break;
            case 'pandalog':
                this.drawPandaLog(ctx, centerX, centerY, scale);
                break;
            case 'splat':
                this.drawSplat(ctx, centerX, centerY, scale);
                break;
            case 'patty':
                this.drawPatty(ctx, centerX, centerY, scale);
                break;
            case 'balls':
                this.drawBalls(ctx, centerX, centerY, scale);
                break;
            case 'horseballs':
                this.drawHorseBalls(ctx, centerX, centerY, scale);
                break;
            case 'elephantboulder':
                this.drawElephantBoulder(ctx, centerX, centerY, scale);
                break;
            case 'cube':
                this.drawCube(ctx, centerX, centerY, scale);
                break;
            case 'tube':
                this.drawTube(ctx, centerX, centerY, scale);
                break;
            case 'twist':
                this.drawTwist(ctx, centerX, centerY, scale);
                break;
            case 'spray':
                this.drawSpray(ctx, centerX, centerY, scale);
                break;
            case 'beans':
                this.drawBeans(ctx, centerX, centerY, scale);
                break;
            case 'rice':
                this.drawRice(ctx, centerX, centerY, scale);
                break;
            case 'boulder':
                this.drawBoulder(ctx, centerX, centerY, scale);
                break;
            case 'crumble':
                this.drawCrumble(ctx, centerX, centerY, scale);
                break;
            case 'capsule':
                this.drawCapsule(ctx, centerX, centerY, scale);
                break;
            case 'pellet':
                this.drawSinglePellet(ctx, centerX, centerY, scale);
                break;
            case 'bolus':
                this.drawBolus(ctx, centerX, centerY, scale);
                break;
            case 'cylinder':
                this.drawCylinder(ctx, centerX, centerY, scale);
                break;
            case 'blob':
                this.drawBlob(ctx, centerX, centerY, scale);
                break;
            default:
                this.drawGenericPoop(ctx, centerX, centerY, scale);
        }
    }
    
    // Shape drawing functions
    drawDots(ctx, x, y, scale) {
        // Very tiny dots in a cluster
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
    
    drawPellets(ctx, x, y, scale) {
        // Round/oval pellets in a scattered pile
        const positions = [
            [0, 0], [-15, -10], [15, -10], [-10, 10], [10, 10],
            [-20, 0], [20, 0], [0, -15], [0, 15], [-8, -8], [8, 8]
        ];
        positions.forEach(([dx, dy]) => {
            ctx.beginPath();
            ctx.ellipse(x + dx * scale, y + dy * scale, 7 * scale, 5 * scale, Math.random() * Math.PI, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
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
        // White part
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
        
        // Dark center
        ctx.fillStyle = '#333333';
        ctx.beginPath();
        ctx.arc(x, y, 10 * scale, 0, Math.PI * 2);
        ctx.fill();
    }
    
    drawPatty(ctx, x, y, scale) {
        // Large flat cow patty with ripples
        ctx.beginPath();
        ctx.ellipse(x, y, 55 * scale, 35 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Add concentric ripples for texture
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.ellipse(x, y, 40 * scale, 25 * scale, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(x, y, 25 * scale, 15 * scale, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
    }
    
    drawBalls(ctx, x, y, scale) {
        const positions = [
            [0, 0], [-20, -15], [20, -15], [-15, 15], [15, 15], [0, -25], [0, 20]
        ];
        positions.forEach(([dx, dy]) => {
            ctx.beginPath();
            ctx.arc(x + dx * scale, y + dy * scale, 15 * scale, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        });
    }
    
    drawCube(ctx, x, y, scale) {
        // Wombat's distinctive cube poop - 3D effect
        const size = 25 * scale;
        
        // Front face
        ctx.fillRect(x - size/2, y - size/2, size, size);
        ctx.strokeRect(x - size/2, y - size/2, size, size);
        
        // 3D effect - top face
        ctx.beginPath();
        ctx.moveTo(x - size/2, y - size/2);
        ctx.lineTo(x - size/3, y - size/1.5);
        ctx.lineTo(x + size/1.5, y - size/1.5);
        ctx.lineTo(x + size/2, y - size/2);
        ctx.closePath();
        ctx.globalAlpha = 0.8;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.stroke();
        
        // 3D effect - right face
        ctx.beginPath();
        ctx.moveTo(x + size/2, y - size/2);
        ctx.lineTo(x + size/1.5, y - size/1.5);
        ctx.lineTo(x + size/1.5, y + size/3);
        ctx.lineTo(x + size/2, y + size/2);
        ctx.closePath();
        ctx.globalAlpha = 0.6;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.stroke();
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
        // Mouse droppings - tiny rice grain shapes
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
        // Elephant's massive round droppings
        ctx.beginPath();
        ctx.arc(x, y, 45 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Add texture lines and shadows
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.arc(x - 5 * scale, y - 5 * scale, 35 * scale, 0, Math.PI * 2);
        ctx.stroke();
        
        // Cracks for texture
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
        // Emoji-style poop
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
    
    // DISTINCT DOG POOP
    drawDogLog(ctx, x, y, scale) {
        // Classic tapered dog poop with segments
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
        
        // Add segment lines
        ctx.beginPath();
        ctx.moveTo(x - 10 * scale, y - 10 * scale);
        ctx.lineTo(x - 10 * scale, y + 8 * scale);
        ctx.moveTo(x + 10 * scale, y - 8 * scale);
        ctx.lineTo(x + 10 * scale, y + 10 * scale);
        ctx.globalAlpha = 0.3;
        ctx.stroke();
        ctx.globalAlpha = 1;
    }
    
    // DISTINCT CAT POOP
    drawCatLog(ctx, x, y, scale) {
        // Smaller, more uniform cylinders typical of cats
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
        
        // Add litter texture
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
    
    // DISTINCT TIGER POOP
    drawTigerLog(ctx, x, y, scale) {
        // Large segmented carnivore scat with visible hair/fur
        ctx.beginPath();
        ctx.moveTo(x - 40 * scale, y - 5 * scale);
        
        // Create lumpy, segmented shape
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
        
        // Bottom curve
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
        
        // Add hair/fur texture
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
    
    // DISTINCT PIG POOP
    drawPigLog(ctx, x, y, scale) {
        // Soft, mushy consistency in clumps
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
        
        // Outline the whole mass
        ctx.beginPath();
        ctx.ellipse(x, y, 35 * scale, 18 * scale, 0, 0, Math.PI * 2);
        ctx.globalAlpha = 0.3;
        ctx.stroke();
        ctx.globalAlpha = 1;
    }
    
    // DISTINCT PANDA POOP
    drawPandaLog(ctx, x, y, scale) {
        // Green cylindrical segments with visible bamboo fibers
        for (let i = 0; i < 2; i++) {
            const offsetY = i * 25 * scale;
            
            // Main cylinder
            ctx.beginPath();
            ctx.ellipse(x, y + offsetY, 25 * scale, 12 * scale, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            
            // Bamboo fiber texture
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
            
            // Bamboo chunks
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
    
    // DISTINCT HORSE BALLS
    drawHorseBalls(ctx, x, y, scale) {
        // Neat pile of round, fibrous balls
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
            
            // Add fibrous texture
            ctx.globalAlpha = 0.3;
            ctx.beginPath();
            ctx.arc(x + dx * scale - 3 * scale, y + dy * scale - 3 * scale, 6 * scale, 0, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = 1;
        });
    }
    
    // DISTINCT ELEPHANT BOULDER
    drawElephantBoulder(ctx, x, y, scale) {
        // Massive fibrous ball with visible plant matter
        ctx.beginPath();
        ctx.arc(x, y, 50 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Add fiber texture in rings
        ctx.globalAlpha = 0.4;
        for (let r = 40; r > 10; r -= 15) {
            ctx.beginPath();
            ctx.arc(x, y, r * scale, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // Add plant matter chunks
        ctx.fillStyle = '#a4916d';
        ctx.globalAlpha = 0.6;
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const dist = 20 + Math.random() * 20;
            ctx.fillRect(
                x + Math.cos(angle) * dist * scale - 4 * scale,
                y + Math.sin(angle) * dist * scale - 2 * scale,
                8 * scale, 4 * scale
            );
        }
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#8b7355';
    }
    
    // Additional specific shapes
    drawCapsule(ctx, x, y, scale) {
        // Rat droppings - capsule shaped with pointed ends
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
    
    drawSinglePellet(ctx, x, y, scale) {
        // Single pellet with white urate (reptile)
        ctx.beginPath();
        ctx.ellipse(x, y, 15 * scale, 10 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // White urate cap
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(x + 10 * scale, y - 5 * scale, 8 * scale, 6 * scale, Math.PI/4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = ctx.fillStyle;
    }
    
    drawBolus(ctx, x, y, scale) {
        // Rhino bolus - large rounded segments
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.ellipse(x + (i - 1) * 25 * scale, y, 20 * scale, 15 * scale, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        }
    }
    
    drawCylinder(ctx, x, y, scale) {
        // Caterpillar frass - tiny cylinders
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
        // Chicken dropping with white uric acid cap
        // Brown base
        ctx.beginPath();
        ctx.ellipse(x, y + 5 * scale, 20 * scale, 15 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // White uric acid cap
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(x, y - 5 * scale, 15 * scale, 10 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#8b6f47';
    }
    
    setupChoices() {
        // Get wrong choices
        const wrongAnimals = this.getWrongChoices(this.currentAnimal, 3);
        
        // Combine with correct answer
        this.choices = [this.currentAnimal, ...wrongAnimals];
        
        // Shuffle choices
        this.choices = this.shuffleArray(this.choices);
        
        // Update buttons
        this.choiceButtons.forEach((btn, index) => {
            const animal = this.choices[index];
            const img = btn.querySelector('.animal-img');
            const name = btn.querySelector('.animal-name');
            
            // Use emoji as animal image
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
    
    getWrongChoices(correctAnimal, count) {
        const sameCategory = animalData.filter(a => 
            a.category === correctAnimal.category && a.name !== correctAnimal.name
        );
        
        const otherAnimals = animalData.filter(a => 
            a.category !== correctAnimal.category && a.name !== correctAnimal.name
        );
        
        // Try to include at least one from same category for harder difficulty
        const choices = [];
        if (sameCategory.length > 0 && this.difficulty !== 'easy') {
            choices.push(sameCategory[Math.floor(Math.random() * sameCategory.length)]);
        }
        
        // Fill rest with random animals
        const remaining = this.shuffleArray(otherAnimals);
        while (choices.length < count) {
            choices.push(remaining.pop());
        }
        
        return this.shuffleArray(choices).slice(0, count);
    }
    
    checkAnswer(choiceIndex) {
        const selectedAnimal = this.choices[choiceIndex];
        const correct = selectedAnimal.name === this.currentAnimal.name;
        
        // Disable all buttons
        this.choiceButtons.forEach(btn => btn.disabled = true);
        
        // Show result
        const selectedButton = this.choiceButtons[choiceIndex];
        if (correct) {
            selectedButton.classList.add('correct');
            this.handleCorrectAnswer();
        } else {
            selectedButton.classList.add('incorrect');
            // Show correct answer
            this.choiceButtons.forEach((btn, idx) => {
                if (this.choices[idx].name === this.currentAnimal.name) {
                    btn.classList.add('correct');
                }
            });
            this.handleIncorrectAnswer();
        }
        
        // Show feedback
        this.showFeedback(correct);
    }
    
    handleCorrectAnswer() {
        this.correctAnswers++;
        this.streak++;
        if (this.streak > this.bestStreak) {
            this.bestStreak = this.streak;
        }
        
        // Calculate points
        let points = 100;
        if (this.hintUsed) points -= 50;
        if (this.fiftyFiftyUsed) points -= 25;
        points += this.streak * 10; // Streak bonus
        
        this.score += points;
        this.updateDisplay();
    }
    
    handleIncorrectAnswer() {
        this.streak = 0;
        this.updateDisplay();
    }
    
    showFeedback(correct) {
        this.feedbackEl.classList.remove('hidden');
        
        if (correct) {
            this.feedbackTitle.textContent = 'Correct! 🎉';
            this.feedbackTitle.className = 'correct';
            this.feedbackText.textContent = `That's ${this.currentAnimal.name} poop!`;
        } else {
            this.feedbackTitle.textContent = 'Wrong! 😅';
            this.feedbackTitle.className = 'incorrect';
            this.feedbackText.textContent = `That was ${this.currentAnimal.name} poop!`;
        }
        
        this.funFactEl.textContent = `Fun Fact: ${this.currentAnimal.funFact}`;
    }
    
    useHint() {
        if (!this.hintUsed) {
            this.hintUsed = true;
            this.hintBtn.disabled = true;
            this.hintText.textContent = `Hint: ${this.currentAnimal.hint}`;
            this.hintText.classList.remove('hidden');
        }
    }
    
    useFiftyFifty() {
        if (!this.fiftyFiftyUsed) {
            this.fiftyFiftyUsed = true;
            this.fiftyFiftyBtn.disabled = true;
            
            // Find wrong answers
            const wrongIndices = [];
            this.choices.forEach((animal, idx) => {
                if (animal.name !== this.currentAnimal.name) {
                    wrongIndices.push(idx);
                }
            });
            
            // Eliminate 2 wrong answers
            const toEliminate = this.shuffleArray(wrongIndices).slice(0, 2);
            toEliminate.forEach(idx => {
                this.choiceButtons[idx].classList.add('eliminated');
                this.choiceButtons[idx].disabled = true;
            });
        }
    }
    
    updateDisplay() {
        this.scoreEl.textContent = this.score;
        this.streakEl.textContent = this.streak;
    }
    
    endGame() {
        this.gameScreen.classList.remove('active');
        this.endScreen.classList.add('active');
        
        const accuracy = Math.round((this.correctAnswers / this.totalRounds) * 100);
        
        this.finalScoreEl.textContent = this.score;
        this.correctCountEl.textContent = this.correctAnswers;
        this.bestStreakEl.textContent = this.bestStreak;
        this.accuracyEl.textContent = accuracy;
        
        // Determine rank
        let rank = '';
        if (accuracy >= 90) rank = '🏆 Poop Professor!';
        else if (accuracy >= 75) rank = '🥇 Scat Scholar!';
        else if (accuracy >= 60) rank = '🥈 Dropping Detective!';
        else if (accuracy >= 40) rank = '🥉 Poop Pupil!';
        else rank = '💩 Keep Studying Those Poops!';
        
        this.rankEl.textContent = rank;
    }
    
    resetGame() {
        this.endScreen.classList.remove('active');
        this.startScreen.classList.add('active');
        
        // Reset all game state
        this.score = 0;
        this.streak = 0;
        this.bestStreak = 0;
        this.currentRound = 0;
        this.correctAnswers = 0;
        this.updateDisplay();
    }
    
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}

// Start the game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new PoopGame();
});