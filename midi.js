// midi.js
const Midi = (function () {
    const statusDiv = document.getElementById('status');
    let midiCallback = null;

    function logMessage(message) {
        const eventsDiv = document.getElementById('events');
        const p = document.createElement('p');
        p.textContent = `${new Date().toLocaleTimeString()} - ${message}`;
        eventsDiv.insertBefore(p, eventsDiv.firstChild);
    }

    function onMIDIMessage(message) {
        const [command, note, velocity] = message.data;
        const commandType = command >= 144 && command < 160 ? 'Note On' :
                           command >= 128 && command < 144 ? 'Note Off' : 'Otro';
        const msg = `${commandType} - Nota: ${note}, Velocidad: ${velocity}`;
        logMessage(msg);
        if (midiCallback) midiCallback({ command, note, velocity });
    }

    function init() {
        if (navigator.requestMIDIAccess) {
            navigator.requestMIDIAccess()
                .then((midiAccess) => {
                    statusDiv.textContent = '¡Conexión MIDI establecida!';
                    const inputs = midiAccess.inputs.values();
                    for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
                        input.value.onmidimessage = onMIDIMessage;
                        logMessage(`Dispositivo conectado: ${input.value.name}`);
                    }
                    midiAccess.onstatechange = (e) => {
                        if (e.port.state === 'connected') {
                            e.port.onmidimessage = onMIDIMessage;
                            logMessage(`Nuevo dispositivo conectado: ${e.port.name}`);
                        }
                    };
                })
                .catch(() => {
                    statusDiv.textContent = 'Error: No se pudo acceder a MIDI';
                });
        } else {
            statusDiv.textContent = 'Error: Web MIDI no soportado';
        }
    }

    return {
        init,
        onMessage: (callback) => { midiCallback = callback; }
    };
})();