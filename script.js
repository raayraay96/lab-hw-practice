// Global variables
let animationIntervals = {};

// Utility functions
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function toggleSteps(sectionId) {
    const steps = document.getElementById(`${sectionId}-steps`);
    steps.classList.toggle('visible');
}

// Problem 1: SysTick Limitations Animation - Improved and Corrected
function initSysTickAnimation() {
    setupAnimation({
        containerId: 'systick-limitations-container', // Corrected container ID
        stepsId: 'systick-limitations-steps',
        animateBtnId: 'systick-limitations-animate-btn',
        stepsBtnId: 'systick-limitations-steps-btn',
        resetBtnId: 'systick-limitations-reset-btn',
        animateFunction: (container, steps, reset) => {
            reset();
            container.innerHTML = `
                <div class="microcontroller">
                    <div class="core">
                        <div class="systick">SysTick</div>
                        <div class="hclk">HCLK</div>
                    </div>
                    <div class="ahb-lite">AHB-Lite Bus</div>
                    <div class="flash-memory">Flash Memory</div>
                    <div class="data-path"></div>
                    <div class="latency-arrow"></div>
                    <div class="systick-counter">SysTick Count: 0</div>
                    <div class="hclk-timeline">
                        <div class="hclk-tick"></div><div class="hclk-tick"></div><div class="hclk-tick"></div><div class="hclk-tick"></div><div class="hclk-tick"></div>
                    </div>
                    <div class="options-list">
                        <span class="option" id="delay-option">a) Delay Function</span>
                        <span class="option" id="variable-option">b) Clear Variable</span>
                        <span class="option disabled" id="flash-latency-option">c) Flash Latency</span>
                        <span class="option" id="handler-option">d) SysTick Handler</span>
                    </div>
                </div>
            `;

            const core = container.querySelector('.core');
            const systick = container.querySelector('.systick');
            const hclkLine = container.querySelector('.hclk');
            const ahbBus = container.querySelector('.ahb-lite');
            const flashMemory = container.querySelector('.flash-memory');
            const dataPath = container.querySelector('.data-path');
            const latencyArrow = container.querySelector('.latency-arrow');
            const systickCounterDisplay = container.querySelector('.systick-counter');
            const hclkTimeline = container.querySelector('.hclk-timeline');
            const hclkTicks = container.querySelectorAll('.hclk-tick');
            const flashLatencyOption = container.querySelector('#flash-latency-option');

            showExplanation("Visualizing SysTick and Flash Memory Setup...");

            setTimeout(() => {
                showExplanation("Simulating Flash Read Request...");
                dataPath.classList.add('active'); // Animate data path
                dataPath.textContent = 'Read Request';
            }, 1000);

            setTimeout(() => {
                showExplanation("Address Phase (HCLK Cycles)...");
                dataPath.textContent = 'Address Phase';
                hclkTimeline.classList.add('active'); // Start HCLK timeline animation
                hclkTicks.forEach((tick, index) => {
                    setTimeout(() => tick.classList.add('active'), index * 200); // Animate HCLK ticks
                });
            }, 2000);

            setTimeout(() => {
                showExplanation("Data Phase & Actual Flash Latency (less than 2 HCLK cycles)...");
                dataPath.textContent = 'Data Phase';
                latencyArrow.classList.add('active'); // Show latency arrow
                latencyArrow.textContent = 'Actual Latency';
            }, 3500);

            setTimeout(() => {
                showExplanation("SysTick Counts HCLK Cycles - Limited Granularity...");
                dataPath.textContent = 'Data Received';
                systickCounterDisplay.classList.add('active'); // Highlight SysTick counter
                systickCounterDisplay.textContent = 'SysTick Count: 2 (Cycles)'; // SysTick sees 2 cycles minimum
            }, 5000);

            setTimeout(() => {
                showExplanation("SysTick cannot accurately measure sub-cycle flash latency.");
                flashLatencyOption.classList.add('incorrect'); // Indicate flash latency is incorrect option
            }, 6500);

            setTimeout(() => {
                showExplanation("SysTick is suitable for delay, variable clearing, and handler timing.");
                container.querySelector('#delay-option').classList.add('correct');
                container.querySelector('#variable-option').classList.add('correct');
                container.querySelector('#handler-option').classList.add('correct');
            }, 7500);


            setTimeout(() => highlightSteps(steps), 8500);
        }
    });
}

// Problem 2: Timer Configuration
async function animateTimerConfig() {
    const options = document.querySelectorAll('#timer-config-options .bit');
    const steps = document.getElementById('timer-config-steps');

    for (let i = 0; i < options.length; i++) {
        options[i].classList.add('high');
        await sleep(500);
    }

    steps.innerHTML = `
        Timer Configuration Options:
        Option 1 (Valid): RELOAD = 999, PRESCALER = 99
        Option 2 (Invalid): RELOAD = 0 (invalid, timer blocked)
        Option 3 (Valid): RELOAD = 9, PRESCALER = 9999
        Formula: ftimer update = fclock / ((1 + RELOAD) * (1 + PRESCALER))
        Option 1: (1 + 999) * (1 + 99) = 1000 * 100 = 100000. ftimer update = 105 / 105 = 1 Hz (1s)
        Option 2: Reload=0 is invalid (timer blocked)
        Option 3: (1 + 9) * (1 + 9999) = 10 * 10000 = 100000. ftimer update = 105 / 105 = 1 Hz (1s)
    `;
    steps.classList.add('visible');
}

