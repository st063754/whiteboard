let canvas = document.getElementById("canvas")
let ctx = canvas.getContext('2d')
var io = io.connect('https://st063754-whiteboard.herokuapp.com/')
//var io = io.connect('localhost:8080')

let current = {x: 0, y: 0}
let last = {x: 0, y: 0}
let lastOther = {x: 0, y: 0}

let mouseDown = false


function Draw(x, y, color, width) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineJoin = "round";
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(x, y);
    ctx.closePath();
    ctx.stroke();
    last.x = x;
    last.y = y;
}
function DrawOther(x, y, color, width) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineJoin = "round";
    ctx.moveTo(lastOther.x, lastOther.y);
    ctx.lineTo(x, y);
    ctx.closePath();
    ctx.stroke();
    lastOther.x = x;
    lastOther.y = y;
}

function init(){
    window.onmouseup = (e) => { mouseDown = false }
    canvas.onmousedown = (e) => {
        last = Object.assign({}, current)
        ctx.moveTo(current.x,current.y)
        io.emit('down', {x: current.x, y: current.y})
        mouseDown = true
    }
    canvas.onmousemove = (e) => {
        current.x = e.offsetX
        current.y = e.offsetY
        if (mouseDown) {
            let c = document.getElementById("color").value;
            let w = document.getElementById("width").value;
            Draw(current.x, current.y, c, w)
            io.emit('draw', {x: current.x, y: current.y, c: c, w: w})
        }
    }
}


io.on('ondraw', ({x,y,c,w}) => { DrawOther(x,y,c,w) })
io.on('ondown', ({x,y}) => { lastOther = {x,y} })


