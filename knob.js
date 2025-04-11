// knob.js
const Knob = (function () {
    function createKnob({ containerId, min, max, initialValue, label, onChange, options }) {
        const container = document.getElementById(containerId);
        const knobWrapper = document.createElement('div');
        knobWrapper.className = 'knob-wrapper';

        const knob = document.createElement('div');
        knob.className = 'knob';
        knob.tabIndex = 0;
        knob.role = 'slider';
        knob.setAttribute('aria-valuemin', min);
        knob.setAttribute('aria-valuemax', max);
        knob.setAttribute('aria-valuenow', initialValue);

        const modal = document.createElement('div');
        modal.className = 'value-modal';

        knobWrapper.appendChild(knob);
        knobWrapper.appendChild(modal);
        container.appendChild(knobWrapper);

        let value = initialValue;
        let isDragging = false;
        let startY = 0;

        // Conversión de valor a ángulo (-135° a 135°)
        function valueToAngle(val) {
            const normalized = (val - min) / (max - min);
            return normalized * 270 - 135;
        }

        // Actualizar el knob
        function updateKnob(newValue) {
            let clampedValue = Math.max(min, Math.min(max, newValue));
            let displayValue = clampedValue.toFixed(1);

            if (options) {
                const closestOption = options.reduce((prev, curr) =>
                    Math.abs(curr.value - clampedValue) < Math.abs(prev.value - clampedValue) ? curr : prev
                );
                clampedValue = closestOption.value;
                displayValue = closestOption.label;
            }

            value = clampedValue;
            knob.style.transform = `rotate(${valueToAngle(value)}deg)`;
            modal.textContent = label ? `${label}: ${displayValue}` : displayValue;
            knob.setAttribute('aria-valuenow', value);
            if (onChange) onChange(value);
        }

        // Eventos de arrastre
        function handleMouseMove(e) {
            if (isDragging) {
                const deltaY = startY - e.clientY;
                const sensitivity = options ? 1 : e.shiftKey ? 0.1 : 0.5;
                const newValue = value + deltaY * sensitivity;
                updateKnob(newValue);
                e.preventDefault();
            }
        }

        function handleMouseUp(e) {
            isDragging = false;
            modal.style.opacity = '0';
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            e.preventDefault();
            e.stopPropagation();
        }

        knob.addEventListener('mousedown', (e) => {
            isDragging = true;
            startY = e.clientY;
            modal.style.opacity = '1';
            document.addEventListener('mousemove', handleMouseMove, { passive: false });
            document.addEventListener('mouseup', handleMouseUp, { passive: false });
            e.preventDefault();
            e.stopPropagation();
        });

        // Inicializar
        updateKnob(initialValue);

        return {
            setValue: (newValue) => updateKnob(newValue),
            getValue: () => value
        };
    }

    return { createKnob };
})();