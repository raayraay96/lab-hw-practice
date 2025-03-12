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

function resetSignalBits(signalBitsContainer, defaultBitValue = '0', defaultBitClass = 'low') {
    [...signalBitsContainer.children].forEach(bit => {
        bit.classList.remove('active', 'high', 'connection', 'visible', 'error-bit', 'low');
        bit.classList.add(defaultBitClass);
        bit.textContent = defaultBitValue;
    });
}

function animateSignalBits(signalBitsContainer, signalPattern, delay = 500) {
    signalPattern.split('').forEach((bit, i) => {
        setTimeout(() => {
            const bitElement = signalBitsContainer.children[i];
            bitElement.classList.add('active');
            bitElement.classList.toggle('high', bit === '1');
            bitElement.classList.toggle('low', bit === '0');
            bitElement.textContent = bit;
            if (bit === '1') {
                bitElement.classList.add('connection');
                setTimeout(() => bitElement.classList.add('visible'), 100);
            }
        }, i * delay);
    });
}

function createSquareWave(container, data, options) {
    const waveSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    waveSvg.setAttribute('width', options.width);
    waveSvg.setAttribute('height', options.height);
    waveSvg.classList.add('square-wave');
    container.appendChild(waveSvg);

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    let d = `M0 ${options.height / 2}`;
    const segmentWidth = options.width / data.length;

    for (let i = 0; i < data.length; i++) {
        const y = data[i] === 1 ? options.height * 0.1 : options.height * 0.9;
        const x = i * segmentWidth;
        d += ` L${x} ${options.height / 2} L${x} ${y}`;
    }
    d += ` L${options.width} ${options.height / 2}`;
    path.setAttribute('d', d);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', '#16c79a');
    path.setAttribute('stroke-width', 2);
    waveSvg.appendChild(path);

    if (options.labels) {
        const xLabel = document.createElement('div');
        xLabel.className = 'wave-label x-label';
        xLabel.textContent = options.labels.x;
        container.appendChild(xLabel);

        const yLabel = document.createElement('div');
        yLabel.className = 'wave-label y-label';
        yLabel.textContent = options.labels.y;
        container.appendChild(yLabel);
        yLabel.style.top = `${options.height / 2}px`;
    }
}

function addLabel(container, text, leftOffset) {
    const existingLabel = container.querySelector('.bit-label');
    if (existingLabel) existingLabel.remove();
    const label = document.createElement('div');
    label.className = 'bit-label';
    label.textContent = text;
    label.style.top = '-30px';
    label.style.left = `${leftOffset}px`;
    container.appendChild(label);
}

// Problem 1: DMA Controller Statements
function initDmaStatementsAnimation() {
    const optionsBits = document.getElementById('dma-statements-options');
    const steps = document.getElementById('dma-statements-steps');
    const animateBtn = document.getElementById('dma-statements-animate-btn');
    const stepsBtn = document.getElementById('dma-statements-steps-btn');
    const resetBtn = document.getElementById('dma-statements-reset-btn');

    optionsBits.innerHTML = `
        <div class="dma-highway">
            <div class="lane" id="processor-lane">Processor</div>
            <div class="lane" id="dma-lane">DMA</div>
            <div class="peripheral" id="peripheral">Periph</div>
            <div class="memory" id="memory">Mem</div>
            <div class="data-car" id="data-car-1"></div>
            <div class="data-car" id="data-car-2"></div>
        </div>
        <div class="options-lane">
            <span class="bit low option-a">a</span>
            <span class="bit low option-b">b</span>
            <span class="bit low option-c">c</span>
            <span class="bit low option-d">d</span>
            <span class="bit low option-e">e</span>
        </div>
    `;

    function animate() {
        reset();
        const processorLane = document.getElementById('processor-lane');
        const dmaLane = document.getElementById('dma-lane');
        const dataCar1 = document.getElementById('data-car-1');
        const dataCar2 = document.getElementById('data-car-2');
        const optionB = document.querySelector('.option-b');
        const optionE = document.querySelector('.option-e');

        setTimeout(() => {
            processorLane.classList.add('inactive');
            dmaLane.classList.add('active');
            dataCar1.classList.add('moving');
            addLabel(optionsBits, 'DMA takes bus control', 0);
            optionB.classList.remove('low');
            optionB.classList.add('high', 'connection', 'visible');
            optionB.textContent = 'Bus Access';
        }, 500);

        setTimeout(() => {
            dmaLane.classList.add('multi-channel');
            dataCar2.classList.add('moving');
            addLabel(optionsBits, 'Multiple channels active', 0);
            optionE.classList.remove('low');
            optionE.classList.add('high', 'connection', 'visible');
            optionE.textContent = 'Multi-Channel';
        }, 2000);

        setTimeout(() => highlightSteps(steps), 3500);
    }

    function reset() {
        optionsBits.innerHTML = `
            <div class="dma-highway">
                <div class="lane" id="processor-lane">Processor</div>
                <div class="lane" id="dma-lane">DMA</div>
                <div class="peripheral" id="peripheral">Periph</div>
                <div class="memory" id="memory">Mem</div>
                <div class="data-car" id="data-car-1"></div>
                <div class="data-car" id="data-car-2"></div>
            </div>
            <div class="options-lane">
                <span class="bit low option-a">a</span>
                <span class="bit low option-b">b</span>
                <span class="bit low option-c">c</span>
                <span class="bit low option-d">d</span>
                <span class="bit low option-e">e</span>
            </div>
        `;
        steps.classList.remove('visible');
        stepsBtn.textContent = 'Show Steps';
    }

    animateBtn.addEventListener('click', animate);
    stepsBtn.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn.addEventListener('click', reset);
    reset();

    const style = document.createElement('style');
    style.textContent = `
        .dma-highway {
            position: relative;
            width: 100%;
            height: 60px;
            background: #444;
            border-radius: 10px;
        }
        .lane {
            position: absolute;
            width: 100%;
            height: 30px;
            top: 0;
            background: #666;
            text-align: center;
            line-height: 30px;
            color: #fff;
            font-size: 14px;
        }
        #processor-lane {
            background: #888;
        }
        #processor-lane.inactive {
            opacity: 0.3;
        }
        #dma-lane {
            top: 30px;
            background: #555;
        }
        #dma-lane.active {
            background: #00ff88;
        }
        #dma-lane.multi-channel {
            background: linear-gradient(to right, #00ff88 50%, #facc15 50%);
        }
        .peripheral, .memory {
            position: absolute;
            width: 40px;
            height: 40px;
            background: #facc15;
            border-radius: 5px;
            text-align: center;
            line-height: 40px;
            color: #000;
            font-size: 12px;
        }
        #peripheral { left: 10px; top: 10px; }
        #memory { right: 10px; top: 10px; }
        .data-car {
            position: absolute;
            width: 20px;
            height: 20px;
            background: #00ff88;
            border-radius: 5px;
            left: 50px;
            top: 35px;
            opacity: 0;
        }
        .data-car.moving {
            animation: moveCar 2s linear forwards;
            opacity: 1;
        }
        #data-car-2 {
            top: 35px;
            left: 50px;
            background: #ffcc00;
            animation-delay: 2s;
        }
        @keyframes moveCar {
            from { left: 50px; }
            to { left: calc(100% - 70px); }
        }
        .options-lane {
            margin-top: 70px;
            display: flex;
            justify-content: center;
            gap: 10px;
        }
    `;
    document.head.appendChild(style);
}

