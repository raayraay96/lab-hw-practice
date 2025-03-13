// script.js - Full Updated Code for HW3 Animations

// Utility Functions
function toggleSteps(steps, btn) {
    btn.textContent = steps.classList.contains('visible') ? 'Show Steps' : 'Hide Steps';
    steps.classList.toggle('visible');
}

function highlightSteps(steps) {
    steps.classList.add('highlight');
    setTimeout(() => steps.classList.remove('highlight'), 1000);
}

function resetBits(container, text = '') {
    container.innerHTML = text; // Reset container content
}

// Helper: Show an explanatory overlay message during animations
function showExplanation(text) {
    const overlay = document.getElementById('explanation-overlay');
    const message = document.getElementById('explanation-message');
    message.textContent = text;
    overlay.classList.add('visible');

    // Clear previous timeouts to avoid overlapping removals
    if (overlay.timeoutId) {
        clearTimeout(overlay.timeoutId);
    }

    // Set a new timeout to hide the overlay after 3 seconds
    overlay.timeoutId = setTimeout(() => {
        overlay.classList.remove('visible');
        overlay.timeoutId = null; // Clear timeout ID
    }, 3000);
}

// NEW: Animation setup helper function
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
        resetBits(container, '');
        steps.classList.remove('visible');
        stepsBtn.textContent = 'Show Steps';
    }

    animateBtn.addEventListener('click', () => animateFunction(container, steps, reset));
    stepsBtn.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn.addEventListener('click', reset);
    reset();
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


