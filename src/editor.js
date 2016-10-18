/*
ACTIONS
*/

var dragOn = false;
function onmouse(event) {
    if (state===undefined) { return }
    if (event.type!=="mousedown"&&!dragOn) { return }
    if (event.type==="mousedown"&&event.target!==source.canvas) { return }
    var frame = state.frames[state.currentFrame];
    var rect = source.canvas.getBoundingClientRect();
    var X = event.clientX-rect.left|0;
    var Y = event.clientY-rect.top|0;
    if (event.type==="mousedown") {
        dragOn = true;
        frame.X = X;
        frame.Y = Y;
    }
    frame.W = Math.min(Math.max(X-frame.X, 1), state.cellw)|0;
    frame.H = Math.min(Math.max(Y-frame.Y, 1), state.cellh)|0;
    frame.x = frame.W/2|0;
    frame.y = frame.H/2|0;
    render();
    if (event.type==="mouseup") {
        dragOn = false;
        saveState();
    }
}

function onkey(event) {
    if (document.activeElement===textarea) {
        return
    }
    if (event.key==='Escape') {
        delete state.frames[state.currentFrame];
        state.currentFrame = undefined;
    }
    var frame = state.frames[state.currentFrame];
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
    saveState();
}

function selectFrame(event) {
    var rect = result.canvas.getBoundingClientRect();
    var row = (event.clientX-rect.left)/state.cellw|0;
    var col = (event.clientY-rect.top)/state.cellh|0;
    state.currentFrame = col+','+row;
    if (state.frames[state.currentFrame]===undefined) {
        state.frames[state.currentFrame] = createFrame();
    }
    state.currentAnimation = undefined;
    for (key in state.animations) {
        if (state.animations[key].includes(state.currentFrame)) {
            state.currentAnimation = key;
            break
        }
    }
    render();
    saveState();
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
    var frame = state.frames[state.currentFrame];
    if (frame) {
        source.pen.strokeStyle = 'black';
        source.pen.strokeRect(frame.X,frame.Y,frame.W,frame.H);
        source.pen.fillStyle = 'red';
        source.pen.fillRect(frame.X+frame.x-2, frame.Y+frame.y, 5, 1);
        source.pen.fillRect(frame.X+frame.x, frame.Y+frame.y-2, 1, 5);
    }

    result.canvas.width = state.cellw*state.ncols;
    result.canvas.height = state.cellh*state.nrows;
    result.clear();
    for (var j=0;j<state.nrows;j++) for (var i=0;i<state.ncols;i++) {

        var frameId = j+','+i;
        var cellx = i*state.cellw;
        var celly = j*state.cellh;
        var frame = state.frames[frameId];

        var gridColor = 'gray';
        if (frameId===state.currentFrame) { gridColor = 'lime' }
        else if (frame) { gridColor = 'magenta' };
        result.pen.strokeStyle = gridColor;
        result.pen.strokeRect(cellx, celly, state.cellw, state.cellh);

        if (frame===undefined) {
            continue
        }

        result.pen.drawImage(img,
            frame.X, frame.Y, frame.W, frame.H,
            cellx+(state.cellw/2-frame.x), celly+(state.cellh/2-frame.y), frame.W, frame.H);
    }
}

tic = 0;
function renderPreview() {
    if (state===undefined) { return }
    var zoom = 5;
    preview.clear();
    preview.canvas.width = state.cellw*zoom;
    preview.canvas.height = state.cellh*zoom;
    var animation = state.animations[state.currentAnimation];
    frame = state.frames[animation[tic%animation.length]];
    if (frame) {
        preview.pen.scale(zoom, zoom);
        preview.pen.imageSmoothingEnabled = false;
        // bbox
        preview.pen.fillStyle = 'red';
        preview.pen.fillRect(
            (state.cellw-state.bboxw)/2|0, (state.cellh-state.bboxh)/2|0,
            state.bboxw, state.bboxh);
        // sprite
        preview.pen.drawImage(img,
            frame.X, frame.Y, frame.W, frame.H,
            (state.cellw/2-frame.x), (state.cellh/2-frame.y), frame.W, frame.H);
    }
    tic += 1;
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
STATE MANAGEMENT
*/

function saveState() {
    removeMiddleWhitespace = (match, ...ps) => ps[0]+ps[1].replace(/\s/g,'')+ps[2];
    textarea.value = JSON.stringify(state, null, 2) // pretty-print
        .replace(/("\d+,\d+":)([\s\S]*?)(\})/g, removeMiddleWhitespace)
        .replace(/(\[)([\s\S]*?)(\])/g, removeMiddleWhitespace);
    location.hash = btoa(textarea.value);
}

function loadState() {
    var object = JSON.parse(textarea.value);
    // validate(temp)
    state = object;
    img.src = state.imgSrc;
    render();
}

/*
GLOBALS
*/

// init
var state;
var img = new Image();
var source = new Canvas();
var result = new Canvas();
var preview = new Canvas();
// events
img.onload = render;
result.canvas.onclick = selectFrame;
window.onmouseup = onmouse;
window.onmousedown = onmouse;
window.onmousemove = onmouse;
window.onkeypress = onkey;
window.setInterval(renderPreview, 1000/2);
if (location.hash) { textarea.value = atob(location.hash.slice(1)); }
loadState();