// Problem 2: Q4.4 Fixed Point Binary Fraction
function initQ44BinaryAnimation() {
    const binaryBits = document.getElementById('q44-binary-bits');
    const steps = document.getElementById('q44-binary-steps');
    const animateBtn = document.getElementById('q44-binary-animate-btn');
    const stepsBtn = document.getElementById('q44-binary-steps-btn');
    const resetBtn = document.getElementById('q44-binary-reset-btn');

    binaryBits.innerHTML = `
        <div class="q44-ruler">
            <div class="integer-part">
                <span class="bit-slot"></span>
                <span class="bit-slot"></span>
                <span class="bit-slot"></span>
                <span class="bit-slot"></span>
            </div>
            <div class="fraction-part">
                <span class="bit-slot" data-value="0.5"></span>
                <span class="bit-slot" data-value="0.25"></span>
                <span class="bit-slot" data-value="0.125"></span>
                <span class="bit-slot" data-value="0.0625"></span>
            </div>
        </div>
        <div class="number-line">
            <div class="line-marker" id="line-marker"></div>
        </div>
    `;

    function animate() {
        reset();
        const integerBits = document.querySelectorAll('.integer-part .bit-slot');
        const fractionBits = document.querySelectorAll('.fraction-part .bit-slot');
        const lineMarker = document.getElementById('line-marker');

        setTimeout(() => {
            integerBits.forEach(bit => {
                bit.textContent = '1';
                bit.classList.add('filled');
            });
            lineMarker.style.left = '75%';
            addLabel(binaryBits, 'Integer: 15 (1111)', 0);
        }, 500);

        setTimeout(() => {
            fractionBits[2].textContent = '1';
            fractionBits[2].classList.add('filled');
            fractionBits[3].textContent = '1';
            fractionBits[3].classList.add('filled');
            lineMarker.style.left = '76%';
            addLabel(binaryBits, 'Fraction: 0.1875 (0011)', 0);
        }, 2000);

        setTimeout(() => {
            addLabel(binaryBits, 'Q4.4: 11110011', 0);
        }, 3500);

        setTimeout(() => highlightSteps(steps), 5000);
    }

    function reset() {
        binaryBits.innerHTML = `
            <div class="q44-ruler">
                <div class="integer-part">
                    <span class="bit-slot"></span>
                    <span class="bit-slot"></span>
                    <span class="bit-slot"></span>
                    <span class="bit-slot"></span>
                </div>
                <div class="fraction-part">
                    <span class="bit-slot" data-value="0.5"></span>
                    <span class="bit-slot" data-value="0.25"></span>
                    <span class="bit-slot" data-value="0.125"></span>
                    <span class="bit-slot" data-value="0.0625"></span>
                </div>
            </div>
            <div class="number-line">
                <div class="line-marker" id="line-marker"></div>
            </div>
        `;
        steps.classList.remove('visible');
        stepsBtn.textContent = 'Show Steps';
    }

    animateBtn.addEventListener('click', animate);
    stepsBtn.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn.addEventListener('click', reset);
    reset();

    const style = document.createElement('style');
    style.textContent = `
        .q44-ruler {
            display: flex;
            width: 100%;
            max-width: 300px;
            height: 60px;
            background: #444;
            border-radius: 10px;
            margin: 0 auto;
        }
        .integer-part, .fraction-part {
            display: flex;
            width: 50%;
            height: 100%;
        }
        .bit-slot {
            flex: 1;
            border: 1px solid #555;
            text-align: center;
            line-height: 60px;
            color: #b0b0b0;
            background: #2a2a2a;
            transition: background 0.3s;
            font-size: 14px;
        }
        .bit-slot.filled {
            background: #00ff88;
            color: #000;
        }
        .fraction-part .bit-slot::after {
            content: attr(data-value);
            position: absolute;
            font-size: 10px;
            top: -20px;
            width: 40px;
            text-align: center;
            color: #b0b0b0;
        }
        .number-line {
            width: 100%;
            max-width: 300px;
            height: 20px;
            background: #666;
            margin: 10px auto;
            position: relative;
        }
        .line-marker {
            position: absolute;
            width: 4px;
            height: 20px;
            background: #facc15;
            transition: left 1s;
            left: 0;
        }
    `;
    document.head.appendChild(style);
}

