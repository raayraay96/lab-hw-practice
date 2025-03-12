// Utility Functions
function toggleSteps(steps, btn) {
    steps.classList.toggle('visible');
    btn.textContent = steps.classList.contains('visible') ? 'Hide Steps' : 'Show Steps';
}

function highlightSteps(steps) {
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

// Problem 1: SysTick Limitations Animation
function initSysTickLimitationsAnimation() {
    const optionsBits = document.getElementById('systick-limitations-options');
    const steps = document.getElementById('systick-limitations-steps');
    const animateBtn = document.getElementById('systick-limitations-animate-btn');
    const stepsBtn = document.getElementById('systick-limitations-steps-btn');
    const resetBtn = document.getElementById('systick-limitations-reset-btn');
    const optionBitsGroup = optionsBits.children[0];

    function animate() {
        resetBits(optionsBits, '');
        ['a', 'b', 'c', 'd'].forEach((option, index) => {
            optionBitsGroup.children[index].textContent = option;
        });

        setTimeout(() => {
            optionBitsGroup.children[2].classList.remove('low');
            optionBitsGroup.children[2].classList.add('high', 'connection');
            setTimeout(() => optionBitsGroup.children[2].classList.add('visible'), 100);
        }, 500);
        setTimeout(() => highlightSteps(steps), 1000);
    }

    function reset() {
        resetBits(optionsBits, '');
        ['a', 'b', 'c', 'd'].forEach((option, index) => {
            optionBitsGroup.children[index].textContent = option;
        });
        steps.classList.remove('visible');
        stepsBtn.textContent = 'Show Steps';
    }

    animateBtn.addEventListener('click', animate);
    stepsBtn.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn.addEventListener('click', reset);
    reset();
}

// Problem 2: Timer Configuration Animation
function initTimerConfigAnimation() {
    const optionsBits = document.getElementById('timer-config-options');
    const steps = document.getElementById('timer-config-steps');
    const animateBtn = document.getElementById('timer-config-animate-btn');
    const stepsBtn = document.getElementById('timer-config-steps-btn');
    const resetBtn = document.getElementById('timer-config-reset-btn');
    const optionBitsGroup = optionsBits.children[0];

    function animate() {
        resetBits(optionsBits, '');

        setTimeout(() => {
            optionBitsGroup.children[0].classList.remove('low');
            optionBitsGroup.children[0].classList.add('high', 'connection');
            setTimeout(() => optionBitsGroup.children[0].classList.add('visible'), 100);
        }, 500);
        setTimeout(() => {
            optionBitsGroup.children[2].classList.remove('low');
            optionBitsGroup.children[2].classList.add('high', 'connection');
            setTimeout(() => optionBitsGroup.children[2].classList.add('visible'), 100);
        }, 1000);
        setTimeout(() => highlightSteps(steps), 1500);
    }

    function reset() {
        resetBits(optionsBits, '');
        steps.classList.remove('visible');
        stepsBtn.textContent = 'Show Steps';
    }

    animateBtn.addEventListener('click', animate);
    stepsBtn.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn.addEventListener('click', reset);
    reset();
}

// Problem 3: Interrupt Interval Animation
function initInterruptIntervalAnimation() {
    const optionsBits = document.getElementById('interrupt-interval-options');
    const steps = document.getElementById('interrupt-interval-steps');
    const animateBtn = document.getElementById('interrupt-interval-animate-btn');
    const stepsBtn = document.getElementById('interrupt-interval-steps-btn');
    const resetBtn = document.getElementById('interrupt-interval-reset-btn');
    const optionBitsGroup = optionsBits.children[0];

    function animate() {
        resetBits(optionsBits, '');

        setTimeout(() => {
            optionBitsGroup.children[1].classList.remove('low');
            optionBitsGroup.children[1].classList.add('high', 'connection');
            setTimeout(() => optionBitsGroup.children[1].classList.add('visible'), 100);
        }, 500);
        setTimeout(() => highlightSteps(steps), 1000);
    }

    function reset() {
        resetBits(optionsBits, '');
        steps.classList.remove('visible');
        stepsBtn.textContent = 'Show Steps';
    }

    animateBtn.addEventListener('click', animate);
    stepsBtn.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn.addEventListener('click', reset);
    reset();
}

// Problem 4: Keypad Scanning Animation
function initKeypadScanningAnimation() {
    const keypadBits = document.getElementById('keypad-scanning-keypad');
    const steps = document.getElementById('keypad-scanning-steps');
    const animateBtn = document.getElementById('keypad-scanning-animate-btn');
    const stepsBtn = document.getElementById('keypad-scanning-steps-btn');
    const resetBtn = document.getElementById('keypad-scanning-reset-btn');

    function createKeypad() {
        let keypadHTML = '<div class="keypad-grid">';
        const keys = ['1', '2', '3', 'A', '4', '5', '6', 'B', '7', '8', '9', 'C', '*', '0', '#', 'D'];
        keys.forEach(key => {
            keypadHTML += `<span class="bit low keypad-key" data-key="${key}">${key}</span>`;
        });
        keypadHTML += '</div>';
        keypadBits.innerHTML = keypadHTML;

        // Add CSS for keypad grid
        const style = document.createElement('style');
        style.textContent = `
            .keypad-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 10px;
                padding: 10px;
                background: #3a3a3a;
                border-radius: 10px;
            }
            .keypad-key {
                position: relative !important;
                left: auto !important;
                top: auto !important;
                width: 40px;
                height: 40px;
                line-height: 40px;
            }
        `;
        document.head.appendChild(style);
    }

    function animate() {
        reset();
        createKeypad();
        const keypadKeys = [...keypadBits.querySelectorAll('.keypad-key')];

        // Row 1 scanning animation
        setTimeout(() => {
            for (let i = 0; i < 4; i++) {
                keypadKeys[i].classList.remove('low');
                keypadKeys[i].classList.add('high', 'connection');
                setTimeout(() => keypadKeys[i].classList.add('visible'), 100);
            }
        }, 500);

        // Row 2 scanning animation
        setTimeout(() => {
            // Reset Row 1
            for (let i = 0; i < 4; i++) {
                keypadKeys[i].classList.remove('high', 'connection', 'visible');
                keypadKeys[i].classList.add('low');
            }
            // Highlight Row 2
            for (let i = 4; i < 8; i++) {
                keypadKeys[i].classList.remove('low');
                keypadKeys[i].classList.add('high', 'connection');
                setTimeout(() => keypadKeys[i].classList.add('visible'), 100);
            }
        }, 1500);

        // Row 3 scanning animation
        setTimeout(() => {
            // Reset Row 2
            for (let i = 4; i < 8; i++) {
                keypadKeys[i].classList.remove('high', 'connection', 'visible');
                keypadKeys[i].classList.add('low');
            }
            // Highlight Row 3
            for (let i = 8; i < 12; i++) {
                keypadKeys[i].classList.remove('low');
                keypadKeys[i].classList.add('high', 'connection');
                setTimeout(() => keypadKeys[i].classList.add('visible'), 100);
            }
        }, 2500);

        // Row 4 scanning animation
        setTimeout(() => {
            // Reset Row 3
            for (let i = 8; i < 12; i++) {
                keypadKeys[i].classList.remove('high', 'connection', 'visible');
                keypadKeys[i].classList.add('low');
            }
            // Highlight Row 4
            for (let i = 12; i < 16; i++) {
                keypadKeys[i].classList.remove('low');
                keypadKeys[i].classList.add('high', 'connection');
                setTimeout(() => keypadKeys[i].classList.add('visible'), 100);
            }
        }, 3500);

        setTimeout(() => highlightSteps(steps), 4000);
    }

    function reset() {
        keypadBits.innerHTML = '';
        steps.classList.remove('visible');
        stepsBtn.textContent = 'Show Steps';
    }

    animateBtn.addEventListener('click', animate);
    stepsBtn.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn.addEventListener('click', reset);
    reset();
}

// Problem 5: History Byte Animation
function initHistoryByteAnimation() {
    const historyBits = document.getElementById('history-byte-bits');
    const steps = document.getElementById('history-byte-steps');
    const animateBtn = document.getElementById('history-byte-animate-btn');
    const stepsBtn = document.getElementById('history-byte-steps-btn');
    const resetBtn = document.getElementById('history-byte-reset-btn');
    const historyBitGroup = historyBits.children[0];

    function animate() {
        resetBits(historyBits, '0');
        const sequence = [
            { values: ['0', '0', '0', '0', '0', '0', '0', '0'], delay: 0, label: 'Initial state' },
            { values: ['0', '0', '0', '0', '0', '0', '0', '1'], delay: 500, label: 'First bounce' },
            { values: ['0', '0', '0', '0', '0', '0', '1', '1'], delay: 1000, label: 'Second scan' },
            { values: ['0', '0', '0', '0', '0', '1', '1', '1'], delay: 1500, label: 'Third scan' },
            { values: ['0', '0', '0', '0', '1', '1', '1', '1'], delay: 2000, label: 'Fourth scan (stable)' },
            { values: ['0', '1', 'X', 'X', 'X', '1', '1', '1'], delay: 2500, label: 'Final state with X' }
        ];

        // Create a label element to show the current stage
        const stageLabel = document.createElement('div');
        stageLabel.style.cssText = 'position: absolute; top: -30px; left: 110px; color: #00ff88; font-weight: bold;';
        historyBits.appendChild(stageLabel);

        sequence.forEach(stage => {
            setTimeout(() => {
                stageLabel.textContent = stage.label;
                stage.values.forEach((val, i) => {
                    historyBitGroup.children[i].textContent = val;
                    historyBitGroup.children[i].classList.remove('low');
                    historyBitGroup.children[i].classList.add('high');
                    if (val === 'X') {
                        historyBitGroup.children[i].classList.add('connection', 'visible');
                    }
                });
            }, stage.delay);
        });

        setTimeout(() => highlightSteps(steps), 3000);
    }

    function reset() {
        resetBits(historyBits, '0');
        // Remove any stage labels that might have been added
        const stageLabel = historyBits.querySelector('div:not(.signal-bits)');
        if (stageLabel) stageLabel.remove();
        steps.classList.remove('visible');
        stepsBtn.textContent = 'Show Steps';
    }

    animateBtn.addEventListener('click', animate);
    stepsBtn.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn.addEventListener('click', reset);
    reset();
}

// Problem 6: Display Frequency Animation
function initDisplayFrequencyAnimation() {
    const frequencyBits = document.getElementById('display-frequency-hz').querySelector('div');
    const steps = document.getElementById('display-frequency-steps');
    const animateBtn = document.getElementById('display-frequency-animate-btn');
    const stepsBtn = document.getElementById('display-frequency-steps-btn');
    const resetBtn = document.getElementById('display-frequency-reset-btn');

    function animate() {
        resetBits({ children: [frequencyBits] }, '0');
        const frequencyBitGroup = frequencyBits.children;
        const result = 625;
        const resultStr = result.toString();

        setTimeout(() => {
            for (let i = 0; i < resultStr.length; i++) {
                if (frequencyBitGroup[i]) {
                    frequencyBitGroup[i].classList.remove('low');
                    frequencyBitGroup[i].classList.add('high', 'connection');
                    frequencyBitGroup[i].textContent = resultStr[i];
                    setTimeout(() => frequencyBitGroup[i].classList.add('visible'), 100);
                }
            }
        }, 500);
        setTimeout(() => highlightSteps(steps), 1500);
    }

    function reset() {
        resetBits({ children: [frequencyBits] }, '0');
        steps.classList.remove('visible');
        stepsBtn.textContent = 'Show Steps';
    }

    animateBtn.addEventListener('click', animate);
    stepsBtn.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn.addEventListener('click', reset);
    reset();
}

// Problem 7: Multiplexing Pins Animation
function initMultiplexingPinsAnimation() {
    const pinsBits = document.getElementById('multiplexing-pins-count').querySelector('div');
    const steps = document.getElementById('multiplexing-pins-steps');
    const animateBtn = document.getElementById('multiplexing-pins-animate-btn');
    const stepsBtn = document.getElementById('multiplexing-pins-steps-btn');
    const resetBtn = document.getElementById('multiplexing-pins-reset-btn');

    function animate() {
        resetBits({ children: [pinsBits] }, '0');
        const pinsBitGroup = pinsBits.children;
        const result = 14;
        const resultStr = result.toString();
        setTimeout(() => {
            for (let i = 0; i < resultStr.length; i++) {
                if (pinsBitGroup[i]) {
                    pinsBitGroup[i].classList.remove('low');
                    pinsBitGroup[i].classList.add('high', 'connection');
                    pinsBitGroup[i].textContent = resultStr[i];
                    setTimeout(() => pinsBitGroup[i].classList.add('visible'), 100);
                }
            }
        }, 500);
        setTimeout(() => highlightSteps(steps), 1000);
    }

    function reset() {
        resetBits({ children: [pinsBits] }, '0');
        steps.classList.remove('visible');
        stepsBtn.textContent = 'Show Steps';
    }

    animateBtn.addEventListener('click', animate);
    stepsBtn.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn.addEventListener('click', reset);
    reset();
}

// Problem 8: Two Arrays Animation
function initTwoArraysAnimation() {
    const pinsBits = document.getElementById('two-arrays-pins-count').querySelector('div');
    const steps = document.getElementById('two-arrays-steps');
    const animateBtn = document.getElementById('two-arrays-animate-btn');
    const stepsBtn = document.getElementById('two-arrays-steps-btn');
    const resetBtn = document.getElementById('two-arrays-reset-btn');

    function animate() {
        resetBits({ children: [pinsBits] }, '0');
        const pinsBitGroup = pinsBits.children;
        const result = 14;
        const resultStr = result.toString();
        setTimeout(() => {
            for (let i = 0; i < resultStr.length; i++) {
                if (pinsBitGroup[i]) {
                    pinsBitGroup[i].classList.remove('low');
                    pinsBitGroup[i].classList.add('high', 'connection');
                    pinsBitGroup[i].textContent = resultStr[i];
                    setTimeout(() => pinsBitGroup[i].classList.add('visible'), 100);
                }
            }
        }, 500);
        setTimeout(() => highlightSteps(steps), 1000);
    }

    function reset() {
        resetBits({ children: [pinsBits] }, '0');
        steps.classList.remove('visible');
        stepsBtn.textContent = 'Show Steps';
    }

    animateBtn.addEventListener('click', animate);
    stepsBtn.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn.addEventListener('click', reset);
    reset();
}

// Problem 9: Counter Timer Interval Animation
function initCounterTimerAnimation() {
    const intervalBits = document.getElementById('counter-timer-interval-ms').querySelector('div');
    const steps = document.getElementById('counter-timer-steps');
    const animateBtn = document.getElementById('counter-timer-animate-btn');
    const stepsBtn = document.getElementById('counter-timer-steps-btn');
    const resetBtn = document.getElementById('counter-timer-reset-btn');

    function animate() {
        resetBits({ children: [intervalBits] }, '0');
        const intervalBitGroup = intervalBits.children;
        const result = 5.12;
        const resultStr = result.toString();

        setTimeout(() => {
            for (let i = 0; i < resultStr.length; i++) {
                if (intervalBitGroup[i]) {
                    intervalBitGroup[i].classList.remove('low');
                    intervalBitGroup[i].classList.add('high', 'connection');
                    intervalBitGroup[i].textContent = resultStr[i];
                    setTimeout(() => intervalBitGroup[i].classList.add('visible'), 100);
                }
            }
        }, 500);
        setTimeout(() => highlightSteps(steps), 1000);
    }

    function reset() {
        resetBits({ children: [intervalBits] }, '0');
        steps.classList.remove('visible');
        stepsBtn.textContent = 'Show Steps';
    }

    animateBtn.addEventListener('click', animate);
    stepsBtn.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn.addEventListener('click', reset);
    reset();
}

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
    initSysTickLimitationsAnimation();
    initTimerConfigAnimation();
    initInterruptIntervalAnimation();
    initKeypadScanningAnimation();
    initHistoryByteAnimation();
    initDisplayFrequencyAnimation();
    initMultiplexingPinsAnimation();
    initTwoArraysAnimation();
    initCounterTimerAnimation();
});