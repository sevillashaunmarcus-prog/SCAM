/**
 * ==============================================================================
 * ✨ PIXEL VISUAL EFFECTS ENGINE
 * ==============================================================================
 * Lightweight ambient floating pixel hearts/stars, burst particle effects
 * for button clicks, and pixel confetti for the final page!
 * ==============================================================================
 */

class PixelEffects {
    constructor() {
        this.ambientContainer = null;
        this.init();
    }

    init() {
        // Create ambient background layer if not exists
        if (!document.getElementById("pixel-ambient-layer")) {
            this.ambientContainer = document.createElement("div");
            this.ambientContainer.id = "pixel-ambient-layer";
            this.ambientContainer.className = "pixel-ambient-layer";
            document.body.appendChild(this.ambientContainer);
            this.spawnAmbientElements();
        } else {
            this.ambientContainer = document.getElementById("pixel-ambient-layer");
        }
    }

    spawnAmbientElements() {
        if (!this.ambientContainer) return;
        const count = window.innerWidth < 600 ? 14 : 24;
        const symbols = ["💖", "✨", "🌸", "⭐", "💕", "🤍", "🌷"];

        for (let i = 0; i < count; i++) {
            const el = document.createElement("span");
            el.className = "floating-pixel-symbol";
            el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            el.style.left = `${Math.random() * 100}%`;
            el.style.top = `${Math.random() * 100}%`;
            el.style.animationDelay = `${Math.random() * 8}s`;
            el.style.animationDuration = `${6 + Math.random() * 8}s`;
            el.style.fontSize = `${10 + Math.random() * 12}px`;
            el.style.opacity = (0.25 + Math.random() * 0.45).toFixed(2);
            this.ambientContainer.appendChild(el);
        }
    }

    // Burst particles at specific (x, y) coordinates
    burstParticles(x, y, options = {}) {
        const {
            count = 12,
            symbols = ["💖", "✨", "💔", "😭", "⭐"],
            spread = 70,
            duration = 750
        } = options;

        for (let i = 0; i < count; i++) {
            const particle = document.createElement("span");
            particle.className = "pixel-particle";
            particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];

            const angle = Math.random() * Math.PI * 2;
            const distance = 25 + Math.random() * spread;
            const targetX = Math.cos(angle) * distance;
            const targetY = Math.sin(angle) * distance;

            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.setProperty("--tx", `${targetX}px`);
            particle.style.setProperty("--ty", `${targetY}px`);
            particle.style.animation = `particleFade ${duration}ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards`;

            document.body.appendChild(particle);

            setTimeout(() => {
                particle.remove();
            }, duration + 50);
        }
    }

    // Grand celebration confetti for final screen
    celebrate() {
        const symbols = ["💖", "✨", "💕", "🎉", "👑", "🌹", "🧸", "🤍"];
        const count = 35;

        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const conf = document.createElement("span");
                conf.className = "pixel-confetti";
                conf.textContent = symbols[Math.floor(Math.random() * symbols.length)];

                const startX = Math.random() * window.innerWidth;
                const endX = startX + (Math.random() * 120 - 60);

                conf.style.left = `${startX}px`;
                conf.style.top = `-20px`;
                conf.style.setProperty("--end-x", `${endX}px`);
                conf.style.animationDuration = `${2.5 + Math.random() * 2}s`;
                conf.style.fontSize = `${14 + Math.random() * 14}px`;

                document.body.appendChild(conf);

                setTimeout(() => conf.remove(), 4500);
            }, i * 65);
        }
    }
}

window.pixelEffects = new PixelEffects();
