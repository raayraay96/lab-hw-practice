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
        
        // Draw the square wave up to the current progress
        ctx.strokeStyle = settings.lineColor;
        ctx.lineWidth = settings.lineWidth;
        ctx.beginPath();
        
        const drawWidth = canvas.width - 2 * settings.padding;
        const drawHeight = canvas.height - 2 * settings.padding;
        const middle = settings.padding + drawHeight / 2;
        
        const segmentWidth = drawWidth / data.length;
        const visibleSegments = Math.ceil(data.length * progress);
        
        ctx.moveTo(settings.padding, middle - (data[0] ? drawHeight / 4 : -drawHeight / 4));
        
        for (let i = 0; i < visibleSegments; i++) {
            const x1 = settings.padding + i * segmentWidth;
            const x2 = settings.padding + (i + 1) * segmentWidth;
            const y = middle - (data[i] ? drawHeight / 4 : -drawHeight / 4);
            
            // Draw horizontal line
            ctx.lineTo(x2, y);
            
            // Draw vertical line to next value if not the last point
            if (i < visibleSegments - 1) {
                const nextY = middle - (data[i + 1] ? drawHeight / 4 : -drawHeight / 4);
                ctx.lineTo(x2, nextY);
            }
        }
        
        ctx.stroke();
        
        // Add data labels at each transition
        ctx.fillStyle = '#16c79a';
        ctx.font = '10px Arial';
        for (let i = 0; i < visibleSegments; i++) {
            const x = settings.padding + i * segmentWidth + segmentWidth / 2;
            const y = middle - (data[i] ? drawHeight / 4 : -drawHeight / 4);
            ctx.fillText(data[i] ? '1' : '0', x, y - 10);
        }
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

// Enhanced bit visualization with transitions
function createEnhancedBits(container, count, options = {}) {
    const defaults = {
        initialValue: '0',
        activeColor: '#16c79a',
        inactiveColor: '#2a2a2a',
        transitionDuration: 300,
        size: 50,
        spacing: 5,
        borderRadius: 8,
        showLabels: true,
        labelPosition: 'top' // 'top', 'bottom', 'left', 'right'
    };
    
    const settings = { ...defaults, ...options };
    
    // Create container for bits if not provided
    if (!container) {
        container = document.createElement('div');
        container.className = 'enhanced-bits-container';
        container.style.display = 'flex';
        container.style.flexWrap = 'wrap';
        container.style.justifyContent = 'center';
        container.style.gap = `${settings.spacing}px`;
    }
    
    // Clear container
    container.innerHTML = '';
    
    // Create bits
    const bits = [];
    for (let i = 0; i < count; i++) {
        const bit = document.createElement('div');
        bit.className = 'enhanced-bit';
        bit.style.width = `${settings.size}px`;
        bit.style.height = `${settings.size}px`;
        bit.style.borderRadius = `${settings.borderRadius}px`;
        bit.style.backgroundColor = settings.inactiveColor;
        bit.style.color = '#fff';
        bit.style.display = 'flex';
        bit.style.justifyContent = 'center';
        bit.style.alignItems = 'center';
        bit.style.fontSize = `${settings.size / 2.5}px`;
        bit.style.fontWeight = 'bold';
        bit.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
        bit.style.transition = `background-color ${settings.transitionDuration}ms ease, 
                               transform ${settings.transitionDuration}ms ease, 
                               box-shadow ${settings.transitionDuration}ms ease`;
        bit.style.position = 'relative';
        bit.textContent = settings.initialValue;
        
        // Add label if enabled
        if (settings.showLabels) {
            const label = document.createElement('div');
            label.className = 'bit-label';
            label.textContent = `Bit ${i}`;
            label.style.position = 'absolute';
            label.style.fontSize = `${settings.size / 4}px`;
            label.style.color = '#b0b0b0';
            
            // Position the label based on settings
            switch (settings.labelPosition) {
                case 'top':
                    label.style.top = `-${settings.size / 2}px`;
                    label.style.left = '50%';
                    label.style.transform = 'translateX(-50%)';
                    break;
                case 'bottom':
                    label.style.bottom = `-${settings.size / 2}px`;
                    label.style.left = '50%';
                    label.style.transform = 'translateX(-50%)';
                    break;
                case 'left':
                    label.style.left = `-${settings.size / 1.5}px`;
                    label.style.top = '50%';
                    label.style.transform = 'translateY(-50%)';
                    break;
                case 'right':
                    label.style.right = `-${settings.size / 1.5}px`;
                    label.style.top = '50%';
                    label.style.transform = 'translateY(-50%)';
                    break;
            }
            
            bit.appendChild(label);
        }
        
        container.appendChild(bit);
        bits.push(bit);
    }
    
    // Return methods to control the bits
    return {
        bits,
        setBit: (index, value, active = true) => {
            if (index >= 0 && index < bits.length) {
                bits[index].textContent = value;
                if (active) {
                    bits[index].style.backgroundColor = settings.activeColor;
                    bits[index].style.transform = 'scale(1.1)';
                    bits[index].style.boxShadow = `0 0 10px ${settings.activeColor}`;
                } else {
                    bits[index].style.backgroundColor = settings.inactiveColor;
                    bits[index].style.transform = 'scale(1)';
                    bits[index].style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
                }
            }
        },
        setAllBits: (values, active = true) => {
            values.forEach((value, index) => {
                if (index < bits.length) {
                    bits[index].textContent = value;
                    if (active) {
                        bits[index].style.backgroundColor = settings.activeColor;
                        bits[index].style.transform = 'scale(1.1)';
                        bits[index].style.boxShadow = `0 0 10px ${settings.activeColor}`;
                    } else {
                        bits[index].style.backgroundColor = settings.inactiveColor;
                        bits[index].style.transform = 'scale(1)';
                        bits[index].style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
                    }
                }
            });
        },
        reset: () => {
            bits.forEach(bit => {
                bit.textContent = settings.initialValue;
                bit.style.backgroundColor = settings.inactiveColor;
                bit.style.transform = 'scale(1)';
                bit.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
            });
        },
        pulse: (index) => {
            if (index >= 0 && index < bits.length) {
                bits[index].style.transform = 'scale(1.2)';
                bits[index].style.boxShadow = `0 0 15px ${settings.activeColor}`;
                
                setTimeout(() => {
                    bits[index].style.transform = 'scale(1.1)';
                    bits[index].style.boxShadow = `0 0 10px ${settings.activeColor}`;
                }, 300);
            }
        }
    };
}

// Create a connection line between elements
function createConnection(fromElement, toElement, options = {}) {
    const defaults = {
        color: '#16c79a',
        width: 2,
        animated: true,
        animationDuration: 1000,
        dashed: false
    };
    
    const settings = { ...defaults, ...options };
    
    // Get positions
    const fromRect = fromElement.getBoundingClientRect();
    const toRect = toElement.getBoundingClientRect();
    
    // Calculate center points
    const fromX = fromRect.left + fromRect.width / 2;
    const fromY = fromRect.top + fromRect.height / 2;
    const toX = toRect.left + toRect.width / 2;
    const toY = toRect.top + toRect.height / 2;
    
    // Create SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.pointerEvents = 'none';
    svg.style.zIndex = '1';
}