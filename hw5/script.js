// Utility Functions
function toggleSteps(steps, btn) {
    btn.textContent = steps.classList.contains('visible') ? 'Show Steps' : 'Hide Steps';
    steps.classList.toggle('visible');
}

function highlightSteps(steps) {
    if (!steps) return;
    steps.classList.add('highlight');
    setTimeout(() => steps.classList.remove('highlight'), 1000);
}

function showExplanation(text) {
    const overlay = document.getElementById('explanation-overlay');
    const message = document.getElementById('explanation-message');
    if (!overlay || !message) return;
    
    message.textContent = text;
    overlay.classList.add('visible');
    
    if (overlay.timeoutId) {
        clearTimeout(overlay.timeoutId);
    }
    
    overlay.timeoutId = setTimeout(() => {
        overlay.classList.remove('visible');
        overlay.timeoutId = null;
    }, 3000);
}

// Animation setup helper function
function setupAnimation({ containerId, stepsId, animateBtnId, stepsBtnId, resetBtnId, animateFunction }) {
    const container = document.getElementById(containerId);
    const steps = document.getElementById(stepsId);
    const animateBtn = document.getElementById(animateBtnId);
    const stepsBtn = document.getElementById(stepsBtnId);
    const resetBtn = document.getElementById(resetBtnId);

    if (!container || !steps || !animateBtn || !stepsBtn || !resetBtn) {
        console.error(`Missing elements for animation setup: ${containerId}`);
        return;
    }

    function reset() {
        if (container.innerHTML) {
            container.innerHTML = '';
        }
        steps.classList.remove('visible');
        stepsBtn.textContent = 'Show Steps';
    }

    animateBtn.addEventListener('click', () => animateFunction(container, steps, reset));
    stepsBtn.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn.addEventListener('click', reset);
    reset();
}

// Problem 1: Timer Configuration
function initTimerConfigAnimation() {
    const canvas = document.getElementById('timer-output-waveform');
    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;

    const prescalerSlider = document.getElementById('timer-prescaler');
    const arrSlider = document.getElementById('timer-arr');
    const ccrSlider = document.getElementById('timer-ccr');
    const prescalerValue = document.getElementById('prescaler-value');
    const arrValue = document.getElementById('arr-value');
    const ccrValue = document.getElementById('ccr-value');

    function updateValues() {
        prescalerValue.textContent = prescalerSlider.value;
        arrValue.textContent = arrSlider.value;
        ccrValue.textContent = ccrSlider.value;
        updateTimerCalculations();
    }

    function updateTimerCalculations() {
        const prescaler = parseInt(prescalerSlider.value);
        const arr = parseInt(arrSlider.value);
        const ccr = parseInt(ccrSlider.value);

        const frequency = 100000 / ((prescaler + 1) * (arr + 1));
        const dutyCycle = (ccr / (arr + 1)) * 100;

        document.getElementById('timer-calculated-freq').textContent = frequency.toFixed(2);
        document.getElementById('timer-calculated-duty').textContent = dutyCycle.toFixed(1);
        
        // Update the values in the steps section
        document.getElementById('timer-prescaler-val').textContent = prescaler;
        document.getElementById('timer-arr-val').textContent = arr;
        document.getElementById('timer-ccr-val').textContent = ccr;
        document.getElementById('timer-arr-val-duty').textContent = arr;

        // Update waveform if animation is running
        if (animationId) {
            drawWaveform();
        }
    }

    function drawWaveform() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.strokeStyle = '#00ff88';
        ctx.lineWidth = 2;

        const prescaler = parseInt(prescalerSlider.value);
        const arr = parseInt(arrSlider.value);
        const ccr = parseInt(ccrSlider.value);
        const period = (prescaler + 1) * (arr + 1) / 100000; // in seconds
        const dutyCycle = ccr / (arr + 1);

        for (let x = 0; x < canvas.width; x++) {
            const t = (x / canvas.width) * 4 * period + time;
            const cycle = (t % period) / period;
            const y = cycle < dutyCycle ? 20 : 60;
            
            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
    }

    function animate() {
        time += 0.01;
        drawWaveform();
        animationId = requestAnimationFrame(animate);
    }

    // Event listeners
    prescalerSlider.addEventListener('input', updateValues);
    arrSlider.addEventListener('input', updateValues);
    ccrSlider.addEventListener('input', updateValues);

    document.getElementById('timer-config-animate-btn').addEventListener('click', function() {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
            this.textContent = 'Animate';
        } else {
            animate();
            this.textContent = 'Stop';
        }
    });

    document.getElementById('timer-config-steps-btn').addEventListener('click', function() {
        const steps = document.getElementById('timer-config-steps');
        toggleSteps(steps, this);
    });

    document.getElementById('timer-config-reset-btn').addEventListener('click', function() {
        prescalerSlider.value = 999;
        arrSlider.value = 99;
        ccrSlider.value = 50;
        time = 0;
        updateValues();
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
            document.getElementById('timer-config-animate-btn').textContent = 'Animate';
        }
        drawWaveform();
    });

    // Initial update
    updateValues();
    drawWaveform();
}

