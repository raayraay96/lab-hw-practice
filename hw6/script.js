// script.js (Refactored)

// Utility Functions (Ensure these are at the top - or in animation-utils.js if you prefer)
// -----------------------------------
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

function resetBits(container) {
    if (!container) return;
    const bits = container.querySelectorAll('.signal-bits div');
    bits.forEach(bit => {
        bit.classList.remove('high', 'active');
        bit.classList.add('low');
    });
}

function createSignalDisplay(container, values, label) {
    container.innerHTML = `<div class="signal-label">${label}</div>`;
    const signalContainer = document.createElement('div');
    signalContainer.className = 'signal-container';

    values.forEach((item, index) => {
        const bit = document.createElement('div');
        bit.className = 'bit';
        bit.classList.add(item.value ? 'high' : 'low');

        // Add label if present
        if (item.label) {
            const bitLabel = document.createElement('div');
            bitLabel.className = 'bit-label';
            bitLabel.textContent = item.label;
            bit.appendChild(bitLabel);
        }

        signalContainer.appendChild(bit);
    });

    container.appendChild(signalContainer);
}

// --- Generic Animation Setup and Reset Functions ---
function setupAnimation(config) {
    const animateBtn = document.getElementById(config.animateBtnId);
    const stepsBtn = document.getElementById(config.stepsBtnId);
    const resetBtn = document.getElementById(config.resetBtnId);
    const steps = document.getElementById(config.stepsId);

    const containers = config.signalContainerIds.map(id => document.getElementById(id));

    animateBtn.addEventListener('click', () => config.animateFunction(containers, steps, config));
    stepsBtn.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn.addEventListener('click', () => resetAnimation(containers, steps, stepsBtn, config));

    resetAnimation(containers, steps, stepsBtn, config);
}

function resetAnimation(containers, steps, stepsBtn, config) {
    containers.forEach(container => {
        if (container) {
            container.innerHTML = '';
        }
    });
    steps.classList.remove('visible');
    stepsBtn.textContent = 'Show Steps';
    if (config.customResetFunction) {
        config.customResetFunction(containers); // Pass containers if needed in custom reset
    }
}


// Problem 1: SPI Word Size Animation (Refactored)
// -----------------------------------
function initSPIWordAnimation() {
    const wordSizeInput = document.getElementById('spi-word-size');

    function generateSignals(wordSize) {
        const nssValues = [];
        const sckValues = [];
        const mosiValues = [];

        nssValues.push({ value: 0, label: 'Idle' });
        for (let i = 0; i < wordSize; i++) {
            nssValues.push({ value: 1, label: 'Start Transfer' });
        }
        nssValues.push({ value: 0, label: 'End' });

        for (let i = 0; i < wordSize; i++) {
            sckValues.push({ value: 0, label: '' });
            sckValues.push({ value: 1, label: '' });
        }

        for (let i = 0; i < wordSize; i++) {
            const bit = Math.round(Math.random());
            mosiValues.push({ value: bit, label: '' });
            mosiValues.push({ value: bit, label: '' });
        }
        return { nssValues, sckValues, mosiValues };
    }

    function animateSPIWord(containers, steps, config) {
        resetAnimation(containers, steps, stepsBtn, config);

        const nss = containers[0];
        const sck = containers[1];
        const mosi = containers[2];
        const wordSize = parseInt(wordSizeInput.value) || 15;

        const { nssValues, sckValues, mosiValues } = generateSignals(wordSize);

        createSignalDisplay(nss, nssValues, 'NSS');
        createSignalDisplay(sck, sckValues, 'SCK');
        createSignalDisplay(mosi, mosiValues, 'MOSI');

        setTimeout(() => {
            const sckElements = sck.querySelectorAll('.bit');
            let edgeCount = 0;

            function highlightNextEdge(index) {
                if (index >= sckElements.length - 1) {
                    const countElement = document.createElement('div');
                    countElement.className = 'edge-count';
                    countElement.textContent = `Total: ${edgeCount} rising edges = ${edgeCount} bits`;
                    countElement.style.color = '#16c79a';
                    countElement.style.fontWeight = 'bold';
                    countElement.style.marginTop = '10px';
                    sck.appendChild(countElement);
                    setTimeout(() => highlightSteps(steps), 500);
                    return;
                }
                if (index > 0 && sckValues[index - 1].value === 0 && sckValues[index].value === 1) {
                    sckElements[index].classList.add('rising-edge');
                    edgeCount++;
                    const edgeLabel = document.createElement('div');
                    edgeLabel.className = 'edge-label';
                    edgeLabel.textContent = edgeCount;
                    edgeLabel.style.position = 'absolute';
                    edgeLabel.style.top = '-20px';
                    edgeLabel.style.left = '50%';
                    edgeLabel.style.transform = 'translateX(-50%)';
                    edgeLabel.style.color = '#16c79a';
                    edgeLabel.style.fontWeight = 'bold';
                    sckElements[index].appendChild(edgeLabel);
                }
                setTimeout(() => highlightNextEdge(index + 1), 300);
            }
            highlightNextEdge(0);
        }, 1000);
    }

    const animationConfig = {
        animateBtnId: 'spi-word-animate-btn',
        stepsBtnId: 'spi-word-steps-btn',
        resetBtnId: 'spi-word-reset-btn',
        stepsId: 'spi-word-steps',
        signalContainerIds: ['spi-word-nss', 'spi-word-sck', 'spi-word-mosi'],
        animateFunction: animateSPIWord,
        customResetFunction: () => {}
    };

    setupAnimation(animationConfig);
}


