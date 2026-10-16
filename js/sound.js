/**
 * ==============================================================================
 * 🎵 RETRO 8-BIT SOUND SYNTHESIZER (Web Audio API)
 * ==============================================================================
 * Walang external .mp3 o .wav files! Pure Web Audio synthesis para 100% reliable
 * at authentic cute 8-bit game feel. May sound toggle para pwedeng i-mute.
 * ==============================================================================
 */

class RetroAudio {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
                this.initialized = true;
            }
        } catch (e) {
            console.warn("Web Audio not supported:", e);
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        return this.isMuted;
    }

    // Cute retro blip on button hover / click
    playBlip(freq = 440, type = "square", duration = 0.08) {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;
        if (this.ctx.state === "suspended") this.ctx.resume();

        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + duration);

            gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch (e) {}
    }

    // Playful boing / error chirp for NO button
    playNoSound() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;
        if (this.ctx.state === "suspended") this.ctx.resume();

        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(280, now);
            osc.frequency.linearRampToValueAtTime(140, now + 0.15);

            gain.gain.setValueAtTime(0.09, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.15);
        } catch (e) {}
    }

    // Sweet ascending coin/jingle for YES / Next button
    playYesSound() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;
        if (this.ctx.state === "suspended") this.ctx.resume();

        try {
            const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
            notes.forEach((freq, idx) => {
                const now = this.ctx.currentTime + idx * 0.06;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = "square";
                osc.frequency.setValueAtTime(freq, now);

                gain.gain.setValueAtTime(0.08, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(now);
                osc.stop(now + 0.12);
            });
        } catch (e) {}
    }

    // Item selection blip (date type, food, color)
    playSelectSound() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;
        if (this.ctx.state === "suspended") this.ctx.resume();

        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = "triangle";
            osc.frequency.setValueAtTime(587.33, now); // D5
            osc.frequency.setValueAtTime(880, now + 0.05); // A5

            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.1);
        } catch (e) {}
    }

    // Victory fanfare when reaching final screen
    playVictorySound() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;
        if (this.ctx.state === "suspended") this.ctx.resume();

        try {
            const melody = [
                { f: 523.25, d: 0.12 }, // C
                { f: 523.25, d: 0.12 }, // C
                { f: 523.25, d: 0.12 }, // C
                { f: 659.25, d: 0.25 }, // E
                { f: 783.99, d: 0.25 }, // G
                { f: 1046.50, d: 0.5 }  // High C
            ];

            let time = this.ctx.currentTime;
            melody.forEach((note) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = "square";
                osc.frequency.setValueAtTime(note.f, time);

                gain.gain.setValueAtTime(0.08, time);
                gain.gain.exponentialRampToValueAtTime(0.001, time + note.d);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(time);
                osc.stop(time + note.d);

                time += note.d * 0.9;
            });
        } catch (e) {}
    }
}

window.retroAudio = new RetroAudio();