// Problem 3: PWM Duty Cycle
function initPWMAnimation() {
    const canvas = document.getElementById('pwm-waveform');
    const ctx = canvas.getContext('2d');
    const ccrSlider = document.getElementById('pwm-ccr');
    const ccrValue = document.getElementById('ccr-value-pwm');
    const dutyDisplay = document.getElementById('duty-cycle-display');
    let animationId;
    let time = 0;

    function calculateDutyCycle(ccr) {
        // For CCR = 0 or CCR = ARR, duty cycle is 96%
        if (ccr === 0 || ccr === 24) {
            return 96;
        }
        // Otherwise, calculate based on CCR value
        return (Math.min(ccr, 24) / 25) * 100;
    }

    function drawWaveform() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.strokeStyle = '#00ff88';
        ctx.lineWidth = 2;

        const ccr = parseInt(ccrSlider.value);
        const period = 25; // ARR + 1
        const dutyCycle = calculateDutyCycle(ccr);

        for (let x = 0; x < canvas.width; x++) {
            const t = (x / canvas.width) * 2 * period + time;
            const cycle = Math.floor(t) % period;
            let y;
            
            if (ccr === 0) {
                // Inverse PWM mode
                y = cycle === 0 ? 60 : 20;
            } else if (ccr === 24) {
                // Normal PWM mode
                y = cycle === 24 ? 60 : 20;
            } else {
                // Normal operation
                y = cycle < ccr ? 20 : 60;
            }
            
            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
    }

    function animate() {
        time += 0.1;
        drawWaveform();
        animationId = requestAnimationFrame(animate);
    }

    // Event listeners
    ccrSlider.addEventListener('input', function() {
        const ccr = parseInt(this.value);
        ccrValue.textContent = ccr;
        const dutyCycle = calculateDutyCycle(ccr);
        dutyDisplay.textContent = `${dutyCycle.toFixed(0)}%`;
        drawWaveform();
    });

    document.getElementById('pwm-animate-btn').addEventListener('click', function() {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
            this.textContent = 'Animate';
        } else {
            animate();
            this.textContent = 'Stop';
        }
    });

    document.getElementById('pwm-steps-btn').addEventListener('click', function() {
        const steps = document.getElementById('pwm-duty-steps');
        toggleSteps(steps, this);
    });

    document.getElementById('pwm-reset-btn').addEventListener('click', function() {
        ccrSlider.value = 24;
        ccrValue.textContent = '24';
        dutyDisplay.textContent = '96%';
        time = 0;
        drawWaveform();
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
            document.getElementById('pwm-animate-btn').textContent = 'Animate';
        }
    });

    // Initial draw
    drawWaveform();
}