// Problem 3: DAC Output (Right Aligned)
function initDacAnimation() {
    const dacBits = document.getElementById('dac-bits');
    const steps = document.getElementById('dac-steps');
    const animateBtn = document.getElementById('dac-animate-btn');
    const stepsBtn = document.getElementById('dac-steps-btn');
    const resetBtn = document.getElementById('dac-reset-btn');

    dacBits.innerHTML = `
        <div class="voltage-ladder">
            <div class="ladder-rungs"></div>
            <div class="voltage-bar" id="voltage-bar"></div>
            <div class="voltmeter" id="voltmeter">
                <div class="needle" id="voltmeter-needle"></div>
            </div>
        </div>
    `;

    function animate() {
        reset();
        const voltageBar = document.getElementById('voltage-bar');
        const voltmeterNeedle = document.getElementById('voltmeter-needle');

        setTimeout(() => {
            voltageBar.style.height = '55.7%';
            addLabel(dacBits, 'Digital Value: 2282 / 4095', 0);
        }, 500);

        setTimeout(() => {
            addLabel(dacBits, 'Vref = 3V, 2282 / 4095 = 0.557', 0);
        }, 2000);

        setTimeout(() => {
            voltageBar.classList.add('analog');
            voltmeterNeedle.style.transform = 'rotate(-45deg)';
            addLabel(dacBits, 'Output: 1.671V', 0);
        }, 3500);

        setTimeout(() => highlightSteps(steps), 5000);
    }

    function reset() {
        dacBits.innerHTML = `
            <div class="voltage-ladder">
                <div class="ladder-rungs"></div>
                <div class="voltage-bar" id="voltage-bar"></div>
                <div class="voltmeter" id="voltmeter">
                    <div class="needle" id="voltmeter-needle"></div>
                </div>
            </div>
        `;
        steps.classList.remove('visible');
        stepsBtn.textContent = 'Show Steps';
    }

    animateBtn.addEventListener('click', animate);
    stepsBtn.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn.addEventListener('click', reset);
    reset();

    const style = document.createElement('style');
    style.textContent = `
        .voltage-ladder {
            position: relative;
            width: 100px;
            height: 200px;
            background: #444;
            border-radius: 10px;
            margin: 0 auto;
        }
        .ladder-rungs {
            position: absolute;
            width: 100%;
            height: 100%;
            background: repeating-linear-gradient(#444 0%, #444 4.88%, #666 4.88%, #666 5%);
        }
        .voltage-bar {
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 0;
            background: #00ff88;
            transition: height 1s;
        }
        .voltage-bar.analog {
            background: #facc15;
            transition: background 1s;
        }
        .voltmeter {
            position: absolute;
            left: 120px;
            top: 0;
            width: 100px;
            height: 100px;
            background: #666;
            border-radius: 50%;
            border: 2px solid #555;
        }
        .needle {
            position: absolute;
            width: 4px;
            height: 40px;
            background: #ffcc00;
            bottom: 50%;
            left: 48px;
            transform-origin: bottom;
            transform: rotate(0deg);
            transition: transform 1s;
        }
    `;
    document.head.appendChild(style);
}