// Problem 2: Timer Configuration Animation - Improved and Visualized
function initTimerConfigAnimation() {
    setupAnimation({
        containerId: 'timer-config-options', // Changed container ID
        stepsId: 'timer-config-steps',
        animateBtnId: 'timer-config-animate-btn',
        stepsBtnId: 'timer-config-steps-btn',
        resetBtnId: 'timer-config-reset-btn',
        animateFunction: (container, steps, reset) => {
            reset();
            container.innerHTML = `
                <div class="timer-animation-container">
                    <div class="clock-source">
                        <div class="label">100kHz Clock</div>
                        <div class="waveform" id="clock-waveform"></div>
                    </div>
                    <div class="prescaler-section">
                        <div class="label">Prescaler</div>
                        <div class="prescaler-value" id="prescaler-display"></div>
                        <div class="waveform" id="prescaler-waveform"></div>
                    </div>
                    <div class="counter-section">
                        <div class="label">Counter</div>
                        <div class="counter-value" id="counter-display">0</div>
                        <div class="reload-label">RELOAD: <span id="reload-display"></span></div>
                    </div>
                    <div class="interval-section">
                        <div class="label">Timer Interval</div>
                        <div class="interval-value" id="interval-display"></div>
                    </div>
                    <div class="options-container">
                        <div class="option" id="option1">
                            <span class="option-label">Option 1</span>
                            <span class="config">PRESCALER= 99,<br>RELOAD= 999</span>
                            <span class="result" id="result1"></span>
                        </div>
                        <div class="option" id="option2">
                            <span class="option-label">Option 2</span>
                            <span class="config">PRESCALER= 99999,<br>RELOAD= 0</span>
                            <span class="result" id="result2"></span>
                        </div>
                        <div class="option" id="option3">
                            <span class="option-label">Option 3</span>
                            <span class="config">PRESCALER= 9999,<br>RELOAD= 9</span>
                            <span class="result" id="result3"></span>
                        </div>
                    </div>
                </div>
            `;

            const clockWaveform = document.getElementById('clock-waveform');
            const prescalerDisplay = document.getElementById('prescaler-display');
            const prescalerWaveform = document.getElementById('prescaler-waveform');
            const counterDisplay = document.getElementById('counter-display');
            const reloadDisplay = document.getElementById('reload-display');
            const intervalDisplay = document.getElementById('interval-display');
            const option1 = document.getElementById('option1');
            const option2 = document.getElementById('option2');
            const option3 = document.getElementById('option3');
            const result1 = document.getElementById('result1');
            const result2 = document.getElementById('result2');
            const result3 = document.getElementById('result3');


            // Function to generate waveform pulses
            function generateWaveform(element, frequency, durationMs) {
                element.innerHTML = ''; // Clear previous waveform
                const pulseWidth = 10; // Width of each pulse
                const spaceWidth = (durationMs / frequency) - pulseWidth; // Space between pulses
                let waveformHTML = '';
                const numPulses = Math.ceil(durationMs / (1000/frequency)); // Number of pulses to show in duration

                for (let i = 0; i < numPulses; i++) {
                    waveformHTML += `<span class="pulse"></span><span class="space" style="width: ${Math.max(0, spaceWidth)}px;"></span>`;
                }
                element.innerHTML = waveformHTML;
            }


            async function animateOption(optionElement, prescalerValue, reloadValue, resultElement) {
                prescalerDisplay.textContent = prescalerValue;
                reloadDisplay.textContent = reloadValue;
                optionElement.classList.add('active-option');

                showExplanation(`Testing Option: PRESCALER = ${prescalerValue}, RELOAD = ${reloadValue}`);

                // 1. Show Clock Waveform
                generateWaveform(clockWaveform, 100000, 1000); // 100kHz for 1 second
                showExplanation("1. Displaying 100kHz Clock Signal...");
                await new Promise(resolve => setTimeout(resolve, 1000));


                // 2. Prescaler Effect
                const prescaledFrequency = 100000 / (prescalerValue + 1);
                generateWaveform(prescalerWaveform, prescaledFrequency, 1000);
                showExplanation(`2. Applying Prescaler (Divide by ${prescalerValue + 1}), Frequency becomes ${prescaledFrequency.toFixed(0)}Hz`);
                await new Promise(resolve => setTimeout(resolve, 1000));


                // 3. Counter Animation
                let counter = 0;
                let interval = 1000 / prescaledFrequency; // Interval in ms for each count update
                let counterAnimationInterval;

                await new Promise(resolve => {
                    counterAnimationInterval = setInterval(() => {
                        counter++;
                        counterDisplay.textContent = counter -1 ; // Display current count

                        if (counter > reloadValue + 1) { // +1 because it counts to RELOAD *before* reset
                            clearInterval(counterAnimationInterval);
                            counterDisplay.textContent = 0; // Reset display to 0 after reaching reload
                            resolve();
                        }
                    }, interval);
                });
                showExplanation(`3. Counter increments with Prescaled Clock up to RELOAD = ${reloadValue}`);

                // 4. Calculate and Display Interval
                const timerIntervalMs = (reloadValue + 1) * (1000 / prescaledFrequency);
                intervalDisplay.textContent = `${(timerIntervalMs/1000).toFixed(2)} s`;
                showExplanation(`4. Calculated Timer Interval: ${(timerIntervalMs/1000).toFixed(2)} seconds`);
                await new Promise(resolve => setTimeout(resolve, 1000));


                optionElement.classList.remove('active-option');
                return timerIntervalMs/1000; // Return interval in seconds
            }


            // Animate Options Sequentially
            animateOption(option1, 99, 999, result1).then(interval1 => {
                if (Math.abs(interval1 - 1) < 0.1) { // Check if close to 1 second, allowing for minor animation timing variations
                    result1.textContent = "Correct!";
                    result1.classList.add('correct');
                    option1.classList.add('correct-option');
                } else {
                    result1.textContent = "Incorrect";
                    result1.classList.add('incorrect');
                    option1.classList.add('incorrect-option');
                }
                return animateOption(option2, 99999, 0, result2); // Animate Option 2 next
            }).then(interval2 => {
                if (interval2 === 0) { // Interval will be effectively 0 because timer is blocked
                    result2.textContent = "Incorrect - Timer Blocked!";
                    result2.classList.add('incorrect');
                    option2.classList.add('incorrect-option', 'blocked-option'); // Add blocked class
                } else {
                    result2.textContent = "Incorrect";
                    result2.classList.add('incorrect');
                    option2.classList.add('incorrect-option');
                }
                return animateOption(option3, 9999, 9, result3); // Animate Option 3 next
            }).then(interval3 => {
                if (Math.abs(interval3 - 1) < 0.1) {
                    result3.textContent = "Correct!";
                    result3.classList.add('correct');
                    option3.classList.add('correct-option');
                } else {
                    result3.textContent = "Incorrect";
                    result3.classList.add('incorrect');
                    option3.classList.add('incorrect-option');
                }
                highlightSteps(steps);
            });


        }
    });
}