// Problem 4: BJT Power Efficiency
function initBJTAnimation() {
    const canvas = document.getElementById('dac-signal-waveform');
    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;
    let fastMode = false;
    
    function drawWaveform() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.strokeStyle = '#00ff88';
        ctx.lineWidth = 2;
        
        for (let x = 0; x < canvas.width; x++) {
            const t = (x / canvas.width) * 2 * Math.PI + time;
            let y;
            
            if (fastMode) {
                // Fast transitions (square wave)
                y = Math.sin(t) > 0 ? 20 : 60;
            } else {
                // Slow transitions (sine wave)
                y = 40 + Math.sin(t) * 20;
            }
            
            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
    }
    
    function animate() {
        time += 0.05;
        drawWaveform();
        
        // Update current display based on mode
        document.getElementById('current-signal-display').textContent = 
            fastMode ? 'High (Less Efficient)' : 'Gradual (More Efficient)';
            
        animationId = requestAnimationFrame(animate);
    }
    
    document.getElementById('toggle-dac-method').addEventListener('click', function() {
        fastMode = !fastMode;
        this.textContent = fastMode ? 'Switch to Slow DAC (Efficient)' : 'Switch to Fast DAC (Less Efficient)';
        drawWaveform();
    });
    
    document.getElementById('bjt-animate-btn').addEventListener('click', function() {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
            this.textContent = 'Animate';
        } else {
            animate();
            this.textContent = 'Stop';
        }
    });
    
    document.getElementById('bjt-steps-btn').addEventListener('click', function() {
        const steps = document.getElementById('bjt-steps');
        toggleSteps(steps, this);
    });
    
    document.getElementById('bjt-reset-btn').addEventListener('click', function() {
        fastMode = false;
        time = 0;
        document.getElementById('toggle-dac-method').textContent = 'Switch to Fast DAC (Less Efficient)';
        document.getElementById('current-signal-display').textContent = 'Gradual (More Efficient)';
        
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
            document.getElementById('bjt-animate-btn').textContent = 'Animate';
        }
        drawWaveform();
    });
    
    // Initial draw
    drawWaveform();
}

// Problem 6: Interrupt Interval
function initInterruptIntervalAnimation() {
    setupAnimation({
        containerId: 'interrupt-interval-options',
        stepsId: 'interrupt-interval-steps',
        animateBtnId: 'interrupt-interval-animate-btn',
        stepsBtnId: 'interrupt-interval-steps-btn',
        resetBtnId: 'interrupt-interval-reset-btn',
        animateFunction: (container, steps, reset) => {
            reset();
            container.innerHTML = `
                <div>
                    <span class="bit low">a) 0.5 ms</span>
                    <span class="bit low">b) 0.8 ms</span>
                    <span class="bit high connection visible">c) 1 ms</span>
                    <span class="bit low">d) 2 ms</span>
                </div>
            `;
            
            setTimeout(() => {
                steps.classList.add('visible');
                document.getElementById('interrupt-interval-steps-btn').textContent = 'Hide Steps';
            }, 1000);
        }
    });
}

// Problem 7: Keypad Scanning
function initKeypadScanningAnimation() {
    setupAnimation({
        containerId: 'keypad-scanning-options',
        stepsId: 'keypad-scanning-steps',
        animateBtnId: 'keypad-scanning-animate-btn',
        stepsBtnId: 'keypad-scanning-steps-btn',
        resetBtnId: 'keypad-scanning-reset-btn',
        animateFunction: (container, steps, reset) => {
            reset();
            container.innerHTML = `
                <div class="keypad-grid">
                    <div class="keypad-row">
                        <div class="keypad-key">1</div>
                        <div class="keypad-key">2</div>
                        <div class="keypad-key">3</div>
                    </div>
                    <div class="keypad-row">
                        <div class="keypad-key">4</div>
                        <div class="keypad-key">5</div>
                        <div class="keypad-key">6</div>
                    </div>
                    <div class="keypad-row">
                        <div class="keypad-key">7</div>
                        <div class="keypad-key active">8</div>
                        <div class="keypad-key">9</div>
                    </div>
                    <div class="keypad-row">
                        <div class="keypad-key">*</div>
                        <div class="keypad-key">0</div>
                        <div class="keypad-key">#</div>
                    </div>
                </div>
                <div class="keypad-result">
                    <div>Row: <span class="highlight">2</span></div>
                    <div>Column: <span class="highlight">1</span></div>
                    <div>Key: <span class="highlight">8</span></div>
                </div>
            `;
            
            setTimeout(() => {
                steps.classList.add('visible');
                document.getElementById('keypad-scanning-steps-btn').textContent = 'Hide Steps';
            }, 1000);
        }
    });
}

