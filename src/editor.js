/*
ACTIONS
*/

var dragOn = false;
function onmouse(event) {
    if (event.type!=="mousedown"&&!dragOn) { return }
    if (event.type==="mousedown"&&event.target!==source.canvas) { return }
    var frame = player.frames[currentFrame];
    var rect = source.canvas.getBoundingClientRect();
    var X = event.clientX-rect.left|0;
    var Y = event.clientY-rect.top|0;
    if (event.type==="mousedown") {
        dragOn = true;
        frame.X = X;
        frame.Y = Y;
    }
    frame.W = Math.max(X-frame.X, 1)|0;
    frame.H = Math.max(Y-frame.Y, 1)|0;
    frame.x = frame.W/2|0;
    frame.y = frame.H/2|0;
    render();
    if (event.type==="mouseup") {
        dragOn = false;
        dumpData();
    }
}

function onkey(event) {
    if (!pause.checked||document.activeElement===textarea) {
        return
    }
    if (event.key==='Escape') {
        delete player.frames[currentFrame];
        currentFrame = undefined;
    }
    var frame = player.frames[currentFrame];
    if (event.shiftKey) {
        if (event.key==='ArrowRight') { frame.X += 1; }
        if (event.key==='ArrowLeft') { frame.X -= 1; }
        if (event.key==='ArrowDown') { frame.Y += 1; }
        if (event.key==='ArrowUp') { frame.Y -= 1; }
    } else {
        if (event.key==='ArrowRight') { frame.x -= 1; }
        if (event.key==='ArrowLeft') { frame.x += 1; }
        if (event.key==='ArrowDown') { frame.y -= 1; }
        if (event.key==='ArrowUp') { frame.y += 1; }
    }
    render();
    dumpData();
}

function selectFrame(event) {
    var rect = result.canvas.getBoundingClientRect();
    var row = (event.clientX-rect.left)/cellw|0;
    var col = (event.clientY-rect.top)/cellh|0;
    currentFrame = col+','+row;
    if (player.frames[currentFrame]===undefined) {
        player.frames[currentFrame] = createFrame();
    }
    render();
}

/*
RENDERERS
*/

function render() {
    source.canvas.width = img.width;
    source.canvas.height = img.height;
    source.clear();
    source.pen.strokeRect(0, 0, img.width, img.height);
    source.pen.drawImage(img, 0, 0, img.width, img.height);
    var frame = player.frames[currentFrame];
    if (frame) {
        source.pen.strokeStyle = 'black';
        source.pen.strokeRect(frame.X,frame.Y,frame.W,frame.H);
        source.pen.fillStyle = 'red';
        source.pen.fillRect(frame.X+frame.x-2, frame.Y+frame.y, 5, 1);
        source.pen.fillRect(frame.X+frame.x, frame.Y+frame.y-2, 1, 5);
    }

    result.canvas.width = cellw*6;
    result.canvas.height = cellh*5;
    result.clear();
    for (var j=0;j<5;j++) for (var i=0;i<6;i++) {

        var frameId = j+','+i;
        var cellx = i*cellw;
        var celly = j*cellh;
        var frame = player.frames[frameId];

        var gridColor = 'gray';
        if (frameId===currentFrame) { gridColor = 'lime' }
        else if (frame) { gridColor = 'magenta' };
        result.pen.strokeStyle = gridColor;
        result.pen.strokeRect(cellx, celly, cellw, cellh);

        if (frame===undefined) {
            continue
        }

        result.pen.drawImage(img,
            frame.X, frame.Y, frame.W, frame.H,
            cellx+(cellw/2-frame.x), celly+(cellh/2-frame.y), frame.W, frame.H);
    }
}

/*
STRUCTS
*/

function createFrame(X,Y,W,H,x,y) {
    return {X:X||0, Y:Y||0, W:W||1, H:H||1, x:x||0, y:y||0}
}

class Canvas {

    constructor() {
        this.canvas = document.createElement("canvas");
        this.pen = this.canvas.getContext('2d');
        document.body.appendChild(this.canvas);
    }

    clear() {
        this.pen.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

}

/*
STATE
*/

function loadData() {
    player.load(JSON.parse(textarea.value));
    img.src=player.imgSrc;
    render();
}

function dumpData() {
    var data = {};
    var excluded = ['pressed','sprite'];
    Object.keys(player).filter(k=>!excluded.includes(k)).forEach(k=>data[k]=player[k]);
    removeMiddleWhitespace = (match, ...ps) => ps[0]+ps[1].replace(/\s/g,'')+ps[2];
    textarea.value = JSON.stringify(data, null, 2) // pretty-print
        .replace(/("\d+,\d+":)([\s\S]*?)(\})/g, removeMiddleWhitespace)
        .replace(/(\[)([\s\S]*?)(\])/g, removeMiddleWhitespace);
    render();
}

/*
GLOBALS
*/

// yolo
cellw = 50;
cellh = 50;
currentFrame = '0,0';
// init
var source = new Canvas();
source.canvas.style.position = "absolute";
source.canvas.style.top = "0";
source.canvas.style.right = "0";
var result = new Canvas();
result.canvas.style.position = "absolute";
result.canvas.style.bottom = "0";
result.canvas.style.right = "0";
var img = new Image();
img.onload = render;
window.setTimeout(loadData, 1000);
// events
result.canvas.onclick = selectFrame;
window.onmouseup = onmouse;
window.onmousedown = onmouse;
window.onmousemove = onmouse;
window.onkeypress = onkey;
