function initSpiWordAnimation() {
    const spiWordContainer = document.getElementById('spi-word-animation');
    const stepsContainer = document.getElementById('spi-word-steps');
    const step1 = document.getElementById('spi-word-step1');
    const step2 = document.getElementById('spi-word-step2');
    const step3 = document.getElementById('spi-word-step3');
    const step4 = document.getElementById('spi-word-step4');
    const step5 = document.getElementById('spi-word-step5');
    const steps = [step1, step2, step3, step4, step5];

    spiWordContainer.innerHTML = `
        <div class="signal-container nss">
            <div class="signal-label">NSS</div>
            <div class="signal-bits spi-word-nss">
                ${Array(1).fill('<span class="bit"></span>').join('')}
            </div>
        </div>
        <div class="signal-container sck">
            <div class="signal-label">SCK</div>
            <div class="signal-bits spi-word-sck">
                ${Array(32).fill('<span class="bit"></span>').join('')}
            </div>
        </div>
        <div class="signal-container mosi">
            <div class="signal-label">MOSI</div>
            <div class="signal-bits spi-word-mosi">
                ${Array(16).fill('<span class="bit"></span>').join('')}
            </div>
        </div>
    `;

    const containers = [
        document.querySelector('.spi-word-nss'),
        document.querySelector('.spi-word-sck'),
        document.querySelector('.spi-word-mosi')
    ];

    document.getElementById('animate-spi-word').addEventListener('click', () => {
        animateSpiWord(containers, steps);
    });
}

function resetAnimation(containers, steps) {
    steps.forEach(step => step.classList.remove('active'));
    containers.forEach(container => {
        Array.from(container.children).forEach(bit => {
            bit.className = 'bit'; // Reset to default 'bit' class
            bit.textContent = ''; // Clear any text content
        });
    });
     // For NSS, ensure it starts high
    const signalBitsNSS = containers[0];
    signalBitsNSS.innerHTML = '<span class="bit high">1</span>';
}


function animateSpiWord(containers, steps) {
    resetAnimation(containers, steps);
    // Now containers[0]=NSS, containers[1]=SCK, containers[2]=MOSI
    const signalBitsNSS = containers[0];
    const signalBitsSCK = containers[1];
    const signalBitsMOSI = containers[2];
    const signal = '110001000010110';
    const numBits = signal.length;

    // Animate NSS - go low for the entire transmission
    signalBitsNSS.innerHTML = '<span class="bit high active">1</span>'; // Start high
    setTimeout(() => {
        signalBitsNSS.innerHTML = '<span class="bit low active">0</span>'; // Go low for transmission
    }, 500); // Small delay before transmission starts

    signal.split('').forEach((bit, i) => {
        setTimeout(() => {
            // MOSI Animation
            signalBitsMOSI.children[i].classList.add('active');
            signalBitsMOSI.children[i].classList.toggle('high', bit === '1');
            signalBitsMOSI.children[i].classList.toggle('low', bit === '0');
            signalBitsMOSI.children[i].textContent = bit;

            // SCK Animation - Clock signal (Rising and Falling edges)
            const sckBitIndex = i * 2; // Each data bit needs 2 SCK states (low and high)

            if (sckBitIndex < signalBitsSCK.children.length) {
                const sckBitLow = signalBitsSCK.children[sckBitIndex]; // Get the SCK bit for falling edge
                const sckBitHigh = signalBitsSCK.children[sckBitIndex + 1]; // Get the SCK bit for rising edge

                if (sckBitLow && sckBitHigh) { // Check if elements are valid before manipulating
                    sckBitLow.classList.add('active');
                    sckBitLow.classList.remove('low'); // Ensure 'low' class is removed first
                    sckBitLow.classList.add('high');  // Then add 'high'

                    sckBitHigh.classList.add('active');
                    sckBitHigh.classList.remove('high'); // Ensure 'high' is removed
                    sckBitHigh.classList.add('low');   // Then add 'low'

                    console.log(`SCK Bit Index: ${sckBitIndex}, Setting SCK bits high then low`); // Debugging log
                } else {
                    console.warn(`SCK bit elements at index ${sckBitIndex} or ${sckBitIndex + 1} not found!`); // Debugging warning
                }
            } else {
                console.warn(`sckBitIndex ${sckBitIndex} out of range for SCK children!`); // Index out of bounds warning
            }


        }, (i * 600) + 500); // Adjusted timing for SCK visibility + NSS delay
    });

    // Reset NSS to high after transmission
    setTimeout(() => {
        signalBitsNSS.innerHTML = '<span class="bit high active">1</span>'; // NSS back to high
        highlightSteps(steps); // Highlight steps after all bits animated
    }, (numBits * 600) + 1000); // Total animation time + some extra delay
}