// Problem 8: Debouncing
function initDebouncingAnimation() {
    setupAnimation({
        containerId: 'debouncing-options',
        stepsId: 'debouncing-steps',
        animateBtnId: 'debouncing-animate-btn',
        stepsBtnId: 'debouncing-steps-btn',
        resetBtnId: 'debouncing-reset-btn',
        animateFunction: (container, steps, reset) => {
            reset();

            const canvas = document.createElement('canvas');
            canvas.width = 400;
            canvas.height = 100;
            container.appendChild(canvas);

            const ctx = canvas.getContext('2d');
            ctx.strokeStyle = '#00ff88';
            ctx.lineWidth = 2;

            // Draw bouncing signal
            ctx.beginPath();
            ctx.moveTo(0, 80);

            // Draw the bouncing pattern
            let x = 0;
            while (x < 400) {
                ctx.lineTo(x += 10, 20);
                ctx.lineTo(x += 5, 80);
                ctx.lineTo(x += 8, 20);
                ctx.lineTo(x += 15, 80);
                ctx.lineTo(x += 7, 20);
                ctx.lineTo(x += 20, 20);
            }

            ctx.stroke();

            // Draw debounced signal
            ctx.beginPath();
            ctx.strokeStyle = '#ff5588';
            ctx.setLineDash([5, 5]);
            ctx.moveTo(0, 80);
            ctx.lineTo(50, 80);
            ctx.lineTo(50, 20);
            ctx.lineTo(350, 20);
            ctx.lineTo(350, 80);
            ctx.stroke();

            // Add legend
            const legend = document.createElement('div');
            legend.className = 'legend';
            legend.innerHTML = `
                <div><span style="color:#00ff88;">■</span> Raw Signal</div>
                <div><span style="color:#ff5588;">■</span> Debounced Signal</div>
                <div>Debounce Time: 20ms</div>
            `;
            container.appendChild(legend);

            setTimeout(() => {
                steps.classList.add('visible');
                document.getElementById('debouncing-steps-btn').textContent = 'Hide Steps';
            }, 1000);
        }
    });
}

// Problem 9: Sinewave Generation
function initSinewaveAnimation() {
    const canvas = document.getElementById('sinewave-canvas');
    const ctx = canvas.getContext('2d');
    let animationId;
    let phase = 0;
    let frequency = 1;
    let samplesPerCycle = 10;
    let dacRate = 100000;

    function drawSineWave(canvas, amplitude, frequency, phase) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        ctx.clearRect(0, 0, width, height);
        ctx.beginPath();
        ctx.strokeStyle = '#00ff88';
        ctx.lineWidth = 2;

        // Draw continuous sine wave
        ctx.beginPath();
        ctx.strokeStyle = '#00ff88';
        for (let x = 0; x < width; x++) {
            const y = height/2 + Math.sin(2 * Math.PI * frequency * x / width + phase) * amplitude * height/2;
            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();

        // Draw sample points
        ctx.fillStyle = '#ff5588';
        const sampleCount = Math.floor(width / (samplesPerCycle * frequency));
        for (let i = 0; i < sampleCount; i++) {
            const x = i * samplesPerCycle * frequency;
            if (x < width) {
                const y = height/2 + Math.sin(2 * Math.PI * frequency * x / width + phase) * amplitude * height/2;
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, 2 * Math.PI);
                ctx.fill();
            }
        }
    }

    function updateValueDisplay(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    function animateSine() {
        drawSineWave(canvas, 0.8, frequency / 25000, phase);
        phase += 0.1;
        if (phase > 2 * Math.PI) {
            phase -= 2 * Math.PI;
        }
        const calculatedMaxFrequency = dacRate / samplesPerCycle;
        updateValueDisplay('sinewave-freq-display', calculatedMaxFrequency.toFixed(0));
        animationId = requestAnimationFrame(animateSine);
    }

    document.getElementById('sinewave-samples-slider').addEventListener('input', function() {
        samplesPerCycle = parseInt(this.value);
        updateValueDisplay('sinewave-samples-display', samplesPerCycle);
        const calculatedMaxFrequency = dacRate / samplesPerCycle;
        updateValueDisplay('sinewave-freq-display', calculatedMaxFrequency.toFixed(0));
        drawSineWave(canvas, 0.8, frequency / 25000, phase);
    });

    document.getElementById('sinewave-animate-btn').addEventListener('click', function() {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
            this.textContent = 'Animate';
        } else {
            animateSine();
            this.textContent = 'Stop';
        }
    });

    document.getElementById('sinewave-steps-btn').addEventListener('click', function() {
        const steps = document.getElementById('sinewave-steps');
        toggleSteps(steps, this);
    });

    document.getElementById('sinewave-reset-btn').addEventListener('click', function() {
        samplesPerCycle = 10;
        phase = 0;
        document.getElementById('sinewave-samples-slider').value = 10;
        updateValueDisplay('sinewave-samples-display', 10);
        const calculatedMaxFrequency = dacRate / samplesPerCycle;
        updateValueDisplay('sinewave-freq-display', calculatedMaxFrequency.toFixed(0));
        
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
            document.getElementById('sinewave-animate-btn').textContent = 'Animate';
        }
    });
}