// Problem 4: DAC Output (Left Aligned)
function initDacLeftAlignedAnimation() {
    const dacBits = document.getElementById('dac-left-aligned-bits');
    const steps = document.getElementById('dac-left-aligned-steps');
    const animateBtn = document.getElementById('dac-left-aligned-animate-btn');
    const stepsBtn = document.getElementById('dac-left-aligned-steps-btn');
    const resetBtn = document.getElementById('dac-left-aligned-reset-btn');

    dacBits.innerHTML = `
        <div class="register-window">
            <div class="register-full" id="register-full">
                <!-- Full 16-bit register -->
                <!-- Each bit is rendered (e.g., via spans) -->
                <!-- ...existing code to display 16 bits... -->
            </div>
            <div class="dac-window" id="dac-window">
                <!-- This window will highlight the leftmost (MSB) 12 bits -->
            </div>
        </div>
        <div class="voltage-ladder" id="voltage-ladder">
            <div class="ladder-rungs"></div>
            <div class="voltage-bar" id="voltage-bar"></div>
        </div>
    `;
    const registerBits = document.getElementById('register-full');
    const binary = '0000100011101010';
    for (let i = 0; i < 16; i++) {
        registerBits.innerHTML += `<span class="bit low" style="left: ${i * 20}px; top: 0px;">${binary[i]}</span>`;
    }

    function animate() {
        reset();
        // Step 1: Show the full 16-bit input register.
        // ...existing code to show register...
        setTimeout(() => {
            // Step 2: Visually highlight the leftmost 12 bits.
            const dacWindow = document.getElementById('dac-window');
            dacWindow.classList.add('visible');
            // Add an overlay (e.g., using innerHTML or a new element) to indicate "MSB selection"
            dacWindow.innerHTML = `<div class="msb-overlay">MSBs Selected</div>`;
            // Optionally add a scale (e.g., 0 to 4095) near the voltage ladder.
        }, 800);
        setTimeout(() => {
            // Step 3: Show the corresponding DAC output.
            const voltageBar = document.getElementById('voltage-bar');
            voltageBar.style.height = '55.7%';
            // ...existing code to label voltage output...
        }, 2000);
        setTimeout(() => highlightSteps(document.getElementById('dac-left-aligned-steps')), 3500);
    }

    function reset() {
        dacBits.innerHTML = `
            <div class="register-window">
                <div class="register-full" id="register-full">
                    <!-- Full 16-bit register -->
                    <!-- Each bit is rendered (e.g., via spans) -->
                    <!-- ...existing code to display 16 bits... -->
                </div>
                <div class="dac-window" id="dac-window">
                    <!-- This window will highlight the leftmost (MSB) 12 bits -->
                </div>
            </div>
            <div class="voltage-ladder" id="voltage-ladder">
                <div class="ladder-rungs"></div>
                <div class="voltage-bar" id="voltage-bar"></div>
            </div>
        `;
        const registerBits = document.getElementById('register-full');
        for (let i = 0; i < 16; i++) {
            registerBits.innerHTML += `<span class="bit low" style="left: ${i * 20}px; top: 0px;">${binary[i]}</span>`;
        }
        steps.classList.remove('visible');
        stepsBtn.textContent = 'Show Steps';
    }

    animateBtn.addEventListener('click', animate);
    stepsBtn.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn.addEventListener('click', reset);
    reset();

    const style = document.createElement('style');
    style.textContent = `
        .register-window {
            position: relative;
            width: 320px; /* Adjusted to fit 16 bits */
            height: 60px;
            background: #444;
            border-radius: 10px;
            margin: 0 auto;
        }
        .register-bits {
            position: relative;
            width: 100%;
            height: 100%;
        }
        .dac-window {
            position: absolute;
            width: 240px; /* 12 bits width */
            height: 60px;
            border: 2px dashed #facc15;
            top: 0;
            left: 0;
            opacity: 0;
            transition: opacity 0.5s;
        }
        .dac-window.visible {
            opacity: 1;
        }
        .voltage-ladder {
            position: relative;
            width: 100px;
            height: 200px;
            background: #444;
            border-radius: 10px;
            margin: 20px auto;
        }
        .ladder-rungs {
            position: absolute;
            width: 100%;
            height: 100%;
            background: repeating-linear-gradient(#444 0%, #444 0.0488%, #666 0.0488%, #666 0.05%);
        }
        .voltage-bar {
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 0;
            background: #00ff88;
            transition: height 1s;
        }
        .voltage-bar.analog {
            background: #facc15;
            transition: background 1s;
        }
    `;
    document.head.appendChild(style);
}

