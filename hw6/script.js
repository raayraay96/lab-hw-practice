// Problem 1: SPI Word Size Animation
// -----------------------------------
function initSpiWordAnimation() {
    const nss = document.getElementById('spi-word-nss');
    const sck = document.getElementById('spi-word-sck');
    const mosi = document.getElementById('spi-word-mosi');
    const steps = document.getElementById('spi-word-steps');
    const animateBtn = document.getElementById('spi-word-animate-btn');
    const stepsBtn = document.getElementById('spi-word-steps-btn');
    const resetBtn = document.getElementById('spi-word-reset-btn');
    const wordSizeInput = document.getElementById('spi-word-size');
    
    // Create arrays to hold the signal values
    let nssValues = [];
    let sckValues = [];
    let mosiValues = [];
    
    function generateSignals(wordSize) {
        // Reset arrays
        nssValues = [];
        sckValues = [];
        mosiValues = [];
        
        // Generate NSS signal (active low)
        // Start with idle high, then go low for the transfer, then back to high
        nssValues.push({value: 0, label: 'Idle'});
        for (let i = 0; i < wordSize; i++) {
            nssValues.push({value: 1, label: 'Start Transfer'});
        }
        nssValues.push({value: 0, label: 'End'});
        
        // Generate SCK signal (clock)
        // Start with 0, then alternate between 0 and 1 for each bit
        for (let i = 0; i < wordSize; i++) {
            sckValues.push({value: 0, label: ''});
            sckValues.push({value: 1, label: ''});
        }
        
        // Generate MOSI signal (data)
        // Random data bits for demonstration
        for (let i = 0; i < wordSize; i++) {
            const bit = Math.round(Math.random());
            mosiValues.push({value: bit, label: ''});
            mosiValues.push({value: bit, label: ''});  // Keep same value during entire clock cycle
        }
    }
    
    function animate() {
        reset();
        
        // Get word size from input
        const wordSize = parseInt(wordSizeInput.value) || 15;
        
        // Generate signals based on word size
        generateSignals(wordSize);
        
        // Create signal displays
        createSignalDisplay(nss, nssValues, 'NSS');
        createSignalDisplay(sck, sckValues, 'SCK');
        createSignalDisplay(mosi, mosiValues, 'MOSI');
        
        // Highlight rising edges of SCK
        setTimeout(() => {
            const sckElements = sck.querySelectorAll('.bit');
            let edgeCount = 0;
            
            // Function to highlight next rising edge
            function highlightNextEdge(index) {
                if (index >= sckElements.length - 1) {
                    // All edges highlighted, show final count
                    const countElement = document.createElement('div');
                    countElement.className = 'edge-count';
                    countElement.textContent = `Total: ${edgeCount} rising edges = ${edgeCount} bits`;
                    countElement.style.color = '#16c79a';
                    countElement.style.fontWeight = 'bold';
                    countElement.style.marginTop = '10px';
                    sck.appendChild(countElement);
                    
                    // Show steps
                    setTimeout(() => highlightSteps(steps), 500);
                    return;
                }
                
                // Check if this is a rising edge (previous bit is 0, current bit is 1)
                if (index > 0 && sckValues[index-1].value === 0 && sckValues[index].value === 1) {
                    sckElements[index].classList.add('rising-edge');
                    edgeCount++;
                    
                    // Add edge counter
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
                
                // Move to next bit after delay
                setTimeout(() => highlightNextEdge(index + 1), 300);
            }
            
            // Start highlighting from the first bit
            highlightNextEdge(0);
        }, 1000);
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
    
    function reset() {
        nss.innerHTML = '';
        sck.innerHTML = '';
        mosi.innerHTML = '';
        steps.classList.remove('visible');
        stepsBtn.textContent = 'Show Steps';
    }
    
    // Add event listeners
    animateBtn.addEventListener('click', animate);
    stepsBtn.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn.addEventListener('click', reset);
    
    // Initialize with default state
    reset();
}

// Problem 2: SPI Transmitted Value
// -----------------------------------
function initSpiValueAnimation() {
    const mosiBits = document.getElementById('spi-value-mosi');
    const steps = document.getElementById('spi-value-steps');
    const animateBtn = document.getElementById('spi-value-animate-btn');
    const stepsBtn = document.getElementById('spi-value-steps-btn');
    const resetBtn = document.getElementById('spi-value-reset-btn');

    mosiBits.innerHTML = '';
    const mosiPattern = '110001000010110';
    for (let i = 0; i < 15; i++) {
        mosiBits.innerHTML += `<span class="bit low" style="left: ${i * 44}px;">${mosiPattern[i]}</span>`;
    }

    // NEW: Insert a container for square wave visualization of MOSI
    const squareWave = document.createElement('div');
    squareWave.className = 'spi-square-wave';
    squareWave.innerHTML = '<!-- square wave visualization for MOSI -->';
    mosiBits.appendChild(squareWave);

    function animate() {
        reset();
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

    function reset() {
        const mosiPattern = '110001000010110';
        [...mosiBits.children].forEach((bit, i) => {
            bit.classList.remove('active', 'connection', 'visible', 'high');
            bit.classList.add('low');
            bit.textContent = mosiPattern[i];
        });
        steps.classList.remove('visible');
        stepsBtn.textContent = 'Show Steps';
    }

    animateBtn.addEventListener('click', animate);
    stepsBtn.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn.addEventListener('click', reset);
    reset();
}

// Problem 3: UART Encoding
// -----------------------------------
function initUartEncodeAnimation() {
    const signalBits = document.getElementById('uart-encode-signal');
    const steps = document.getElementById('uart-encode-steps');
    const animateBtn = document.getElementById('uart-encode-animate-btn');
    const stepsBtn = document.getElementById('uart-encode-steps-btn');
    const resetBtn = document.getElementById('uart-encode-reset-btn');

    signalBits.innerHTML = '';
    for (let i = 0; i < 10; i++) {
        signalBits.innerHTML += `<span class="bit low" style="left: ${i * 44}px;">0</span>`;
    }

    // Add container for square wave visualization
    const waveContainer = document.createElement('div');
    waveContainer.className = 'wave-container';
    waveContainer.style.marginTop = '30px';
    document.getElementById('uart-encode-section').insertBefore(waveContainer, steps);

    function animate() {
        reset();
        const signal = '0110010101';
        
        // Prepare data for square wave visualization
        const uartData = [];
        
        // Convert the signal to an array of 1s and 0s for the square wave
        for (let i = 0; i < signal.length; i++) {
            uartData.push(signal[i] === '1' ? 1 : 0);
        }
        
        // Create square wave visualization
        createSquareWave(waveContainer, uartData, {
            width: 600,
            height: 150,
            labels: { x: 'Time', y: 'UART TX' },
            animationDuration: 2000
        });
        
        // Add labels for different parts of the UART frame
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

    function reset() {
        // Clear wave container
        waveContainer.innerHTML = '';
        
        [...signalBits.children].forEach(bit => {
            bit.classList.remove('active', 'high', 'connection', 'visible');
            bit.classList.add('low');
            bit.textContent = '0';
        });
        steps.classList.remove('visible');
        stepsBtn.textContent = 'Show Steps';
    }

    animateBtn.addEventListener('click', animate);
    stepsBtn.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn.addEventListener('click', reset);
    
    // Add styles for UART labels
    const style = document.createElement('style');
    style.textContent = `
        .wave-container {
            position: relative;
            display: flex;
            flex-direction: column;
            gap: 20px;
            margin-bottom: 20px;
        }
        .uart-labels {
            position: relative;
            height: 30px;
            margin-top: -30px;
        }
        .uart-label {
            position: absolute;
            transform: translateX(-50%);
            font-size: 0.8em;
            color: #16c79a;
            background: rgba(26, 26, 46, 0.7);
            padding: 2px 5px;
            border-radius: 3px;
        }
    `;
    document.head.appendChild(style);
    
    reset();
}

// Problem 4: UART Decoded Word
// -----------------------------------
function initUartWordAnimation() {
    const signalBits = document.getElementById('uart-word-signal');
    const steps = document.getElementById('uart-word-steps');
    const animateBtn = document.getElementById('uart-word-animate-btn');
    const stepsBtn = document.getElementById('uart-word-steps-btn');
    const resetBtn = document.getElementById('uart-word-reset-btn');

    signalBits.innerHTML = '';
    for (let i = 0; i < 10; i++) {
        signalBits.innerHTML += `<span class="bit low" style="left: ${i * 44}px;">0</span>`;
    }

    // Add container for square wave visualization
    const waveContainer = document.createElement('div');
    waveContainer.className = 'wave-container';
    waveContainer.style.marginTop = '30px';
    document.getElementById('uart-word-section').insertBefore(waveContainer, steps);

    function animate() {
        reset();
        const signal = '0100100110'; // First frame: "d"
        
        // Prepare data for square wave visualization
        const uartData = [];
        
        // Convert the signal to an array of 1s and 0s for the square wave
        for (let i = 0; i < signal.length; i++) {
            uartData.push(signal[i] === '1' ? 1 : 0);
        }
        
        // Create square wave visualization
        createSquareWave(waveContainer, uartData, {
            width: 600,
            height: 150,
            labels: { x: 'Time', y: 'UART RX' },
            animationDuration: 2000
        });
        
        // Add labels for different parts of the UART frame
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
        
        // Add decoded value explanation
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

    function reset() {
        // Clear wave container
        waveContainer.innerHTML = '';
        
        [...signalBits.children].forEach(bit => {
            bit.classList.remove('active', 'high', 'connection', 'visible');
            bit.classList.add('low');
            bit.textContent = '0';
        });
        steps.classList.remove('visible');
        stepsBtn.textContent = 'Show Steps';
    }

    animateBtn.addEventListener('click', animate);
    stepsBtn.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn.addEventListener('click', reset);
    
    // Add styles for UART labels and decoded values
    const style = document.createElement('style');
    style.textContent = `
        .decoded-container {
            margin-top: 20px;
            padding: 10px;
            background: rgba(26, 26, 46, 0.7);
            border-radius: 8px;
            border-left: 3px solid #16c79a;
        }
        .decoded-value {
            margin: 5px 0;
            font-size: 0.9em;
        }
        .decoded-label {
            color: #16c79a;
            margin-right: 10px;
            font-weight: bold;
        }
        .decoded-bits {
            font-family: monospace;
            background: rgba(22, 199, 154, 0.2);
            padding: 2px 5px;
            border-radius: 3px;
        }
    `;
    document.head.appendChild(style);
    
    reset();
}

// Problem 5: Odd Parity
// -----------------------------------
function initParityAnimation() {
    const dataBits = document.getElementById('parity-data');
    const steps = document.getElementById('parity-steps');
    const animateBtn = document.getElementById('parity-animate-btn');
    const stepsBtn = document.getElementById('parity-steps-btn');
    const resetBtn = document.getElementById('parity-reset-btn');

    dataBits.innerHTML = '';
    for (let i = 0; i < 10; i++) {
        dataBits.innerHTML += `<span class="bit low" style="left: ${i * 44}px;">0</span>`;
    }

    // Add container for square wave visualization
    const waveContainer = document.createElement('div');
    waveContainer.className = 'wave-container';
    waveContainer.style.marginTop = '30px';
    document.getElementById('parity-section').insertBefore(waveContainer, steps);

    function animate() {
        reset();
        const signal = '0101010111';
        
        // Prepare data for square wave visualization
        const uartData = [];
        
        // Convert the signal to an array of 1s and 0s for the square wave
        for (let i = 0; i < signal.length; i++) {
            uartData.push(signal[i] === '1' ? 1 : 0);
        }
        
        // Create square wave visualization
        createSquareWave(waveContainer, uartData, {
            width: 600,
            height: 150,
            labels: { x: 'Time', y: 'UART Signal' },
            animationDuration: 2000
        });
        
        // Add labels for different parts of the UART frame
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
        
        // Add parity explanation
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

    function reset() {
        // Clear wave container
        waveContainer.innerHTML = '';
        
        [...dataBits.children].forEach(bit => {
            bit.classList.remove('active', 'high', 'connection', 'visible');
            bit.classList.add('low');
            bit.textContent = '0';
        });
        steps.classList.remove('visible');
        stepsBtn.textContent = 'Show Steps';
    }

    animateBtn.addEventListener('click', animate);
    stepsBtn.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn.addEventListener('click', reset);
    
    // Add styles for parity explanation
    const style = document.createElement('style');
    style.textContent = `
        .parity-container {
            margin-top: 20px;
            padding: 15px;
            background: rgba(26, 26, 46, 0.7);
            border-radius: 8px;
            border-left: 3px solid #16c79a;
        }
        .parity-title {
            font-size: 1.1em;
            color: #16c79a;
            margin-bottom: 10px;
            font-weight: bold;
        }
        .parity-row {
            margin: 8px 0;
            display: flex;
            align-items: center;
        }
        .parity-label {
            width: 100px;
            color: #e6e6e6;
        }
        .parity-bits {
            font-family: monospace;
            background: rgba(22, 199, 154, 0.1);
            padding: 2px 5px;
            border-radius: 3px;
            margin-right: 10px;
        }
        .parity-bits.highlight {
            background: rgba(22, 199, 154, 0.4);
            font-weight: bold;
        }
        .parity-count {
            color: #b8b8b8;
            font-style: italic;
        }
        .parity-total {
            font-size: 1.2em;
            font-weight: bold;
            color: #16c79a;
            margin-right: 10px;
        }
    `;
    document.head.appendChild(style);
    
    reset();
}

// Problem 6: Words per Second
// -----------------------------------
function initBaudWordsAnimation() {
    const frameBits = document.getElementById('baud-words-frame');
    const steps = document.getElementById('baud-words-steps');
    const animateBtn = document.getElementById('baud-words-animate-btn');
    const stepsBtn = document.getElementById('baud-words-steps-btn');
    const resetBtn = document.getElementById('baud-words-reset-btn');

    frameBits.innerHTML = '';
    for (let i = 0; i < 10; i++) {
        frameBits.innerHTML += `<span class="bit low" style="left: ${i * 44}px;">0</span>`;
    }

    // Add container for square wave visualization
    const waveContainer = document.createElement('div');
    waveContainer.className = 'wave-container';
    waveContainer.style.marginTop = '30px';
    document.getElementById('baud-words-section').insertBefore(waveContainer, steps);

    function animate() {
        reset();
        const signal = '0110010101';
        
        // Prepare data for square wave visualization
        const uartData = [];
        
        // Convert the signal to an array of 1s and 0s for the square wave
        for (let i = 0; i < signal.length; i++) {
            uartData.push(signal[i] === '1' ? 1 : 0);
        }
        
        // Create square wave visualization
        createSquareWave(waveContainer, uartData, {
            width: 600,
            height: 150,
            labels: { x: 'Time', y: 'UART Frame' },
            animationDuration: 2000
        });
        
        // Add labels for different parts of the UART frame
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
        
        // Add baud rate calculation
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

    function reset() {
        // Clear wave container
        waveContainer.innerHTML = '';
        
        [...frameBits.children].forEach(bit => {
            bit.classList.remove('active', 'high', 'connection', 'visible');
            bit.classList.add('low');
            bit.textContent = '0';
        });
        steps.classList.remove('visible');
        stepsBtn.textContent = 'Show Steps';
    }

    animateBtn.addEventListener('click', animate);
    stepsBtn.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn.addEventListener('click', reset);
    
    // Add styles for baud rate calculation
    const style = document.createElement('style');
    style.textContent = `
        .baud-container {
            margin-top: 20px;
            padding: 15px;
            background: rgba(26, 26, 46, 0.7);
            border-radius: 8px;
            border-left: 3px solid #16c79a;
        }
        .baud-title {
            font-size: 1.1em;
            color: #16c79a;
            margin-bottom: 10px;
            font-weight: bold;
        }
        .baud-row {
            margin: 8px 0;
            display: flex;
            align-items: center;
        }
        .baud-label {
            width: 120px;
            color: #e6e6e6;
        }
        .baud-value {
            font-family: monospace;
            background: rgba(22, 199, 154, 0.1);
            padding: 2px 5px;
            border-radius: 3px;
        }
        .baud-row.calculation {
            margin-top: 15px;
            padding-top: 10px;
            border-top: 1px dashed rgba(22, 199, 154, 0.3);
        }
        .baud-formula {
            font-family: monospace;
            font-weight: bold;
            color: #16c79a;
            background: rgba(22, 199, 154, 0.2);
            padding: 5px 8px;
            border-radius: 3px;
        }
    `;
    document.head.appendChild(style);
    
    reset();
}

// Problem 7: UART Baud Rate
// -----------------------------------
function initBaudRateAnimation() {
    const signalBits = document.getElementById('baud-rate-signal');
    const steps = document.getElementById('baud-rate-steps');
    const animateBtn = document.getElementById('baud-rate-animate-btn');
    const stepsBtn = document.getElementById('baud-rate-steps-btn');
    const resetBtn = document.getElementById('baud-rate-reset-btn');

    signalBits.innerHTML = '';
    for (let i = 0; i < 10; i++) {
        signalBits.innerHTML += `<span class="bit low" style="left: ${i * 44}px;">0</span>`;
    }

    // Add container for square wave visualization
    const waveContainer = document.createElement('div');
    waveContainer.className = 'wave-container';
    waveContainer.style.marginTop = '30px';
    document.getElementById('baud-rate-section').insertBefore(waveContainer, steps);

    function animate() {
        reset();
        const signal = '0110010101';
        
        // Prepare data for square wave visualization
        const uartData = [];
        
        // Convert the signal to an array of 1s and 0s for the square wave
        for (let i = 0; i < signal.length; i++) {
            uartData.push(signal[i] === '1' ? 1 : 0);
        }
        
        // Create square wave visualization
        createSquareWave(waveContainer, uartData, {
            width: 600,
            height: 150,
            labels: { x: 'Time (ms)', y: 'UART Signal' },
            animationDuration: 2000
        });
        
        // Add time markers to show the 50ms duration
        const timeContainer = document.createElement('div');
        timeContainer.className = 'time-markers';
        timeContainer.innerHTML = `
            <div class="time-marker start">0 ms</div>
            <div class="time-marker end">50 ms</div>
            <div class="time-duration">10 bits in 50 ms</div>
        `;
        waveContainer.appendChild(timeContainer);
        
        // Add baud rate calculation
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

    function reset() {
        // Clear wave container
        waveContainer.innerHTML = '';
        
        [...signalBits.children].forEach(bit => {
            bit.classList.remove('active', 'high', 'connection', 'visible');
            bit.classList.add('low');
            bit.textContent = '0';
        });
        steps.classList.remove('visible');
        stepsBtn.textContent = 'Show Steps';
    }

    animateBtn.addEventListener('click', animate);
    stepsBtn.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn.addEventListener('click', reset);
    
    // Add styles for time markers and baud rate calculation
    const style = document.createElement('style');
    style.textContent = `
        .time-markers {
            position: relative;
            height: 40px;
            margin-top: 5px;
            border-top: 1px dashed rgba(22, 199, 154, 0.5);
        }
        .time-marker {
            position: absolute;
            font-size: 0.8em;
            color: #16c79a;
            background: rgba(26, 26, 46, 0.7);
            padding: 2px 5px;
            border-radius: 3px;
        }
        .time-marker.start {
            left: 0;
            top: 5px;
        }
        .time-marker.end {
            right: 0;
            top: 5px;
        }
        .time-duration {
            position: absolute;
            left: 50%;
            top: 5px;
            transform: translateX(-50%);
            font-size: 0.9em;
            color: #ffffff;
            background: rgba(22, 199, 154, 0.3);
            padding: 3px 8px;
            border-radius: 3px;
            font-weight: bold;
        }
    `;
    document.head.appendChild(style);
    
    reset();
}

// Problem 8: Parity Error
// -----------------------------------
function initParityErrorAnimation() {
    const signalBits = document.getElementById('parity-error-signal');
    const steps = document.getElementById('parity-error-steps');
    const animateBtn = document.getElementById('parity-error-animate-btn');
    const stepsBtn = document.getElementById('parity-error-steps-btn');
    const resetBtn = document.getElementById('parity-error-reset-btn');

    signalBits.innerHTML = '';
    for (let i = 0; i < 10; i++) {
        signalBits.innerHTML += `<span class="bit low" style="left: ${i * 44}px;">0</span>`;
    }

    // Add container for square wave visualization
    const waveContainer = document.createElement('div');
    waveContainer.className = 'wave-container';
    waveContainer.style.marginTop = '30px';
    document.getElementById('parity-error-section').insertBefore(waveContainer, steps);

    function animate() {
        reset();
        const signal = '0101010101'; // Signal with parity error
        
        // Prepare data for square wave visualization
        const uartData = [];
        
        // Convert the signal to an array of 1s and 0s for the square wave
        for (let i = 0; i < signal.length; i++) {
            uartData.push(signal[i] === '1' ? 1 : 0);
        }
        
        // Create square wave visualization
        createSquareWave(waveContainer, uartData, {
            width: 600,
            height: 150,
            labels: { x: 'Time', y: 'UART Signal' },
            animationDuration: 2000
        });
        
        // Add labels for different parts of the UART frame
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
            <div class="uart-label error" style="left: 95%;">Parity</div>
        `;
        waveContainer.appendChild(labelContainer);
        
        // Add parity error explanation
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
                // Highlight the parity bit as an error
                if (i === 9) {
                    signalBits.children[i].classList.add('error-bit');
                }
            }, i * 500);
        });
        setTimeout(() => highlightSteps(steps), 10 * 500 + 500);
    }

    function reset() {
        // Clear wave container
        waveContainer.innerHTML = '';
        
        [...signalBits.children].forEach(bit => {
            bit.classList.remove('active', 'high', 'connection', 'visible', 'error-bit');
            bit.classList.add('low');
            bit.textContent = '0';
        });
        steps.classList.remove('visible');
        stepsBtn.textContent = 'Show Steps';
    }

    animateBtn.addEventListener('click', animate);
    stepsBtn.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn.addEventListener('click', reset);
    
    // Add styles for parity error visualization
    const style = document.createElement('style');
    style.textContent = `
        .uart-label.error {
            color: #ff4d4d;
            font-weight: bold;
            border: 1px solid #ff4d4d;
        }
        .parity-container.error {
            border-left: 3px solid #ff4d4d;
        }
        .parity-bits.error {
            background: rgba(255, 77, 77, 0.2);
            color: #ff4d4d;
        }
        .parity-count.error {
            color: #ff4d4d;
        }
        .parity-result {
            margin-top: 15px;
            padding: 8px;
            background: rgba(255, 77, 77, 0.1);
            border-radius: 5px;
            color: #ff4d4d;
            font-weight: bold;
            display: flex;
            align-items: center;
        }
        .error-icon {
            font-size: 1.5em;
            margin-right: 10px;
        }
        .error-bit {
            border: 2px solid #ff4d4d !important;
            box-shadow: 0 0 10px rgba(255, 77, 77, 0.7) !important;
        }
    `;
    document.head.appendChild(style);
    
    reset();
}

// Problem 9: I2C Open-Drain
// -----------------------------------
function initI2cConfigAnimation() {
    const sdaBits = document.getElementById('i2c-config-sda');
    const steps = document.getElementById('i2c-config-steps');
    const animateBtn = document.getElementById('i2c-config-animate-btn');
    const stepsBtn = document.getElementById('i2c-config-steps-btn');
    const resetBtn = document.getElementById('i2c-config-reset-btn');
    
    // NEW: Initialize waveContainer before use
    const waveContainer = document.createElement('div');
    waveContainer.className = 'wave-container';
    waveContainer.style.marginTop = '30px';
    const section = document.getElementById('i2c-config-section');
    if (section) {
        section.insertBefore(waveContainer, steps);
    }

    sdaBits.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        sdaBits.innerHTML += `<span class="bit low" style="left: ${i * 44}px;">1</span>`;
    }

    function animate() {
        reset();
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

    function reset() {
        [...sdaBits.children].forEach(bit => {
            bit.classList.remove('active', 'high', 'connection', 'visible');
            bit.classList.add('low');
            bit.textContent = '1';
        });
        steps.classList.remove('visible');
        stepsBtn.textContent = 'Show Steps';
    }

    animateBtn.addEventListener('click', animate);
    stepsBtn.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn.addEventListener('click', reset);
    reset();
}

// Problem 10: I2C vs SPI
// -----------------------------------
function initI2cSpiAnimation() {
    const spiBits = document.getElementById('i2c-spi-spi');
    const i2cBits = document.getElementById('i2c-spi-i2c');
    const steps = document.getElementById('i2c-spi-steps');
    const animateBtn = document.getElementById('i2c-spi-animate-btn');
    const stepsBtn = document.getElementById('i2c-spi-steps-btn');
    const resetBtn = document.getElementById('i2c-spi-reset-btn');

    spiBits.innerHTML = '';
    i2cBits.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        spiBits.innerHTML += `<span class="bit low" style="left: ${i * 44}px;">0</span>`;
        i2cBits.innerHTML += `<span class="bit low" style="left: ${i * 44}px;">0</span>`;
    }

    function animate() {
        reset();
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

    function reset() {
        [...spiBits.children, ...i2cBits.children].forEach(bit => {
            bit.classList.remove('active', 'high', 'connection', 'visible');
            bit.classList.add('low');
            bit.textContent = '0';
        });
        steps.classList.remove('visible');
        stepsBtn.textContent = 'Show Steps';
    }

    animateBtn.addEventListener('click', animate);
    stepsBtn.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn.addEventListener('click', reset);
    reset();
}

// Problem 11: I2C Data Rate
// -----------------------------------
function initI2cDataAnimation() {


    const sdaBits = document.getElementById('i2c-data-sda');
    const sclBits = document.getElementById('i2c-data-scl');
    const steps = document.getElementById('i2c-data-steps');
    const animateBtn = document.getElementById('i2c-data-animate-btn');
    const stepsBtn = document.getElementById('i2c-data-steps-btn');
    const resetBtn = document.getElementById('i2c-data-reset-btn');

    sdaBits.innerHTML = '';
    sclBits.innerHTML = '';
    for (let i = 0; i < 29; i++) {
        sdaBits.innerHTML += `<span class="bit low" style="left: ${i * 44}px;">1</span>`;
        sclBits.innerHTML += `<span class="bit low" style="left: ${i * 44}px;">0</span>`;
    }

    function animate() {
        reset();
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

    function reset() {
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
        steps.classList.remove('visible');
        stepsBtn.textContent = 'Show Steps';
    }

    animateBtn.addEventListener('click', animate);
    stepsBtn.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn.addEventListener('click', reset);
    reset();
}

// Utility Functions
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

// Initialize all animations for HW6
function initSPIWordAnimation() {
    const nss = document.getElementById('spi-word-nss');
    const sck = document.getElementById('spi-word-sck');
    const mosi = document.getElementById('spi-word-mosi');
    const steps = document.getElementById('spi-word-steps');
    // ... rest of animation setup
}

// Add similar init functions for other animations
function initSPIValueAnimation() { /* ... */ }
function initUARTEncodeAnimation() { /* ... */ }
function initUARTWordAnimation() { /* ... */ }
function initParityAnimation() { /* ... */ }
function initBaudWordsAnimation() { /* ... */ }
function initBaudRateAnimation() { /* ... */ }
function initParityErrorAnimation() { /* ... */ }
function initI2CAddressAnimation() { /* ... */ }
function initI2CACKAnimation() { /* ... */ }

// Initialize all animations on page load
document.addEventListener('DOMContentLoaded', () => {
    initSPIWordAnimation();
    initSPIValueAnimation();
    initUARTEncodeAnimation();
    initUARTWordAnimation();
    initParityAnimation();
    initBaudWordsAnimation();
    initBaudRateAnimation();
    initParityErrorAnimation();
    initI2CAddressAnimation();
    initI2CACKAnimation();
});

// Back to Top Functionality
// -------------------------
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

// Problem 10: I2C ACK/NACK
// -----------------------------------
function initI2cAckAnimation() {
    const ackBits = document.getElementById('i2c-ack-signal');
    const nackBits = document.getElementById('i2c-nack-signal');
    const steps = document.getElementById('i2c-ack-steps');
    const animateBtn = document.getElementById('i2c-ack-animate-btn');
    const stepsBtn = document.getElementById('i2c-ack-steps-btn');
    const resetBtn = document.getElementById('i2c-ack-reset-btn');

    ackBits.innerHTML = '';
    nackBits.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        ackBits.innerHTML += `<span class="bit low" style="left: ${i * 44}px;">0</span>`;
        nackBits.innerHTML += `<span class="bit low" style="left: ${i * 44}px;">0</span>`;
    }

    // Add container for square wave visualization
    const waveContainer = document.createElement('div');
    waveContainer.className = 'wave-container';
    waveContainer.style.marginTop = '30px';
    document.getElementById('i2c-ack-section').insertBefore(waveContainer, steps);

    function animate() {
        reset();
        
        // Prepare data for square wave visualization
        // For ACK: SCL and SDA (SDA pulled low by receiver = ACK)
        const sclDataAck = [0, 1, 0];
        const sdaDataAck = [1, 0, 1]; // SDA goes low during ACK bit
        
        // For NACK: SCL and SDA (SDA remains high = NACK)
        const sclDataNack = [0, 1, 0];
        const sdaDataNack = [1, 1, 1]; // SDA stays high during NACK bit
        
        // Create ACK visualization
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
        
        // Create NACK visualization
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
        
        // Add explanation
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

        // Animate ACK bits
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

        // Animate NACK bits
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

    function reset() {
        // Clear wave container
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
        
        steps.classList.remove('visible');
        stepsBtn.textContent = 'Show Steps';
    }

    animateBtn.addEventListener('click', animate);
    stepsBtn.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn.addEventListener('click', reset);
    
    // Add styles for ACK/NACK visualization
    const style = document.createElement('style');
    style.textContent = `
        .i2c-section-title {
            font-size: 1em;
            color: #16c79a;
            margin: 10px 0;
            font-weight: bold;
        }
        .ack-container {
            margin-top: 20px;
            padding: 15px;
            background: rgba(26, 26, 46, 0.7);
            border-radius: 8px;
            border-left: 3px solid #16c79a;
        }
        .ack-title {
            font-size: 1.1em;
            color: #16c79a;
            margin-bottom: 10px;
            font-weight: bold;
        }
        .ack-row {
            margin: 8px 0;
            display: flex;
            align-items: center;
        }
        .ack-label {
            width: 80px;
            color: #e6e6e6;
            font-weight: bold;
        }
        .ack-value {
            width: 200px;
            font-family: monospace;
            background: rgba(22, 199, 154, 0.1);
            padding: 2px 5px;
            border-radius: 3px;
            margin-right: 10px;
        }
        .ack-meaning {
            color: #b8b8b8;
            font-style: italic;
        }
        .ack-row.usage {
            margin-top: 15px;
            padding-top: 10px;
            border-top: 1px dashed rgba(22, 199, 154, 0.3);
        }
        .ack-usage {
            color: #ff9900;
        }
    `;
    document.head.appendChild(style);
    
    reset();
}

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
    initSpiWordAnimation();
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
});

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all HW6 animations
    if (document.getElementById('spi-word-section')) {
        initSpiWordAnimation();
    }

    // Back to top button functionality
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.onscroll = function() {
            if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
                backToTopBtn.style.display = 'block';
            } else {
                backToTopBtn.style.display = 'none';
            }
        };
        
        backToTopBtn.onclick = function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
    }
});
