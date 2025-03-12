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

// Problem 1: SysTick Limitations Animation
function initSysTickLimitationsAnimation() {
    const optionsBits = document.getElementById('systick-limitations-options');
    const steps = document.getElementById('systick-limitations-steps');
    if (!optionsBits || !steps) {
        console.warn("SysTick Limitations elements not found.");
        return;
    }
    const animateBtn = document.getElementById('systick-limitations-animate-btn');
    const stepsBtn = document.getElementById('systick-limitations-steps-btn');
    const resetBtn = document.getElementById('systick-limitations-reset-btn');
    const optionBitsGroup = optionsBits.children[0];

    // Redesigned animation: Focus on how the SysTick signal differs during real operation.
    // /* Redesigned animation content for SysTick Limitations.
    //    Replace generic transitions with detailed, concept-specific steps. */

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

    // /* Redesigned animation content for Timer Configuration.
    //    Emphasize how PRE and RELOAD values affect timer behavior. */

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

    // /* Redesigned animation content for Interrupt Interval.
    //    Focus on the timing intervals and their significance for system response. */

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

    // /* Redesigned animation content for Keypad Scanning.
    //    Demonstrate matrix scanning and ghosting issues clearly. */

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

    // /* Redesigned animation content for History Byte.
    //    Clearly illustrate the sequential changes and stabilization of the byte. */

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

    // /* Redesigned animation content for Display Frequency.
    //    Show frequency measurement on a labeled scale. */

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

    // /* Redesigned animation content for Multiplexing Pins.
    //    Show how multiplexing reduces the number of required pins. */

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

    // /* Redesigned animation content for Two Arrays.
    //    Show how two arrays can be used to store and manipulate data. */

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

    // /* Redesigned animation content for Counter Timer Interval.
    //    Show how the counter timer interval is calculated and used. */

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
    if (document.getElementById('systick-limitations-options') &&
        document.getElementById('systick-limitations-steps')) {
        initSysTickLimitationsAnimation();
    }
    if (document.getElementById('timer-config-options')) {
        initTimerConfigAnimation();
    }
    if (document.getElementById('interrupt-interval-options')) {
        initInterruptIntervalAnimation();
    }
    if (document.getElementById('keypad-scanning-keypad')) {
        initKeypadScanningAnimation();
    }
    if (document.getElementById('history-byte-bits')) {
        initHistoryByteAnimation();
    }
    if (document.getElementById('display-frequency-hz')) {
        initDisplayFrequencyAnimation();
    }
    if (document.getElementById('multiplexing-pins-count')) {
        initMultiplexingPinsAnimation();
    }
    if (document.getElementById('two-arrays-pins-count')) {
        initTwoArraysAnimation();
    }
    if (document.getElementById('counter-timer-interval-ms')) {
        initCounterTimerAnimation();
    }
});