// Problem 3: Interrupt Interval Animation - Improved
function initInterruptIntervalAnimation() {
    setupAnimation({
        containerId: 'interrupt-interval-options', // Changed container ID
        stepsId: 'interrupt-interval-steps',
        animateBtnId: 'interrupt-interval-animate-btn',
        stepsBtnId: 'interrupt-interval-steps-btn',
        resetBtnId: 'interrupt-interval-reset-btn',
        animateFunction: (container, steps, reset) => {
            reset();
            container.innerHTML = `
                <div>
                    <span class="bit low">a) 2.5 ms</span>
                    <span class="bit high connection visible">b) 5 ms</span>
                    <span class="bit low">c) 10 ms</span>
                    <span class="bit low">d) 7 ms</span>
                </div>
            `;
            const options = container.querySelectorAll('.bit');


            showExplanation("Calculating interrupt interval...");

            setTimeout(() => {
                options[1].classList.add('correct');
                showExplanation("Option b) 5ms is the correct interval");
            }, 500);


            setTimeout(() => highlightSteps(steps), 1000);
        }
    });
}


// Problem 4: Keypad Scanning Animation (Conceptual - you'll need to build keypad visualization)
function initKeypadScanningAnimation() {
    setupAnimation({
        containerId: 'keypad-scanning-keypad',
        stepsId: 'keypad-scanning-steps',
        animateBtnId: 'keypad-scanning-animate-btn',
        stepsBtnId: 'keypad-scanning-steps-btn',
        resetBtnId: 'keypad-scanning-reset-btn',
        animateFunction: (container, steps, reset) => {
            reset();
            container.innerHTML = createKeypadHTML(); // Generate keypad

            const keypadKeys = [...container.querySelectorAll('.keypad-key')];


            // Example animation (you'll need to refine this to show row scanning)
            setTimeout(() => {
                showExplanation("Simulating pressing keys '1' and '2'...");
                keypadKeys[0].classList.remove('low'); // Highlight key '1'
                keypadKeys[0].classList.add('high', 'connection', 'visible');
            }, 500);
            setTimeout(() => {
                keypadKeys[1].classList.remove('low'); // Highlight key '2'
                keypadKeys[1].classList.add('high', 'connection', 'visible');
            }, 1000);


            setTimeout(() => highlightSteps(steps), 1500);
        }
    });
}


function createKeypadHTML() {
    let keypadHTML = '<div>';
    const keys = ['1', '2', '3', 'A', '4', '5', '6', 'B', '7', '8', '9', 'C', '*', '0', '#', 'D'];
    for (let i = 0; i < keys.length; i++) {
        keypadHTML += `<span class="bit low keypad-key" data-key="${keys[i]}">${keys[i]}</span>`;
        if ((i + 1) % 4 === 0) {
            keypadHTML += '</div><div>'; // Start new row
        }
    }
    keypadHTML += '</div>';
    return keypadHTML;
}


// Problem 5: History Byte Animation
function initHistoryByteAnimation() {
    setupAnimation({
        containerId: 'history-byte-options',
        stepsId: 'history-byte-steps',
        animateBtnId: 'history-byte-animate-btn',
        stepsBtnId: 'history-byte-steps-btn',
        resetBtnId: 'history-byte-reset-btn',
        animateFunction: (container, steps, reset) => {
            reset();
            container.innerHTML = `
                <div>
                    <span class="bit low">0</span>
                    <span class="bit low">1</span>
                    <span class="bit low">X</span>
                    <span class="bit low">X</span>
                    <span class="bit low">X</span>
                    <span class="bit low">1</span>
                    <span class="bit low">1</span>
                    <span class="bit low">1</span>
                </div>
            `;


            showExplanation("Displaying possible history byte values...");


            setTimeout(() => highlightSteps(steps), 1000);
        }
    });
}