// Problem 2: SPI Transmitted Value (Refactored)
// -----------------------------------
function initSpiValueAnimation() {
    const mosiBits = document.getElementById('spi-value-mosi');
    const mosiPattern = '110001000010110';

    function animateSpiValue(containers, steps, config) {
        resetAnimation(containers, steps, stepsBtn, config);
        const mosiBits = containers[0];
        const mosiValue = '110001000010110';
        mosiValue.split('').forEach((bit, i) => {
            setTimeout(() => {
                mosiBits.children[i].classList.add('active');
                mosiBits.children[i].classList.toggle('high', bit === '1');
                mosiBits.children[i].classList.toggle('low', bit === '0');
                mosiBits.children[i].textContent = bit;
                if (bit === '1') {
                    mosiBits.children[i].classList.add('connection');
                    setTimeout(() => mosiBits.children[i].classList.add('visible'), 100);
                }
            }, i * 500);
        });
        setTimeout(() => highlightSteps(steps), 2500);
    }

    function customResetSpiValue(containers) {
        const mosiBits = containers[0];
        const mosiPattern = '110001000010110';
        [...mosiBits.children].forEach((bit, i) => {
            bit.classList.remove('active', 'connection', 'visible', 'high');
            bit.classList.add('low');
            bit.textContent = mosiPattern[i];
        });
    }

    const mosiBitsElem = document.getElementById('spi-value-mosi');
    mosiBitsElem.innerHTML = '';
    const mosiPatternInit = '110001000010110'; // Use a consistent variable name
    for (let i = 0; i < 15; i++) {
        mosiBitsElem.innerHTML += `<span class="bit low" style="left: ${i * 44}px;">${mosiPatternInit[i]}</span>`;
    }
    const squareWave = document.createElement('div');
    squareWave.className = 'spi-square-wave';
    squareWave.innerHTML = '<!-- square wave visualization for MOSI -->';
    mosiBitsElem.appendChild(squareWave);


    const animationConfig = {
        animateBtnId: 'spi-value-animate-btn',
        stepsBtnId: 'spi-value-steps-btn',
        resetBtnId: 'spi-value-reset-btn',
        stepsId: 'spi-value-steps',
        signalContainerIds: ['spi-value-mosi'],
        animateFunction: animateSpiValue,
        customResetFunction: customResetSpiValue
    };

    setupAnimation(animationConfig);
}

// Problem 3: UART Encoding (Refactored)
// -----------------------------------
function initUartEncodeAnimation() {
    const signalBits = document.getElementById('uart-encode-signal');

    function animateUartEncode(containers, steps, config) {
        resetAnimation(containers, steps, stepsBtn, config);
        const signalBits = containers[0];
        const signal = '0110010101';

        const waveContainer = document.querySelector('#uart-encode-section .wave-container'); // Get wave container
        const uartData = [];
        for (let i = 0; i < signal.length; i++) {
            uartData.push(signal[i] === '1' ? 1 : 0);
        }
        createSquareWave(waveContainer, uartData, {
            width: 600,
            height: 150,
            labels: { x: 'Time', y: 'UART TX' },
            animationDuration: 2000
        });

        signal.split('').forEach((bit, i) => {
            setTimeout(() => {
                signalBits.children[i].classList.add('active');
                signalBits.children[i].classList.toggle('high', bit === '1');
                signalBits.children[i].classList.toggle('low', bit === '0');
                signalBits.children[i].textContent = bit;
                if (bit === '1') {
                    signalBits.children[i].classList.add('connection');
                    setTimeout(() => signalBits.children[i].classList.add('visible'), 100);
                }
            }, i * 500);
        });
        setTimeout(() => highlightSteps(steps), 10 * 500 + 500);
    }

    function customResetUartEncode(containers) {
        const signalBits = containers[0];
        const waveContainer = document.querySelector('#uart-encode-section .wave-container');
        waveContainer.innerHTML = ''; // Clear wave container
        [...signalBits.children].forEach(bit => {
            bit.classList.remove('active', 'high', 'connection', 'visible');
            bit.classList.add('low');
            bit.textContent = '0';
        });
    }

    const signalBitsElem = document.getElementById('uart-encode-signal');
    signalBitsElem.innerHTML = '';
    for (let i = 0; i < 10; i++) {
        signalBitsElem.innerHTML += `<span class="bit low" style="left: ${i * 44}px;">0</span>`;
    }

    const waveContainer = document.createElement('div'); // Wave container setup
    waveContainer.className = 'wave-container';
    waveContainer.style.marginTop = '30px';
    document.getElementById('uart-encode-section').insertBefore(waveContainer, document.getElementById('uart-encode-steps'));

    const labelContainer = document.createElement('div'); // Labels setup
    labelContainer.className = 'uart-labels';
    labelContainer.innerHTML = `
        <div class="uart-label" style="left: 5%;">Start</div>
        <div class="uart-label" style="left: 15%;">Bit 0</div>
        <div class="uart-label" style="left: 25%;">Bit 1</div>
        <div class="uart-label" style="left: 35%;">Bit 2</div>
        <div class="uart-label" style="left: 45%;">Bit 3</div>
        <div class="uart-label" style="left: 55%;">Bit 4</div>
        <div class="uart-label" style="left: 65%;">Bit 5</div>
        <div class="uart-label" style="left: 75%;">Bit 6</div>
        <div class="uart-label" style="left: 85%;">Bit 7</div>
        <div class="uart-label" style="left: 95%;">Stop</div>
    `;
    waveContainer.appendChild(labelContainer);


    const animationConfig = {
        animateBtnId: 'uart-encode-animate-btn',
        stepsBtnId: 'uart-encode-steps-btn',
        resetBtnId: 'uart-encode-reset-btn',
        stepsId: 'uart-encode-steps',
        signalContainerIds: ['uart-encode-signal'],
        animateFunction: animateUartEncode,
        customResetFunction: customResetUartEncode
    };

    setupAnimation(animationConfig);
}

