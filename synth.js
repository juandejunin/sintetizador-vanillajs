// synth.js
const Synth = (function () {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const gainNode = audioContext.createGain(); // Nodo de ganancia para volumen
    let oscillator = null;

    gainNode.connect(audioContext.destination); // Conecta al altavoz
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime); // Volumen inicial

    function startNote(frequency) {
        if (oscillator) {
            oscillator.stop();
            oscillator.disconnect(); // Desconectar el oscilador anterior
        }
        oscillator = audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.connect(gainNode); // Conecta al nodo de ganancia
        oscillator.start();
    }

    function stopNote() {
        if (oscillator) {
            oscillator.stop();
            oscillator.disconnect();
            oscillator = null;
        }
    }

    function setVolume(value) {
        // Asegurarse de que el valor esté entre 0 y 1
        const clampedValue = Math.max(0, Math.min(1, value));
        gainNode.gain.setValueAtTime(clampedValue, audioContext.currentTime);
    }

    function midiToFrequency(midiNote) {
        return 440 * Math.pow(2, (midiNote - 69) / 12);
    }

    return {
        play: (note) => startNote(midiToFrequency(note)),
        stop: () => stopNote(),
        setVolume: (value) => setVolume(value)
    };
})();