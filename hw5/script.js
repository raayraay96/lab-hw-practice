// Utility Functions
function toggleSteps(steps, btn) {
    if (!steps || !btn) return;
    steps.classList.toggle('visible');
    btn.textContent = steps.classList.contains('visible') ? 'Hide Steps' : 'Show Steps';
}

function highlightSteps(steps) {
    if (!steps) return;
    steps.classList.add('visible');
    const paragraphs = steps.querySelectorAll('p');
    paragraphs.forEach((p, i) => {
        setTimeout(() => {
            // Remove highlight from previous paragraph if exists
            if (i > 0) paragraphs[i - 1].classList.remove('step-highlight');
            p.classList.add('step-highlight');
        }, i * 800);
    });
    // Optionally remove highlight from the final paragraph after completion
    setTimeout(() => {
        if (paragraphs.length) paragraphs[paragraphs.length - 1].classList.remove('step-highlight');
    }, paragraphs.length * 800);
}

function resetBits(bitContainer, initialText) {
    [...bitContainer.children].forEach(child => { // Iterate over direct children of bitContainer (should be DIVs)
        if (child.tagName === 'DIV') {
            [...child.children].forEach(bit => { // Iterate over bits within each DIV
                bit.classList.remove('high', 'connection', 'visible');
                bit.classList.add('low');
                if (initialText !== '') bit.textContent = initialText;
            });
        }
    });
}

window.onscroll = function() {
    const btn = document.getElementById('back-to-top');
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        btn.style.display = 'block';
    } else {
        btn.style.display = 'none';
    }
};

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setupAnimation(config) {
    const { containerId, stepsId, animateBtnId, stepsBtnId, resetBtnId, initialValue = '', animateFunction } = config;
    const container = document.getElementById(containerId);
    const steps = document.getElementById(stepsId);
    const animateBtn = document.getElementById(animateBtnId);
    const stepsBtn = document.getElementById(stepsBtnId);
    const resetBtn = document.getElementById(resetBtnId);
    if (!container || !steps || !animateBtn || !stepsBtn || !resetBtn) {
        console.warn(`Elements not found for ${containerId} animation`);
        return;
    }
    function reset() {
        if (container.querySelector('div')) {
            resetBits(container, initialValue);
        } else {
            container.innerHTML = initialValue;
        }
        steps.classList.remove('visible');
        stepsBtn.textContent = 'Show Steps';
    }
    animateBtn.addEventListener('click', () => animateFunction(container, steps, reset));
    stepsBtn.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn.addEventListener('click', reset);
    reset();
}

// ---- New Utility Functions for Drawing Waveforms and Counters ----