// Problem 4: UART Decoded Word (Refactored)
// -----------------------------------
function initUartWordAnimation() {
    const signalBits = document.getElementById('uart-word-signal');

    function animateUartWord(containers, steps, config) {
        resetAnimation(containers, steps, stepsBtn, config);
        const signalBits = containers[0];
        const signal = '0100100110';

        const waveContainer = document.querySelector('#uart-word-section .wave-container');
        const uartData = [];
        for (let i = 0; i < signal.length; i++) {
            uartData.push(signal[i] === '1' ? 1 : 0);
        }
        createSquareWave(waveContainer, uartData, {
            width: 600,
            height: 150,
            labels: { x: 'Time', y: 'UART RX' },
            animationDuration: 2000
        });

        signal.split('').forEach((bit, i) => {
            setTimeout(() => {
                signalBits.children[i].classList.add('active');
                signalBits.children[i].classList.toggle('high', bit === '1');
                signalBits.children[i].classList.toggle('low', bit === '0');
                signalBits.children[i].textContent = bit;
                if (bit === '1') {
                    signalBits.children[i].classList.add('connection');
                    setTimeout(() => signalBits.children[i].classList.add('visible'), 100);
                }
            }, i * 500);
        });
        setTimeout(() => highlightSteps(steps), 10 * 500 + 500);
    }

    function customResetUartWord(containers) {
        const signalBits = containers[0];
        const waveContainer = document.querySelector('#uart-word-section .wave-container');
        waveContainer.innerHTML = '';
        [...signalBits.children].forEach(bit => {
            bit.classList.remove('active', 'high', 'connection', 'visible');
            bit.classList.add('low');
            bit.textContent = '0';
        });
    }

    const signalBitsElem = document.getElementById('uart-word-signal');
    signalBitsElem.innerHTML = '';
    for (let i = 0; i < 10; i++) {
        signalBitsElem.innerHTML += `<span class="bit low" style="left: ${i * 44}px;">0</span>`;
    }

    const waveContainer = document.createElement('div');
    waveContainer.className = 'wave-container';
    waveContainer.style.marginTop = '30px';
    document.getElementById('uart-word-section').insertBefore(waveContainer, document.getElementById('uart-word-steps'));

    const labelContainer = document.createElement('div');
    labelContainer.className = 'uart-labels';
    labelContainer.innerHTML = `
        <div class="uart-label" style="left: 5%;">Start</div>
        <div class="uart-label" style="left: 15%;">Bit 0</div>
        <div class="uart-label" style="left: 25%;">Bit 1</div>
        <div class="uart-label" style="left: 35%;">Bit 2</div>
        <div class="uart-label" style="left: 45%;">Bit 3</div>
        <div class="uart-label" style="left: 55%;">Bit 4</div>
        <div class="uart-label" style="left: 65%;">Bit 5</div>
        <div class="uart-label" style="left: 75%;">Bit 6</div>
        <div class="uart-label" style="left: 85%;">Parity</div>
        <div class="uart-label" style="left: 95%;">Stop</div>
    `;
    waveContainer.appendChild(labelContainer);

    const decodedContainer = document.createElement('div');
    decodedContainer.className = 'decoded-container';
    decodedContainer.innerHTML = `
        <div class="decoded-value">
            <span class="decoded-label">Data Bits (flipped):</span>
            <span class="decoded-bits">0010011</span>
        </div>
        <div class="decoded-value">
            <span class="decoded-label">ASCII Value:</span>
            <span class="decoded-bits">1100100 (0x64 = 'd')</span>
        </div>
    `;
    waveContainer.appendChild(decodedContainer);


    const animationConfig = {
        animateBtnId: 'uart-word-animate-btn',
        stepsBtnId: 'uart-word-steps-btn',
        resetBtnId: 'uart-word-reset-btn',
        stepsId: 'uart-word-steps',
        signalContainerIds: ['uart-word-signal'],
        animateFunction: animateUartWord,
        customResetFunction: customResetUartWord
    };

    setupAnimation(animationConfig);
}

// Problem 5: Odd Parity (Refactored)
// -----------------------------------
function initParityAnimation() {
    const dataBits = document.getElementById('parity-data');

    function animateParity(containers, steps, config) {
        resetAnimation(containers, steps, stepsBtn, config);
        const dataBits = containers[0];
        const signal = '0101010111';

        const waveContainer = document.querySelector('#parity-section .wave-container');
        const uartData = [];
        for (let i = 0; i < signal.length; i++) {
            uartData.push(signal[i] === '1' ? 1 : 0);
        }
        createSquareWave(waveContainer, uartData, {
            width: 600,
            height: 150,
            labels: { x: 'Time', y: 'UART Signal' },
            animationDuration: 2000
        });

        signal.split('').forEach((bit, i) => {
            setTimeout(() => {
                dataBits.children[i].classList.add('active');
                dataBits.children[i].classList.toggle('high', bit === '1');
                dataBits.children[i].classList.toggle('low', bit === '0');
                dataBits.children[i].textContent = bit;
                if (bit === '1') {
                    dataBits.children[i].classList.add('connection');
                    setTimeout(() => dataBits.children[i].classList.add('visible'), 100);
                }
            }, i * 500);
        });
        setTimeout(() => highlightSteps(steps), 10 * 500 + 500);
    }

    function customResetParity(containers) {
        const dataBits = containers[0];
        const waveContainer = document.querySelector('#parity-section .wave-container');
        waveContainer.innerHTML = '';
        [...dataBits.children].forEach(bit => {
            bit.classList.remove('active', 'high', 'connection', 'visible');
            bit.classList.add('low');
            bit.textContent = '0';
        });
    }

    const dataBitsElem = document.getElementById('parity-data');
    dataBitsElem.innerHTML = '';
    for (let i = 0; i < 10; i++) {
        dataBitsElem.innerHTML += `<span class="bit low" style="left: ${i * 44}px;">0</span>`;
    }

    const waveContainer = document.createElement('div');
    waveContainer.className = 'wave-container';
    waveContainer.style.marginTop = '30px';
    document.getElementById('parity-section').insertBefore(waveContainer, document.getElementById('parity-steps'));

    const labelContainer = document.createElement('div');
    labelContainer.className = 'uart-labels';
    labelContainer.innerHTML = `
        <div class="uart-label" style="left: 5%;">Start</div>
        <div class="uart-label" style="left: 15%;">Bit 0</div>
        <div class="uart-label" style="left: 25%;">Bit 1</div>
        <div class="uart-label" style="left: 35%;">Bit 2</div>
        <div class="uart-label" style="left: 45%;">Bit 3</div>
        <div class="uart-label" style="left: 55%;">Bit 4</div>
        <div class="uart-label" style="left: 65%;">Bit 5</div>
        <div class="uart-label" style="left: 75%;">Bit 6</div>
        <div class="uart-label" style="left: 85%;">Bit 7</div>
        <div class="uart-label" style="left: 95%;">Parity</div>
    `;
    waveContainer.appendChild(labelContainer);

    const parityContainer = document.createElement('div');
    parityContainer.className = 'parity-container';
    parityContainer.innerHTML = `
        <div class="parity-title">Odd Parity Explanation</div>
        <div class="parity-row">
            <span class="parity-label">Data Bits:</span>
            <span class="parity-bits">10101010</span>
            <span class="parity-count">(4 ones)</span>
        </div>
        <div class="parity-row">
            <span class="parity-label">Parity Bit:</span>
            <span class="parity-bits highlight">1</span>
            <span class="parity-count">(to make total odd)</span>
        </div>
        <div class="parity-row">
            <span class="parity-label">Total 1's:</span>
            <span class="parity-total">5</span>
            <span class="parity-count">(odd number ✓)</span>
        </div>
    `;
    waveContainer.appendChild(parityContainer);


    const animationConfig = {
        animateBtnId: 'parity-animate-btn',
        stepsBtnId: 'parity-steps-btn',
        resetBtnId: 'parity-reset-btn',
        stepsId: 'parity-steps',
        signalContainerIds: ['parity-data'],
        animateFunction: animateParity,
        customResetFunction: customResetParity
    };

    setupAnimation(animationConfig);
}

