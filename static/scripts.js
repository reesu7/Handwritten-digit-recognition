var canvas, ctx;
var mouseX, mouseY, mouseDown = 0;
var touchX, touchY;

// Function for interacting with canvas
function init() {
    canvas = document.getElementById('sketchpad');
    ctx = canvas.getContext('2d');
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (ctx) {
        canvas.addEventListener('mousedown', sketchpad_mouseDown, false);
        canvas.addEventListener('mousemove', sketchpad_mouseMove, false);
        window.addEventListener('mouseup', sketchpad_mouseUp, false);
        canvas.addEventListener('touchstart', sketchpad_touchStart, false);
        canvas.addEventListener('touchmove', sketchpad_touchMove, false);
    }
}

function draw(ctx, x, y, size, isDown) {
    if (isDown) {
        ctx.beginPath();
        ctx.strokeStyle = "white";
        ctx.lineWidth = '15';
        ctx.lineJoin = ctx.lineCap = 'round';
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.stroke();
    }
    lastX = x;
    lastY = y;
}

// Event handlers
function sketchpad_mouseDown() {
    mouseDown = 1;
    draw(ctx, mouseX, mouseY, 12, false);
}

function sketchpad_mouseUp() {
    mouseDown = 0;
}

function sketchpad_mouseMove(e) {
    getMousePos(e);
    if (mouseDown == 1) {
        draw(ctx, mouseX, mouseY, 12, true);
    }
}

function getMousePos(e) {
    if (!e)
        var e = event;
    if (e.offsetX) {
        mouseX = e.offsetX;
        mouseY = e.offsetY;
    } else if (e.layerX) {
        mouseX = e.layerX;
        mouseY = e.layerY;
    }
}

function sketchpad_touchStart() {
    getTouchPos();
    draw(ctx, touchX, touchY, 12, false);
    event.preventDefault();
}

function sketchpad_touchMove(e) {
    getTouchPos(e);
    draw(ctx, touchX, touchY, 12, true);
    event.preventDefault();
}

function getTouchPos(e) {
    if (!e)
        var e = event;
    if (e.touches) {
        if (e.touches.length == 1) {
            var touch = e.touches[0];
            touchX = touch.pageX - touch.target.offsetLeft;
            touchY = touch.pageY - touch.target.offsetTop;
        }
    }
}

document.getElementById('clear_button').addEventListener("click",
    function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    });

// Prediction
document.getElementById('predict_button').addEventListener("click", async function () {
    var imageData = canvas.toDataURL();
    console.log(imageData);
    fetch('/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image_data: imageData })
    })
    .then(response => response.json())
    .then(data => {
        displayLabel(data.results);
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

// Output
function displayLabel(data) {
    var max = data[0];
    var maxIndex = 0;
    for (var i = 1; i < data.length; i++) {
        if (data[i] > max) {
            maxIndex = i;
            max = data[i];
        }
    }
    document.getElementById('result').innerHTML = maxIndex;
    document.getElementById('confidence').innerHTML = "Confidence: " + (max * 100).toFixed(2) + "%";
}