// Problem 6: Display Frequency Animation
function initDisplayFrequencyAnimation() {
    setupAnimation({
        containerId: 'display-frequency-options',
        stepsId: 'display-frequency-steps',
        animateBtnId: 'display-frequency-animate-btn',
        stepsBtnId: 'display-frequency-steps-btn',
        resetBtnId: 'display-frequency-reset-btn',
        animateFunction: (container, steps, reset) => {
            reset();
            container.innerHTML = `
                <div>
                    <span class="bit high connection visible">6</span>
                    <span class="bit high connection visible">2</span>
                    <span class="bit high connection visible">5</span>
                </div>
            `;


            showExplanation("Displaying calculated minimum frequency: 625Hz...");


            setTimeout(() => highlightSteps(steps), 1500);
        }
    });
}

// Problem 7: Multiplexing Pins Animation
function initMultiplexingPinsAnimation() {
    setupAnimation({
        containerId: 'multiplexing-pins-options',
        stepsId: 'multiplexing-pins-steps',
        animateBtnId: 'multiplexing-pins-animate-btn',
        stepsBtnId: 'multiplexing-pins-steps-btn',
        resetBtnId: 'multiplexing-pins-reset-btn',
        animateFunction: (container, steps, reset) => {
            reset();
            container.innerHTML = `
                <div>
                    <span class="bit high connection visible">1</span>
                    <span class="bit high connection visible">4</span>
                </div>
            `;

            showExplanation("Displaying calculated pins needed: 14...");

            setTimeout(() => highlightSteps(steps), 1000);
        }
    });
}

// Problem 8: Two Arrays Animation
function initTwoArraysAnimation() {
    setupAnimation({
        containerId: 'two-arrays-options',
        stepsId: 'two-arrays-steps',
        animateBtnId: 'two-arrays-animate-btn',
        stepsBtnId: 'two-arrays-steps-btn',
        resetBtnId: 'two-arrays-reset-btn',
        animateFunction: (container, steps, reset) => {
            reset();
            container.innerHTML = `
                <div>
                    <span class="bit high connection visible">1</span>
                    <span class="bit high connection visible">4</span>
                </div>
            `;


            showExplanation("Displaying pins needed for two arrays: 14 (same as single array)...");

            setTimeout(() => highlightSteps(steps), 1000);
        }
    });
}

// Problem 9: Counter Timer Animation
function initCounterTimerAnimation() {
    setupAnimation({
        containerId: 'counter-timer-options',
        stepsId: 'counter-timer-steps',
        animateBtnId: 'counter-timer-animate-btn',
        stepsBtnId: 'counter-timer-steps-btn',
        resetBtnId: 'counter-timer-reset-btn',
        animateFunction: (container, steps, reset) => {
            reset();
            container.innerHTML = `
                <div>
                    <span class="bit high connection visible">5</span>
                    <span class="bit">.</span>
                    <span class="bit high connection visible">1</span>
                    <span class="bit high connection visible">2</span>
                </div>
            `;

            showExplanation("Displaying calculated counter timer interval: 5.12 ms...");


            setTimeout(() => highlightSteps(steps), 1000);
        }
    });
}

// NEW ANIMATION FUNCTIONS FOR DMA, FIXED-POINT, DAC, ADC, QUANTIZATION, AND INTEGRATION

function initDmaAnimation() {
    setupAnimation({
        containerId: 'dma-controller',
        stepsId: 'dma-steps',
        animateBtnId: 'dma-animate-btn',
        stepsBtnId: 'dma-steps-btn',
        resetBtnId: 'dma-reset-btn',
        animateFunction: (container, steps, reset) => {
            // Explain DMA: show processor configuring DMA channels and DMA transferring data independently.
            showExplanation("Configuring DMA: Processor sets up DMA channels.");
            container.innerHTML = `DMA Animation Placeholder`;
            setTimeout(() => highlightSteps(steps), 1500);
        }
    });
}

