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