// Problem 3: Interrupt Interval
async function animateInterruptInterval() {
    const options = document.querySelectorAll('#interrupt-interval-options .bit');
    const steps = document.getElementById('interrupt-interval-steps');

    for (let i = 0; i < options.length; i++) {
        options[i].classList.add('high');
        await sleep(500);
    }

    steps.innerHTML = `
        Interrupt Interval Calculation:
        RELOAD = 499, PRESCALER = 0, Clock = 105 MHz
        Formula: ftimer update = fclock / ((1 + RELOAD) * (1 + PRESCALER))
        ftimer update = 105 Hz / ((1 + 499) * (1 + 0)) = 105 Hz / 500 = 200 Hz
        Interval = 1 / ftimer update = 1 / 200 Hz = 0.005 s = 5 ms
    `;
    steps.classList.add('visible');
}

// Problem 4: Keypad Scanning
async function animateKeypadScanning() {
    const keypad = document.getElementById('keypad-scanning-keypad');
    const steps = document.getElementById('keypad-scanning-steps');

    // Create keypad visualization
    keypad.innerHTML = '';
    for (let i = 0; i < 4; i++) { // Rows
        for (let j = 0; j < 4; j++) { // Columns
            const key = document.createElement('div');
            key.className = 'key';
            key.textContent = `Key ${i * 4 + j + 1}`;
            keypad.appendChild(key);
            await sleep(100);
        }
    }

    steps.innerHTML = `
        Keypad Scanning Explanation:
        4x4 Keypad Matrix: 4 rows, 4 columns
        Scanning Method: Poll rows, columns as output
        Simultaneous Press Detection:
        4.1: Keys 1 & 2 pressed - True (same row, same ISR iteration)
        4.2: Keys 1 & 4 pressed - False (different rows, different ISR iterations)
        4.3: Unstable bits before solid read - 7 bits (calculated based on bounce time and scan rate)
    `;
    steps.classList.add('visible');
}

// Problem 5: History Byte
async function animateHistoryByte() {
    const historyByte = document.getElementById('history-byte-bits');
    const steps = document.getElementById('history-byte-steps');

    // Initialize history byte
    historyByte.innerHTML = '00000000';

    // Animate bit shifting
    for (let i = 0; i < 8; i++) {
        await sleep(300);
        historyByte.innerHTML = '1' + historyByte.innerHTML.slice(0, 7);
        if (i < 4) {
            historyByte.innerHTML = historyByte.innerHTML.replace('1', 'X');
        } else if (i === 4) {
            historyByte.innerHTML = historyByte.innerHTML.replace('X', '0');
        } else {
            historyByte.innerHTML = historyByte.innerHTML.replace('X', '1');
        }
    }

    steps.innerHTML = `
        Initial state: 00000000
        After 7 scans: 1111111
        First 4 bits are unstable due to bouncing
        Possible values at t=25ms: 01XXX111 (X: unstable bits)
    `;
    steps.classList.add('visible');
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Problem 1: SysTick Limitations
    document.getElementById('systick-limitations-animate-btn').addEventListener('click', animateSysTickLimitations);
    document.getElementById('systick-limitations-steps-btn').addEventListener('click', () => toggleSteps('systick-limitations'));
    document.getElementById('systick-limitations-reset-btn').addEventListener('click', () => {
        document.querySelectorAll('#systick-limitations-options .bit').forEach(bit => bit.classList.remove('high'));
        document.getElementById('systick-limitations-steps').classList.remove('visible');
    });

    // Problem 2: Timer Configuration
    document.getElementById('timer-config-animate-btn').addEventListener('click', animateTimerConfig);
    document.getElementById('timer-config-steps-btn').addEventListener('click', () => toggleSteps('timer-config'));
    document.getElementById('timer-config-reset-btn').addEventListener('click', () => {
        document.querySelectorAll('#timer-config-options .bit').forEach(bit => bit.classList.remove('high'));
        document.getElementById('timer-config-steps').classList.remove('visible');
    });

    // Problem 3: Interrupt Interval
    document.getElementById('interrupt-interval-animate-btn').addEventListener('click', animateInterruptInterval);
    document.getElementById('interrupt-interval-steps-btn').addEventListener('click', () => toggleSteps('interrupt-interval'));
    document.getElementById('interrupt-interval-reset-btn').addEventListener('click', () => {
        document.querySelectorAll('#interrupt-interval-options .bit').forEach(bit => bit.classList.remove('high'));
        document.getElementById('interrupt-interval-steps').classList.remove('visible');
    });

    // Problem 4: Keypad Scanning
    document.getElementById('keypad-scanning-animate-btn').addEventListener('click', animateKeypadScanning);
    document.getElementById('keypad-scanning-steps-btn').addEventListener('click', () => toggleSteps('keypad-scanning'));
    document.getElementById('keypad-scanning-reset-btn').addEventListener('click', () => {
        document.getElementById('keypad-scanning-keypad').innerHTML = '';
        document.getElementById('keypad-scanning-steps').classList.remove('visible');
    });

    // Problem 5: History Byte
    document.getElementById('history-byte-animate-btn').addEventListener('click', animateHistoryByte);
    document.getElementById('history-byte-steps-btn').addEventListener('click', () => toggleSteps('history-byte'));
    document.getElementById('history-byte-reset-btn').addEventListener('click', () => {
        document.getElementById('history-byte-bits').innerHTML = '00000000';
        document.getElementById('history-byte-steps').classList.remove('visible');
    });
});
