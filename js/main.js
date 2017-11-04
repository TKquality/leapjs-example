'use strict';

const init = () => {
    const elm = document.getElementById('test');
    elm.innerHTML = 'Welcome to "leap.js."';

    const controller = new Leap.Controller({ enableGestures: true });
    controller.loop((frame) => {
        console.log('recieve frame from LMC.');
    });
};
window.addEventListener('load', init);