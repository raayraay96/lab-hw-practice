function resetAnimation(containers, steps, stepsBtn, config) {
    containers.forEach(container => {
        [...container.children].forEach(bit => {
            bit.classList.remove('active', 'high', 'connection', 'visible');
            bit.classList.add('low');
            bit.textContent = '0';
        });
    });
    if (steps) {
        steps.classList.remove('visible');
        if (stepsBtn) stepsBtn.textContent = 'Show Steps';
    }
}

function createSquareWave(container, data, options) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", options.width);
    svg.setAttribute("height", options.height);
    
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    let d = `M 0 ${options.height - 30}`;
    
    const stepWidth = options.width / data.length;
    data.forEach((bit, i) => {
        const x = i * stepWidth;
        const y = bit ? 30 : options.height - 30;
        d += ` L ${x} ${y} L ${x + stepWidth} ${y}`;
    });
    
    path.setAttribute("d", d);
    path.setAttribute("stroke", "#2196F3");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke-width", "2");
    
    svg.appendChild(path);
    container.appendChild(svg);
}

function toggleSteps(steps, stepsBtn) {
    steps.classList.toggle('visible');
    stepsBtn.textContent = steps.classList.contains('visible') ? 'Hide Steps' : 'Show Steps';
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
