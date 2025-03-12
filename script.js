document.addEventListener('DOMContentLoaded', () => {
    console.log('Index page loaded');
    
    // Add animation effects to microcontroller components
    const components = document.querySelectorAll('.component');
    
    // Add hover effects to components
    components.forEach((component, index) => {
        // Set animation delay based on index
        component.style.setProperty('--i', index);
        
        // Add hover effects
        component.addEventListener('mouseenter', () => {
            component.style.transform = 'scale(1.2)';
            component.style.boxShadow = '0 0 15px rgba(22, 199, 154, 0.8)';
        });
        
        component.addEventListener('mouseleave', () => {
            component.style.transform = 'scale(1)';
            component.style.boxShadow = '';
        });
    });
    
    // Add random blinking effect to pins
    const pins = document.querySelectorAll('.pin');
    pins.forEach((pin, index) => {
        // Set animation delay based on index
        pin.style.setProperty('--i', index);
        
        // Add random blinking
        setInterval(() => {
            if (Math.random() > 0.7) {
                pin.style.backgroundColor = '#16c79a';
                setTimeout(() => {
                    pin.style.backgroundColor = '';
                }, 200);
            }
        }, 2000 + Math.random() * 3000);
    });
});