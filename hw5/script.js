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
            if (i > 0) paragraphs[i - 1].classList.remove('step-highlight');
            p.classList.add('step-highlight');
        }, i * 800);
    });
    setTimeout(() => {
        if (paragraphs.length) paragraphs[paragraphs.length - 1].classList.remove('step-highlight');
    }, paragraphs.length * 800);
}

function resetBits(bitContainer, initialText) {
    [...bitContainer.children].forEach(child => {
        if (child.tagName === 'DIV') {
            [...child.children].forEach(bit => {
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

// ---- Utility Functions for Drawing Waveforms and Counters ----

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


// This function now DYNAMICALLY draws the triangle waveform.
function drawCounterWaveform(waveformCanvas, counterValue, arrValue, countingUp) {
	const ctx = waveformCanvas.getContext('2d');
	clearCanvas(waveformCanvas);
	ctx.strokeStyle = '#00ff88';
	ctx.lineWidth = 2;
	const width = waveformCanvas.width;
	const height = waveformCanvas.height;

	ctx.beginPath();
	ctx.moveTo(0, height); // Start at bottom left

	if (countingUp) {
		// Calculate the x-coordinate for the upward line.
		const x = (counterValue / arrValue) * (width / 2);
		// Draw the line from the bottom left to the current counter position.
		ctx.lineTo(x, height - (counterValue / arrValue) * height);
	} else {
		// If counting down, first draw a line to the top center.
		ctx.lineTo(width / 2, 0);

		// Calculate the x-coordinate for the downward line.
		const x = width / 2 + ((arrValue - counterValue) / arrValue) * (width / 2);
		// Draw the line from the top center to the current counter position.
		ctx.lineTo(x, (arrValue - counterValue) / arrValue * height);
	}

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

// ---- Animation Functions ----

function initTimerConfigAnimation() {
    console.log("initTimerConfigAnimation called");
    const prescalerSlider = document.getElementById('timer-prescaler');
    const arrSlider = document.getElementById('timer-arr');
    const ccrSlider = document.getElementById('timer-ccr');

    setupAnimation({
        containerId: 'timer-config-options',
        stepsId: 'timer-config-steps',
        animateBtnId: 'timer-config-animate-btn',
        stepsBtnId: 'timer-config-steps-btn',
        resetBtnId: 'timer-config-reset-btn',
        animateFunction: (container, steps, reset) => {
            console.log("Timer config animateFunction started");
            reset();
            const counterDisplay = document.getElementById('timer-counter-display');
            const waveformCanvas = document.getElementById('timer-output-waveform');
            let counterValue = 0;
            let animationInterval;

            const updateAnimation = () => {
                console.log("updateAnimation called - prescaler:", prescalerSlider.value, "arr:", arrSlider.value, "ccr:", ccrSlider.value);
                const prescaler = parseInt(prescalerSlider.value, 10);
                const arrValue = parseInt(arrSlider.value, 10);
                const ccrValue = parseInt(ccrSlider.value, 10);
                const timerFrequency = 100000 / (1 + prescaler) / (1 + arrValue);
                const dutyCycle = (ccrValue / (arrValue + 1)) * 100;

                document.getElementById('timer-prescaler-val').textContent = prescaler;
                document.getElementById('timer-arr-val').textContent = arrValue;
                document.getElementById('timer-arr-val-duty').textContent = arrValue;
                document.getElementById('timer-ccr-val').textContent = ccrValue;
                document.getElementById('timer-calculated-freq').textContent = timerFrequency.toFixed(2);
                document.getElementById('timer-calculated-duty').textContent = dutyCycle.toFixed(0);

                updateVisualCounter('timer-counter-display', counterValue);

                const ctx = waveformCanvas.getContext('2d');
                ctx.strokeStyle = '#00ff88';
                ctx.lineWidth = 2;
                const width = waveformCanvas.width;
                const height = waveformCanvas.height / 2;
                const xIncrement = width / (arrValue + 1);
                const currentX = counterValue * xIncrement;

                ctx.beginPath();
                if (counterValue < ccrValue) {
                    ctx.moveTo(currentX, height);
                    ctx.lineTo(currentX + xIncrement, height);
                } else {
                    ctx.moveTo(currentX, 0);
                    ctx.lineTo(currentX + xIncrement, 0);
                }
                ctx.stroke();

                counterValue++;
                if (counterValue > arrValue) {
                    counterValue = 0;
                    clearCanvas(waveformCanvas);
                }
            };

            animationInterval = setInterval(updateAnimation, 20);

            setTimeout(() => {
                console.log("Highlighting steps");
                highlightSteps(steps);
            }, 1000);
            setTimeout(() => {
                console.log("Clearing animation interval");
                clearInterval(animationInterval);
            }, 20000);
        }
    });

    const updateTimerDisplay = () => {
        console.log("updateTimerDisplay called");
        const prescaler = parseInt(prescalerSlider.value, 10);
        const arrValue = parseInt(arrSlider.value, 10);
        const ccrValue = parseInt(ccrSlider.value, 10);
        const timerFrequency = 100000 / (1 + prescaler) / (1 + arrValue);
        const dutyCycle = (ccrValue / (arrValue + 1)) * 100;

        document.getElementById('timer-prescaler-val').textContent = prescaler;
        document.getElementById('timer-arr-val').textContent = arrValue;
        document.getElementById('timer-arr-val-duty').textContent = arrValue;
        document.getElementById('timer-ccr-val').textContent = ccrValue;
        document.getElementById('timer-calculated-freq').textContent = timerFrequency.toFixed(2);
        document.getElementById('timer-calculated-duty').textContent = dutyCycle.toFixed(0);
    };

    prescalerSlider.addEventListener('input', updateTimerDisplay);
    arrSlider.addEventListener('input', updateTimerDisplay);
    ccrSlider.addEventListener('input', updateTimerDisplay);
    console.log("initTimerConfigAnimation setup complete");
}

function initSinewaveAnimation() {
    setupAnimation({
        containerId: 'sinewave-samples',
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
            let phase = 0;
            let animationInterval;

            updateValueDisplay('sinewave-samples-display', samplesPerCycle);
            updateValueDisplay('sinewave-freq-display', frequency);

            function animateSine() {
                clearCanvas(sinewaveCanvas);
                drawSineWave(sinewaveCanvas, 0.8, frequency / 25000, phase);
                phase += 0.1;
                if (phase > 2 * Math.PI) {
                    phase -= 2 * Math.PI;
                }
                const calculatedMaxFrequency = dacRate / samplesPerCycle;
                updateValueDisplay('sinewave-freq-display', calculatedMaxFrequency.toFixed(0));
            }

            animationInterval = setInterval(animateSine, 30);

            setTimeout(() => highlightSteps(steps), 1000);
            setTimeout(() => clearInterval(animationInterval), 10000);
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

            function drawCounterWaveform() {
                const ctx = waveformCanvas.getContext('2d');
                clearCanvas(waveformCanvas);
                ctx.strokeStyle = '#00ff88';
                ctx.lineWidth = 2;
                const width = waveformCanvas.width;
                const height = waveformCanvas.height;

                ctx.beginPath();
                ctx.moveTo(0, height); // Start at bottom left

                if (countingUp) {
                    // Calculate the x-coordinate for the upward line.
                    const x = (counterValue / arrValue) * (width / 2);
                    // Draw the line from the bottom left to the current counter position.
                    ctx.lineTo(x, height - (counterValue / arrValue) * height);
                } else {
                    // If counting down, first draw a line to the top center.
                    ctx.lineTo(width / 2, 0);

                    // Calculate the x-coordinate for the downward line.
                    const x = width / 2 + ((arrValue - counterValue) / arrValue) * (width / 2);
                    // Draw the line from the top center to the current counter position.
                    ctx.lineTo(x, (arrValue - counterValue) / arrValue * height);
                }

                ctx.stroke();
            }

            animationInterval = setInterval(() => {
                updateVisualCounter('center-counter-display', counterValue);
                drawCounterWaveform(waveformCanvas, counterValue, arrValue, countingUp);

                if (countingUp) {
                    counterValue++;
                    if (counterValue > arrValue) {
                        countingUp = false;
                        counterValue = arrValue;
                    }
                } else {
                    counterValue--;
                    if (counterValue < 0) {
                        countingUp = true;
                        counterValue = 0;
                    }
                }
            }, 20);

            setTimeout(() => highlightSteps(steps), 1000);
            setTimeout(() => clearInterval(animationInterval), 10000);
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
            const toggleButton = document.getElementById('toggle-dac-method');
            let time = 0;
            let isFastDAC = false;
            let animationInterval;

            function animateDACSignal() {
                clearCanvas(dacWaveformCanvas);
                const frequency = isFastDAC ? 5 : 0.5;
                drawSineWave(dacWaveformCanvas, 0.8, frequency, time);

                const ctx = dacWaveformCanvas.getContext('2d');
                const currentLevel = isFastDAC ? 50 : 20;
                ctx.fillStyle = isFastDAC ? '#ff6347' : '#00ff88';
                ctx.fillRect(0, dacWaveformCanvas.height - currentLevel, 20, currentLevel);

                time += 0.02;
            }

            function startAnimation() {
                if (animationInterval) clearInterval(animationInterval);
                animationInterval = setInterval(animateDACSignal, 20);
            }

            startAnimation();
            toggleButton.onclick = () => {
                isFastDAC = !isFastDAC;
                toggleButton.textContent = isFastDAC ? 'Toggle Driving Method (Slow)' : 'Toggle Driving Method (Fast)';
                startAnimation();
            };

            setTimeout(() => highlightSteps(steps), 1000);
            setTimeout(() => clearInterval(animationInterval), 10000);
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
            updatePWMDisplay();
            setTimeout(() => highlightSteps(steps), 1000);
        }
    });

    const updatePWMDisplay = () => {
        const arrValue = parseInt(arrSlider.value, 10);
        const ccrValue = parseInt(ccrSlider.value, 10);
        const dutyCyclePercent = (ccrValue / (arrValue + 1)) * 100;

        document.getElementById('pwm-arr-val').textContent = arrValue;
        document.getElementById('pwm-ccr-val-duty').textContent = ccrValue;
        document.getElementById('pwm-calculated-period').textContent = arrValue + 1;
        document.getElementById('pwm-calculated-period-duty').textContent = arrValue + 1;
        document.getElementById('pwm-calculated-duty-percent').textContent = dutyCyclePercent.toFixed(0);

        const dutyCycleDisplay = document.getElementById('pwm-duty-cycle-display');
        dutyCycleDisplay.textContent = dutyCyclePercent.toFixed(0) + '%';

        const pwmWaveformCanvas = document.getElementById('pwm-signal-waveform');
        clearCanvas(pwmWaveformCanvas);
        drawSquareWave(pwmWaveformCanvas, dutyCyclePercent);
    };

    arrSlider.addEventListener('input', updatePWMDisplay);
    ccrSlider.addEventListener('input', updatePWMDisplay);
}

function initSysTickLimitationsAnimation() { initGenericBitsAnimation('systick-limitations'); }
function initInterruptIntervalAnimation() { initGenericBitsAnimation('interrupt-interval'); }
function initKeypadScanningAnimation() {
    setupAnimation({
        containerId: 'keypad-scanning-keypad',
        stepsId: 'keypad-scanning-steps',
        animateBtnId: 'keypad-scanning-animate-btn',
        stepsBtnId: 'keypad-scanning-steps-btn',
        resetBtnId: 'keypad-scanning-reset-btn',
        animateFunction: (container, steps, reset) => {
            reset();
            if (!container.querySelector('.keypad-key')) {
                const keys = ['1','2','3','A','4','5','6','B','7','8','9','C','*','0','#','D'];
                let keypadHTML = '<div>';
                keys.forEach((key, i) => {
                    keypadHTML += `<span class="bit low keypad-key" data-key="${key}">${key}</span>`;
                    if ((i+1) % 4 === 0 && i < keys.length - 1) keypadHTML += '</div><div>';
                });
                keypadHTML += '</div>';
                container.innerHTML = keypadHTML;
            }
            const keypadKeys = [...container.querySelectorAll('.keypad-key')];
            setTimeout(() => {
                if (keypadKeys[0]) {
                    keypadKeys[0].classList.remove('low');
                    keypadKeys[0].classList.add('high', 'connection');
                    setTimeout(() => keypadKeys[0].classList.add('visible'), 100);
                }
            }, 500);
            setTimeout(() => highlightSteps(steps), 1000);
        }
    });
}
function initHistoryByteAnimation() { initHistoryByteAnimationBase(); }
function initDisplayFrequencyAnimation() { initDisplayFrequencyAnimationBase(); }
function initMultiplexingPinsAnimation() { initMultiplexingPinsAnimationBase(); }
function initTwoArraysAnimation() { initTwoArraysAnimationBase(); }
function initCounterTimerAnimation() { initCounterTimerAnimationBase(); }

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

function initHistoryByteAnimationBase() {
    setupAnimation({
        containerId: 'history-byte-bits',
        stepsId: 'history-byte-steps',
        animateBtnId: 'history-byte-animate-btn',
        stepsBtnId: 'history-byte-steps-btn',
        resetBtnId: 'history-byte-reset-btn',
        initialValue: '0',
        animateFunction: (container, steps, reset) => {
            reset();
            const historyBitGroup = container.children[0].children;
            const targetValues = ['1','0','1','0','1','0','1','0'];
            setTimeout(() => {
                targetValues.forEach((val, i) => {
                    if (historyBitGroup[i]) {
                        historyBitGroup[i].classList.remove('low');
                        historyBitGroup[i].classList.add('high');
                        historyBitGroup[i].textContent = val;
                    }
                });
            }, 500);
            setTimeout(() => highlightSteps(steps), 1000);
        }
    });
}

function initDisplayFrequencyAnimationBase() {
    setupAnimation({
        containerId: 'display-frequency-hz',
        stepsId: 'display-frequency-steps',
        animateBtnId: 'display-frequency-animate-btn',
        stepsBtnId: 'display-frequency-steps-btn',
        resetBtnId: 'display-frequency-reset-btn',
        initialValue: '0',
        animateFunction: (container, steps, reset) => {
            reset();
            const frequencyBits = container.querySelector('div');
            const frequencyBitGroup = frequencyBits.children;
            const resultStr = "625";
            setTimeout(() => {
                Array.from(resultStr).forEach((char, i) => {
                    if (frequencyBitGroup[i]) {
                        frequencyBitGroup[i].classList.remove('low');
                        frequencyBitGroup[i].classList.add('high', 'connection');
                        frequencyBitGroup[i].textContent = char;
                        setTimeout(() => frequencyBitGroup[i].classList.add('visible'), 100);
                    }
                });
            }, 500);
            setTimeout(() => highlightSteps(steps), 1500);
        }
    });
}

function initMultiplexingPinsAnimationBase() {
    setupAnimation({
        containerId: 'multiplexing-pins-count',
        stepsId: 'multiplexing-pins-steps',
        animateBtnId: 'multiplexing-pins-animate-btn',
        stepsBtnId: 'multiplexing-pins-steps-btn',
        resetBtnId: 'multiplexing-pins-reset-btn',
        initialValue: '0',
        animateFunction: (container, steps, reset) => {
            reset();
            const pinsBits = container.querySelector('div');
            const pinsBitGroup = pinsBits.children;
            const resultStr = "14";
            setTimeout(() => {
                Array.from(resultStr).forEach((char, i) => {
                    if (pinsBitGroup[i]) {
                        pinsBitGroup[i].classList.remove('low');
                        pinsBitGroup[i].classList.add('high', 'connection');
                        pinsBitGroup[i].textContent = char;
                        setTimeout(() => pinsBitGroup[i].classList.add('visible'), 100);
                    }
                });
            }, 500);
            setTimeout(() => highlightSteps(steps), 1000);
        }
    });
}

function initTwoArraysAnimationBase() {
    setupAnimation({
        containerId: 'two-arrays-pins-count',
        stepsId: 'two-arrays-steps',
        animateBtnId: 'two-arrays-animate-btn',
        stepsBtnId: 'two-arrays-steps-btn',
        resetBtnId: 'two-arrays-reset-btn',
        initialValue: '0',
        animateFunction: (container, steps, reset) => {
            reset();
            const pinsBits = container.querySelector('div');
            const pinsBitGroup = pinsBits.children;
            const resultStr = "14";
            setTimeout(() => {
                Array.from(resultStr).forEach((char, i) => {
                    if (pinsBitGroup[i]) {
                        pinsBitGroup[i].classList.remove('low');
                        pinsBitGroup[i].classList.add('high', 'connection');
                        pinsBitGroup[i].textContent = char;
                        setTimeout(() => pinsBitGroup[i].classList.add('visible'), 100);
                    }
                });
            }, 500);
            setTimeout(() => highlightSteps(steps), 1000);
        }
    });
}

function initCounterTimerAnimationBase() {
    setupAnimation({
        containerId: 'counter-timer-interval-ms',
        stepsId: 'counter-timer-steps',
        animateBtnId: 'counter-timer-animate-btn',
        stepsBtnId: 'counter-timer-steps-btn',
        resetBtnId: 'counter-timer-reset-btn',
        initialValue: '0',
        animateFunction: (container, steps, reset) => {
            reset();
            const intervalBits = container.querySelector('div');
            const intervalBitGroup = intervalBits.children;
            const resultStr = "5.12";
            setTimeout(() => {
                Array.from(resultStr).forEach((char, i) => {
                    if (intervalBitGroup[i]) {
                        intervalBitGroup[i].classList.remove('low');
                        intervalBitGroup[i].classList.add('high', 'connection');
                        intervalBitGroup[i].textContent = char;
                        setTimeout(() => intervalBitGroup[i].classList.add('visible'), 100);
                    }
                });
            }, 500);
            setTimeout(() => highlightSteps(steps), 1000);
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
            const stepValueHex = '0x4f057';
            const wrapAroundIterations = 203;

            updateValueDisplay('wavetable-step-display', stepValueHex);
            updateValueDisplay('wavetable-offset-display', offsetIterations);

            let animationInterval = setInterval(() => {
                offsetIterations++;
                updateValueDisplay('wavetable-offset-display', offsetIterations);
                if (offsetIterations >= wrapAroundIterations) {
                    clearInterval(animationInterval);
                    updateValueDisplay('wavetable-offset-display', 'Wrapped Around!');
                }
            }, 50);

            setTimeout(() => highlightSteps(steps), 1000);
        }
    });
}
// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('systick-limitations-options')) { initSysTickLimitationsAnimation(); }
    if (document.getElementById('timer-config-options')) { initTimerConfigAnimation(); }
    if (document.getElementById('interrupt-interval-options')) { initInterruptIntervalAnimation(); }
    if (document.getElementById('keypad-scanning-keypad')) { initKeypadScanningAnimation(); }
    if (document.getElementById('history-byte-bits')) { initHistoryByteAnimation(); }
    if (document.getElementById('display-frequency-hz')) { initDisplayFrequencyAnimation(); }
    if (document.getElementById('multiplexing-pins-count')) { initMultiplexingPinsAnimation(); }
    if (document.getElementById('two-arrays-pins-count')) { initTwoArraysAnimation(); }
    if (document.getElementById('counter-timer-interval-ms')) { initCounterTimerAnimation(); }
    if (document.getElementById('sinewave-samples')) { initSinewaveAnimation(); }
    if (document.getElementById('center-counter')) { initCenterAnimation(); }
    if (document.getElementById('wavetable-step')) { initWavetableAnimation(); }
    if (document.getElementById('dac-signal')) { initBJTAnimation(); }
    if (document.getElementById('pwm-signal')) { initPWMAnimation(); }
});

// Utility Functions
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function drawWaveform(canvasId, period, dutyCycle, color = '#007BFF') {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    for (let x = 0; x <= width; x++) {
        const t = (x / width) * period;
        const y = t < dutyCycle ? height / 4 : (3 * height) / 4;
        ctx.lineTo(x, y);
    }

    ctx.stroke();
}

// Problem 1: Timer Configurations
const timerCanvas = document.getElementById('timer-output-waveform');
const timerPrescalerInput = document.getElementById('timer-prescaler');
const timerArrInput = document.getElementById('timer-arr');
const timerCcrInput = document.getElementById('timer-ccr');
const timerPrescalerVal = document.getElementById('timer-prescaler-val');
const timerArrVal = document.getElementById('timer-arr-val');
const timerCalculatedFreq = document.getElementById('timer-calculated-freq');
const timerCcrVal = document.getElementById('timer-ccr-val');
const timerCalculatedDuty = document.getElementById('timer-calculated-duty');

function updateTimerCalculations() {
    const prescaler = parseInt(timerPrescalerInput.value, 10);
    const arr = parseInt(timerArrInput.value, 10);
    const ccr = parseInt(timerCcrInput.value, 10);

    timerPrescalerVal.textContent = prescaler;
    timerArrVal.textContent = arr;
    timerCalculatedFreq.textContent = (100000 / (prescaler + 1) / (arr + 1)).toFixed(2);
    timerCcrVal.textContent = ccr;
    timerCalculatedDuty.textContent = ((ccr / (arr + 1)) * 100).toFixed(2);

    drawWaveform('timer-output-waveform', arr + 1, ccr);
}

document.getElementById('timer-config-animate-btn').addEventListener('click', () => {
    let ccr = parseInt(timerCcrInput.value, 10);
    const arr = parseInt(timerArrInput.value, 10);

    const interval = setInterval(() => {
        if (ccr >= arr) {
            clearInterval(interval);
        } else {
            ccr += 1;
            timerCcrInput.value = ccr;
            updateTimerCalculations();
        }
    }, 100);
});

timerPrescalerInput.addEventListener('input', updateTimerCalculations);
timerArrInput.addEventListener('input', updateTimerCalculations);
timerCcrInput.addEventListener('input', updateTimerCalculations);

// Initialize timer calculations on load
updateTimerCalculations();

// Additional Problems Logic Can Be Added Here