// Problem 6: Words per Second (Refactored)
// -----------------------------------
function initBaudWordsAnimation() {
    const frameBits = document.getElementById('baud-words-frame');

    function animateBaudWords(containers, steps, config) {
        resetAnimation(containers, steps, stepsBtn, config);
        const frameBits = containers[0];
        const signal = '0110010101';

        const waveContainer = document.querySelector('#baud-words-section .wave-container');
        const uartData = [];
        for (let i = 0; i < signal.length; i++) {
            uartData.push(signal[i] === '1' ? 1 : 0);
        }
        createSquareWave(waveContainer, uartData, {
            width: 600,
            height: 150,
            labels: { x: 'Time', y: 'UART Frame' },
            animationDuration: 2000
        });

        signal.split('').forEach((bit, i) => {
            setTimeout(() => {
                frameBits.children[i].classList.add('active');
                frameBits.children[i].classList.toggle('high', bit === '1');
                frameBits.children[i].classList.toggle('low', bit === '0');
                frameBits.children[i].textContent = bit;
                if (bit === '1') {
                    frameBits.children[i].classList.add('connection');
                    setTimeout(() => frameBits.children[i].classList.add('visible'), 100);
                }
            }, i * 500);
        });
        setTimeout(() => highlightSteps(steps), 10 * 500 + 500);
    }

    function customResetBaudWords(containers) {
        const frameBits = containers[0];
        const waveContainer = document.querySelector('#baud-words-section .wave-container');
        waveContainer.innerHTML = '';
        [...frameBits.children].forEach(bit => {
            bit.classList.remove('active', 'high', 'connection', 'visible');
            bit.classList.add('low');
            bit.textContent = '0';
        });
    }

    const frameBitsElem = document.getElementById('baud-words-frame');
    frameBitsElem.innerHTML = '';
    for (let i = 0; i < 10; i++) {
        frameBitsElem.innerHTML += `<span class="bit low" style="left: ${i * 44}px;">0</span>`;
    }

    const waveContainer = document.createElement('div');
    waveContainer.className = 'wave-container';
    waveContainer.style.marginTop = '30px';
    document.getElementById('baud-words-section').insertBefore(waveContainer, document.getElementById('baud-words-steps'));

    const labelContainer = document.createElement('div');
    labelContainer.className = 'uart-labels';
    labelContainer.innerHTML = `
        <div class="uart-label" style="left: 5%;">Start</div>
        <div class="uart-label" style="left: 15%;">Bit 0</div>
        <div class="uart-label" style="left: 25%;">Bit 1</div>
        <div class="uart-label" style="left: 35%;">Bit 2</div>
        <div class="uart-label" style="left: 45%;">Bit 3</div>
        <div class="uart-label" style="left: 55%;">Bit 4</div>
        <div class="uart-label" style="left: 65%;">Bit 5</div>
        <div class="uart-label" style="left: 75%;">Bit 6</div>
        <div class="uart-label" style="left: 85%;">Bit 7</div>
        <div class="uart-label" style="left: 95%;">Stop</div>
    `;
    waveContainer.appendChild(labelContainer);

    const baudContainer = document.createElement('div');
    baudContainer.className = 'baud-container';
    baudContainer.innerHTML = `
        <div class="baud-title">Baud Rate to Words/Second Calculation</div>
        <div class="baud-row">
            <span class="baud-label">Baud Rate:</span>
            <span class="baud-value">13,540 bits/second</span>
        </div>
        <div class="baud-row">
            <span class="baud-label">Frame Size:</span>
            <span class="baud-value">10 bits (1 start + 8 data + 1 stop)</span>
        </div>
        <div class="baud-row calculation">
            <span class="baud-label">Words/Second:</span>
            <span class="baud-formula">13,540 ÷ 10 = 1,354 words/second</span>
        </div>
    `;
    waveContainer.appendChild(baudContainer);


    const animationConfig = {
        animateBtnId: 'baud-words-animate-btn',
        stepsBtnId: 'baud-words-steps-btn',
        resetBtnId: 'baud-words-reset-btn',
        stepsId: 'baud-words-steps',
        signalContainerIds: ['baud-words-frame'],
        animateFunction: animateBaudWords,
        customResetFunction: customResetBaudWords
    };

    setupAnimation(animationConfig);
}

