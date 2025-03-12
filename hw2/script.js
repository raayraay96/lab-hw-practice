// Problem 1: Interrupt Vector Table Contents
function initVectorTableAnimation() {
    const optionsBits = document.getElementById('vector-table-options');
    const steps = document.getElementById('vector-table-steps');
    const animateBtn = document.getElementById('vector-table-animate-btn');
    const stepsBtn = document.getElementById('vector-table-steps-btn');
    const resetBtn = document.getElementById('vector-table-reset-btn');

    const options = ['a', 'b', 'c', 'd', 'e'];
    options.forEach(opt => optionsBits.innerHTML += `<span class="bit low">${opt}</span>`);

    function animate() {
        reset();
        setTimeout(() => {
            const bit = optionsBits.children[2];
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

// Problem 2: ISR Trigger Source
function initIsrCallAnimation() {
    const sourceBits = document.getElementById('isr-call-source');
    const steps = document.getElementById('isr-call-steps');
    const animateBtn = document.getElementById('isr-call-animate-btn');
    const stepsBtn = document.getElementById('isr-call-steps-btn');
    const resetBtn = document.getElementById('isr-call-reset-btn');

    const sources = ['Soft', 'Hard'];
    sources.forEach(src => sourceBits.innerHTML += `<span class="bit low">${src}</span>`);

    function animate() {
        reset();
        setTimeout(() => {
            const bit = sourceBits.children[1];
            bit.classList.remove('low');
            bit.classList.add('high', 'connection');
            setTimeout(() => bit.classList.add('visible'), 100);
        }, 500);
        setTimeout(() => highlightSteps(steps), 1000);
    }

    function reset() {
        [...sourceBits.children].forEach((bit, i) => {
            bit.classList.remove('high', 'connection', 'visible');
            bit.classList.add('low');
            bit.textContent = sources[i];
        });
        steps.classList.remove('visible');
        stepsBtn.textContent = 'Show Steps';
    }

    animateBtn.addEventListener('click', animate);
    stepsBtn.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn.addEventListener('click', reset);
    reset();
}

// Problem 3: Exception Priority & State Saves
function initException1Animation() {
    const flowDiagram = document.getElementById('exception1-flow');
    const steps = document.getElementById('exception1-steps');
    const animateBtn = document.getElementById('exception1-animate-btn');
    const stepsBtn = document.getElementById('exception1-steps-btn');
    const resetBtn = document.getElementById('exception1-reset-btn');

    function createFlowBit(text, id) {
        return `<span class="bit flow-bit" id="${id}">${text}</span>`;
    }
    function createFlowArrow(classes) {
        return `<span class="flow-arrow ${classes}"></span>`;
    }
    function createStackIcon(id) {
        return `
            <div class="stack-icon" id="${id}">
                <span class="stack-frame" id="stack-frame-main">Main State</span>
            </div>`;
    }

    function animate() {
        reset();
        flowDiagram.innerHTML = `
            <div class="flow-row">
                ${createFlowBit('Main Program', 'main-prog-1')}
                ${createStackIcon('stack-1')}
            </div>
            <div class="flow-row">${createFlowArrow('down arrow-1')}</div>
            <div class="flow-row">${createFlowBit('Executing ISR 1', 'isr1-1')}</div>
            <div class="flow-row">${createFlowBit('ISR 2 Pending', 'isr2-pending-1')}</div>
            <div class="flow-row">${createFlowArrow('right arrow-2')}</div>
            <div class="flow-row">${createFlowBit('Executing ISR 2', 'isr2-1')}</div>
        `;

        const mainProg = document.getElementById('main-prog-1');
        const stackFrameMain = document.getElementById('stack-frame-main');
        const arrow1 = document.querySelector('.arrow-1');
        const isr1 = document.getElementById('isr1-1');
        const isr2Pending = document.getElementById('isr2-pending-1');
        const arrow2 = document.querySelector('.arrow-2');
        const isr2 = document.getElementById('isr2-1');

        setTimeout(() => {
            mainProg.classList.add('high');
            stackFrameMain.classList.add('visible');
            setTimeout(() => {
                arrow1.classList.add('visible', 'down');
                setTimeout(() => {
                    isr1.classList.add('high');
                    setTimeout(() => {
                        isr2Pending.classList.add('high');
                        setTimeout(() => {
                            arrow2.classList.add('visible', 'right');
                            setTimeout(() => {
                                isr2.classList.add('high');
                            }, 500);
                        }, 500);
                    }, 500);
                }, 500);
            }, 500);
        }, 500);
        setTimeout(() => highlightSteps(steps), 3000);
    }

    function reset() {
        flowDiagram.innerHTML = '';
        steps.classList.remove('visible');
        stepsBtn.textContent = 'Show Steps';
    }

    animateBtn.addEventListener('click', animate);
    stepsBtn.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn.addEventListener('click', reset);
    reset();
}

// Problem 4: Exception Priority & State Saves
function initException2Animation() {
    const flowDiagram = document.getElementById('exception2-flow');
    const steps = document.getElementById('exception2-steps');
    const animateBtn = document.getElementById('exception2-animate-btn');
    const stepsBtn = document.getElementById('exception2-steps-btn');
    const resetBtn = document.getElementById('exception2-reset-btn');

    function createFlowBit(text, id) {
        return `<span class="bit flow-bit" id="${id}">${text}</span>`;
    }
    function createFlowArrow(classes) {
        return `<span class="flow-arrow ${classes}"></span>`;
    }
    function createStackIcon(id) {
        return `
            <div class="stack-icon" id="${id}">
                <span class="stack-frame" id="stack-frame-main">Main State</span>
                <span class="stack-frame" id="stack-frame-isr1">ISR1 State</span>
            </div>`;
    }

    function animate() {
        reset();
        flowDiagram.innerHTML = `
            <div class="flow-row">
                ${createFlowBit('Main Program', 'main-prog-2')}
                ${createStackIcon('stack-2')}
            </div>
            <div class="flow-row">${createFlowArrow('down arrow-3')}</div>
            <div class="flow-row">${createFlowBit('Executing ISR 1', 'isr1-2')}</div>
            <div class="flow-row">${createFlowBit('ISR 2 Pending (Higher)', 'isr2-pending-2')}</div>
            <div class="flow-row">${createFlowArrow('down arrow-4')}</div>
            <div class="flow-row">${createFlowBit('Executing ISR 2', 'isr2-2')}</div>
        `;

        const mainProg = document.getElementById('main-prog-2');
        const stackFrameMain = document.getElementById('stack-frame-main');
        const stackFrameIsr1 = document.getElementById('stack-frame-isr1');
        const arrow3 = document.querySelector('.arrow-3');
        const isr1 = document.getElementById('isr1-2');
        const isr2Pending = document.getElementById('isr2-pending-2');
        const arrow4 = document.querySelector('.arrow-4');
        const isr2 = document.getElementById('isr2-2');

        setTimeout(() => {
            mainProg.classList.add('high');
            stackFrameMain.classList.add('visible');
            setTimeout(() => {
                arrow3.classList.add('visible', 'down');
                setTimeout(() => {
                    isr1.classList.add('high');
                    stackFrameIsr1.classList.add('visible');
                    setTimeout(() => {
                        isr2Pending.classList.add('high');
                        setTimeout(() => {
                            arrow4.classList.add('visible', 'down');
                            setTimeout(() => {
                                isr2.classList.add('high');
                            }, 500);
                        }, 500);
                    }, 500);
                }, 500);
            }, 500);
        }, 500);
        setTimeout(() => highlightSteps(steps), 3500);
    }

    function reset() {
        flowDiagram.innerHTML = '';
        steps.classList.remove('visible');
        stepsBtn.textContent = 'Show Steps';
    }

    animateBtn.addEventListener('click', animate);
    stepsBtn.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn.addEventListener('click', reset);
    reset();
}

// Problem 5: CPU State Stack at t=16 ms
function initStackAnimation() {
    const stackVisual = document.getElementById('cpu-stack-visual');
    const steps = document.getElementById('stack-steps');
    const animateBtn = document.getElementById('stack-animate-btn');
    const stepsBtn = document.getElementById('stack-steps-btn');
    const resetBtn = document.getElementById('stack-reset-btn');

    function createStackFrame(text, id) {
        return `<span class="stack-frame" id="${id}">${text}</span>`;
    }

    function animate() {
        reset();
        const stages = [
            { text: 'Main Program', delay: 500, id: 'stack-main' },
            { text: 'handle_button', delay: 1500, id: 'stack-button' },
        ];
        stages.forEach(stage => {
            setTimeout(() => {
                stackVisual.innerHTML += createStackFrame(stage.text, stage.id);
                const frame = document.getElementById(stage.id);
                frame.classList.add('visible');
            }, stage.delay);
        });
        setTimeout(() => highlightSteps(steps), 2500);
    }

    function reset() {
        stackVisual.innerHTML = '';
        steps.classList.remove('visible');
        stepsBtn.textContent = 'Show Steps';
    }

    animateBtn.addEventListener('click', animate);
    stepsBtn.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn.addEventListener('click', reset);
    reset();
}

// Problem 6: Program Counter Properties
function initPcAnimation() {
    const optionsBits = document.getElementById('pc-options');
    const steps = document.getElementById('pc-steps');
    const animateBtn = document.getElementById('pc-animate-btn');
    const stepsBtn = document.getElementById('pc-steps-btn');
    const resetBtn = document.getElementById('pc-reset-btn');

    const options = ['a', 'b', 'c', 'd', 'e'];
    options.forEach(opt => optionsBits.innerHTML += `<span class="bit low">${opt}</span>`);

    function animate() {
        reset();
        const correct = [1, 2, 3];
        correct.forEach((idx, i) => {
            setTimeout(() => {
                const bit = optionsBits.children[idx];
                bit.classList.remove('low');
                bit.classList.add('high', 'connection');
                setTimeout(() => bit.classList.add('visible'), 100);
            }, 1000 * (i + 1));
        });
        setTimeout(() => highlightSteps(steps), 4000);
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

// Problem 7: Interrupt Priority (Main Thread)
function initPriority1Animation() {
    const interruptBits = document.getElementById('priority1-interrupts');
    const steps = document.getElementById('priority1-steps');
    const animateBtn = document.getElementById('priority1-animate-btn');
    const stepsBtn = document.getElementById('priority1-steps-btn');
    const resetBtn = document.getElementById('priority1-reset-btn');

    const interruptNames = ['ISR_0', 'ISR_1', 'ISR_2', 'ISR_3'];
    interruptNames.forEach((name, i) => {
        interruptBits.innerHTML += `<span class="bit low">${name}<span class="priority-bar" id="pri1-${i}"></span></span>`;
    });

    function animate() {
        reset();
        setTimeout(() => {
            const isr2 = interruptBits.children[2];
            isr2.classList.remove('low');
            isr2.classList.add('high');
            document.getElementById('pri1-2').classList.add('active');
            setTimeout(() => {
                const isr3 = interruptBits.children[3];
                isr3.classList.remove('low');
                isr3.classList.add('high');
                document.getElementById('pri1-3').classList.add('active');
                setTimeout(() => {
                    isr2.classList.add('connection', 'visible');
                    isr3.classList.remove('high');
                    isr3.classList.add('low');
                    document.getElementById('pri1-3').classList.remove('active');
                }, 500);
            }, 500);
        }, 500);
        setTimeout(() => highlightSteps(steps), 2000);
    }

    function reset() {
        [...interruptBits.children].forEach((bit, i) => {
            bit.classList.remove('high', 'connection', 'visible');
            bit.classList.add('low');
            document.getElementById(`pri1-${i}`).classList.remove('active');
        });
        steps.classList.remove('visible');
        stepsBtn.textContent = 'Show Steps';
    }

    animateBtn.addEventListener('click', animate);
    stepsBtn.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn.addEventListener('click', reset);
    reset();
}

// Problem 8: Interrupt Priority (ISR_3)
function initPriority2Animation() {
    const interruptBits = document.getElementById('priority2-interrupts');
    const steps = document.getElementById('priority2-steps');
    const animateBtn = document.getElementById('priority2-animate-btn');
    const stepsBtn = document.getElementById('priority2-steps-btn');
    const resetBtn = document.getElementById('priority2-reset-btn');

    const interruptNames = ['ISR_0', 'ISR_1', 'ISR_2', 'ISR_3'];
    interruptNames.forEach((name, i) => {
        interruptBits.innerHTML += `<span class="bit low">${name}<span class="priority-bar" id="pri2-${i}"></span></span>`;
    });

    function animate() {
        reset();
        setTimeout(() => {
            const isr0 = interruptBits.children[0];
            isr0.classList.remove('low');
            isr0.classList.add('high');
            document.getElementById('pri2-0').classList.add('active');
            setTimeout(() => {
                const isr2 = interruptBits.children[2];
                isr2.classList.remove('low');
                isr2.classList.add('high');
                document.getElementById('pri2-2').classList.add('active');
                setTimeout(() => {
                    const isr3 = interruptBits.children[3];
                    isr3.classList.remove('low');
                    isr3.classList.add('high');
                    document.getElementById('pri2-3').classList.add('active');
                    setTimeout(() => {
                        isr2.classList.add('connection', 'visible');
                        isr0.classList.remove('high');
                        isr0.classList.add('low');
                        document.getElementById('pri2-0').classList.remove('active');
                        isr3.classList.remove('high');
                        isr3.classList.add('low');
                        document.getElementById('pri2-3').classList.remove('active');
                    }, 500);
                }, 500);
            }, 500);
        }, 500);
        setTimeout(() => highlightSteps(steps), 2500);
    }

    function reset() {
        [...interruptBits.children].forEach((bit, i) => {
            bit.classList.remove('high', 'connection', 'visible');
            bit.classList.add('low');
            document.getElementById(`pri2-${i}`).classList.remove('active');
        });
        steps.classList.remove('visible');
        stepsBtn.textContent = 'Show Steps';
    }

    animateBtn.addEventListener('click', animate);
    stepsBtn.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn.addEventListener('click', reset);
    reset();
}

// Problem 9: Cycles Between Interrupts
function initCyclesAnimation() {
    const cyclesBits = document.getElementById('cycles-cycles');
    const steps = document.getElementById('cycles-steps');
    const animateBtn = document.getElementById('cycles-animate-btn');
    const stepsBtn = document.getElementById('cycles-steps-btn');
    const resetBtn = document.getElementById('cycles-reset-btn');

    cyclesBits.innerHTML = `<span class="bit low">0</span><span class="cycle-counter" id="cycle-count">0</span>`;

    function animate() {
        reset();
        const bit = cyclesBits.children[0];
        const counter = document.getElementById('cycle-count');
        setTimeout(() => {
            bit.classList.remove('low');
            bit.classList.add('high');
            bit.textContent = '50 ms';
            setTimeout(() => {
                bit.textContent = '100 kHz';
                setTimeout(() => {
                    bit.textContent = '5000';
                    let count = 0;
                    const interval = setInterval(() => {
                        count += 100;
                        counter.textContent = count;
                        if (count >= 5000) clearInterval(interval);
                    }, 50);
                }, 500);
            }, 500);
        }, 500);
        setTimeout(() => highlightSteps(steps), 2500);
    }

    function reset() {
        const bit = cyclesBits.children[0];
        bit.classList.remove('high', 'connection', 'visible');
        bit.classList.add('low');
        bit.textContent = '0';
        document.getElementById('cycle-count').textContent = '0';
        steps.classList.remove('visible');
        stepsBtn.textContent = 'Show Steps';
    }

    animateBtn.addEventListener('click', animate);
    stepsBtn.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn.addEventListener('click', reset);
    reset();
}

// Problem 10: Flag Reads Between Interrupts
function initFlagAnimation() {
    const flagBits = document.getElementById('flag-flag');
    const steps = document.getElementById('flag-steps');
    const animateBtn = document.getElementById('flag-animate-btn');
    const stepsBtn = document.getElementById('flag-steps-btn');
    const resetBtn = document.getElementById('flag-reset-btn');

    flagBits.innerHTML = `
        <span class="bit low">0</span>
        <span class="read-counter">Reads: <span id="zero-reads">0</span></span>
    `;

    function animate() {
        reset();
        const bit = flagBits.querySelector('.bit');
        const readCountDisplay = document.getElementById('zero-reads');
        
        setTimeout(() => {
            bit.classList.remove('low');
            bit.classList.add('high', 'connection', 'visible');
            bit.textContent = '1';
            setTimeout(() => {
                bit.classList.remove('connection', 'visible');
                bit.textContent = '0';
                setTimeout(() => {
                    let reads = 0;
                    const interval = setInterval(() => {
                        reads += 50;
                        readCountDisplay.textContent = reads;
                        if (reads >= 2450) {
                            clearInterval(interval);
                            setTimeout(() => {
                                bit.classList.add('high', 'connection', 'visible');
                                bit.textContent = '1';
                            }, 500);
                        }
                    }, 50);
                }, 500);
            }, 500);
        }, 500);
        setTimeout(() => highlightSteps(steps), 3500);
    }

    function reset() {
        const bit = flagBits.querySelector('.bit');
        bit.classList.remove('high', 'connection', 'visible');
        bit.classList.add('low');
        bit.textContent = '0';
        document.getElementById('zero-reads').textContent = '0';
        steps.classList.remove('visible');
        stepsBtn.textContent = 'Show Steps';
    }

    animateBtn.addEventListener('click', animate);
    stepsBtn.addEventListener('click', () => toggleSteps(steps, stepsBtn));
    resetBtn.addEventListener('click', reset);
    reset();
}

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

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
    initVectorTableAnimation();
    initIsrCallAnimation();
    initException1Animation();
    initException2Animation();
    initStackAnimation();
    initPcAnimation();
    initPriority1Animation();
    initPriority2Animation();
    initCyclesAnimation();
    initFlagAnimation();
});