// Problem 5: 1-bit DAC Maximum Error
function initDacErrorAnimation() {
    const optionsBits = document.getElementById('dac-error-options');
    const steps = document.getElementById('dac-error-steps');
    const animateBtn = document.getElementById('dac-error-animate-btn');
    const stepsBtn = document.getElementById('dac-error-steps-btn');
    const resetBtn = document.getElementById('dac-error-reset-btn');

    optionsBits.innerHTML = `
        <div class="voltage-divider">
            <div class="resistor" id="r1">R1 = 1</div>
            <div class="vout-node" id="vout-node">Vout</div>
            <div class="resistor" id="r2">R2 = 1</div>
            <div class="ground">GND</div>
            <div class="vref">Vref</div>
        </div>
        <div class="error-bar">
            <div class="error-value" id="error-value"></div>
        </div>
        <div class="options-lane">
            <span class="bit low option-a">0.01 Vref</span>
            <span class="bit low option-b">0.05 Vref</span>
            <span class="bit low option-c">0.1 Vref</span>
            <span class="bit low option-d">0.2 Vref</span>
        </div>
    `;

    function animate() {
        reset();
        const r1 = document.getElementById('r1');
        const r2 = document.getElementById('r2');
        const voutNode = document.getElementById('vout-node');
        const errorValue = document.getElementById('error-value');
        const optionB = document.querySelector('.option-b');

        setTimeout(() => {
            voutNode.textContent = 'Vout = 0.5 Vref';
            voutNode.classList.add('active');
            addLabel(optionsBits, 'Ideal: R1 = R2 = 1', 0);
        }, 500);

        setTimeout(() => {
            r1.textContent = 'R1 = 1.1';
            r2.textContent = 'R2 = 0.9';
            voutNode.textContent = 'Vout = 0.45 Vref';
            errorValue.style.width = '10%';
            addLabel(optionsBits, 'Max Error: 0.05 Vref', 0);
        }, 2000);

        setTimeout(() => {
            optionB.classList.remove('low');
            optionB.classList.add('high', 'connection', 'visible');
        }, 3500);

        setTimeout(() => highlightSteps(steps), 5000);
    }

    function reset() {
        optionsBits.innerHTML = `
            <div class="voltage-divider">
                <div class="resistor" id="r1">R1 = 1</div>
                <div class="vout-node" id="vout-node">Vout</div>
                <div class="resistor" id="r2">R2 = 1</div>
                <div class="ground">GND</div>
                <div class="vref">Vref</div>
            </div>
            <div class="error-bar">
                <div class="error-value" id="error-value"></div>
            </div>
            <div class="options-lane">
                <span class="bit low option-a">0.01 Vref</span>
                <span class="bit low option-b">0.05 Vref</span>
                <span class="bit low option-c">0.1 Vref</span>
                <span class="bit low option-d">0.2 Vref</span>
            </div>
        `;
        steps.classList.remove('visible');
        stepsBtn.textContent = 'Show Steps';
    }

    animateBtn.addEventListener('click', animate);
    stepsBtn.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn.addEventListener('click', reset);
    reset();

    const style = document.createElement('style');
    style.textContent = `
        .voltage-divider {
            position: relative;
            width: 200px;
            height: 150px;
            margin: 0 auto;
            background: #444;
            border-radius: 10px;
        }
        .resistor {
            position: absolute;
            width: 60px;
            height: 30px;
            background: #666;
            text-align: center;
            line-height: 30px;
            left: 70px;
            font-size: 14px;
        }
        #r1 { top: 20px; }
        #r2 { top: 100px; }
        .vout-node {
            position: absolute;
            left: 70px;
            top: 60px;
            width: 60px;
            height: 30px;
            background: #555;
            text-align: center;
            line-height: 30px;
            color: #b0b0b0;
            font-size: 14px;
        }
        .vout-node.active {
            background: #facc15;
            color: #000;
        }
        .ground, .vref {
            position: absolute;
            left: 70px;
            width: 60px;
            text-align: center;
            font-size: 14px;
        }
        .ground { top: 130px; }
        .vref { top: 0; }
        .error-bar {
            width: 200px;
            height: 20px;
            background: #666;
            margin: 10px auto;
            position: relative;
        }
        .error-value {
            width: 0;
            height: 100%;
            background: #ff5555;
            transition: width 1s;
        }
    `;
    document.head.appendChild(style);
}