function highlightSteps(steps) {
  if (!steps || steps.classList.contains('hidden')) return;

  const stepElements = Array.from(steps);
  stepElements.forEach((step, index) => {
    setTimeout(() => {
      step.classList.add('active-step');
    }, (index * 1500));
  });
}


function initUartEncodeAnimation() {
    const inputField = document.getElementById('uart-encode-input');
    const binaryOutput = document.getElementById('uart-encode-binary-output');
    const encodeBtn = document.getElementById('uart-encode-btn');

    if (!inputField || !binaryOutput || !encodeBtn) {
        console.error("UART encode elements not found!");
        return;
    }

    encodeBtn.addEventListener('click', () => {
        const text = inputField.value;
        const binary = textToBinary(text);
        binaryOutput.textContent = binary;
    });
}

function textToBinary(text) {
    let binaryString = '';
    for (let i = 0; i < text.length; i++) {
        const binaryChar = text.charCodeAt(i).toString(2);
        binaryString += binaryChar.padStart(8, '0') + ' '; // Pad to 8 bits and add space
    }
    return binaryString.trim();
}


function initUartWordAnimation() {
    const signalBits = document.getElementById('uart-word-signal');

    if (!signalBits) {
        console.error("UART signal bits element not found!");
        return;
    }

    // Initialize with empty bits for start, data bits, stop, parity
    signalBits.innerHTML = Array(11).fill('<span class="bit low">0</span>').join(''); //default to low

    const animateBtn = document.getElementById('uart-word-animate-btn');
    const stepsBtn = document.getElementById('uart-word-steps-btn');
    const resetBtn = document.getElementById('uart-word-reset-btn');
    const steps = document.getElementById('uart-word-steps');

    animateBtn?.addEventListener('click', () => animateUartWord(signalBits, steps));
    stepsBtn?.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn?.addEventListener('click', () => resetAnimation(signalBits, steps, stepsBtn));
}


function animateUartWord(signalBits, steps) {
    resetAnimation(signalBits, steps);
    const word = '1011010'; // 7 bits data
    const parityBit = calculateParity(word, 'even'); // Example: Even parity
    const uartSignal = '0' + word + parityBit + '1'; // Start bit + 7 data bits + parity + stop bit (LSB first)

    signalBits.innerHTML = ''; // Clear existing bits

    uartSignal.split('').forEach((bit, i) => {
        const bitElement = document.createElement('span');
        bitElement.classList.add('bit');
        bitElement.textContent = bit;

        setTimeout(() => {
            bitElement.classList.add('active'); // Add active class during animation
            bitElement.classList.toggle('high', bit === '1');
            bitElement.classList.toggle('low', bit === '0');
        }, i * 750); // Adjust timing for bit visibility

        signalBits.appendChild(bitElement);
    });

        setTimeout(() => {
            step.classList.add('active-step');
        }, (index * 1500)); // Delay for each step highlight
    setTimeout(() => {
        highlightSteps(steps);
    }, (uartSignal.length * 750)); // Delay highlighting steps until after bit animation
}


function initParityAnimation() {
    const inputField = document.getElementById('parity-input');
    const parityType = document.getElementById('parity-type');
    const parityOutput = document.getElementById('parity-output');
    const calculateBtn = document.getElementById('parity-calculate-btn');

    if (!inputField || !parityType || !parityOutput || !calculateBtn) {
        console.error("Parity elements not found!");
        return;
    }

    calculateBtn.addEventListener('click', () => {
        const binaryWord = inputField.value;
        const selectedParity = parityType.value;
        const parityBit = calculateParity(binaryWord, selectedParity);
        parityOutput.textContent = parityBit;
    });
}

function calculateParity(binaryWord, parityType) {
    const bitCount = binaryWord.split('').filter(bit => bit === '1').length;
    if (parityType === 'even') {
        return (bitCount % 2 === 0) ? '0' : '1'; // Even parity: 0 if even 1s, 1 if odd
    } else if (parityType === 'odd') {
        return (bitCount % 2 !== 0) ? '0' : '1'; // Odd parity: 0 if odd 1s, 1 if even
    }
    return '?'; // Unknown parity type
}


function initBaudRateAnimation() {
    const baudRateInput = document.getElementById('baud-rate-input');
    const bitDurationOutput = document.getElementById('bit-duration-output');

    if (!baudRateInput || !bitDurationOutput) {
        console.error("Baud rate elements not found!");
        return;
    }

    baudRateInput.addEventListener('input', () => {
        const baudRate = parseFloat(baudRateInput.value);
        if (!isNaN(baudRate) && baudRate > 0) {
            const bitDurationMs = (1 / baudRate) * 1000; // Duration in milliseconds
            bitDurationOutput.textContent = bitDurationMs.toFixed(2) + ' ms';
        } else {
            bitDurationOutput.textContent = 'Invalid Baud Rate';
        }
    });
}