// Problem 7: UART Baud Rate (Refactored)
// -----------------------------------
function initBaudRateAnimation() {
    const signalBits = document.getElementById('baud-rate-signal');

    function animateBaudRate(containers, steps, config) {
        resetAnimation(containers, steps, stepsBtn, config);
        const signalBits = containers[0];
        const signal = '0110010101';

        const waveContainer = document.querySelector('#baud-rate-section .wave-container');
        const uartData = [];
        for (let i = 0; i < signal.length; i++) {
            uartData.push(signal[i] === '1' ? 1 : 0);
        }
        createSquareWave(waveContainer, uartData, {
            width: 600,
            height: 150,
            labels: { x: 'Time (ms)', y: 'UART Signal' },
            animationDuration: 2000
        });

        signal.split('').forEach((bit, i) => {
            setTimeout(() => {
                signalBits.children[i].classList.add('active');
                signalBits.children[i].classList.toggle('high', bit === '1');
                signalBits.children[i].classList.toggle('low', bit === '0');
                signalBits.children[i].textContent = bit;
                if (bit === '1') {
                    signalBits.children[i].classList.add('connection');
                    setTimeout(() => signalBits.children[i].classList.add('visible'), 100);
                }
            }, i * 500);
        });
        setTimeout(() => highlightSteps(steps), 10 * 500 + 500);
    }

    function customResetBaudRate(containers) {
        const signalBits = containers[0];
        const waveContainer = document.querySelector('#baud-rate-section .wave-container');
        waveContainer.innerHTML = '';
        [...signalBits.children].forEach(bit => {
            bit.classList.remove('active', 'high', 'connection', 'visible');
            bit.classList.add('low');
            bit.textContent = '0';
        });
    }

    const signalBitsElem = document.getElementById('baud-rate-signal');
    signalBitsElem.innerHTML = '';
    for (let i = 0; i < 10; i++) {
        signalBitsElem.innerHTML += `<span class="bit low" style="left: ${i * 44}px;">0</span>`;
    }

    const waveContainer = document.createElement('div');
    waveContainer.className = 'wave-container';
    waveContainer.style.marginTop = '30px';
    document.getElementById('baud-rate-section').insertBefore(waveContainer, document.getElementById('baud-rate-steps'));

    const timeContainer = document.createElement('div');
    timeContainer.className = 'time-markers';
    timeContainer.innerHTML = `
        <div class="time-marker start">0 ms</div>
        <div class="time-marker end">50 ms</div>
        <div class="time-duration">10 bits in 50 ms</div>
    `;
    waveContainer.appendChild(timeContainer);

    const baudContainer = document.createElement('div');
    baudContainer.className = 'baud-container';
    baudContainer.innerHTML = `
        <div class="baud-title">Baud Rate Calculation</div>
        <div class="baud-row">
            <span class="baud-label">Frame Size:</span>
            <span class="baud-value">10 bits</span>
        </div>
        <div class="baud-row">
            <span class="baud-label">Time Period:</span>
            <span class="baud-value">50 ms = 0.05 seconds</span>
        </div>
        <div class="baud-row calculation">
            <span class="baud-label">Baud Rate:</span>
            <span class="baud-formula">10 bits ÷ 0.05 seconds = 200 bits/second</span>
        </div>
    `;
    waveContainer.appendChild(baudContainer);


    const animationConfig = {
        animateBtnId: 'baud-rate-animate-btn',
        stepsBtnId: 'baud-rate-steps-btn',
        resetBtnId: 'baud-rate-reset-btn',
        stepsId: 'baud-rate-steps',
        signalContainerIds: ['baud-rate-signal'],
        animateFunction: animateBaudRate,
        customResetFunction: customResetBaudRate
    };

    setupAnimation(animationConfig);
}