// Problem 6: ADC Sampling Rate Statements
function initAdcSamplingRateAnimation() {
    const optionsBits = document.getElementById('adc-sampling-rate-options');
    const steps = document.getElementById('adc-sampling-rate-steps');
    const animateBtn = document.getElementById('adc-sampling-rate-animate-btn');
    const stepsBtn = document.getElementById('adc-sampling-rate-steps-btn');
    const resetBtn = document.getElementById('adc-sampling-rate-reset-btn');

    optionsBits.innerHTML = `
        <div class="sine-wave-container">
            <div class="sine-wave" id="sine-wave"></div>
            <div class="sample-points" id="sample-points"></div>
            <div class="reconstructed-wave" id="reconstructed-wave"></div>
        </div>
        <div class="options-lane">
            <span class="bit low option-a">a</span>
            <span class="bit low option-b">b</span>
            <span class="bit low option-c">c</span>
            <span class="bit low option-d">d</span>
        </div>
    `;

    function animate() {
        reset();
        const samplePoints = document.getElementById('sample-points');
        const reconstructedWave = document.getElementById('reconstructed-wave');
        const optionB = document.querySelector('.option-b');

        setTimeout(() => {
            samplePoints.classList.add('undersampled');
            reconstructedWave.classList.add('aliased');
            addLabel(optionsBits, 'Undersampling: Aliasing occurs', 0);
        }, 500);

        setTimeout(() => {
            samplePoints.classList.remove('undersampled');
            samplePoints.classList.add('nyquist');
            reconstructedWave.classList.remove('aliased');
            reconstructedWave.classList.add('correct');
            addLabel(optionsBits, 'Nyquist: 2x signal freq', 0);
            optionB.classList.remove('low');
            optionB.classList.add('high', 'connection', 'visible');
            optionB.textContent = 'Nyquist';
        }, 2000);

        setTimeout(() => highlightSteps(steps), 3500);
    }

    function reset() {
        optionsBits.innerHTML = `
            <div class="sine-wave-container">
                <div class="sine-wave" id="sine-wave"></div>
                <div class="sample-points" id="sample-points"></div>
                <div class="reconstructed-wave" id="reconstructed-wave"></div>
            </div>
            <div class="options-lane">
                <span class="bit low option-a">a</span>
                <span class="bit low option-b">b</span>
                <span class="bit low option-c">c</span>
                <span class="bit low option-d">d</span>
            </div>
        `;
        steps.classList.remove('visible');
        stepsBtn.textContent = 'Show Steps';
    }

    animateBtn.addEventListener('click', animate);
    stepsBtn.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn.addEventListener('click', reset);
    reset();

    const style = document.createElement('style');
    style.textContent = `
        .sine-wave-container {
            position: relative;
            width: 300px;
            height: 100px;
            background: #444;
            border-radius: 10px;
            margin: 0 auto;
        }
        .sine-wave {
            position: absolute;
            width: 100%;
            height: 100%;
            background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="100"><path d="M0 50 C 50 0, 100 100, 150 50 C 200 0, 250 100, 300 50" fill="none" stroke="#00ff88" stroke-width="2"/></svg>') no-repeat center;
        }
        .sample-points {
            position: absolute;
            width: 100%;
            height: 100%;
        }
        .sample-points.undersampled::before {
            content: '';
            position: absolute;
            width: 6px;
            height: 6px;
            background: #ff5555;
            border-radius: 50%;
            top: 50%;
            left: 0;
            animation: undersample 2s infinite;
        }
        .sample-points.nyquist::before {
            content: '';
            position: absolute;
            width: 6px;
            height: 6px;
            background: #facc15;
            border-radius: 50%;
            top: 50%;
            left: 0;
            animation: nyquist 2s infinite;
        }
        .sample-points.nyquist::after {
            content: '';
            position: absolute;
            width: 6px;
            height: 6px;
            background: #facc15;
            border-radius: 50%;
            top: 0;
            left: 150px;
            animation: nyquist 2s infinite;
        }
        @keyframes undersample {
            0% { left: 0; top: 50%; }
            50% { left: 300px; top: 50%; }
            100% { left: 0; top: 50%; }
        }
        @keyframes nyquist {
            0% { left: 0; top: 50%; }
            50% { left: 150px; top: 0; }
            100% { left: 300px; top: 50%; }
        }
        .reconstructed-wave {
            position: absolute;
            width: 100%;
            height: 100%;
        }
        .reconstructed-wave.aliased {
            background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="100"><path d="M0 50 L 300 50" fill="none" stroke="#ff5555" stroke-width="2"/></svg>') no-repeat center;
        }
        .reconstructed-wave.correct {
            background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="100"><path d="M0 50 C 50 0, 100 100, 150 50 C 200 0, 250 100, 300 50" fill="none" stroke="#facc15" stroke-width="2"/></svg>') no-repeat center;
        }
    `;
    document.head.appendChild(style);
}

// Problem 7: ADC Total Cycles
function initAdcCyclesAnimation() {
    const cyclesBits = document.getElementById('adc-cycles');
    const steps = document.getElementById('adc-cycles-steps');
    const animateBtn = document.getElementById('adc-cycles-animate-btn');
    const stepsBtn = document.getElementById('adc-cycles-steps-btn');
    const resetBtn = document.getElementById('adc-cycles-reset-btn');

    cyclesBits.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        cyclesBits.innerHTML += `<span class="bit low" style="left: ${i * 60}px; top: 0px;">0</span>`;
    }

    function animate() {
        reset();
        const stages = [
            { value: '10', delay: 500, label: 'Sampling Cycles' },
            { value: '12', delay: 1500, label: 'Conversion Cycles' },
            { value: '22', delay: 2500, label: 'Total Cycles' }
        ];

        stages.forEach((stage, i) => {
            setTimeout(() => {
                const bit = cyclesBits.children[i];
                bit.textContent = stage.value;
                bit.classList.remove('low');
                bit.classList.add('high', 'connection');
                setTimeout(() => bit.classList.add('visible'), 100);
                addLabel(bit, stage.label, '-30px');
            }, stage.delay);
        });

        setTimeout(() => highlightSteps(steps), 3500);
    }

    function reset() {
        cyclesBits.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            cyclesBits.innerHTML += `<span class="bit low" style="left: ${i * 60}px; top: 0px;">0</span>`;
        }
        steps.classList.remove('visible');
        stepsBtn.textContent = 'Show Steps';
    }

    animateBtn.addEventListener('click', animate);
    stepsBtn.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn.addEventListener('click', reset);
    reset();
}

