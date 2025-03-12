// NOTE: Future animations for HW3 Problems 6–9 should be redesigned
// to clearly illustrate each key concept rather than using generic transitions.

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
        }
    });
}

window.onscroll = function() {
    const btn = document.getElementById('back-to-top');
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        btn.style.display = "block";
    } else {
        btn.style.display = "none";
    }
};

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Helper: Show an explanatory overlay message during animations
function showExplanation(text) {
    let explanationOverlay = document.getElementById('animation-explanation');
    if (!explanationOverlay) {
        explanationOverlay = document.createElement('div');
        explanationOverlay.id = 'animation-explanation';
        explanationOverlay.style.position = 'fixed';
        explanationOverlay.style.bottom = '20px';
        explanationOverlay.style.left = '50%';
        explanationOverlay.style.transform = 'translateX(-50%)';
        explanationOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        explanationOverlay.style.color = '#fff';
        explanationOverlay.style.padding = '10px 20px';
        explanationOverlay.style.borderRadius = '5px';
        explanationOverlay.style.fontSize = '16px';
        explanationOverlay.style.zIndex = '1000';
        explanationOverlay.style.opacity = '1';
        document.body.appendChild(explanationOverlay);
    }
    explanationOverlay.textContent = text;
    explanationOverlay.style.opacity = '1';
    setTimeout(() => {
        explanationOverlay.style.opacity = '0';
    }, 2500);
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
        showExplanation("Starting SysTick: All options at baseline.");
        setTimeout(() => {
            const bit = optionBitsGroup.children[2];
            bit.classList.remove('low');
            bit.classList.add('high', 'connection');
            showExplanation("Activating SysTick: Signal is raised.");
            setTimeout(() => bit.classList.add('visible'), 100);
        }, 800);
        setTimeout(() => {
            showExplanation("Reviewing SysTick limitations step-by-step.");
            highlightSteps(steps);
        }, 1500);
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
        showExplanation("Starting Timer Configuration: Initiating timer settings.");
        setTimeout(() => {
            const bit0 = optionBitsGroup.children[0];
            bit0.classList.remove('low');
            bit0.classList.add('high', 'connection');
            showExplanation("Setting PRE value: Timer starts counting.");
            setTimeout(() => bit0.classList.add('visible'), 100);
            setTimeout(() => {
                const bit2 = optionBitsGroup.children[2];
                bit2.classList.remove('low');
                bit2.classList.add('high', 'connection');
                showExplanation("Setting RELOAD value: Defines timer reset.");
                setTimeout(() => bit2.classList.add('visible'), 100);
            }, 800);
        }, 800);
        setTimeout(() => {
            showExplanation("Timer configuration complete. Review the steps.");
            highlightSteps(steps);
        }, 1800);
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
        showExplanation("Starting Interrupt Interval: Monitoring signal timing.");
        setTimeout(() => {
            const bit = optionBitsGroup.children[1];
            bit.classList.remove('low');
            bit.classList.add('high', 'connection');
            showExplanation("Interrupt detected: Interval recognized.");
            setTimeout(() => bit.classList.add('visible'), 100);
        }, 800);
        setTimeout(() => {
            showExplanation("Reviewing interrupt timing details.");
            highlightSteps(steps);
        }, 1500);
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
    const keypadBits = document.getElementById('keypad-scanning-options');
    const steps = document.getElementById('keypad-scanning-steps');
    const animateBtn = document.getElementById('keypad-scanning-animate-btn');
    const stepsBtn = document.getElementById('keypad-scanning-steps-btn');
    const resetBtn = document.getElementById('keypad-scanning-reset-btn');
    const keypadBitsGroup = keypadBits.children[0];

    function animate() {
        reset();
        showExplanation("Starting Keypad Scanning: Monitoring signal timing.");
        setTimeout(() => {
            const bit = keypadBitsGroup.children[1];
            bit.classList.remove('low');
            bit.classList.add('high', 'connection');
            showExplanation("Keypad detected: Scanning recognized.");
            setTimeout(() => bit.classList.add('visible'), 100);
        }, 800);
        setTimeout(() => {
            showExplanation("Reviewing Keypad Scanning details.");
            highlightSteps(steps);
        }, 1500);
    }

    function reset() {
        resetBits(keypadBits, '');
        const options = ['a) 2.5 ms', 'b) 5 ms', 'c) 10 ms', 'd) 7 ms'];
        options.forEach((opt, i) => keypadBitsGroup.children[i].innerHTML = opt);
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
    const historyBits = document.getElementById('history-byte-options');
    const steps = document.getElementById('history-byte-steps');
    const animateBtn = document.getElementById('history-byte-animate-btn');
    const stepsBtn = document.getElementById('history-byte-steps-btn');
    const resetBtn = document.getElementById('history-byte-reset-btn');
    const historyBitsGroup = historyBits.children[0];

    function animate() {
        reset();
        showExplanation("Starting History Byte: Monitoring signal timing.");
        setTimeout(() => {
            const bit = historyBitsGroup.children[1];
            bit.classList.remove('low');
            bit.classList.add('high', 'connection');
            showExplanation("History Byte detected: Scanning recognized.");
            setTimeout(() => bit.classList.add('visible'), 100);
        }, 800);
        setTimeout(() => {
            showExplanation("Reviewing History Byte details.");
            highlightSteps(steps);
        }, 1500);
    }

    function reset() {
        resetBits(historyBits, '');
        const options = ['a) 2.5 ms', 'b) 5 ms', 'c) 10 ms', 'd) 7 ms'];
        options.forEach((opt, i) => historyBitsGroup.children[i].innerHTML = opt);
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
    const frequencyBits = document.getElementById('display-frequency-options');
    const steps = document.getElementById('display-frequency-steps');
    const animateBtn = document.getElementById('display-frequency-animate-btn');
    const stepsBtn = document.getElementById('display-frequency-steps-btn');
    const resetBtn = document.getElementById('display-frequency-reset-btn');
    const frequencyBitsGroup = frequencyBits.children[0];

    function animate() {
        reset();
        showExplanation("Starting Display Frequency: Monitoring signal timing.");
        setTimeout(() => {
            const bit = frequencyBitsGroup.children[1];
            bit.classList.remove('low');
            bit.classList.add('high', 'connection');
            showExplanation("Display Frequency detected: Scanning recognized.");
            setTimeout(() => bit.classList.add('visible'), 100);
        }, 800);
        setTimeout(() => {
            showExplanation("Reviewing Display Frequency details.");
            highlightSteps(steps);
        }, 1500);
    }

    function reset() {
        resetBits(frequencyBits, '');
        const options = ['a) 2.5 ms', 'b) 5 ms', 'c) 10 ms', 'd) 7 ms'];
        options.forEach((opt, i) => frequencyBitsGroup.children[i].innerHTML = opt);
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
    const pinsBits = document.getElementById('multiplexing-pins-options');
    const steps = document.getElementById('multiplexing-pins-steps');
    const animateBtn = document.getElementById('multiplexing-pins-animate-btn');
    const stepsBtn = document.getElementById('multiplexing-pins-steps-btn');
    const resetBtn = document.getElementById('multiplexing-pins-reset-btn');
    const pinsBitsGroup = pinsBits.children[0];

    function animate() {
        reset();
        showExplanation("Starting Multiplexing Pins: Monitoring signal timing.");
        setTimeout(() => {
            const bit = pinsBitsGroup.children[1];
            bit.classList.remove('low');
            bit.classList.add('high', 'connection');
            showExplanation("Multiplexing Pins detected: Scanning recognized.");
            setTimeout(() => bit.classList.add('visible'), 100);
        }, 800);
        setTimeout(() => {
            showExplanation("Reviewing Multiplexing Pins details.");
            highlightSteps(steps);
        }, 1500);
    }

    function reset() {
        resetBits(pinsBits, '');
        const options = ['a) 2.5 ms', 'b) 5 ms', 'c) 10 ms', 'd) 7 ms'];
        options.forEach((opt, i) => pinsBitsGroup.children[i].innerHTML = opt);
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
    const pinsBits = document.getElementById('two-arrays-options');
    const steps = document.getElementById('two-arrays-steps');
    const animateBtn = document.getElementById('two-arrays-animate-btn');
    const stepsBtn = document.getElementById('two-arrays-steps-btn');
    const resetBtn = document.getElementById('two-arrays-reset-btn');
    const pinsBitsGroup = pinsBits.children[0];

    function animate() {
        reset();
        showExplanation("Starting Two Arrays: Monitoring signal timing.");
        setTimeout(() => {
            const bit = pinsBitsGroup.children[1];
            bit.classList.remove('low');
            bit.classList.add('high', 'connection');
            showExplanation("Two Arrays detected: Scanning recognized.");
            setTimeout(() => bit.classList.add('visible'), 100);
        }, 800);
        setTimeout(() => {
            showExplanation("Reviewing Two Arrays details.");
            highlightSteps(steps);
        }, 1500);
    }

    function reset() {
        resetBits(pinsBits, '');
        const options = ['a) 2.5 ms', 'b) 5 ms', 'c) 10 ms', 'd) 7 ms'];
        options.forEach((opt, i) => pinsBitsGroup.children[i].innerHTML = opt);
        steps.classList.remove('visible');
        stepsBtn.textContent = 'Show Steps';
    }

    animateBtn.addEventListener('click', animate);
    stepsBtn.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn.addEventListener('click', reset);
    reset();
}

// Problem 9: Counter Timer Animation
function initCounterTimerAnimation() {
    const intervalBits = document.getElementById('counter-timer-options');
    const steps = document.getElementById('counter-timer-steps');
    const animateBtn = document.getElementById('counter-timer-animate-btn');
    const stepsBtn = document.getElementById('counter-timer-steps-btn');
    const resetBtn = document.getElementById('counter-timer-reset-btn');
    const intervalBitsGroup = intervalBits.children[0];

    function animate() {
        reset();
        showExplanation("Starting Counter Timer: Monitoring signal timing.");
        setTimeout(() => {
            const bit = intervalBitsGroup.children[1];
            bit.classList.remove('low');
            bit.classList.add('high', 'connection');
            showExplanation("Counter Timer detected: Scanning recognized.");
            setTimeout(() => bit.classList.add('visible'), 100);
        }, 800);
        setTimeout(() => {
            showExplanation("Reviewing Counter Timer details.");
            highlightSteps(steps);
        }, 1500);
    }

    function reset() {
        resetBits(intervalBits, '');
        const options = ['a) 2.5 ms', 'b) 5 ms', 'c) 10 ms', 'd) 7 ms'];
        options.forEach((opt, i) => intervalBitsGroup.children[i].innerHTML = opt);
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