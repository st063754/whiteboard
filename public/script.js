let canvas = document.getElementById("canvas")
let ctx = canvas.getContext('2d')
var io = io.connect('https://st063754-whiteboard.herokuapp.com/')
//var io = io.connect('localhost:8080')

let current = {x: 0, y: 0}
let lastMy = {x: 0, y: 0}
let lastOther = {x: 0, y: 0}

let last = [lastMy, lastOther]

let mouseDown = false


function Draw(x, y, color, width, prev) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineJoin = "round";
    ctx.moveTo(prev.x, prev.y);
    ctx.lineTo(x, y);
    ctx.closePath();
    ctx.stroke();
    prev.x = x;
    prev.y = y;
}

function init(){
    window.onmouseup = (e) => { mouseDown = false }
    canvas.onmousedown = (e) => {
        last[0] = Object.assign({}, current)
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
            Draw(current.x, current.y, c, w, last[0])
            io.emit('draw', {x: current.x, y: current.y, c: c, w: w})
        }
    }
}


io.on('ondraw', ({x,y,c,w}) => { Draw(x,y,c,w, last[1]) })
io.on('ondown', ({x,y}) => { last[1] = {x,y} })