// Problem 8: ADC Maximum Quantization Error
function initAdcQuantizationErrorAnimation() {
    const optionsBits = document.getElementById('adc-quantization-error-options');
    const steps = document.getElementById('adc-quantization-error-steps');
    const animateBtn = document.getElementById('adc-quantization-error-animate-btn');
    const stepsBtn = document.getElementById('adc-quantization-error-steps-btn');
    const resetBtn = document.getElementById('adc-quantization-error-reset-btn');

    optionsBits.innerHTML = `
        <div class="quantization-staircase">
            <div class="staircase-levels" id="staircase-levels"></div>
            <div class="analog-input-line" id="analog-input-line"></div>
            <div class="quantized-output-line" id="quantized-output-line">
                <div class="output-label">Quantized Level</div>
            </div>
            <div class="error-arrow" id="error-arrow">
                <div class="error-label">Max Error<br>0.5 LSB</div>
            </div>
            <div class="error-value-text" id="error-value-text"></div>
        </div>
        <div class="options-lane">
            <span class="bit low option-a">0.73 mV</span>
            <span class="bit low option-b">1.47 mV</span>
            <span class="bit low option-c">0.61 mV</span>
            <span class="bit low option-d">0.25 mV</span>
        </div>
    `;

    const staircaseLevels = document.getElementById('staircase-levels');
    for (let i = 0; i < 16; i++) {
        const step = document.createElement('div');
        step.className = 'stair-step';
        step.style.top = `${(i * 100) / 16}%`;
        staircaseLevels.appendChild(step);
    }

    function animate() {
        reset();
        const analogInputLine = document.getElementById('analog-input-line');
        const quantizedOutputLine = document.getElementById('quantized-output-line');
        const errorArrow = document.getElementById('error-arrow');
        const errorValueText = document.getElementById('error-value-text');
        const optionA = document.querySelector('.option-a');

        setTimeout(() => {
            analogInputLine.style.top = '35%';
            quantizedOutputLine.style.top = '37.5%';
            errorArrow.style.top = '35%';
            errorArrow.style.bottom = '37.5%';
            errorValueText.textContent = '';
            addLabel(optionsBits, 'Analog Input', 0);
        }, 500);

        setTimeout(() => {
            errorValueText.textContent = 'Max Error ≈ 0.73 mV';
            errorArrow.classList.add('error');
            quantizedOutputLine.classList.add('quantized');
            analogInputLine.classList.add('analog');
            addLabel(optionsBits, 'Quantized Level', 0);
        }, 2000);

        setTimeout(() => {
            optionA.classList.remove('low');
            optionA.classList.add('high', 'connection', 'visible');
        }, 3500);

        setTimeout(() => highlightSteps(steps), 5000);
    }

    function reset() {
        optionsBits.innerHTML = `
            <div class="quantization-staircase">
                <div class="staircase-levels" id="staircase-levels"></div>
                <div class="analog-input-line" id="analog-input-line"></div>
                <div class="quantized-output-line" id="quantized-output-line">
                    <div class="output-label">Quantized Level</div>
                </div>
                <div class="error-arrow" id="error-arrow">
                    <div class="error-label">Max Error<br>0.5 LSB</div>
                </div>
                <div class="error-value-text" id="error-value-text"></div>
            </div>
            <div class="options-lane">
                <span class="bit low option-a">0.73 mV</span>
                <span class="bit low option-b">1.47 mV</span>
                <span class="bit low option-c">0.61 mV</span>
                <span class="bit low option-d">0.25 mV</span>
            </div>
        `;
        const staircaseLevels = document.getElementById('staircase-levels');
        staircaseLevels.innerHTML = '';
        for (let i = 0; i < 16; i++) {
            const step = document.createElement('div');
            step.className = 'stair-step';
            step.style.top = `${(i * 100) / 16}%`;
            staircaseLevels.appendChild(step);
        }
        steps.classList.remove('visible');
        stepsBtn.textContent = 'Show Steps';
    }

    animateBtn.addEventListener('click', animate);
    stepsBtn.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn.addEventListener('click', reset);
    reset();
}

// Problem 9: ADC Bits of Resolution
function initAdcResolutionBitsAnimation() {
    const bitsBits = document.getElementById('adc-resolution-bits');
    const steps = document.getElementById('adc-resolution-bits-steps');
    const animateBtn = document.getElementById('adc-resolution-bits-animate-btn');
    const stepsBtn = document.getElementById('adc-resolution-bits-steps-btn');
    const resetBtn = document.getElementById('adc-resolution-bits-reset-btn');

    bitsBits.innerHTML = `
        <div class="zoom-lens">
            <div class="range-line" id="range-line"></div>
            <div class="zoom-window" id="zoom-window"></div>
            <div class="bits-counter" id="bits-counter">0</div>
        </div>
    `;

    function animate() {
        reset();
        const zoomWindow = document.getElementById('zoom-window');
        const bitsCounter = document.getElementById('bits-counter');

        setTimeout(() => {
            zoomWindow.style.width = '300px';
            addLabel(bitsBits, 'Range: 6V', 0);
        }, 500);

        setTimeout(() => {
            zoomWindow.style.width = '10px';
            zoomWindow.style.background = 'repeating-linear-gradient(90deg, #666 0%, #666 0.0167%, #444 0.0167%, #444 0.0333%)';
            addLabel(bitsBits, 'Resolution: 1µV (6V / 1µV = 6M steps)', 0);
        }, 2000);

        setTimeout(() => {
            let bits = 0;
            const interval = setInterval(() => {
                bits++;
                bitsCounter.textContent = bits;
                if (bits >= 23) clearInterval(interval);
            }, 100);
            addLabel(bitsBits, '23 bits needed', 0);
        }, 3500);

        setTimeout(() => highlightSteps(steps), 6000);
    }

    function reset() {
        bitsBits.innerHTML = `
            <div class="zoom-lens">
                <div class="range-line" id="range-line"></div>
                <div class="zoom-window" id="zoom-window"></div>
                <div class="bits-counter" id="bits-counter">0</div>
            </div>
        `;
        steps.classList.remove('visible');
        stepsBtn.textContent = 'Show Steps';
    }

    animateBtn.addEventListener('click', animate);
    stepsBtn.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn.addEventListener('click', reset);
    reset();

    const style = document.createElement('style');
    style.textContent = `
        .zoom-lens {
            position: relative;
            width: 300px;
            height: 60px;
            background: #444;
            border-radius: 10px;
            margin: 0 auto;
        }
        .range-line {
            position: absolute;
            width: 100%;
            height: 10px;
            background: #666;
            top: 25px;
        }
        .zoom-window {
            position: absolute;
            width: 300px;
            height: 60px;
            top: 0;
            left: 0;
            background: transparent;
            transition: width 1s;
        }
        .bits-counter {
            position: absolute;
            top: 70px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 20px;
            color: #00ff88;
        }
    `;
    document.head.appendChild(style);
}

