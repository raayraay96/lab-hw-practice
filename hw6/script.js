document.addEventListener('DOMContentLoaded', () => {
    initSpiWordAnimation();
    initSpiValueAnimation();
    initUartEncodeAnimation();
    initUartWordAnimation();
    initParityAnimation();
    initBaudRateAnimation();
    initI2cConfigAnimation();
    initI2cAckAnimation();
    initParityErrorAnimation();
    initI2cAddressAnimation();
});

// Utility function to reset animation
function resetAnimation(containers, steps, stepsBtn) {
    containers.forEach(container => {
        if (container) {
            Array.from(container.children).forEach(bit => {
                bit.classList.remove('active', 'high', 'low');
                bit.textContent = '0';
            });
        }
    });
    hideSteps(steps, stepsBtn);
}

// Utility function to toggle steps visibility
function toggleSteps(steps, stepsBtn) {
    if (steps.style.display === 'block') {
        hideSteps(steps, stepsBtn);
    } else {
        steps.style.display = 'block';
        stepsBtn.textContent = 'Hide Steps';
    }
}

// Utility function to hide steps
function hideSteps(steps, stepsBtn) {
    steps.style.display = 'none';
    stepsBtn.textContent = 'Show Steps';
}

// Utility function to highlight steps
function highlightSteps(steps) {
    if (steps) {
        steps.classList.add('highlighted');
        setTimeout(() => steps.classList.remove('highlighted'), 500);
    }
}

// Initialize each animation section
function initSpiWordAnimation() {
    const signalBitsMOSI = document.getElementById('spi-word-mosi');
    const signalBitsNSS = document.getElementById('spi-word-nss');
    const signalBitsSCK = document.getElementById('spi-word-sck');

    if (!signalBitsMOSI || !signalBitsNSS || !signalBitsSCK) {
        console.error("One or more SPI word elements not found!");
        return;
    }

    signalBitsMOSI.innerHTML = Array(15).fill('<span class="bit low">0</span>').join('');
    signalBitsNSS.innerHTML = Array(15).fill('<span class="bit low">0</span>').join('');
    signalBitsSCK.innerHTML = Array(15).fill('<span class="bit low">0</span>').join('');

    const animateBtn = document.getElementById('spi-word-animate-btn');
    const stepsBtn = document.getElementById('spi-word-steps-btn');
    const resetBtn = document.getElementById('spi-word-reset-btn');
    const steps = document.getElementById('spi-word-steps');

    animateBtn?.addEventListener('click', () => {
        animateSpiWord([signalBitsMOSI, signalBitsNSS, signalBitsSCK], steps, stepsBtn);
    });

    stepsBtn?.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn?.addEventListener('click', () => resetAnimation([signalBitsMOSI, signalBitsNSS, signalBitsSCK], steps, stepsBtn));
}

function initSpiValueAnimation() {
    const signalBits = document.getElementById('spi-value-mosi');
    if (!signalBits) return;

    signalBits.innerHTML = Array(15).fill('<span class="bit low">0</span>').join('');

    const animateBtn = document.getElementById('spi-value-animate-btn');
    const stepsBtn = document.getElementById('spi-value-steps-btn');
    const resetBtn = document.getElementById('spi-value-reset-btn');
    const steps = document.getElementById('spi-value-steps');

    animateBtn?.addEventListener('click', () => {
        animateSpiValue([signalBits], steps, stepsBtn);
    });

    stepsBtn?.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn?.addEventListener('click', () => resetAnimation([signalBits], steps, stepsBtn));
}

function initUartEncodeAnimation() {
    const signalBits = document.getElementById('uart-encode-signal');
    if (!signalBits) return;

    signalBits.innerHTML = Array(10).fill('<span class="bit low">0</span>').join('');

    const animateBtn = document.getElementById('uart-encode-animate-btn');
    const stepsBtn = document.getElementById('uart-encode-steps-btn');
    const resetBtn = document.getElementById('uart-encode-reset-btn');
    const steps = document.getElementById('uart-encode-steps');
    const inputByte = document.getElementById('uart-input-byte');

    animateBtn?.addEventListener('click', () => {
        const byte = parseInt(inputByte.value, 16);
        animateUartEncode([signalBits], steps, stepsBtn, byte);
    });

    stepsBtn?.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn?.addEventListener('click', () => resetAnimation([signalBits], steps, stepsBtn));
}

