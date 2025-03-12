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
            paragraphs.forEach(p => p.classList.remove('step-highlight'));
            p.classList.add('step-highlight');
        }, i * 800);
    });
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

// NEW: Animation setup helper function
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

// Refactored Animation Functions using setupAnimation

function initSysTickLimitationsAnimation() {
    setupAnimation({
        containerId: 'systick-limitations-options',
        stepsId: 'systick-limitations-steps',
        animateBtnId: 'systick-limitations-animate-btn',
        stepsBtnId: 'systick-limitations-steps-btn',
        resetBtnId: 'systick-limitations-reset-btn',
        animateFunction: (container, steps, reset) => {
            reset();
            const optionBitsGroup = container.children[0];
            ['a', 'b', 'c', 'd'].forEach((option, index) => {
                if (optionBitsGroup.children[index]) {
                    optionBitsGroup.children[index].textContent = option;
                }
            });
            setTimeout(() => {
                if (optionBitsGroup.children[2]) {
                    optionBitsGroup.children[2].classList.remove('low');
                    optionBitsGroup.children[2].classList.add('high', 'connection');
                    setTimeout(() => optionBitsGroup.children[2].classList.add('visible'), 100);
                }
            }, 500);
            setTimeout(() => highlightSteps(steps), 1000);
        }
    });
}

function initTimerConfigAnimation() {
    setupAnimation({
        containerId: 'timer-config-options',
        stepsId: 'timer-config-steps',
        animateBtnId: 'timer-config-animate-btn',
        stepsBtnId: 'timer-config-steps-btn',
        resetBtnId: 'timer-config-reset-btn',
        animateFunction: (container, steps, reset) => {
            reset();
            const optionBitsGroup = container.children[0];
            [0, 2].forEach((i, delayIdx) => {
                setTimeout(() => {
                    if (optionBitsGroup.children[i]) {
                        optionBitsGroup.children[i].classList.remove('low');
                        optionBitsGroup.children[i].classList.add('high', 'connection');
                        setTimeout(() => optionBitsGroup.children[i].classList.add('visible'), 100);
                    }
                }, 500 + delayIdx * 500);
            });
            setTimeout(() => highlightSteps(steps), 1500);
        }
    });
}

function initInterruptIntervalAnimation() {
    setupAnimation({
        containerId: 'interrupt-interval-options',
        stepsId: 'interrupt-interval-steps',
        animateBtnId: 'interrupt-interval-animate-btn',
        stepsBtnId: 'interrupt-interval-steps-btn',
        resetBtnId: 'interrupt-interval-reset-btn',
        animateFunction: (container, steps, reset) => {
            reset();
            const optionBitsGroup = container.children[0];
            setTimeout(() => {
                if (optionBitsGroup.children[1]) {
                    optionBitsGroup.children[1].classList.remove('low');
                    optionBitsGroup.children[1].classList.add('high', 'connection');
                    setTimeout(() => optionBitsGroup.children[1].classList.add('visible'), 100);
                }
            }, 500);
            setTimeout(() => highlightSteps(steps), 1000);
        }
    });
}

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

function initHistoryByteAnimation() {
    setupAnimation({
        containerId: 'history-byte-bits',
        stepsId: 'history-byte-steps',
        animateBtnId: 'history-byte-animate-btn',
        stepsBtnId: 'history-byte-steps-btn',
        resetBtnId: 'history-byte-reset-btn',
        initialValue: '0',
        animateFunction: (container, steps, reset) => {
            reset();
            const historyBitGroup = container.children[0];
            const targetValues = ['1','0','1','0','1','0','1','0']; // example pattern
            setTimeout(() => {
                targetValues.forEach((val, i) => {
                    if (historyBitGroup.children[i]) {
                        historyBitGroup.children[i].classList.remove('low');
                        historyBitGroup.children[i].classList.add('high');
                        historyBitGroup.children[i].textContent = val;
                    }
                });
            }, 500);
            setTimeout(() => highlightSteps(steps), 1000);
        }
    });
}

function initDisplayFrequencyAnimation() {
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

function initMultiplexingPinsAnimation() {
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

function initTwoArraysAnimation() {
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

function initCounterTimerAnimation() {
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

function initSinewaveAnimation() {
    setupAnimation({
        containerId: 'sinewave-samples',
        stepsId: 'sinewave-steps',
        animateBtnId: 'sinewave-animate-btn',
        stepsBtnId: 'sinewave-steps-btn',
        resetBtnId: 'sinewave-reset-btn',
        initialValue: '',
        animateFunction: (container, steps, reset) => {
            reset();
            // Example: animate sinewave sample update
            container.innerHTML = '<div>';
            for (let i = 0; i < 10; i++) {
                container.innerHTML += `<span class="bit low">~</span>`;
            }
            container.innerHTML += '</div>';
            setTimeout(() => highlightSteps(steps), 1000);
        }
    });
}

// Add remaining animation initializations
function initCenterAnimation() { /* ... */ }
function initWavetableAnimation() { /* ... */ }
function initBJTAnimation() { /* ... */ }
function initPWMAnimation() { /* ... */ }

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