function initI2cConfigAnimation() {
    const configDiagram = document.getElementById('i2c-config-diagram');
    const configCode = document.getElementById('i2c-config-code');
    const configSelect = document.getElementById('i2c-config-select');

    if (!configDiagram || !configCode || !configSelect) {
        console.error("I2C config elements not found!");
        return;
    }

    configSelect.addEventListener('change', (event) => {
        const selectedConfig = event.target.value;
        configDiagram.src = `assets/i2c-config-${selectedConfig}.png`; // Update diagram image
        configCode.textContent = getI2cConfigCode(selectedConfig); // Update code snippet
    });
}

function getI2cConfigCode(configName) {
    switch (configName) {
        case 'standard':
            return `// Standard Mode (100 kHz)
Wire.begin(); // Join I2C bus as master (default pins)`;
        case 'fast':
            return `// Fast Mode (400 kHz)
Wire.begin();
Wire.setClock(400000); // Set clock to 400 kHz`;
        case 'fast-plus':
            return `// Fast-Plus Mode (1 MHz) - Check device support
Wire.begin();
Wire.setClock(1000000); // Set clock to 1 MHz`;
        default:
            return '// Select I2c mode from dropdown';
    }
}


function initI2cAckAnimation() {
    const signalBitsSDA = document.getElementById('i2c-ack-sda');
    const signalBitsSCL = document.getElementById('i2c-ack-scl');

    if (!signalBitsSDA || !signalBitsSCL) {
        console.error("I2C ACK signal elements not found!");
        return;
    }

    signalBitsSDA.innerHTML = Array(9).fill('<span class="bit high">1</span>').join(''); // 8 data bits + ACK bit, initialize all high
    signalBitsSCL.innerHTML = Array(9).fill('<span class="bit low">0</span>').join('');

    const animateBtn = document.getElementById('i2c-ack-animate-btn');
    const stepsBtn = document.getElementById('i2c-ack-steps-btn');
    const resetBtn = document.getElementById('i2c-ack-reset-btn');
    const steps = document.getElementById('i2c-ack-steps');

    animateBtn?.addEventListener('click', () => animateI2cAck(signalBitsSDA, signalBitsSCL, steps));
    stepsBtn?.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn?.addEventListener('click', () => resetAnimation([signalBitsSDA, signalBitsSCL], steps, stepsBtn)); // Pass both SDA and SCL for reset
}


function animateI2cAck(signalBitsSDA, signalBitsSCL, steps) {
    resetAnimation([signalBitsSDA, signalBitsSCL], steps);
    const dataBits = '10101010'; // Example data byte
    const ackBit = '0'; // Acknowledge bit (0 for ACK, 1 for NACK)
    const i2cSequence = dataBits + ackBit;

    signalBitsSDA.innerHTML = ''; // Clear existing bits
    signalBitsSCL.innerHTML = '';

    i2cSequence.split('').forEach((bit, i) => {
        const sdaBitElement = document.createElement('span');
        sdaBitElement.classList.add('bit');
        sdaBitElement.textContent = bit;

        const sclBitElement = document.createElement('span');
        sclBitElement.classList.add('bit');
        sclBitElement.classList.add('low'); // SCL starts low

        setTimeout(() => {
            sdaBitElement.classList.add('active');
            sdaBitElement.classList.toggle('high', bit === '1');
            sdaBitElement.classList.toggle('low', bit === '0');
            signalBitsSCL.appendChild(sclBitElement); // Add SCL bit for each SDA bit
            signalBitsSDA.appendChild(sdaBitElement); // Add SDA bit
        }, i * 600);

        setTimeout(() => {
             sclBitElement.classList.add('active'); // Make SCL active when it goes high
             sclBitElement.classList.add('high'); // SCL goes high after SDA is set
        }, (i * 600) + 300); // SCL pulse after SDA changes, adjust timing as needed
    });

    //ACK bit animation - SDA pulled low by receiver during 9th clock pulse
    setTimeout(() => {
        signalBitsSDA.children[8].classList.add('active'); // Highlight ACK bit
        signalBitsSDA.children[8].classList.remove('high'); // Pull SDA low for ACK
        signalBitsSDA.children[8].classList.add('low');
        signalBitsSDA.children[8].textContent = ackBit;

        const sclBitElement = document.createElement('span');
        sclBitElement.classList.add('bit');
        sclBitElement.classList.add('active');
        sclBitElement.classList.add('high');
        signalBitsSCL.appendChild(sclBitElement); // Add 9th SCL clock pulse for ACK

    }, 8 * 600);

    setTimeout(() => {
        highlightSteps(steps);
    }, (i2cSequence.length * 600) + 600 ); //steps highlight after animation + ACK pulse
}



