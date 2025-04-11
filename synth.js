// synth.js
const Synth = (function () {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const gainNode = audioContext.createGain();
    let currentOscillator = null; // Oscilador activo
    let currentNote = null; // Nota MIDI actual

    gainNode.connect(audioContext.destination);
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime); // Volumen inicial

    function startNote(frequency, midiNote) {
        // Si no hay oscilador, crear uno
        if (!currentOscillator) {
            currentOscillator = audioContext.createOscillator();
            currentOscillator.type = 'sine';
            currentOscillator.connect(gainNode);
            currentOscillator.start();
        }
        // Ajustar frecuencia inmediatamente
        currentOscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        currentNote = midiNote;
    }

    function stopNote(midiNote) {
        if (currentNote === midiNote && currentOscillator) {
            const currentGain = audioContext.createGain();
            currentGain.connect(gainNode);
            currentOscillator.disconnect(gainNode);
            currentOscillator.connect(currentGain);
            currentGain.gain.setValueAtTime(0.5, audioContext.currentTime);
            currentGain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.01); // 10ms
            setTimeout(() => {
                if (currentOscillator) {
                    currentOscillator.disconnect();
                    currentOscillator = null;
                    currentNote = null;
                }
            }, 10); // 10ms
        }
    }

    function setVolume(value) {
        const clampedValue = Math.max(0, Math.min(1, value));
        gainNode.gain.setValueAtTime(clampedValue, audioContext.currentTime);
    }

    function midiToFrequency(midiNote) {
        return 440 * Math.pow(2, (midiNote - 69) / 12);
    }

    return {
        play: (note) => startNote(midiToFrequency(note), note),
        stop: (note) => stopNote(note),
        setVolume: (value) => setVolume(value)
    };
})();