// Problem 10: OpAmp Gain
function initOpAmpGainAnimation() {
    setupAnimation({
        containerId: 'opamp-gain-options',
        stepsId: 'opamp-gain-steps',
        animateBtnId: 'opamp-gain-animate-btn',
        stepsBtnId: 'opamp-gain-steps-btn',
        resetBtnId: 'opamp-gain-reset-btn',
        animateFunction: (container, steps, reset) => {
            reset();
            container.innerHTML = `
                <div>
                    <span class="bit low">a) Gain = 5</span>
                    <span class="bit low">b) Gain = 10</span>
                    <span class="bit high connection visible">c) Gain = 11</span>
                    <span class="bit low">d) Gain = 20</span>
                </div>
            `;

            setTimeout(() => {
                steps.classList.add('visible');
                document.getElementById('opamp-gain-steps-btn').textContent = 'Hide Steps';
            }, 1000);
        }
    });
}

// Problem 11: I2C Transfer Rate
function initMOSFETSwitchAnimation() {
    const container = document.getElementById('mosfet-switch-options');
    const steps = document.getElementById('mosfet-switch-steps');
    
    function drawI2CTimeline() {
        container.innerHTML = '';
        
        // Create canvas for I2C timeline
        const canvas = document.createElement('canvas');
        canvas.width = 500;
        canvas.height = 300;
        container.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw I2C timeline
        ctx.font = '14px Arial';
        ctx.fillStyle = '#fff';
        
        // Draw master and slave labels
        ctx.fillText('I2C Master', 100, 30);
        ctx.fillText('I2C Slave', 350, 30);
        
        // Draw vertical lines for master and slave
        ctx.beginPath();
        ctx.strokeStyle = '#fff';
        ctx.moveTo(120, 40);
        ctx.lineTo(120, 280);
        ctx.moveTo(380, 40);
        ctx.lineTo(380, 280);
        ctx.stroke();
        
        // Draw signal lines
        const signals = [
            { from: 120, to: 380, y: 60, label: 'Start bit' },
            { from: 120, to: 380, y: 90, label: '8 bit (7 address + R/W)' },
            { from: 380, to: 120, y: 120, label: '1 bit ACK' },
            { from: 120, to: 380, y: 150, label: '8 bit of data' },
            { from: 380, to: 120, y: 180, label: '1 bit ACK' },
            { from: 120, to: 380, y: 210, label: '8 bit of data' },
            { from: 380, to: 120, y: 240, label: '1 bit ACK' },
            { from: 120, to: 380, y: 270, label: 'Stop bit' }
        ];
        
        signals.forEach(signal => {
            ctx.beginPath();
            ctx.moveTo(signal.from, signal.y);
            ctx.lineTo(signal.to, signal.y);
            ctx.stroke();
            
            // Add arrowhead
            const arrowSize = 5;
            const direction = signal.from < signal.to ? 1 : -1;
            ctx.beginPath();
            ctx.moveTo(signal.to, signal.y);
            ctx.lineTo(signal.to - direction * arrowSize, signal.y - arrowSize);
            ctx.lineTo(signal.to - direction * arrowSize, signal.y + arrowSize);
            ctx.closePath();
            ctx.fill();
            
            // Add label
            ctx.fillText(signal.label, Math.min(signal.from, signal.to) + Math.abs(signal.from - signal.to) / 2 - 40, signal.y - 5);
        });
        
        // Add calculation result
        const resultDiv = document.createElement('div');
        resultDiv.className = 'calculation-result';
        resultDiv.innerHTML = `
            <h3>I2C Data Transfer Rate Calculation</h3>
            <p>Total signal changes: 29 bits</p>
            <p>Baud rate: 9600 bits/second</p>
            <p>Transactions per second: 9600 ÷ 29 = 331.03</p>
            <p>Data bytes per transaction: 2 bytes</p>
            <p>Data transfer rate: 331.03 × 2 = 662.07 Bytes/s</p>
        `;
        container.appendChild(resultDiv);
    }
    
    document.getElementById('mosfet-switch-animate-btn').addEventListener('click', function() {
        drawI2CTimeline();
        setTimeout(() => {
            steps.classList.add('visible');
            document.getElementById('mosfet-switch-steps-btn').textContent = 'Hide Steps';
        }, 1000);
    });
    
    document.getElementById('mosfet-switch-steps-btn').addEventListener('click', function() {
        toggleSteps(steps, this);
    });
    
    document.getElementById('mosfet-switch-reset-btn').addEventListener('click', function() {
        container.innerHTML = '';
        steps.classList.remove('visible');
        document.getElementById('mosfet-switch-steps-btn').textContent = 'Show Steps';
    });
}