// Problem 10: ADC Guess After 6 Cycles
function initAdcGuessAnimation() {
    const guessBits = document.getElementById('adc-guess');
    const steps = document.getElementById('adc-guess-steps');
    const animateBtn = document.getElementById('adc-guess-animate-btn');
    const stepsBtn = document.getElementById('adc-guess-steps-btn');
    const resetBtn = document.getElementById('adc-guess-reset-btn');

    guessBits.innerHTML = `
        <div class="sar-container">
            <div class="sar-bits" id="sar-bits"></div>
            <div class="voltage-bar" id="voltage-bar"></div>
        </div>
    `;
    const sarBits = document.getElementById('sar-bits');
    for (let i = 0; i < 4; i++) {
        sarBits.innerHTML += `<span class="bit low" style="left: ${i * 50}px; top: 0px;">0</span>`;
    }

    function animate() {
        reset();
        const sarBitsChildren = document.querySelectorAll('#sar-bits .bit');
        const voltageBar = document.getElementById('voltage-bar');
        const vin = 8.225;
        const vref = 10;
        const stepsData = [
            { bits: '1000', voltage: 5.0, delay: 500 },
            { bits: '1100', voltage: 7.5, delay: 1000 },
            { bits: '1110', voltage: 8.75, delay: 1500 },
            { bits: '1101', voltage: 8.125, delay: 2000 }
        ];

        setTimeout(() => {
            addLabel(guessBits, `Vin = ${vin}V, Vref = ${vref}V`, 0);
            voltageBar.style.height = '82.25%';
            voltageBar.classList.add('vin');
        }, 0);

        stepsData.forEach((step, i) => {
            setTimeout(() => {
                step.bits.split('').forEach((bitVal, j) => {
                    const bit = sarBitsChildren[j];
                    bit.textContent = bitVal;
                    bit.classList.remove('low');
                    bit.classList.add('high');
                    if (bitVal === '1') {
                        bit.classList.add('connection');
                        setTimeout(() => bit.classList.add('visible'), 100);
                    }
                });
                voltageBar.style.height = `${(step.voltage / vref) * 100}%`;
                voltageBar.classList.remove('vin');
                addLabel(guessBits, `Guess ${i + 1}: ${step.voltage}V`, '-60px');
            }, step.delay);
        });

        setTimeout(() => highlightSteps(steps), 3000);
    }

    function reset() {
        guessBits.innerHTML = `
            <div class="sar-container">
                <div class="sar-bits" id="sar-bits"></div>
                <div class="voltage-bar" id="voltage-bar"></div>
            </div>
        `;
        const sarBits = document.getElementById('sar-bits');
        for (let i = 0; i < 4; i++) {
            sarBits.innerHTML += `<span class="bit low" style="left: ${i * 50}px; top: 0px;">0</span>`;
        }
        steps.classList.remove('visible');
        stepsBtn.textContent = 'Show Steps';
    }

    animateBtn.addEventListener('click', animate);
    stepsBtn.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn.addEventListener('click', reset);
    reset();

    const style = document.createElement('style');
    style.textContent = `
        .sar-container {
            position: relative;
            width: 300px;
            height: 200px;
            margin: 0 auto;
        }
        .sar-bits {
            position: absolute;
            top: 0;
            left: 0;
            width: 200px;
            height: 60px;
        }
        .voltage-bar {
            position: absolute;
            left: 220px;
            bottom: 0;
            width: 30px;
            height: 0;
            background: #facc15;
            transition: height 0.5s;
        }
        .voltage-bar.vin {
            background: #00ff88;
        }
    `;
    document.head.appendChild(style);
}

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
    initDmaStatementsAnimation();
    initQ44BinaryAnimation();
    initDacAnimation();
    initDacLeftAlignedAnimation();
    initDacErrorAnimation();
    initAdcSamplingRateAnimation();
    initAdcCyclesAnimation();
    initAdcQuantizationErrorAnimation();
    initAdcResolutionBitsAnimation();
    initAdcGuessAnimation();
});

// Back to Top Functionality
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