function initFixedPointAnimation() {
    setupAnimation({
        containerId: 'fixed-point-display',
        stepsId: 'fixed-point-steps',
        animateBtnId: 'fixed-point-animate-btn',
        stepsBtnId: 'fixed-point-steps-btn',
        resetBtnId: 'fixed-point-reset-btn',
        animateFunction: (container, steps, reset) => {
            // Demonstrate conversion to Q4.4: break down integer and fractional parts.
            showExplanation("Converting decimal to Q4.4 fixed-point format.");
            container.innerHTML = `Fixed Point Animation Placeholder`;
            setTimeout(() => highlightSteps(steps), 1500);
        }
    });
}

function initDacAnimation() {
    setupAnimation({
        containerId: 'dac-display',
        stepsId: 'dac-steps',
        animateBtnId: 'dac-animate-btn',
        stepsBtnId: 'dac-steps-btn',
        resetBtnId: 'dac-reset-btn',
        animateFunction: (container, steps, reset) => {
            // Show conversion of a digital value into an analog voltage.
            showExplanation("DAC conversion: Digital value → Analog voltage.");
            container.innerHTML = `DAC Animation Placeholder`;
            setTimeout(() => highlightSteps(steps), 1500);
        }
    });
}

function initAdcAnimation() {
    setupAnimation({
        containerId: 'adc-display',
        stepsId: 'adc-steps',
        animateBtnId: 'adc-animate-btn',
        stepsBtnId: 'adc-steps-btn',
        resetBtnId: 'adc-reset-btn',
        animateFunction: (container, steps, reset) => {
            // Illustrate ADC sampling and quantization.
            showExplanation("ADC sampling: Converting analog input to digital value.");
            container.innerHTML = `ADC Animation Placeholder`;
            setTimeout(() => highlightSteps(steps), 1500);
        }
    });
}

function initQuantizationAnimation() {
    setupAnimation({
        containerId: 'quantization-display',
        stepsId: 'quantization-steps',
        animateBtnId: 'quantization-animate-btn',
        stepsBtnId: 'quantization-steps-btn',
        resetBtnId: 'quantization-reset-btn',
        animateFunction: (container, steps, reset) => {
            // Explain ADC quantization error using LSB calculations.
            showExplanation("Quantization Error: Highlighting the LSB impact.");
            container.innerHTML = `Quantization Animation Placeholder`;
            setTimeout(() => highlightSteps(steps), 1500);
        }
    });
}

function initAdcDacIntegrationAnimation() {
    setupAnimation({
        containerId: 'adcdac-display',
        stepsId: 'adcdac-steps',
        animateBtnId: 'adcdac-animate-btn',
        stepsBtnId: 'adcdac-steps-btn',
        resetBtnId: 'adcdac-reset-btn',
        animateFunction: (container, steps, reset) => {
            // Demonstrate a chain: ADC samples, digital processing, then DAC outputs the analog result.
            showExplanation("ADC→DAC Chain: Capture analog input and regenerate output.");
            container.innerHTML = `ADC-DAC Integration Animation Placeholder`;
            setTimeout(() => highlightSteps(steps), 1500);
        }
    });
}


window.onscroll = function() {scrollFunction()};
function scrollFunction() {
    let backToTopBtn = document.getElementById("back-to-top");
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        backToTopBtn.style.display = "block";
    } else {
        backToTopBtn.style.display = "none";
    }
}

function scrollToTop() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}


// Initialize animations
document.addEventListener('DOMContentLoaded', () => {


    initSysTickAnimation();
    initTimerConfigAnimation();
    initInterruptIntervalAnimation();
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

// Tooltip functionality
document.querySelectorAll('.tooltip').forEach(tooltipElement => {
    let tooltipText = tooltipElement.getAttribute('data-tooltip');
    tooltipElement.addEventListener('mouseover', function() {
        const explanationDiv = document.getElementById('animation-explanation');
        explanationDiv.textContent = tooltipText;
        explanationDiv.style.opacity = 1;
    });
    tooltipElement.addEventListener('mouseout', function() {
        const explanationDiv = document.getElementById('animation-explanation');
        explanationDiv.style.opacity = 0;
    });
});