// Problem 12: ADC Resolution
function initADCResolutionAnimation() {
    setupAnimation({
        containerId: 'adc-resolution-options',
        stepsId: 'adc-resolution-steps',
        animateBtnId: 'adc-resolution-animate-btn',
        stepsBtnId: 'adc-resolution-steps-btn',
        resetBtnId: 'adc-resolution-reset-btn',
        animateFunction: (container, steps, reset) => {
            reset();
            container.innerHTML = `
                <div>
                    <span class="bit low">a) 8-bit</span>
                    <span class="bit low">b) 10-bit</span>
                    <span class="bit high connection visible">c) 12-bit</span>
                    <span class="bit low">d) 16-bit</span>
                </div>
            `;

            setTimeout(() => {
                steps.classList.add('visible');
                document.getElementById('adc-resolution-steps-btn').textContent = 'Hide Steps';
            }, 1000);
        }
    });
}

// Problem 13: Clock Frequency
function initClockFrequencyAnimation() {
    setupAnimation({
        containerId: 'clock-frequency-options',
        stepsId: 'clock-frequency-steps',
        animateBtnId: 'clock-frequency-animate-btn',
        stepsBtnId: 'clock-frequency-steps-btn',
        resetBtnId: 'reset-btn-clock-frequency',
        animateFunction: (container, steps, reset) => {
            reset();
            container.innerHTML = `
                <div>
                    <span class="bit low">a) 1 MHz</span>
                    <span class="bit low">b) 4 MHz</span>
                    <span class="bit high connection visible">c) 8 MHz</span>
                    <span class="bit low">d) 16 MHz</span>
                </div>
            `;

            setTimeout(() => {
                steps.classList.add('visible');
                document.getElementById('clock-frequency-steps-btn').textContent = 'Hide Steps';
            }, 1000);
        }
    });
}

// Problem 14: UART Baud Rate
function initUARTBaudRateAnimation() {
    setupAnimation({
        containerId: 'uart-baud-rate-options',
        stepsId: 'uart-baud-rate-steps',
        animateBtnId: 'uart-baud-rate-animate-btn',
        stepsBtnId: 'uart-baud-rate-steps-btn',
        resetBtnId: 'uart-baud-rate-reset-btn',
        animateFunction: (container, steps, reset) => {
            reset();
            container.innerHTML = `
                <div>
                    <span class="bit low">a) 9600 bps</span>
                    <span class="bit low">b) 19200 bps</span>
                    <span class="bit high connection visible">c) 38400 bps</span>
                    <span class="bit low">d) 115200 bps</span>
                </div>
            `;

            setTimeout(() => {
                steps.classList.add('visible');
                document.getElementById('uart-baud-rate-steps-btn').textContent = 'Hide Steps';
            }, 1000);
        }
    });
}

// Problem 15: I2C Addressing
function initI2CAddressingAnimation() {
    setupAnimation({
        containerId: 'i2c-addressing-options',
        stepsId: 'i2c-addressing-steps',
        animateBtnId: 'i2c-addressing-animate-btn',
        stepsBtnId: 'i2c-addressing-steps-btn',
        resetBtnId: 'i2c-addressing-reset-btn',
        animateFunction: (container, steps, reset) => {
            reset();
            container.innerHTML = `
                <div>
                    <span class="bit low">a) 7-bit</span>
                    <span class="bit low">b) 8-bit</span>
                    <span class="bit high connection visible">c) 10-bit</span>
                    <span class="bit low">d) 16-bit</span>
                </div>
            `;

            setTimeout(() => {
                steps.classList.add('visible');
                document.getElementById('i2c-addressing-steps-btn').textContent = 'Hide Steps';
            }, 1000);
        }
    });
}

