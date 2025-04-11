// main.js
Midi.init();
Midi.onMessage(({ command, note, velocity }) => {
    if (command >= 144 && command < 160 && velocity > 0) {
        Synth.play(note);
    } else if (command >= 128 && command < 144 || velocity === 0) {
        Synth.stop();
    }
});

// Crear knob para volumen
const volumeKnob = Knob.createKnob({
    containerId: 'volume-knob-container',
    min: 0,
    max: 1,
    initialValue: 0.5,
    label: 'Volumen',
    onChange: (value) => Synth.setVolume(value)
});