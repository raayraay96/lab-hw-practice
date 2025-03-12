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
function initSysTickAnimation() {
    const optionsBits = document.getElementById('systick-options');
    const steps = document.getElementById('systick-steps');
    const animateBtn = document.getElementById('systick-animate-btn');
    const stepsBtn = document.getElementById('systick-steps-btn');
    const resetBtn = document.getElementById('systick-reset-btn');

    const options = ['Delay Function', 'Clear Variable', 'Flash Memory Latency', 'Consistent SysTick_Handler'];
    options.forEach(opt => optionsBits.innerHTML += `<span class="bit low">${opt}</span>`);

    function animate() {
        reset();
        setTimeout(() => {
            const bit = optionsBits.children[2]; // Highlight Flash Memory Latency as not possible
            bit.classList.remove('low');
            bit.classList.add('high', 'connection');
            setTimeout(() => bit.classList.add('visible'), 100);
        }, 500);
        setTimeout(() => highlightSteps(steps), 1000);
    }

    function reset() {
        [...optionsBits.children].forEach((bit, i) => {
            bit.classList.remove('high', 'connection', 'visible');
            bit.classList.add('low');
            bit.textContent = options[i];
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
    const timerBits = document.getElementById('timer-config');
    const steps = document.getElementById('timer-config-steps');
    const animateBtn = document.getElementById('timer-config-animate-btn');
    const stepsBtn = document.getElementById('timer-config-steps-btn');
    const resetBtn = document.getElementById('timer-config-reset-btn');

    const options = ['PRESCALER = 99', 'RELOAD = 999'];
    options.forEach(opt => timerBits.innerHTML += `<span class="bit low">${opt}</span>`);

    function animate() {
        reset();
        setTimeout(() => {
            const bit = timerBits.children[0];
            bit.classList.remove('low');
            bit.classList.add('high', 'connection');
            setTimeout(() => bit.classList.add('visible'), 100);
        }, 500);
        setTimeout(() => highlightSteps(steps), 1000);
    }

    function reset() {
        [...timerBits.children].forEach((bit, i) => {
            bit.classList.remove('high', 'connection', 'visible');
            bit.classList.add('low');
            bit.textContent = options[i];
        });
        steps.classList.remove('visible');
        stepsBtn.textContent = 'Show Steps';
    }

    animateBtn.addEventListener('click', animate);
    stepsBtn.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn.addEventListener('click', reset);
    reset();
}

// Problem 3: Keypad Scanning Animation
function initKeypadScanAnimation() {
    const keypadBits = document.getElementById('keypad-scan');
    const steps = document.getElementById('keypad-scan-steps');
    const animateBtn = document.getElementById('keypad-scan-animate-btn');
    const stepsBtn = document.getElementById('keypad-scan-steps-btn');
    const resetBtn = document.getElementById('keypad-scan-reset-btn');

    const keys = ['1', '2', '4', '5'];
    keys.forEach(key => keypadBits.innerHTML += `<span class="bit low">${key}</span>`);

    function animate() {
        reset();
        setTimeout(() => {
            const bit = keypadBits.children[0]; // Highlight key '1'
            bit.classList.remove('low');
            bit.classList.add('high', 'connection');
            setTimeout(() => bit.classList.add('visible'), 100);
        }, 500);
        setTimeout(() => highlightSteps(steps), 1000);
    }

    function reset() {
        [...keypadBits.children].forEach((bit, i) => {
            bit.classList.remove('high', 'connection', 'visible');
            bit.classList.add('low');
            bit.textContent = keys[i];
        });
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

// NEW ANIMATION FUNCTIONS FOR DMA, FIXED-POINT, DAC, ADC, QUANTIZATION, AND INTEGRATION

function initDmaAnimation() {
    const container = document.getElementById('dma-controller');
    const steps = document.getElementById('dma-steps');
    const animateBtn = document.getElementById('dma-animate-btn');
    const stepsBtn = document.getElementById('dma-steps-btn');
    const resetBtn = document.getElementById('dma-reset-btn');
    function animate() {
        // Explain DMA: show processor configuring DMA channels and DMA transferring data independently.
        showExplanation("Configuring DMA: Processor sets up DMA channels.");
        // ...simulate DMA transfer animation...
        setTimeout(() => highlightSteps(steps), 1500);
    }
    function reset() {
        container.innerHTML = ''; // Reset DMA display
        steps.classList.remove('visible');
        stepsBtn.textContent = 'Show Steps';
    }
    animateBtn.addEventListener('click', animate);
    stepsBtn.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn.addEventListener('click', reset);
    reset();
}

function initFixedPointAnimation() {
    const container = document.getElementById('fixed-point-display');
    const steps = document.getElementById('fixed-point-steps');
    const animateBtn = document.getElementById('fixed-point-animate-btn');
    const stepsBtn = document.getElementById('fixed-point-steps-btn');
    const resetBtn = document.getElementById('fixed-point-reset-btn');
    function animate() {
        // Demonstrate conversion to Q4.4: break down integer and fractional parts.
        showExplanation("Converting decimal to Q4.4 fixed-point format.");
        // ...simulate conversion process...
        setTimeout(() => highlightSteps(steps), 1500);
    }
    function reset() {
        container.innerHTML = '0.0000'; // initial fixed-point display
        steps.classList.remove('visible');
        stepsBtn.textContent = 'Show Steps';
    }
    animateBtn.addEventListener('click', animate);
    stepsBtn.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn.addEventListener('click', reset);
    reset();
}

function initDacAnimation() {
    const container = document.getElementById('dac-display');
    const steps = document.getElementById('dac-steps');
    const animateBtn = document.getElementById('dac-animate-btn');
    const stepsBtn = document.getElementById('dac-steps-btn');
    const resetBtn = document.getElementById('dac-reset-btn');
    function animate() {
        // Show conversion of a digital value into an analog voltage.
        showExplanation("DAC conversion: Digital value → Analog voltage.");
        // ...simulate DAC output update...
        setTimeout(() => highlightSteps(steps), 1500);
    }
    function reset() {
        container.innerHTML = '0 V';
        steps.classList.remove('visible');
        stepsBtn.textContent = 'Show Steps';
    }
    animateBtn.addEventListener('click', animate);
    stepsBtn.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn.addEventListener('click', reset);
    reset();
}

function initAdcAnimation() {
    const container = document.getElementById('adc-display');
    const steps = document.getElementById('adc-steps');
    const animateBtn = document.getElementById('adc-animate-btn');
    const stepsBtn = document.getElementById('adc-steps-btn');
    const resetBtn = document.getElementById('adc-reset-btn');
    function animate() {
        // Illustrate ADC sampling and quantization.
        showExplanation("ADC sampling: Converting analog input to digital value.");
        // ...simulate analog-to-digital conversion...
        setTimeout(() => highlightSteps(steps), 1500);
    }
    function reset() {
        container.innerHTML = '0';
        steps.classList.remove('visible');
        stepsBtn.textContent = 'Show Steps';
    }
    animateBtn.addEventListener('click', animate);
    stepsBtn.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn.addEventListener('click', reset);
    reset();
}

function initQuantizationAnimation() {
    const container = document.getElementById('quantization-display');
    const steps = document.getElementById('quantization-steps');
    const animateBtn = document.getElementById('quantization-animate-btn');
    const stepsBtn = document.getElementById('quantization-steps-btn');
    const resetBtn = document.getElementById('quantization-reset-btn');
    function animate() {
        // Explain ADC quantization error using LSB calculations.
        showExplanation("Quantization Error: Highlighting the LSB impact.");
        // ...simulate error estimation...
        setTimeout(() => highlightSteps(steps), 1500);
    }
    function reset() {
        container.innerHTML = '0';
        steps.classList.remove('visible');
        stepsBtn.textContent = 'Show Steps';
    }
    animateBtn.addEventListener('click', animate);
    stepsBtn.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn.addEventListener('click', reset);
    reset();
}

function initAdcDacIntegrationAnimation() {
    const container = document.getElementById('adcdac-display');
    const steps = document.getElementById('adcdac-steps');
    const animateBtn = document.getElementById('adcdac-animate-btn');
    const stepsBtn = document.getElementById('adcdac-steps-btn');
    const resetBtn = document.getElementById('adcdac-reset-btn');
    function animate() {
        // Demonstrate a chain: ADC samples, digital processing, then DAC outputs the analog result.
        showExplanation("ADC→DAC Chain: Capture analog input and regenerate output.");
        // ...simulate the full conversion chain...
        setTimeout(() => highlightSteps(steps), 1500);
    }
    function reset() {
        container.innerHTML = '0 V';
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
    initSysTickAnimation();
    initTimerConfigAnimation();
    initKeypadScanAnimation();
    initKeypadScanningAnimation();
    initHistoryByteAnimation();
    initDisplayFrequencyAnimation();
    initMultiplexingPinsAnimation();
    initTwoArraysAnimation();
    initCounterTimerAnimation();
    // New animations for DMA, Fixed-Point, DAC, ADC, Quantization, and ADC-DAC integration.
    initDmaAnimation();
    initFixedPointAnimation();
    initDacAnimation();
    initAdcAnimation();
    initQuantizationAnimation();
    initAdcDacIntegrationAnimation();
});