// Problem 3: SysTick Limitations
function initSysTickAnimation() {
    setupAnimation({
        containerId: 'systick-limitations-options',
        stepsId: 'systick-limitations-steps',
        animateBtnId: 'systick-limitations-animate-btn',
        stepsBtnId: 'systick-limitations-steps-btn',
        resetBtnId: 'systick-limitations-reset-btn',
        animateFunction: (container, steps, reset) => {
            reset();
            container.innerHTML = `
                <div>
                    <span class="bit low">a) Delay Function</span>
                    <span class="bit low">b) Clear Variable</span>
                    <span class="bit high connection visible">c) Flash Latency</span>
                    <span class="bit low">d) SysTick Handler</span>
                </div>
            `;
            
            setTimeout(() => {
                steps.classList.add('visible');
                document.getElementById('systick-limitations-steps-btn').textContent = 'Hide Steps';
            }, 1000);
        }
    });
}

// Problem 5: Sampling Rate
function initSamplingRateAnimation() {
    const canvas = document.getElementById('sampling-rate-canvas');
    const ctx = canvas.getContext('2d');
    let animationId;
    let phase = 0;
    let samplingRate = 10; // Default sampling rate
    
    function drawSignal() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw original signal (sine wave)
        ctx.beginPath();
        ctx.strokeStyle = '#00ff88';
        ctx.lineWidth = 2;
        
        for (let x = 0; x < canvas.width; x++) {
            const t = (x / canvas.width) * 2 * Math.PI + phase;
            const y = canvas.height/2 + Math.sin(t) * canvas.height/3;
            
            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
        
        // Draw sampling points
        ctx.fillStyle = '#ff5588';
        for (let i = 0; i < samplingRate; i++) {
            const x = (i / samplingRate) * canvas.width;
            const t = (x / canvas.width) * 2 * Math.PI + phase;
            const y = canvas.height/2 + Math.sin(t) * canvas.height/3;
            
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
        }
        
        // Update Nyquist frequency display
        const nyquistFreq = samplingRate / 2;
        document.getElementById('nyquist-freq-display').textContent = nyquistFreq.toFixed(1);
    }
    
    function animate() {
        phase += 0.05;
        if (phase > 2 * Math.PI) {
            phase -= 2 * Math.PI;
        }
        drawSignal();
        animationId = requestAnimationFrame(animate);
    }
    
    // Event listeners
    document.getElementById('sampling-rate-slider').addEventListener('input', function() {
        samplingRate = parseInt(this.value);
        document.getElementById('sampling-rate-display').textContent = samplingRate;
        drawSignal();
    });
    
    document.getElementById('sampling-rate-animate-btn').addEventListener('click', function() {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
            this.textContent = 'Animate';
        } else {
            animate();
            this.textContent = 'Stop';
        }
    });
    
    document.getElementById('sampling-rate-steps-btn').addEventListener('click', function() {
        const steps = document.getElementById('sampling-rate-steps');
        toggleSteps(steps, this);
    });
    
    document.getElementById('sampling-rate-reset-btn').addEventListener('click', function() {
        samplingRate = 10;
        phase = 0;
        document.getElementById('sampling-rate-slider').value = 10;
        document.getElementById('sampling-rate-display').textContent = '10';
        document.getElementById('nyquist-freq-display').textContent = '5.0';
        
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
            document.getElementById('sampling-rate-animate-btn').textContent = 'Animate';
        }
        drawSignal();
    });
    
    // Initial draw
    drawSignal();
}

document.addEventListener('DOMContentLoaded', function() {
    initTimerConfigAnimation(); // Problem 1
    initPWMAnimation(); // Problem 2
    initSysTickAnimation(); // Problem 3
    initBJTAnimation(); // Problem 4
    initSamplingRateAnimation(); // Problem 5
    initInterruptIntervalAnimation(); // Problem 6
    initKeypadScanningAnimation(); // Problem 7
    initDebouncingAnimation(); // Problem 8
    initSinewaveAnimation(); // Problem 9
    initOpAmpGainAnimation(); // Problem 10
    initMOSFETSwitchAnimation(); // Problem 11
    initADCResolutionAnimation(); // Problem 12
    initClockFrequencyAnimation(); // Problem 13
    initUARTBaudRateAnimation(); // Problem 14
    initI2CAddressingAnimation(); // Problem 15
});
