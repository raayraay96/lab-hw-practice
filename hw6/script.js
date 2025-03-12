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

// Initialize each animation section
function initSpiWordAnimation() {
    // Corrected ID to target spi-word-mosi
    const signalBitsMOSI = document.getElementById('spi-word-mosi');
    if (!signalBitsMOSI) {
        console.error("Element with ID 'spi-word-mosi' not found!"); // Error logging for debugging
        return;
    }

    signalBitsMOSI.innerHTML = Array(15).fill('<span class="bit low">0</span>').join('');

    const animateBtn = document.getElementById('spi-word-animate-btn');
    const stepsBtn = document.getElementById('spi-word-steps-btn');
    const resetBtn = document.getElementById('spi-word-reset-btn');
    const steps = document.getElementById('spi-word-steps');

    animateBtn?.addEventListener('click', () => {
        // Pass the correct container to animateSpiWord
        const containers = [signalBitsMOSI];
        animateSpiWord(containers, steps);
    });

    stepsBtn?.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn?.addEventListener('click', () => resetAnimation(containers, steps, stepsBtn));
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
        const containers = [signalBits];
        animateSpiValue(containers, steps);
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

    animateBtn?.addEventListener('click', () => {
        const containers = [signalBits];
        animateUartEncode(containers, steps);
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
        const containers = [signalBits];
        animateUartWord(containers, steps);
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
        const containers = [signalBits];
        animateParity(containers, steps);
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
        const containers = [signalBits];
        animateBaudRate(containers, steps);
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
        const containers = [signalBits];
        animateI2cConfig(containers, steps);
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
        const containers = [ackSignal, nackSignal];
        animateI2cAck(containers, steps);
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
        const containers = [signalBits];
        animateParityError(containers, steps);
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
        const containers = [signalBits];
        animateI2cAddress(containers, steps);
    });

    stepsBtn?.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn?.addEventListener('click', () => resetAnimation([signalBits], steps, stepsBtn));
}

function animateSpiWord(containers, steps) {
    resetAnimation(containers, steps);
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

function animateSpiValue(containers, steps) {
    resetAnimation(containers, steps);
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

function animateUartEncode(containers, steps) {
    resetAnimation(containers, steps);
    const signalBits = containers[0];
    const signal = '0110010101'; // Start bit (0) + Data (11001010) + Stop bit (1)

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

function animateUartWord(containers, steps) {
    resetAnimation(containers, steps);
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

function animateParity(containers, steps) {
    resetAnimation(containers, steps);
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

function animateBaudRate(containers, steps) {
    resetAnimation(containers, steps);
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

function animateI2cConfig(containers, steps) {
    // This would be a more complex animation showing I2C open-drain behavior
    // For now, we'll just highlight the steps
    setTimeout(() => highlightSteps(steps), 1000);
}

function animateI2cAck(containers, steps) {
    resetAnimation(containers, steps);
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

function animateParityError(containers, steps) {
    resetAnimation(containers, steps);
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

function animateI2cAddress(containers, steps) {
    resetAnimation(containers, steps);
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