// Problem 8: Parity Error (Refactored)
// -----------------------------------
function initParityErrorAnimation() {
    const signalBits = document.getElementById('parity-error-signal');

    function animateParityError(containers, steps, config) {
        resetAnimation(containers, steps, stepsBtn, config);
        const signalBits = containers[0];
        const signal = '0101010101';

        const waveContainer = document.querySelector('#parity-error-section .wave-container');
        const uartData = [];
        for (let i = 0; i < signal.length; i++) {
            uartData.push(signal[i] === '1' ? 1 : 0);
        }
        createSquareWave(waveContainer, uartData, {
            width: 600,
            height: 150,
            labels: { x: 'Time', y: 'UART Signal' },
            animationDuration: 2000
        });

        signal.split('').forEach((bit, i) => {
            setTimeout(() => {
                signalBits.children[i].classList.add('active');
                signalBits.children[i].classList.toggle('high', bit === '1');
                signalBits.children[i].classList.toggle('low', bit === '0');
                signalBits.children[i].textContent = bit;
                if (bit === '1') {
                    signalBits.children[i].classList.add('connection');
                    setTimeout(() => signalBits.children[i].classList.add('visible'), 100);
                }
                if (i === 9) {
                    signalBits.children[i].classList.add('error-bit');
                }
            }, i * 500);
        });
        setTimeout(() => highlightSteps(steps), 10 * 500 + 500);
    }

    function customResetParityError(containers) {
        const signalBits = containers[0];
        const waveContainer = document.querySelector('#parity-error-section .wave-container');
        waveContainer.innerHTML = '';
        [...signalBits.children].forEach(bit => {
            bit.classList.remove('active', 'high', 'connection', 'visible', 'error-bit');
            bit.classList.add('low');
            bit.textContent = '0';
        });
    }

    const signalBitsElem = document.getElementById('parity-error-signal');
    signalBitsElem.innerHTML = '';
    for (let i = 0; i < 10; i++) {
        signalBitsElem.innerHTML += `<span class="bit low" style="left: ${i * 44}px;">0</span>`;
    }

    const waveContainer = document.createElement('div');
    waveContainer.className = 'wave-container';
    waveContainer.style.marginTop = '30px';
    document.getElementById('parity-error-section').insertBefore(waveContainer, document.getElementById('parity-error-steps'));

    const labelContainer = document.createElement('div');
    labelContainer.className = 'uart-labels';
    labelContainer.innerHTML = `
        <div class="uart-label" style="left: 5%;">Start</div>
        <div class="uart-label" style="left: 15%;">Bit 0</div>
        <div class="uart-label" style="left: 25%;">Bit 1</div>
        <div class="uart-label" style="left: 35%;">Bit 2</div>
        <div class="uart-label" style="left: 45%;">Bit 3</div>
        <div class="uart-label" style="left: 55%;">Bit 4</div>
        <div class="uart-label" style="left: 65%;">Bit 5</div>
        <div class="uart-label" style="left: 75%;">Bit 6</div>
        <div class="uart-label error" style="left: 85%;">Parity</div>
        <div class="uart-label" style="left: 95%;">Stop</div>
    `;
    waveContainer.appendChild(labelContainer);

    const parityContainer = document.createElement('div');
    parityContainer.className = 'parity-container error';
    parityContainer.innerHTML = `
        <div class="parity-title">Parity Error Detection</div>
        <div class="parity-row">
            <span class="parity-label">Data Bits:</span>
            <span class="parity-bits">10101010</span>
            <span class="parity-count">(4 ones)</span>
        </div>
        <div class="parity-row">
            <span class="parity-label">Parity Bit:</span>
            <span class="parity-bits error">0</span>
            <span class="parity-count error">(should be 1 for odd parity)</span>
        </div>
        <div class="parity-row">
            <span class="parity-label">Total 1's:</span>
            <span class="parity-total">4</span>
            <span class="parity-count error">(even number ✗)</span>
        </div>
        <div class="parity-result">
            <span class="error-icon">⚠️</span> Parity Error Detected: Expected odd number of 1's
        </div>
    `;
    waveContainer.appendChild(parityContainer);


    const animationConfig = {
        animateBtnId: 'parity-error-animate-btn',
        stepsBtnId: 'parity-error-steps-btn',
        resetBtnId: 'parity-error-reset-btn',
        stepsId: 'parity-error-steps',
        signalContainerIds: ['parity-error-signal'],
        animateFunction: animateParityError,
        customResetFunction: customResetParityError
    };

    setupAnimation(animationConfig);
}

// Problem 9: I2C Open-Drain (Refactored)
// -----------------------------------
function initI2cConfigAnimation() {
    const sdaBits = document.getElementById('i2c-config-sda');

    function animateI2cConfig(containers, steps, config) {
        resetAnimation(containers, steps, stepsBtn, config);
        const sdaBits = containers[0];
        const stages = ['1', '1', '0', '0', '0'];
        stages.forEach((bit, i) => {
            setTimeout(() => {
                sdaBits.children[i].classList.add('active');
                sdaBits.children[i].classList.toggle('high', bit === '1');
                sdaBits.children[i].classList.toggle('low', bit === '0');
                sdaBits.children[i].textContent = bit;
                if (bit === '0') {
                    sdaBits.children[i].classList.add('connection');
                    setTimeout(() => sdaBits.children[i].classList.add('visible'), 100);
                }
            }, i * 500);
        });
        setTimeout(() => highlightSteps(steps), 5 * 500 + 500);
    }

    function customResetI2cConfig(containers) {
        const sdaBits = containers[0];
        [...sdaBits.children].forEach(bit => {
            bit.classList.remove('active', 'high', 'connection', 'visible');
            bit.classList.add('low');
            bit.textContent = '1';
        });
    }

    const sdaBitsElem = document.getElementById('i2c-config-sda');
    sdaBitsElem.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        sdaBitsElem.innerHTML += `<span class="bit low" style="left: ${i * 44}px;">1</span>`;
    }


    const animationConfig = {
        animateBtnId: 'i2c-config-animate-btn',
        stepsBtnId: 'i2c-config-steps-btn',
        resetBtnId: 'i2c-config-reset-btn',
        stepsId: 'i2c-config-steps',
        signalContainerIds: ['i2c-config-sda'],
        animateFunction: animateI2cConfig,
        customResetFunction: customResetI2cConfig
    };

    setupAnimation(animationConfig);
}

// Problem 10: I2C vs SPI (Refactored)
// -----------------------------------
function initI2cSpiAnimation() {
    const spiBits = document.getElementById('i2c-spi-spi');
    const i2cBits = document.getElementById('i2c-spi-i2c');

    function animateI2cSpi(containers, steps, config) {
        resetAnimation(containers, steps, stepsBtn, config);
        const spiBits = containers[0];
        const i2cBits = containers[1];
        const spiSignal = '10101';
        const i2cSignal = '11001';
        spiSignal.split('').forEach((bit, i) => {
            setTimeout(() => {
                spiBits.children[i].classList.add('active');
                spiBits.children[i].classList.toggle('high', bit === '1');
                spiBits.children[i].classList.toggle('low', bit === '0');
                spiBits.children[i].textContent = bit;
                i2cBits.children[i].classList.add('active');
                i2cBits.children[i].classList.toggle('high', i2cSignal[i] === '1');
                i2cBits.children[i].classList.toggle('low', i2cSignal[i] === '0');
                i2cBits.children[i].textContent = i2cSignal[i];
                if (bit === '1') {
                    spiBits.children[i].classList.add('connection');
                    setTimeout(() => spiBits.children[i].classList.add('visible'), 100);
                }
            }, i * 500);
        });
        setTimeout(() => highlightSteps(steps), 5 * 500 + 500);
    }

    function customResetI2cSpi(containers) {
        const spiBits = containers[0];
        const i2cBits = containers[1];
        [...spiBits.children, ...i2cBits.children].forEach(bit => {
            bit.classList.remove('active', 'high', 'connection', 'visible');
            bit.classList.add('low');
            bit.textContent = '0';
        });
    }

    const spiBitsElem = document.getElementById('i2c-spi-spi');
    const i2cBitsElem = document.getElementById('i2c-spi-i2c');
    spiBitsElem.innerHTML = '';
    i2cBitsElem.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        spiBitsElem.innerHTML += `<span class="bit low" style="left: ${i * 44}px;">0</span>`;
        i2cBitsElem.innerHTML += `<span class="bit low" style="left: ${i * 44}px;">0</span>`;
    }


    const animationConfig = {
        animateBtnId: 'i2c-spi-animate-btn',
        stepsBtnId: 'i2c-spi-steps-btn',
        resetBtnId: 'i2c-spi-reset-btn',
        stepsId: 'i2c-spi-steps',
        signalContainerIds: ['i2c-spi-spi', 'i2c-spi-i2c'],
        animateFunction: animateI2cSpi,
        customResetFunction: customResetI2cSpi
    };

    setupAnimation(animationConfig);
}

