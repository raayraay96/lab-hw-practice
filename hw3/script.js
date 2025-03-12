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
                if (initialText !== '') bit.innerHTML = initialText;
            });
        } else {
            child.classList.remove('high', 'connection', 'visible');
            child.classList.add('low');
            if (initialText !== '') child.innerHTML = initialText;
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
        reset();
        setTimeout(() => {
            const bit = optionBitsGroup.children[2];
            bit.classList.remove('low');
            bit.classList.add('high', 'connection');
            setTimeout(() => bit.classList.add('visible'), 100);
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
        reset();
        setTimeout(() => {
            const bit0 = optionBitsGroup.children[0];
            bit0.classList.remove('low');
            bit0.classList.add('high', 'connection');
            setTimeout(() => bit0.classList.add('visible'), 100);
            setTimeout(() => {
                const bit2 = optionBitsGroup.children[2];
                bit2.classList.remove('low');
                bit2.classList.add('high', 'connection');
                setTimeout(() => bit2.classList.add('visible'), 100);
            }, 500);
        }, 500);
        setTimeout(() => highlightSteps(steps), 1500);
    }

    function reset() {
        resetBits(optionsBits, '');
        const options = [
            'PRE=100-1,<br>RELOAD=1000-1',
            'PRE=100000-1,<br>RELOAD=1-1',
            'PRE=10000-1,<br>RELOAD=10-1'
        ];
        options.forEach((opt, i) => optionBitsGroup.children[i].innerHTML = opt);
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
        reset();
        setTimeout(() => {
            const bit = optionBitsGroup.children[1];
            bit.classList.remove('low');
            bit.classList.add('high', 'connection');
            setTimeout(() => bit.classList.add('visible'), 100);
        }, 500);
        setTimeout(() => highlightSteps(steps), 1000);
    }

    function reset() {
        resetBits(optionsBits, '');
        const options = ['a) 2.5 ms', 'b) 5 ms', 'c) 10 ms', 'd) 7 ms'];
        options.forEach((opt, i) => optionBitsGroup.children[i].innerHTML = opt);
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
    }

    function animate() {
        reset();
        createKeypad();
        const keypadKeys = [...keypadBits.querySelectorAll('.keypad-key')];

        setTimeout(() => {
            keypadKeys[0].classList.remove('low');
            keypadKeys[0].classList.add('high', 'connection', 'visible'); // Key '1'
            keypadKeys[1].classList.remove('low');
            keypadKeys[1].classList.add('high', 'connection', 'visible'); // Key '2'
            setTimeout(() => {
                keypadKeys[0].classList.remove('high', 'connection', 'visible');
                keypadKeys[0].classList.add('low');
                keypadKeys[1].classList.remove('high', 'connection', 'visible');
                keypadKeys[1].classList.add('low');
                keypadKeys[4].classList.remove('low');
                keypadKeys[4].classList.add('high', 'connection', 'visible'); // Key '4'
            }, 1000);
        }, 500);
        setTimeout(() => highlightSteps(steps), 2500);
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
        reset();
        const sequence = [
            { values: ['0', '0', '0', '0', '0', '0', '0', '0'], delay: 0 },
            { values: ['0', '0', '0', '0', '0', '0', '0', '1'], delay: 500 },
            { values: ['0', '0', '0', '0', '0', '0', '1', '1'], delay: 1000 },
            { values: ['0', '0', '0', '0', '0', '1', '1', '1'], delay: 1500 },
            { values: ['0', '0', '0', '0', '1', '1', '1', '1'], delay: 2000 },
            { values: ['0', '1', 'X', 'X', 'X', '1', '1', '1'], delay: 2500 }
        ];

        sequence.forEach(stage => {
            setTimeout(() => {
                stage.values.forEach((val, i) => {
                    const bit = historyBitGroup.children[i];
                    bit.textContent = val;
                    bit.classList.remove('low');
                    bit.classList.add('high');
                    if (val === 'X') {
                        bit.classList.add('connection', 'visible');
                    }
                });
            }, stage.delay);
        });
        setTimeout(() => highlightSteps(steps), 3000);
    }

    function reset() {
        resetBits(historyBits, '0');
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
        reset();
        const result = '625';
        setTimeout(() => {
            result.split('').forEach((digit, i) => {
                const bit = frequencyBits.children[i];
                bit.textContent = digit;
                bit.classList.remove('low');
                bit.classList.add('high', 'connection');
                setTimeout(() => bit.classList.add('visible'), 100);
            });
        }, 500);
        setTimeout(() => highlightSteps(steps), 1000);
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
        reset();
        const result = '14';
        setTimeout(() => {
            result.split('').forEach((digit, i) => {
                const bit = pinsBits.children[i];
                bit.textContent = digit;
                bit.classList.remove('low');
                bit.classList.add('high', 'connection');
                setTimeout(() => bit.classList.add('visible'), 100);
            });
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
        reset();
        const result = '14';
        setTimeout(() => {
            result.split('').forEach((digit, i) => {
                const bit = pinsBits.children[i];
                bit.textContent = digit;
                bit.classList.remove('low');
                bit.classList.add('high', 'connection');
                setTimeout(() => bit.classList.add('visible'), 100);
            });
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
        reset();
        const result = '5.12';
        setTimeout(() => {
            result.split('').forEach((char, i) => {
                const bit = intervalBits.children[i];
                bit.textContent = char;
                bit.classList.remove('low');
                bit.classList.add('high', 'connection');
                setTimeout(() => bit.classList.add('visible'), 100);
            });
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