function initUartWordAnimation() {
    const signalBits = document.getElementById('uart-word-signal');
    if (!signalBits) return;

    signalBits.innerHTML = Array(10).fill('<span class="bit low">0</span>').join('');

    const animateBtn = document.getElementById('uart-word-animate-btn');
    const stepsBtn = document.getElementById('uart-word-steps-btn');
    const resetBtn = document.getElementById('uart-word-reset-btn');
    const steps = document.getElementById('uart-word-steps');

    animateBtn?.addEventListener('click', () => {
        animateUartWord([signalBits], steps, stepsBtn);
    });

    stepsBtn?.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn?.addEventListener('click', () => resetAnimation([signalBits], steps, stepsBtn));
}

function initParityAnimation() {
    const signalBits = document.getElementById('parity-data');
    if (!signalBits) return;

    signalBits.innerHTML = Array(9).fill('<span class="bit low">0</span>').join('');

    const animateBtn = document.getElementById('parity-animate-btn');
    const stepsBtn = document.getElementById('parity-steps-btn');
    const resetBtn = document.getElementById('parity-reset-btn');
    const steps = document.getElementById('parity-steps');

    animateBtn?.addEventListener('click', () => {
        animateParity([signalBits], steps, stepsBtn);
    });

    stepsBtn?.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn?.addEventListener('click', () => resetAnimation([signalBits], steps, stepsBtn));
}

function initBaudRateAnimation() {
    const signalBits = document.getElementById('baud-rate-signal');
    if (!signalBits) return;

    signalBits.innerHTML = Array(10).fill('<span class="bit low">0</span>').join('');

    const animateBtn = document.getElementById('baud-rate-animate-btn');
    const stepsBtn = document.getElementById('baud-rate-steps-btn');
    const resetBtn = document.getElementById('baud-rate-reset-btn');
    const steps = document.getElementById('baud-rate-steps');

    animateBtn?.addEventListener('click', () => {
        animateBaudRate([signalBits], steps, stepsBtn);
    });

    stepsBtn?.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn?.addEventListener('click', () => resetAnimation([signalBits], steps, stepsBtn));
}

function initI2cConfigAnimation() {
    const signalBits = document.getElementById('i2c-config-sda');
    if (!signalBits) return;

    signalBits.innerHTML = '<div class="i2c-config"></div>';

    const animateBtn = document.getElementById('i2c-config-animate-btn');
    const stepsBtn = document.getElementById('i2c-config-steps-btn');
    const resetBtn = document.getElementById('i2c-config-reset-btn');
    const steps = document.getElementById('i2c-config-steps');

    animateBtn?.addEventListener('click', () => {
        animateI2cConfig([signalBits], steps, stepsBtn);
    });

    stepsBtn?.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn?.addEventListener('click', () => resetAnimation([signalBits], steps, stepsBtn));
}

function initI2cAckAnimation() {
    const ackSignal = document.getElementById('i2c-ack-signal');
    const nackSignal = document.getElementById('i2c-nack-signal');
    if (!ackSignal || !nackSignal) return;

    ackSignal.innerHTML = Array(5).fill('<span class="bit low">0</span>').join('');
    nackSignal.innerHTML = Array(5).fill('<span class="bit low">0</span>').join('');

    const animateBtn = document.getElementById('i2c-ack-animate-btn');
    const stepsBtn = document.getElementById('i2c-ack-steps-btn');
    const resetBtn = document.getElementById('i2c-ack-reset-btn');
    const steps = document.getElementById('i2c-ack-steps');

    animateBtn?.addEventListener('click', () => {
        animateI2cAck([ackSignal, nackSignal], steps, stepsBtn);
    });

    stepsBtn?.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn?.addEventListener('click', () => resetAnimation([ackSignal, nackSignal], steps, stepsBtn));
}