function clearCanvas(canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawSquareWave(canvas, dutyCyclePercent) {
    const ctx = canvas.getContext('2d');
    clearCanvas(canvas);
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 2;
    const width = canvas.width;
    const height = canvas.height / 2;
    const onWidth = width * (dutyCyclePercent / 100);

    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(onWidth, height);
    ctx.lineTo(onWidth, 0);
    ctx.lineTo(width, 0);
    ctx.lineTo(width, height);
    ctx.stroke();
}

function drawSineWave(canvas, amplitude = 0.8, frequency = 1, phase = 0) {
    const ctx = canvas.getContext('2d');
    clearCanvas(canvas);
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 1.5;
    const width = canvas.width;
    const height = canvas.height / 2;
    const scaleY = height * amplitude;
    ctx.beginPath();
    for (let x = 0; x < width; x++) {
        const normalizedX = x / width;
        const y = height - scaleY * Math.sin(2 * Math.PI * frequency * normalizedX + phase);
        if (x === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();
}

function drawTriangleWave(canvas, peakHeightPercent = 0.8) {
    const ctx = canvas.getContext('2d');
    clearCanvas(canvas);
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 2;
    const width = canvas.width;
    const height = canvas.height / 2;
    const peakY = height - height * peakHeightPercent;

    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(width / 2, peakY);
    ctx.lineTo(width, height);
    ctx.stroke();
    ctx.lineTo(0, height); // Close the path to fill if needed later
    ctx.closePath(); // Explicitly close path
    ctx.stroke();
}


function updateVisualCounter(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value;
    }
}

function updateValueDisplay(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value;
    }
}


// Refactored Animation Functions (Updated for Visuals and Interactivity)

function initTimerConfigAnimation() {
    const prescalerSlider = document.getElementById('timer-prescaler');
    const arrSlider = document.getElementById('timer-arr');
    const ccrSlider = document.getElementById('timer-ccr');

    setupAnimation({
        containerId: 'timer-config-options', // Still might use bits for options in future if needed
        stepsId: 'timer-config-steps',
        animateBtnId: 'timer-config-animate-btn',
        stepsBtnId: 'timer-config-steps-btn',
        resetBtnId: 'timer-config-reset-btn',
        animateFunction: (container, steps, reset) => {
            reset();
            const counterDisplay = document.getElementById('timer-counter-display');
            const waveformCanvas = document.getElementById('timer-output-waveform');
            let counterValue = 0;
            let animationInterval;

            const prescaler = parseInt(prescalerSlider.value, 10);
            const arrValue = parseInt(arrSlider.value, 10);
            const ccrValue = parseInt(ccrSlider.value, 10);
            const timerFrequency = 100000 / (1 + prescaler) / (1 + arrValue); // in Hz
            const dutyCycle = (ccrValue / (arrValue + 1)) * 100;

            // Update Calculation Steps Dynamically
            document.getElementById('timer-prescaler-val').textContent = prescaler;
            document.getElementById('timer-arr-val').textContent = arrValue;
            document.getElementById('timer-arr-val-duty').textContent = arrValue;
            document.getElementById('timer-ccr-val').textContent = ccrValue;
            document.getElementById('timer-calculated-freq').textContent = timerFrequency.toFixed(2);
            document.getElementById('timer-calculated-duty').textContent = dutyCycle.toFixed(0);
            document.getElementById('timer-calculated-duty-percent').textContent = dutyCycle.toFixed(0);


            animationInterval = setInterval(() => {
                updateVisualCounter('timer-counter-display', counterValue);
                drawSquareWave(waveformCanvas, dutyCycle); // Duty cycle is now fixed based on CCR/ARR

                counterValue++;
                if (counterValue > arrValue) {
                    counterValue = 0;
                }
            }, 1000 / timerFrequency / (arrValue + 1) ); // Adjust interval for animation speed

            setTimeout(() => highlightSteps(steps), 1000); // Highlight steps after initial animation starts
            setTimeout(() => clearInterval(animationInterval), 10000); // Stop animation after 10 seconds (adjust as needed)
        }
    });

    // Add event listeners to sliders to update calculations and animation
    const updateTimerDisplay = () => {
        const prescaler = parseInt(prescalerSlider.value, 10);
        const arrValue = parseInt(arrSlider.value, 10);
        const ccrValue = parseInt(ccrSlider.value, 10);
        const timerFrequency = 100000 / (1 + prescaler) / (1 + arrValue);
        const dutyCycle = (ccrValue / (arrValue + 1)) * 100;

        // Update Calculation Steps Dynamically (same as in animateFunction)
        document.getElementById('timer-prescaler-val').textContent = prescaler;
        document.getElementById('timer-arr-val').textContent = arrValue;
        document.getElementById('timer-arr-val-duty').textContent = arrValue;
        document.getElementById('timer-ccr-val').textContent = ccrValue;
        document.getElementById('timer-calculated-freq').textContent = timerFrequency.toFixed(2);
        document.getElementById('timer-calculated-duty').textContent = dutyCycle.toFixed(0);
        document.getElementById('timer-calculated-duty-percent').textContent = dutyCycle.toFixed(0);

        const waveformCanvas = document.getElementById('timer-output-waveform');
        drawSquareWave(waveformCanvas, dutyCycle); // Redraw waveform with updated duty cycle
    };

    prescalerSlider.addEventListener('input', updateTimerDisplay);
    arrSlider.addEventListener('input', updateTimerDisplay);
    ccrSlider.addEventListener('input', updateTimerDisplay);
}


function initSinewaveAnimation() {
    setupAnimation({
        containerId: 'sinewave-samples', // Still bits container for now, could be repurposed
        stepsId: 'sinewave-steps',
        animateBtnId: 'sinewave-animate-btn',
        stepsBtnId: 'sinewave-steps-btn',
        resetBtnId: 'sinewave-reset-btn',
        animateFunction: (container, steps, reset) => {
            reset();
            const sinewaveCanvas = document.getElementById('sinewave-canvas');
            let samplesPerCycle = 20;
            let frequency = 25000;
            let dacRate = 500000;

            updateValueDisplay('sinewave-samples-display', samplesPerCycle);
            updateValueDisplay('sinewave-freq-display', frequency);

            drawSineWave(sinewaveCanvas, 0.8, frequency/25000); // Example frequency scaling

            setTimeout(() => highlightSteps(steps), 1000);
        }
    });
}

function initCenterAnimation() {
    setupAnimation({
        containerId: 'center-counter',
        stepsId: 'center-steps',
        animateBtnId: 'center-animate-btn',
        stepsBtnId: 'center-steps-btn',
        resetBtnId: 'center-reset-btn',
        initialValue: '0',
        animateFunction: (container, steps, reset) => {
            reset();
            const counterDisplay = document.getElementById('center-counter-display');
            const waveformCanvas = document.getElementById('center-waveform');
            let counterValue = 0;
            let arrValue = 500;
            let countingUp = true;
            let animationInterval;

            animationInterval = setInterval(() => {
                updateVisualCounter('center-counter-display', counterValue);
                drawTriangleWave(waveformCanvas); // Basic triangle wave

                if (countingUp) {
                    counterValue++;
                    if (counterValue > arrValue) {
                        countingUp = false;
                        counterValue = arrValue; // To avoid going over ARR value
                    }
                } else {
                    counterValue--;
                    if (counterValue < 0) {
                        countingUp = true;
                        counterValue = 0;
                    }
                }
            }, 1000 / 100); // Adjust interval for animation speed (10ms interrupt interval is 100Hz rate)

            setTimeout(() => highlightSteps(steps), 1000);
            setTimeout(() => clearInterval(animationInterval), 10000); // Stop after 10 seconds
        }
    });
}

function initWavetableAnimation() {
    setupAnimation({
        containerId: 'wavetable-step',
        stepsId: 'wavetable-steps',
        animateBtnId: 'wavetable-animate-btn',
        stepsBtnId: 'wavetable-steps-btn',
        resetBtnId: 'wavetable-reset-btn',
        initialValue: '0',
        animateFunction: (container, steps, reset) => {
            reset();
            let offsetIterations = 0;
            const stepDisplay = document.getElementById('wavetable-step-display');
            const offsetDisplay = document.getElementById('wavetable-offset-display');
            const stepValueHex = '0x4f057'; // Example step value
            const wrapAroundIterations = 203;

            updateValueDisplay('wavetable-step-display', stepValueHex);
            updateValueDisplay('wavetable-offset-display', offsetIterations);

            let animationInterval = setInterval(() => {
                offsetIterations++;
                updateValueDisplay('wavetable-offset-display', offsetIterations);
                if (offsetIterations >= wrapAroundIterations) {
                    clearInterval(animationInterval);
                    updateValueDisplay('wavetable-offset-display', 'Wrapped Around!'); // Indicate wrap-around
                }
            }, 50); // Adjust interval for animation speed

            setTimeout(() => highlightSteps(steps), 1000);
        }
    });
}

function initBJTAnimation() {
    setupAnimation({
        containerId: 'dac-signal',
        stepsId: 'bjt-steps',
        animateBtnId: 'bjt-animate-btn',
        stepsBtnId: 'bjt-steps-btn',
        resetBtnId: 'bjt-reset-btn',
        initialValue: '0',
        animateFunction: (container, steps, reset) => {
            reset();
            const dacWaveformCanvas = document.getElementById('dac-signal-waveform');
            const currentDisplay = document.getElementById('current-signal-display');
            let time = 0;
            let animationInterval;
            let isFastDAC = false; // Initially slow DAC

            function animateDACSignal() {
                const frequency = isFastDAC ? 5 : 0.5; // Fast vs Slow DAC signal frequency
                drawSineWave(dacWaveformCanvas, 0.8, frequency, time); // Example DAC signal as sine wave
                currentDisplay.textContent = isFastDAC ? 'Fluctuating' : 'Stable'; // Example current indication
                time += 0.02; // Increment time for sine wave animation
            }

            animationInterval = setInterval(animateDACSignal, 20); // Animation interval

            const toggleButton = document.getElementById('toggle-dac-method');
            toggleButton.onclick = () => {
                isFastDAC = !isFastDAC;
                clearInterval(animationInterval); // Restart animation with new DAC speed
                time = 0; // Reset time
                animationInterval = setInterval(animateDACSignal, 20);
                toggleButton.textContent = isFastDAC ? 'Toggle Driving Method (Slow)' : 'Toggle Driving Method (Fast)'; // Update button text
            };


            setTimeout(() => highlightSteps(steps), 1000);
            setTimeout(() => clearInterval(animationInterval), 10000); // Stop after 10 seconds (adjust as needed)
        }
    });
}


function initPWMAnimation() {
    const arrSlider = document.getElementById('pwm-arr');
    const ccrSlider = document.getElementById('pwm-ccr');

    setupAnimation({
        containerId: 'pwm-signal',
        stepsId: 'pwm-steps',
        animateBtnId: 'pwm-animate-btn',
        stepsBtnId: 'pwm-steps-btn',
        resetBtnId: 'pwm-reset-btn',
        animateFunction: (container, steps, reset) => {
            reset();
            const pwmWaveformCanvas = document.getElementById('pwm-signal-waveform');
            const dutyCycleDisplay = document.getElementById('pwm-duty-cycle-display');

            const arrValue = parseInt(arrSlider.value, 10);
            const ccrValue = parseInt(ccrSlider.value, 10);
            const dutyCyclePercent = (ccrValue / (arrValue + 1)) * 100;

            // Update Calculation Steps Dynamically
            document.getElementById('pwm-arr-val').textContent = arrValue;
            document.getElementById('pwm-ccr-val-duty').textContent = ccrValue;
            document.getElementById('pwm-calculated-period').textContent = arrValue + 1;
            document.getElementById('pwm-calculated-period-duty').textContent = arrValue + 1;
            document.getElementById('pwm-calculated-duty-percent').textContent = dutyCyclePercent.toFixed(0);
            dutyCycleDisplay.textContent = dutyCyclePercent.toFixed(0) + '%';


            drawSquareWave(pwmWaveformCanvas, dutyCyclePercent);


            setTimeout(() => highlightSteps(steps), 1000);
        }
    });

     // Add event listeners to sliders to update calculations and waveform
     const updatePWMDisplay = () => {
        const arrValue = parseInt(arrSlider.value, 10);
        const ccrValue = parseInt(ccrSlider.value, 10);
        const dutyCyclePercent = (ccrValue / (arrValue + 1)) * 100;

        // Update Calculation Steps Dynamically (same as in animateFunction)
        document.getElementById('pwm-arr-val').textContent = arrValue;
        document.getElementById('pwm-ccr-val-duty').textContent = ccrValue;
        document.getElementById('pwm-calculated-period').textContent = arrValue + 1;
        document.getElementById('pwm-calculated-period-duty').textContent = arrValue + 1;
        document.getElementById('pwm-calculated-duty-percent').textContent = dutyCyclePercent.toFixed(0);
        dutyCycleDisplay.textContent = dutyCyclePercent.toFixed(0) + '%';

        const pwmWaveformCanvas = document.getElementById('pwm-signal-waveform');
        drawSquareWave(pwmWaveformCanvas, dutyCyclePercent); // Redraw waveform
    };

    arrSlider.addEventListener('input', updatePWMDisplay);
    ccrSlider.addEventListener('input', updatePWMDisplay);
}


function initSysTickLimitationsAnimation() { /* ... (Simplified - bits only for now, can add visuals later) ... */ initGenericBitsAnimation('systick-limitations'); }
function initInterruptIntervalAnimation() { /* ... (Simplified - bits only for now, can add visuals later) ... */ initGenericBitsAnimation('interrupt-interval'); }
function initKeypadScanningAnimation() { /* ... (Keypad animation remains largely the same as before) ... */  initKeypadScanningAnimationBase(); }
function initHistoryByteAnimation() { /* ... (Bits animation remains largely the same) ... */ initHistoryByteAnimationBase(); }
function initDisplayFrequencyAnimation() { /* ... (Bits animation remains largely the same) ... */ initDisplayFrequencyAnimationBase(); }
function initMultiplexingPinsAnimation() { /* ... (Bits animation remains largely the same) ... */ initMultiplexingPinsAnimationBase(); }
function initTwoArraysAnimation() { /* ... (Bits animation remains largely the same) ... */ initTwoArraysAnimationBase(); }
function initCounterTimerAnimation() { /* ... (Bits animation remains largely the same) ... */ initCounterTimerAnimationBase(); }


// --- Simplified Animation Functions for Problems with Bit Representations (can be visually enhanced later) ---

function initGenericBitsAnimation(baseId) {
    setupAnimation({
        containerId: `${baseId}-options`,
        stepsId: `${baseId}-steps`,
        animateBtnId: `${baseId}-animate-btn`,
        stepsBtnId: `${baseId}-steps-btn`,
        resetBtnId: `${baseId}-reset-btn`,
        animateFunction: (container, steps, reset) => {
            reset();
            const optionBitsGroup = container.children[0].children;
            setTimeout(() => {
                if (optionBitsGroup[2]) {
                    optionBitsGroup[2].classList.remove('low');
                    optionBitsGroup[2].classList.add('high', 'connection');
                    setTimeout(() => optionBitsGroup[2].classList.add('visible'), 100);
                }
            }, 500);
            setTimeout(() => highlightSteps(steps), 1000);
        }
    });
}

function initKeypadScanningAnimationBase() { // Renamed to avoid conflict if you enhance later
    setupAnimation({
        containerId: 'keypad-scanning-keypad',
        stepsId: 'keypad-scanning-steps',
        animateBtnId: 'keypad-scanning-animate-btn',
        stepsBtnId: 'keypad-scanning-steps-btn',
        resetBtnId: 'keypad-scanning-reset-btn',
        animateFunction: initKeypadScanningAnimation().animateFunction // Re-use the keypad animation logic
    });
}

function initHistoryByteAnimationBase() { // Renamed
    setupAnimation({
        containerId: 'history-byte-bits',
        stepsId: 'history-byte-steps',
        animateBtnId: 'history-byte-animate-btn',
        stepsBtnId: 'history-byte-steps-btn',
        resetBtnId: 'history-byte-reset-btn',
        initialValue: '0',
        animateFunction: initHistoryByteAnimation().animateFunction // Re-use history byte animation logic
    });
}

function initDisplayFrequencyAnimationBase() { // Renamed
    setupAnimation({
        containerId: 'display-frequency-hz',
        stepsId: 'display-frequency-steps',
        animateBtnId: 'display-frequency-animate-btn',
        stepsBtnId: 'display-frequency-steps-btn',
        resetBtnId: 'display-frequency-reset-btn',
        initialValue: '0',
        animateFunction: initDisplayFrequencyAnimation().animateFunction // Re-use display frequency animation logic
    });
}

function initMultiplexingPinsAnimationBase() { // Renamed
    setupAnimation({
        containerId: 'multiplexing-pins-count',
        stepsId: 'multiplexing-pins-steps',
        animateBtnId: 'multiplexing-pins-animate-btn',
        stepsBtnId: 'multiplexing-pins-steps-btn',
        resetBtnId: 'multiplexing-pins-reset-btn',
        initialValue: '0',
        animateFunction: initMultiplexingPinsAnimation().animateFunction // Re-use multiplexing pins animation logic
    });
}

function initTwoArraysAnimationBase() { // Renamed
    setupAnimation({
        containerId: 'two-arrays-pins-count',
        stepsId: 'two-arrays-steps',
        animateBtnId: 'two-arrays-animate-btn',
        stepsBtnId: 'two-arrays-steps-btn',
        resetBtnId: 'two-arrays-reset-btn',
        initialValue: '0',
        animateFunction: initTwoArraysAnimation().animateFunction // Re-use two arrays animation logic
    });
}

function initCounterTimerAnimationBase() { // Renamed
    setupAnimation({
        containerId: 'counter-timer-interval-ms',
        stepsId: 'counter-timer-steps',
        animateBtnId: 'counter-timer-animate-btn',
        stepsBtnId: 'counter-timer-steps-btn',
        resetBtnId: 'counter-timer-reset-btn',
        initialValue: '0',
        animateFunction: initCounterTimerAnimation().animateFunction // Re-use counter timer animation logic
    });
}


// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('systick-limitations-options')) { initSysTickLimitationsAnimation(); }
    if (document.getElementById('timer-config-options')) { initTimerConfigAnimation(); }
    if (document.getElementById('interrupt-interval-options')) { initInterruptIntervalAnimation(); }
    if (document.getElementById('keypad-scanning-keypad')) { initKeypadScanningAnimationBase(); } // Use base for now
    if (document.getElementById('history-byte-bits')) { initHistoryByteAnimationBase(); } // Use base for now
    if (document.getElementById('display-frequency-hz')) { initDisplayFrequencyAnimationBase(); } // Use base for now
    if (document.getElementById('multiplexing-pins-count')) { initMultiplexingPinsAnimationBase(); } // Use base for now
    if (document.getElementById('two-arrays-pins-count')) { initTwoArraysAnimationBase(); } // Use base for now
    if (document.getElementById('counter-timer-interval-ms')) { initCounterTimerAnimationBase(); } // Use base for now
    if (document.getElementById('sinewave-samples')) { initSinewaveAnimation(); }
    if (document.getElementById('center-counter')) { initCenterAnimation(); }
    if (document.getElementById('wavetable-step')) { initWavetableAnimation(); }
    if (document.getElementById('dac-signal')) { initBJTAnimation(); }
    if (document.getElementById('pwm-signal')) { initPWMAnimation(); }
});