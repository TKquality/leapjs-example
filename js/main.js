'use strict';

const FINGER_TYPE = ['thumb', 'index', 'middle', 'ring', 'pinky'];
const RADIUS_HAND = 50;
const RADIUS_FINGER = 30;

const basePos = {
    xAxis: window.innerWidth / 2,
    yAxis: window.innerHeight,
};

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
        const hand = frame.hands[i];

        let handText = '';
        handText += 'id: ' + hand.id + ' ';
        if (hand.valid) {
            handText += 'type: ' + hand.type + ' ';
            handText += 'palm 2D: ' + hand.stabilizedPalmPosition + ' ';
            handText += 'direction: ' + hand.direction + ' ';
        } else {
            handText += 'this hand is invalid...';
        }

        const targetChild = target.appendChild(document.createElement('div'));
        targetChild.innerHTML = handText;
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

    let currentHand;
    for (let i = 0, numFingers = frame.fingers.length; i < numFingers; i++) {
        const finger = frame.fingers[i];

        let fingerText = '';
        if (currentHand !== finger.hand()) {
            currentHand = finger.hand();
            if (i !== 0) {
                fingerText += '<br />';
            }
            fingerText += currentHand.type + ' hand\'s finger' + '<br />';
        }

        fingerText += 'id: ' + finger.id + ' ';
        fingerText += 'type: ' + FINGER_TYPE[finger.type] + ' ';
        if (finger.valid) {
            fingerText += 'palm 2D: ' + finger.stabilizedTipPosition + ' ';
            fingerText += 'direction: ' + finger.direction + ' ';
            fingerText += 'touch distance: ' + finger.touchDistance + ' ';
        } else {
            fingerText += 'this finger is invalid...';
        }

        const targetChild = target.appendChild(document.createElement('div'));
        targetChild.innerHTML = fingerText;
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

        const gesture = frame.gestures[i];
        const gestureHand = (gesture.handIds.length > 0) ? frame.hand(gesture.handIds[0]) : null;
        const gestureFinger = (gesture.pointableIds.length > 0) ? frame.finger(gesture.pointableIds[0]) : null;

        let gestureText = '';
        gestureText += 'type: ' + gesture.type + ' ';
        if (gestureHand && gestureFinger) {
            gestureText += 'source: ' + gestureHand.type + '-' + FINGER_TYPE[gestureFinger.type] + ' ';
        }
        gestureText += 'state: ' + gesture.state + ' ';
        switch (gesture.type) {
            case 'circle':
                gestureText += 'center: ' + gesture.center + ' ';
                gestureText += 'radius: ' + gesture.radius + ' ';
                break;

            case 'swipe':
                gestureText += 'position: ' + gesture.position + ' ';
                gestureText += 'direction: ' + gesture.direction + ' ';
                gestureText += 'speed: ' + gesture.speed + ' ';
                break;

            case 'keyTap':
                break;

            case 'screenTap':
                break;

            default:
                gestureText += 'unknown gesture';
                break;
        }

        const targetChild = target.appendChild(document.createElement('div'));
        targetChild.innerHTML = gestureText;
    }

};

const resetCanvas = (ctx) => {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
};

const drawHands = (ctx, frame) => {

    for (let i = 0, numHands = frame.hands.length; i < numHands; i++) {
        const hand = frame.hands[i];
        const handPosX = basePos.xAxis + hand.stabilizedPalmPosition[0] * 3;
        const handPosY = basePos.yAxis - (hand.stabilizedPalmPosition[1] * 3);

        drawCircle(ctx, handPosX, handPosY, RADIUS_HAND);

        drawFingers(ctx, hand.fingers);
    }

};

const drawFingers = (ctx, fingers) => {
    fingers.forEach((finger) => {
        const fingerPosX = basePos.xAxis + finger.tipPosition[0] * 3;
        const fingerPosY = basePos.yAxis - (finger.tipPosition[1] * 3);

        drawCircle(ctx, fingerPosX, fingerPosY, RADIUS_FINGER);
    });
};

const resizeCanvas = (canvas, width, height) => {

    basePos.xAxis = width / 2;
    basePos.yAxis = height;

    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
};

const drawCircle = (ctx, posX, posY, radius) => {
    ctx.fillStyle = 'rgb(192, 80, 77)';
    ctx.beginPath();
    ctx.arc(posX, posY, radius, 0, Math.PI * 2, false);
    ctx.fill();
};

window.addEventListener('load', () => {

    const drawCanvas = document.getElementById('drawCanvas');
    // drawCanvas.setAttribute('width', window.innerWidth);
    // drawCanvas.setAttribute('height', window.innerHeight);

    resizeCanvas(drawCanvas, window.innerWidth, window.innerHeight);

    const drawContext = drawCanvas.getContext('2d');
    resetCanvas(drawContext);

    window.addEventListener('resize', () => {
        resizeCanvas(drawCanvas, window.innerWidth, window.innerHeight);
    });

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

        resetCanvas(drawContext);
        drawHands(drawContext, frame);
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

    controller.connect();
});