function initParityErrorAnimation() {
    const receivedDataField = document.getElementById('parity-error-received-data');
    const calculatedParityField = document.getElementById('parity-error-calculated-parity');
    const receivedParityField = document.getElementById('parity-error-received-parity');
    const errorStatusField = document.getElementById('parity-error-status');
    const checkBtn = document.getElementById('parity-error-check-btn');
    const parityTypeSelect = document.getElementById('parity-error-parity-type');


    if (!receivedDataField || !calculatedParityField || !receivedParityField || !errorStatusField || !checkBtn || !parityTypeSelect) {
        console.error("Parity error elements not found!");
        return;
    }

    checkBtn.addEventListener('click', () => {
        const receivedBinary = receivedDataField.value;
        const receivedParity = receivedParityField.value;
        const selectedParityType = parityTypeSelect.value;

        const calculatedParity = calculateParity(receivedBinary, selectedParityType);
        calculatedParityField.textContent = calculatedParity;

        const errorDetected = (calculatedParity !== receivedParity);
        errorStatusField.textContent = errorDetected ? 'Error Detected' : 'No Error';
        errorStatusField.className = errorDetected ? 'error-detected' : 'no-error'; // For CSS styling
    });
}


function initI2cAddressAnimation() {
    const addressInput = document.getElementById('i2c-address-input');
    const binaryOutput = document.getElementById('i2c-address-binary-output');
    const typeOutput = document.getElementById('i2c-address-type-output');
    const addressBtn = document.getElementById('i2c-address-calculate-btn');

    if (!addressInput || !binaryOutput || !typeOutput || !addressBtn) {
        console.error("I2C address elements not found!");
        return;
    }

    addressBtn.addEventListener('click', () => {
        const addressValue = parseInt(addressInput.value);
        if (!isNaN(addressValue) && addressValue >= 0 && addressValue <= 127) {
            const binaryAddress = addressValue.toString(2).padStart(7, '0');
            binaryOutput.textContent = binaryAddress;
            typeOutput.textContent = determineAddressType(binaryAddress);
        } else {
            binaryOutput.textContent = 'Invalid Address';
            typeOutput.textContent = '';
        }
    });
}

function determineAddressType(binaryAddress) {
    if (binaryAddress.startsWith('000')) {
        return 'Reserved for CBUS addresses';
    } else if (binaryAddress.startsWith('001')) {
        return 'Reserved for different formats';
    } else if (binaryAddress.startsWith('010')) {
        return 'Reserved for High-speed master codes';
    } else if (binaryAddress.startsWith('01111')) {
        return '10-bit addressing extension';
    } else if (binaryAddress === '1111111') {
        return 'General call address';
    } else if (binaryAddress === '1111110') {
        return 'Start byte';
    } else {
        return 'Standard 7-bit address';
    }
}


// Utility functions for steps and reset - re-used across animations
function toggleSteps(stepsElement, buttonElement) {
    stepsElement.classList.toggle('hidden');
    buttonElement.textContent = stepsElement.classList.contains('hidden') ? 'Show Steps' : 'Hide Steps';
}

function resetAnimation(signalContainers, stepsElement, stepsButton) {
    if (!Array.isArray(signalContainers)) {
        signalContainers = [signalContainers]; // Handle single container case
    }
    signalContainers.forEach(container => {
        if (container) {
            const initialBits = container.dataset.initialState;
            if (initialBits) {
                container.innerHTML = initialBits;
            } else {
                container.innerHTML = container.innerHTML.replace(/<span class="bit.*?<\/span>/g, '<span class="bit low">0</span>'); // Default reset to low if no initial state
            }
        }
    });
    if (stepsElement) {
        stepsElement.classList.add('hidden');
        if (stepsButton) {
            stepsButton.textContent = 'Show Steps'; // Reset button text as well
        }
        resetHighlightSteps(stepsElement); //remove any step highlights
    }
}


function highlightSteps(steps) {
    if (!steps || steps.classList.contains('hidden')) return; //do not highlight if hidden

    const stepElements = Array.from(steps); // Ensure steps is treated as an array of elements
    stepElements.forEach((step, index) => {
        setTimeout(() => {
            step.classList.add('active-step'); // Highlight current step
        }, (index * 1500)); // Delay for each step highlight
    });
}

function resetHighlightSteps(stepsElement) {
    if (!stepsElement) return;
    const steps = Array.from(stepsElement.children);
    steps.forEach(step => {
        step.classList.remove('active-step'); // Remove highlight from all steps
    });
}
