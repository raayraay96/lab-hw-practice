// This file contains animation utilities for ECE362 study animations
// Corrected: Removed <html>, <head>, <body> tags as they are not valid within a .js file
// Corrected: Removed <title> and <style> tags as they are not valid within a .js file
/* Basic styling - adjust as needed */
/*
.container {
    margin-bottom: 20px;
}

#i2c-config-steps {
    display: none;
}

#i2c-config-steps.show {
    display: block;
}
*/
/*
<div class="container">
    <h2>I2C Configuration Animation</h2>
    <div id="i2c-config-sda">
        <!-- Waveform will be inserted here -->
    </div>
    <button id="i2c-config-animate-btn">Animate</button>
    <button id="i2c-config-steps-btn">Show Steps</button>
    <button id="i2c-config-reset-btn">Reset</button>
    <ol id="i2c-config-steps">
        <li>Start Condition: SDA goes low while SCL is high.</li>
        <li>Send Slave Address.</li>
        <li>Send Register Address.</li>
        <li>Send Data.</li>
        <li>Stop Condition: SDA goes high while SCL is high.</li>
    </ol>
</div>
*/

/**
 * Enhanced Animation Utilities for ECE362 Study Animations
 * This file contains utility functions to improve animations across all homework pages
 */

// Square Wave Visualization Generator
function createSquareWave(container, data, options = {}) {
    const defaults = {
        width: 600,
        height: 150,
        padding: 20,
        lineColor: '#16c79a',
        lineWidth: 3,
        backgroundColor: 'rgba(26, 26, 46, 0.5)',
        gridColor: 'rgba(255, 255, 255, 0.1)',
        showGrid: true,
        animationDuration: 1000,
        labels: {
            x: 'Time',
            y: 'Signal'
        }
    };

    const settings = { ...defaults, ...options };

    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.width = settings.width;
    canvas.height = settings.height;
    canvas.style.borderRadius = '8px';
    canvas.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    // Draw background
    ctx.fillStyle = settings.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid if enabled
    if (settings.showGrid) {
        ctx.strokeStyle = settings.gridColor;
        ctx.lineWidth = 1;

        // Vertical grid lines
        const xStep = (canvas.width - 2 * settings.padding) / 10;
        for (let i = 0; i <= 10; i++) {
            const x = settings.padding + i * xStep;
            ctx.beginPath();
            ctx.moveTo(x, settings.padding);
            ctx.lineTo(x, canvas.height - settings.padding);
            ctx.stroke();
        }

        // Horizontal grid lines
        const yStep = (canvas.height - 2 * settings.padding) / 4;
        for (let i = 0; i <= 4; i++) {
            const y = settings.padding + i * yStep;
            ctx.beginPath();
            ctx.moveTo(settings.padding, y);
            ctx.lineTo(canvas.width - settings.padding, y);
            ctx.stroke();
        }
    }

    // Add labels
    ctx.fillStyle = '#e6e6e6';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(settings.labels.x, canvas.width / 2, canvas.height - 5);

    ctx.save();
    ctx.translate(10, canvas.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(settings.labels.y, 0, 0);
    ctx.restore();

    // Animate the square wave
    const drawWave = (progress) => {
        // Clear the drawing area (but keep background and grid)
        ctx.clearRect(settings.padding, settings.padding,
                     canvas.width - 2 * settings.padding,
                     canvas.height - 2 * settings.padding);

        if (settings.showGrid) {
            // Redraw grid if it was cleared
            ctx.strokeStyle = settings.gridColor;
            ctx.lineWidth = 1;

            // Vertical grid lines
            const xStep = (canvas.width - 2 * settings.padding) / 10;
            for (let i = 0; i <= 10; i++) {
                const x = settings.padding + i * xStep;
                ctx.beginPath();
                ctx.moveTo(x, settings.padding);
                ctx.lineTo(x, canvas.height - settings.padding);
                ctx.stroke();
            }

            // Horizontal grid lines
            const yStep = (canvas.height - 2 * settings.padding) / 4;
            for (let i = 0; i <= 4; i++) {
                const y = settings.padding + i * yStep;
                ctx.beginPath();
                ctx.moveTo(settings.padding, y);
                ctx.lineTo(canvas.width - settings.padding, y);
                ctx.stroke();
            }
        }

        // Draw the square wave
        ctx.strokeStyle = settings.lineColor;
        ctx.lineWidth = settings.lineWidth;
        ctx.beginPath();

        const drawWidth = canvas.width - 2 * settings.padding;
        const drawHeight = canvas.height - 2 * settings.padding;
        const midY = settings.padding + drawHeight / 2;

        // Calculate how much of the data to draw based on progress
        const dataPointsToDraw = Math.floor(data.length * progress);

        for (let i = 0; i < dataPointsToDraw; i++) {
            const x = settings.padding + (i / data.length) * drawWidth;
            const y = midY - (data[i] * drawHeight / 2);

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }

        ctx.stroke();
    };

    // Animate the drawing of the wave
    let startTime = null;

    function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / settings.animationDuration, 1);

        drawWave(progress);

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }

    requestAnimationFrame(animate);

    return canvas;
}