// Problem 11: I2C Data Rate (Refactored)
// -----------------------------------
function initI2cDataAnimation() {
    const sdaBits = document.getElementById('i2c-data-sda');
    const sclBits = document.getElementById('i2c-data-scl');

    function animateI2cData(containers, steps, config) {
        resetAnimation(containers, steps, stepsBtn, config);
        const sdaBits = containers[0];
        const sclBits = containers[1];
        const sdaSignal = '01100000010100000101000001011';
        const sclSignal = '00111111110111111110111111100';
        sdaSignal.split('').forEach((sdaBit, i) => {
            setTimeout(() => {
                sdaBits.children[i].classList.add('active');
                sdaBits.children[i].classList.toggle('high', sdaBit === '1');
                sdaBits.children[i].classList.toggle('low', sdaBit === '0');
                sdaBits.children[i].textContent = sdaBit;
                sclBits.children[i].classList.add('active');
                sclBits.children[i].classList.toggle('high', sclSignal[i] === '1');
                sclBits.children[i].classList.toggle('low', sclSignal[i] === '0');
                sclBits.children[i].textContent = sclSignal[i];
                if (sclSignal[i] === '1' && sdaBit === '1') {
                    sdaBits.children[i].classList.add('connection');
                    setTimeout(() => sdaBits.children[i].classList.add('visible'), 100);
                }
            }, i * 200);
        });
        setTimeout(() => highlightSteps(steps), 29 * 200 + 500);
    }

    function customResetI2cData(containers) {
        const sdaBits = containers[0];
        const sclBits = containers[1];
        [...sdaBits.children].forEach(bit => {
            bit.classList.remove('active', 'high', 'connection', 'visible');
            bit.classList.add('low');
            bit.textContent = '1';
        });
        [...sclBits.children].forEach(bit => {
            bit.classList.remove('active', 'high', 'connection', 'visible');
            bit.classList.add('low');
            bit.textContent = '0';
        });
    }

    const sdaBitsElem = document.getElementById('i2c-data-sda');
    const sclBitsElem = document.getElementById('i2c-data-scl');
    sdaBitsElem.innerHTML = '';
    sclBitsElem.innerHTML = '';
    for (let i = 0; i < 29; i++) {
        sdaBitsElem.innerHTML += `<span class="bit low" style="left: ${i * 44}px;">1</span>`;
        sclBitsElem.innerHTML += `<span class="bit low" style="left: ${i * 44}px;">0</span>`;
    }


    const animationConfig = {
        animateBtnId: 'i2c-data-animate-btn',
        stepsBtnId: 'i2c-data-steps-btn',
        resetBtnId: 'i2c-data-reset-btn',
        stepsId: 'i2c-data-steps',
        signalContainerIds: ['i2c-data-sda', 'i2c-data-scl'],
        animateFunction: animateI2cData,
        customResetFunction: customResetI2cData
    };

    setupAnimation(animationConfig);
}