function initParityErrorAnimation() {
    const signalBits = document.getElementById('parity-error-signal');
    if (!signalBits) return;

    signalBits.innerHTML = Array(10).fill('<span class="bit low">0</span>').join('');

    const animateBtn = document.getElementById('parity-error-animate-btn');
    const stepsBtn = document.getElementById('parity-error-steps-btn');
    const resetBtn = document.getElementById('parity-error-reset-btn');
    const steps = document.getElementById('parity-error-steps');

    animateBtn?.addEventListener('click', () => {
        animateParityError([signalBits], steps, stepsBtn);
    });

    stepsBtn?.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn?.addEventListener('click', () => resetAnimation([signalBits], steps, stepsBtn));
}

function initI2cAddressAnimation() {
    const signalBits = document.getElementById('i2c-address-sda');
    if (!signalBits) return;

    signalBits.innerHTML = Array(8).fill('<span class="bit low">0</span>').join('');

    const animateBtn = document.getElementById('i2c-address-animate-btn');
    const stepsBtn = document.getElementById('i2c-address-steps-btn');
    const resetBtn = document.getElementById('i2c-address-reset-btn');
    const steps = document.getElementById('i2c-address-steps');

    animateBtn?.addEventListener('click', () => {
        animateI2cAddress([signalBits], steps, stepsBtn);
    });

    stepsBtn?.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn?.addEventListener('click', () => resetAnimation([signalBits], steps, stepsBtn));
}

function animateSpiWord(containers, steps, stepsBtn) {
    resetAnimation(containers, steps, stepsBtn);
    const signalBitsMOSI = containers[0];
    const signalBitsNSS = containers[1];
    const signalBitsSCK = containers[2];

    const signal = '110001000010110';

    signal.split('').forEach((bit, i) => {
        setTimeout(() => {
            signalBitsMOSI.children[i].classList.add('active');
            signalBitsMOSI.children[i].classList.toggle('high', bit === '1');
            signalBitsMOSI.children[i].classList.toggle('low', bit === '0');
            signalBitsMOSI.children[i].textContent = bit;

            signalBitsNSS.children[i].classList.add('active');
            signalBitsNSS.children[i].classList.toggle('high', i === 0);
            signalBitsNSS.children[i].classList.toggle('low', i !== 0);
            signalBitsNSS.children[i].textContent = i === 0 ? '1' : '0';

            signalBitsSCK.children[i].classList.add('active');
            signalBitsSCK.children[i].classList.toggle('high', i % 2 !== 0);
            signalBitsSCK.children[i].classList.toggle('low', i % 2 === 0);
            signalBitsSCK.children[i].textContent = i % 2 !== 0 ? '1' : '0';
        }, i * 300);
    });

    setTimeout(() => highlightSteps(steps), signal.length * 300 + 500);
}

function animateSpiValue(containers, steps, stepsBtn) {
    resetAnimation(containers, steps, stepsBtn);
    const signalBits = containers[0];
    const signal = '110001000010110';

    signal.split('').forEach((bit, i) => {
        setTimeout(() => {
            signalBits.children[i].classList.add('active');
            signalBits.children[i].classList.toggle('high', bit === '1');
            signalBits.children[i].classList.toggle('low', bit === '0');
            signalBits.children[i].textContent = bit;
        }, i * 300);
    });

    setTimeout(() => highlightSteps(steps), signal.length * 300 + 500);
}

function animateUartEncode(containers, steps, stepsBtn, byte) {
    resetAnimation(containers, steps, stepsBtn);
    const signalBits = containers[0];
    let binaryString = byte.toString(2).padStart(8, '0');
    const signal = '0' + binaryString + '1'; // Start bit + Data + Stop bit

    signal.split('').forEach((bit, i) => {
        setTimeout(() => {
            signalBits.children[i].classList.add('active');
            signalBits.children[i].classList.toggle('high', bit === '1');
            signalBits.children[i].classList.toggle('low', bit === '0');
            signalBits.children[i].textContent = bit;
        }, i * 300);
    });

    setTimeout(() => highlightSteps(steps), signal.length * 300 + 500);
}

