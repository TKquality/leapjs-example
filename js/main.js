'use strict';

const extractFrameInfo = (frame, dispNode) => {
    const currentId = frame.id;
    const currentFrameRate = frame.currentFrameRate;
    const timestamp = frame.timestamp;
    // const numHands = frame.hands.length;
    // const numFingers = frame.fingers.length;
    // const numGestures = frame.gestures.length;

    let target;
    if (dispNode.children.length === 0) {
        target = dispNode.appendChild(document.createElement('div'));
    } else {
        target = dispNode.firstElementChild;
    }

    let frameText = '';
    frameText += 'currentId: ' + currentId + '<br />';
    frameText += 'currentFrameRate: ' + currentFrameRate + '<br />';
    frameText += 'timestamp: ' + timestamp + '<br />';
    // frameText += '#Hands:' + numHands + '<br />';
    // frameText += '#Fingers:' + numFingers + '<br />';
    // frameText += '#Gestures:' + numGestures + '<br />';

    target.innerHTML = frameText;
};

const extractHandInfo = (frame, dispNode) => {
    let target;
    if (dispNode.children.length === 0) {
        target = dispNode.appendChild(document.createElement('div'));
    } else {
        target = dispNode.firstElementChild;
        target.innerHTML = '';
    }

    for (let i = 0, numHands = frame.hands.length; i < numHands; i++) {
        const targetChild = target.appendChild(document.createElement('div'));
        targetChild.innerHTML = '[' + i + '] hand';
    }
};

const extractFingerInfo = (frame, dispNode) => {
    let target;
    if (dispNode.children.length === 0) {
        target = dispNode.appendChild(document.createElement('div'));
    } else {
        target = dispNode.firstElementChild;
        target.innerHTML = '';
    }

    for (let i = 0, numFingers = frame.fingers.length; i < numFingers; i++) {
        const targetChild = target.appendChild(document.createElement('div'));
        targetChild.innerHTML = '[' + i + '] finger';
    }
};

const extractGestureInfo = (frame, dispNode) => {
    let target;
    if (dispNode.children.length === 0) {
        target = dispNode.appendChild(document.createElement('div'));
    } else {
        target = dispNode.firstElementChild;
        target.innerHTML = '';
    }

    for (let i = 0, numGestures = frame.gestures.length; i < numGestures; i++) {
        const targetChild = target.appendChild(document.createElement('div'));
        targetChild.innerHTML = '[' + i + '] gesture';
    }
};

window.addEventListener('load', () => {

    const frameDisplay = document.getElementById('frameInfo');
    const handDisplay = document.getElementById('handInfo');
    const fingerDisplay = document.getElementById('fingerInfo');
    const gestureDisplay = document.getElementById('gestureInfo');

    const controller = new Leap.Controller({ enableGestures: true });

    controller.on('frame', (frame) => {
        extractFrameInfo(frame, frameDisplay);
        extractHandInfo(frame, handDisplay);
        extractFingerInfo(frame, fingerDisplay);
        extractGestureInfo(frame, gestureDisplay);
    });

    const connectDisplay = document.getElementById('connectInfo');
    document.getElementById('connectBtn').addEventListener('click', () => {
        connectDisplay.textContent = 'Connect';
        controller.connect();
    });
    document.getElementById('disconnectBtn').addEventListener('click', () => {
        connectDisplay.textContent = 'Disconnect';
        controller.disconnect();
    });
});