// Problem 10: I2C ACK/NACK (Refactored)
// -----------------------------------
function initI2cAckAnimation() {
    const ackBits = document.getElementById('i2c-ack-signal');
    const nackBits = document.getElementById('i2c-nack-signal');

    function animateI2cAck(containers, steps, config) {
        resetAnimation(containers, steps, stepsBtn, config);
        const ackBits = containers[0];
        const nackBits = containers[1];

        const waveContainer = document.querySelector('#i2c-ack-section .wave-container');

        const sclDataAck = [0, 1, 0];
        const sdaDataAck = [1, 0, 1];
        const sclDataNack = [0, 1, 0];
        const sdaDataNack = [1, 1, 1];

        const ackTitle = document.createElement('div');
        ackTitle.className = 'i2c-section-title';
        ackTitle.textContent = 'ACK Signal (SDA pulled LOW by receiver)';
        waveContainer.appendChild(ackTitle);

        createSquareWave(waveContainer, sclDataAck, {
            width: 600,
            height: 100,
            labels: { x: 'Time', y: 'SCL' },
            animationDuration: 1500
        });

        createSquareWave(waveContainer, sdaDataAck, {
            width: 600,
            height: 100,
            labels: { x: 'Time', y: 'SDA' },
            animationDuration: 1500
        });

        const nackTitle = document.createElement('div');
        nackTitle.className = 'i2c-section-title';
        nackTitle.textContent = 'NACK Signal (SDA remains HIGH)';
        nackTitle.style.marginTop = '30px';
        waveContainer.appendChild(nackTitle);

        createSquareWave(waveContainer, sclDataNack, {
            width: 600,
            height: 100,
            labels: { x: 'Time', y: 'SCL' },
            animationDuration: 1500
        });

        createSquareWave(waveContainer, sdaDataNack, {
            width: 600,
            height: 100,
            labels: { x: 'Time', y: 'SDA' },
            animationDuration: 1500
        });

        const explanationContainer = document.createElement('div');
        explanationContainer.className = 'ack-container';
        explanationContainer.innerHTML = `
            <div class="ack-title">ACK vs NACK Explanation</div>
            <div class="ack-row">
                <span class="ack-label">ACK:</span>
                <span class="ack-value">SDA pulled LOW by receiver</span>
                <span class="ack-meaning">Device acknowledges receipt</span>
            </div>
            <div class="ack-row">
                <span class="ack-label">NACK:</span>
                <span class="ack-value">SDA remains HIGH</span>
                <span class="ack-meaning">Device does not acknowledge</span>
            </div>
            <div class="ack-row usage">
                <span class="ack-label">When used:</span>
                <span class="ack-usage">After address or data byte transmission</span>
            </div>
        `;
        waveContainer.appendChild(explanationContainer);

        setTimeout(() => {
            ackBits.children[0].classList.add('active');
            ackBits.children[0].textContent = 'SCL';

            ackBits.children[1].classList.add('active', 'low');
            ackBits.children[1].textContent = '0';
            ackBits.children[1].classList.add('connection');
            setTimeout(() => ackBits.children[1].classList.add('visible'), 100);

            ackBits.children[2].classList.add('active');
            ackBits.children[2].textContent = 'ACK';
        }, 500);

        setTimeout(() => {
            nackBits.children[0].classList.add('active');
            nackBits.children[0].textContent = 'SCL';

            nackBits.children[1].classList.add('active', 'high');
            nackBits.children[1].textContent = '1';
            nackBits.children[1].classList.add('connection');
            setTimeout(() => nackBits.children[1].classList.add('visible'), 100);

            nackBits.children[2].classList.add('active');
            nackBits.children[2].textContent = 'NACK';
        }, 1000);

        setTimeout(() => highlightSteps(steps), 1500);
    }

    function customResetI2cAck(containers) {
        const ackBits = containers[0];
        const nackBits = containers[1];
        const waveContainer = document.querySelector('#i2c-ack-section .wave-container');
        waveContainer.innerHTML = '';

        [...ackBits.children].forEach(bit => {
            bit.classList.remove('active', 'high', 'low', 'connection', 'visible');
            bit.classList.add('low');
            bit.textContent = '0';
        });

        [...nackBits.children].forEach(bit => {
            bit.classList.remove('active', 'high', 'low', 'connection', 'visible');
            bit.classList.add('low');
            bit.textContent = '0';
        });
    }

    const ackBitsElem = document.getElementById('i2c-ack-signal');
    const nackBitsElem = document.getElementById('i2c-nack-signal');
    ackBitsElem.innerHTML = '';
    nackBitsElem.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        ackBitsElem.innerHTML += `<span class="bit low" style="left: ${i * 44}px;">0</span>`;
        nackBitsElem.innerHTML += `<span class="bit low" style="left: ${i * 44}px;">0</span>`;
    }

    const waveContainer = document.createElement('div');
    waveContainer.className = 'wave-container';
    waveContainer.style.marginTop = '30px';
    document.getElementById('i2c-ack-section').insertBefore(waveContainer, document.getElementById('i2c-ack-steps'));


    const animationConfig = {
        animateBtnId: 'i2c-ack-animate-btn',
        stepsBtnId: 'i2c-ack-steps-btn',
        resetBtnId: 'i2c-ack-reset-btn',
        stepsId: 'i2c-ack-steps',
        signalContainerIds: ['i2c-ack-signal', 'i2c-nack-signal'],
        animateFunction: animateI2cAck,
        customResetFunction: customResetI2cAck
    };

    setupAnimation(animationConfig);
}

// Problem 9: I2C Address (Refactored)
// -----------------------------------
function initI2cAddressAnimation() {
    const sdaBits = document.getElementById('i2c-address-sda');

    function animateI2cAddress(containers, steps, config) {
        resetAnimation(containers, steps, stepsBtn, config);
        const sdaBits = containers[0];
        const addressSignal = '01110100'; // Address + R/W bit
        addressSignal.split('').forEach((bit, i) => {
            setTimeout(() => {
                sdaBits.children[i].classList.add('active');
                sdaBits.children[i].classList.toggle('high', bit === '1');
                sdaBits.children[i].classList.toggle('low', bit === '0');
                sdaBits.children[i].textContent = bit;
                if (bit === '1') {
                    sdaBits.children[i].classList.add('connection');
                    setTimeout(() => sdaBits.children[i].classList.add('visible'), 100);
                }
            }, i * 500);
        });
        setTimeout(() => highlightSteps(steps), 8 * 500 + 500);
    }

    function customResetI2cAddress(containers) {
        const sdaBits = containers[0];
        [...sdaBits.children].forEach(bit => {
            bit.classList.remove('active', 'high', 'connection', 'visible');
            bit.classList.add('low');
            bit.textContent = '0';
        });
    }

    const sdaBitsElem = document.getElementById('i2c-address-sda');
    sdaBitsElem.innerHTML = '';
    for (let i = 0; i < 8; i++) {
        sdaBitsElem.innerHTML += `<span class="bit low" style="left: ${i * 44}px;">0</span>`;
    }


    const animationConfig = {
        animateBtnId: 'i2c-address-animate-btn',
        stepsBtnId: 'i2c-address-steps-btn',
        resetBtnId: 'i2c-address-reset-btn',
        stepsId: 'i2c-address-steps',
        signalContainerIds: ['i2c-address-sda'],
        animateFunction: animateI2cAddress,
        customResetFunction: customResetI2cAddress
    };

    setupAnimation(animationConfig);
}


// Initialize all animations on page load
document.addEventListener('DOMContentLoaded', () => {
    initSPIWordAnimation();
    initSpiValueAnimation();
    initUartEncodeAnimation();
    initUartWordAnimation();
    initParityAnimation();
    initBaudWordsAnimation();
    initBaudRateAnimation();
    initParityErrorAnimation();
    initI2cConfigAnimation();
    initI2cSpiAnimation();
    initI2cDataAnimation();
    initI2cAckAnimation();
    initI2cAddressAnimation(); // Initialize I2C Address Animation
});

// Back to Top Functionality (No change needed)
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