function animateUartWord(containers, steps, stepsBtn) {
    resetAnimation(containers, steps, stepsBtn);
    const signalBits = containers[0];
    const signal = '0100100110'; // First frame for 'd'

    signal.split('').forEach((bit, i) => {
        setTimeout(() => {
            signalBits.children[i].classList.add('active');
            signalBits.children[i].classList.toggle('high', bit === '1');
            signalBits.children[i].classList.toggle('low', bit === '0');
            signalBits.children[i].textContent = bit;
        }, i * 300);
    });

    setTimeout(() => highlightSteps(steps), signal.length * 300 + 500);
}

function animateParity(containers, steps, stepsBtn) {
    resetAnimation(containers, steps, stepsBtn);
    const signalBits = containers[0];
    const signal = '101010101'; // Data (10101010) + Parity bit (1)

    signal.split('').forEach((bit, i) => {
        setTimeout(() => {
            signalBits.children[i].classList.add('active');
            signalBits.children[i].classList.toggle('high', bit === '1');
            signalBits.children[i].classList.toggle('low', bit === '0');
            signalBits.children[i].textContent = bit;
        }, i * 300);
    });

    setTimeout(() => highlightSteps(steps), signal.length * 300 + 500);
}

function animateBaudRate(containers, steps, stepsBtn) {
    resetAnimation(containers, steps, stepsBtn);
    const signalBits = containers[0];
    const signal = '0101010101'; // Example UART frame

    signal.split('').forEach((bit, i) => {
        setTimeout(() => {
            signalBits.children[i].classList.add('active');
            signalBits.children[i].classList.toggle('high', bit === '1');
            signalBits.children[i].classList.toggle('low', bit === '0');
            signalBits.children[i].textContent = bit;
        }, i * 300);
    });

    setTimeout(() => highlightSteps(steps), signal.length * 300 + 500);
}

function animateI2cConfig(containers, steps, stepsBtn) {
    // This would be a more complex animation showing I2C open-drain behavior
    // For now, we'll just highlight the steps
    setTimeout(() => highlightSteps(steps), 1000);
}

function animateI2cAck(containers, steps, stepsBtn) {
    resetAnimation(containers, steps, stepsBtn);
    const ackSignal = containers[0];
    const nackSignal = containers[1];

    const ackBits = '00100'; // SDA pulled low for ACK
    const nackBits = '11111'; // SDA remains high for NACK

    ackBits.split('').forEach((bit, i) => {
        setTimeout(() => {
            ackSignal.children[i].classList.add('active');
            ackSignal.children[i].classList.toggle('high', bit === '1');
            ackSignal.children[i].classList.toggle('low', bit === '0');
            ackSignal.children[i].textContent = bit;
        }, i * 300);
    });

    nackBits.split('').forEach((bit, i) => {
        setTimeout(() => {
            nackSignal.children[i].classList.add('active');
            nackSignal.children[i].classList.toggle('high', bit === '1');
            nackSignal.children[i].classList.toggle('low', bit === '0');
            nackSignal.children[i].textContent = bit;
        }, i * 300);
    });

    setTimeout(() => highlightSteps(steps), Math.max(ackBits.length, nackBits.length) * 300 + 500);
}

function animateParityError(containers, steps, stepsBtn) {
    resetAnimation(containers, steps, stepsBtn);
    const signalBits = containers[0];
    const signal = '1010101000'; // Data (10101010) + Parity bit (0) - even parity when odd expected

    signal.split('').forEach((bit, i) => {
        setTimeout(() => {
            signalBits.children[i].classList.add('active');
            signalBits.children[i].classList.toggle('high', bit === '1');
            signalBits.children[i].classList.toggle('low', bit === '0');
            signalBits.children[i].textContent = bit;
        }, i * 300);
    });

    setTimeout(() => highlightSteps(steps), signal.length * 300 + 500);
}

function animateI2cAddress(containers, steps, stepsBtn) {
    resetAnimation(containers, steps, stepsBtn);
    const signalBits = containers[0];
    const signal = '01110100'; // Address bits (0111010) + R/W bit (0)

    signal.split('').forEach((bit, i) => {
        setTimeout(() => {
            signalBits.children[i].classList.add('active');
            signalBits.children[i].classList.toggle('high', bit === '1');
            signalBits.children[i].classList.toggle('low', bit === '0');
            signalBits.children[i].textContent = bit;
        }, i * 300);
    });

    setTimeout(() => highlightSteps(steps), signal.length * 300 + 500);
}