// Digital Logic Gate Visualization
function createLogicGate(container, type, inputs, output) {
    const gateContainer = document.createElement('div');
    gateContainer.className = 'logic-gate';
    container.appendChild(gateContainer);

    // Create gate symbol
    const gateSymbol = document.createElement('div');
    gateSymbol.className = `gate-symbol ${type}-gate`;
    gateContainer.appendChild(gateSymbol);

    // Add gate label
    const gateLabel = document.createElement('div');
    gateLabel.className = 'gate-label';
    gateLabel.textContent = type.toUpperCase();
    gateSymbol.appendChild(gateLabel);

    // Create input wires
    const inputContainer = document.createElement('div');
    inputContainer.className = 'input-wires';
    gateContainer.appendChild(inputContainer);

    const inputWires = [];
    for (let i = 0; i < inputs.length; i++) {
        const wire = document.createElement('div');
        wire.className = 'wire input-wire';
        wire.dataset.value = inputs[i];
        wire.style.setProperty('--value', inputs[i]);
        inputContainer.appendChild(wire);
        inputWires.push(wire);

        // Add input label
        const inputLabel = document.createElement('div');
        inputLabel.className = 'wire-label';
        inputLabel.textContent = `In ${i+1}: ${inputs[i]}`;
        wire.appendChild(inputLabel);
    }

    // Create output wire
    const outputWire = document.createElement('div');
    outputWire.className = 'wire output-wire';
    outputWire.dataset.value = output;
    outputWire.style.setProperty('--value', output);
    gateContainer.appendChild(outputWire);

    // Add output label
    const outputLabel = document.createElement('div');
    outputLabel.className = 'wire-label';
    outputLabel.textContent = `Out: ${output}`;
    outputWire.appendChild(outputLabel);

    // Add animation
    const animateSignal = () => {
        // Animate input wires
        inputWires.forEach((wire, index) => {
            const signal = document.createElement('div');
            signal.className = 'signal';
            signal.style.backgroundColor = inputs[index] ? '#16c79a' : '#e74c3c';
            wire.appendChild(signal);

            setTimeout(() => {
                signal.style.left = '100%';
                setTimeout(() => {
                    signal.remove();
                }, 500);
            }, 10);
        });

        // Animate gate processing
        setTimeout(() => {
            gateSymbol.classList.add('processing');
            setTimeout(() => {
                gateSymbol.classList.remove('processing');

                // Animate output wire
                const signal = document.createElement('div');
                signal.className = 'signal';
                signal.style.backgroundColor = output ? '#16c79a' : '#e74c3c';
                outputWire.appendChild(signal);

                setTimeout(() => {
                    signal.style.left = '100%';
                    setTimeout(() => {
                        signal.remove();
                    }, 500);
                }, 10);

            }, 300);
        }, 500);
    };

    // Start animation
    setInterval(animateSignal, 3000);

    return gateContainer;
}

// Corrected: Removed the extra closing parenthesis
document.addEventListener('DOMContentLoaded', () => {
    initI2cConfigAnimation();
});

function initI2cConfigAnimation() {
    const signalBits = document.getElementById('i2c-config-sda');
    if (!signalBits) {
        console.error("Element with ID 'i2c-config-sda' not found!");
        return;
    }

    const animateBtn = document.getElementById('i2c-config-animate-btn');
    const stepsBtn = document.getElementById('i2c-config-steps-btn');
    const resetBtn = document.getElementById('i2c-config-reset-btn');
    const steps = document.getElementById('i2c-config-steps');

    animateBtn?.addEventListener('click', () => {
        const containers = [signalBits];
        animateI2cConfig(containers, steps);
    });

    stepsBtn?.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn?.addEventListener('click', () => resetAnimation([signalBits], steps, stepsBtn));
}

function animateI2cConfig(containers, steps) {
  resetAnimation(containers, steps);

  const i2cContainer = containers[0];

  // Define the I2C sequence as an array of 0s and 1s (for low and high).
  // This example shows a simplified sequence. Adjust for more complex scenarios.
  const sclData = [1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1];
  const sdaData = [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1]; // Start condition, data, stop condition

  // Create square wave visualizations for SCL and SDA
  createSquareWave(i2cContainer, sclData, {
      lineColor: '#29abe2', // Light blue for SCL
      animationDuration: 3000,
      labels: { x: 'Time', y: 'SCL' },
      height: 75, //Half of total height
      width: 600,
  });
  createSquareWave(i2cContainer, sdaData, {
      lineColor: '#f9ca24', // Yellow for SDA
      animationDuration: 3000,
      labels: { x: 'Time', y: 'SDA' },
      height: 75,  //Half of total height
      width: 600,
  });

  setTimeout(() => highlightSteps(steps), 3500); // Highlight steps after animation
}

function resetAnimation(containers, steps, stepsBtn) {
    containers.forEach(container => {
        // Remove all child nodes (including the canvas)
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    });
    steps.classList.remove('show');  // Hide steps
    if (stepsBtn) {
      stepsBtn.textContent = 'Show Steps'; // Reset button text
    }
}


function toggleSteps(steps, stepsBtn) {
    steps.classList.toggle('show');
    stepsBtn.textContent = steps.classList.contains('show') ? 'Hide Steps' : 'Show Steps';
}


function highlightSteps(steps) {
    const stepItems = steps.querySelectorAll('li');
    stepItems.forEach((step, index) => {
        setTimeout(() => {
            step.classList.add('active'); // Or any other highlighting style
        }, index * 500); // Stagger the highlighting
    });
}
