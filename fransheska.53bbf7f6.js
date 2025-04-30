let c = document.getElementById("balloons");
let ctx = c.getContext("2d");
let bc = document.createElement("canvas");
let bCtx = bc.getContext("2d");
let cw = c.width = bc.width = window.innerWidth, cx = cw / 2;
let ch = c.height = bc.height = window.innerHeight + 100, cy = ch;
let frames = 0;
let requestId = null;
let rad = Math.PI / 180;
let kappa = 0.5522847498;
let x, y;
bCtx.strokeStyle = "#abcdef";
bCtx.lineWidth = 1;
let balloons = [];
class Balloon {
    constructor(){
        this.r = randomIntFromInterval(20, 70);
        this.R = 1.4 * this.r;
        this.x = randomIntFromInterval(this.r, cw - this.r);
        this.y = ch + 2 * this.r;
        this.a = this.r * 4.5;
        this.pm = Math.random() < 0.5 ? -1 : 1;
        this.speed = randomIntFromInterval(1.5, 4);
        this.k = this.speed / 5;
        this.hue = this.pm > 0 ? "180" : "80";
    }
}
function Draw() {
    updateBallons(bCtx);
    ctx.clearRect(0, 0, cw, ch);
    let img = bc;
    ctx.drawImage(img, 0, 0);
    requestId = window.requestAnimationFrame(Draw);
}
//requestId = window.requestAnimationFrame(Draw);
function Init() {
    if (requestId) {
        window.cancelAnimationFrame(requestId);
        requestId = null;
    }
    cw = c.width = bc.width = window.innerWidth, cx = cw / 2;
    ch = c.height = bc.height = window.innerHeight + 100, cy = ch;
    bCtx.strokeStyle = "#abcdef";
    bCtx.lineWidth = 1;
    Draw();
}
setTimeout(function() {
    Init();
    window.addEventListener("resize", Init, false);
}, 15);
function updateBallons(ctx) {
    frames += 1;
    if (frames % 37 == 0 && balloons.length < 37) {
        let balloon = new Balloon();
        balloons.push(balloon);
    }
    ctx.clearRect(0, 0, cw, ch);
    for(let i = 0; i < balloons.length; i++){
        let b = balloons[i];
        if (b.y > -b.a) b.y -= b.speed;
        else b.y = parseInt(ch + b.r + b.R);
        let p1 = thread(b, ctx);
        b.cx = p1.x;
        b.cy = p1.y - b.R;
        ctx.fillStyle = Grd(p1.x, p1.y, b.r, b.hue);
        drawBalloon(b, ctx);
    }
}
function drawBalloon(b, ctx) {
    let or = b.r * kappa; // offset
    let p1 = {
        x: b.cx - b.r,
        y: b.cy
    };
    let pc11 = {
        x: p1.x,
        y: p1.y + or
    };
    let pc12 = {
        x: p1.x,
        y: p1.y - or
    };
    let p2 = {
        x: b.cx,
        y: b.cy - b.r
    };
    let pc21 = {
        x: b.cx - or,
        y: p2.y
    };
    let pc22 = {
        x: b.cx + or,
        y: p2.y
    };
    let p3 = {
        x: b.cx + b.r,
        y: b.cy
    };
    let pc31 = {
        x: p3.x,
        y: p3.y - or
    };
    let pc32 = {
        x: p3.x,
        y: p3.y + or
    };
    let p4 = {
        x: b.cx,
        y: b.cy + b.R
    };
    let pc41 = {
        x: p4.x + or,
        y: p4.y
    };
    let pc42 = {
        x: p4.x - or,
        y: p4.y
    };
    let t1 = {
        x: p4.x + 0.2 * b.r * Math.cos(70 * rad),
        y: p4.y + 0.2 * b.r * Math.sin(70 * rad)
    };
    let t2 = {
        x: p4.x + 0.2 * b.r * Math.cos(110 * rad),
        y: p4.y + 0.2 * b.r * Math.sin(110 * rad)
    };
    //balloon
    ctx.beginPath();
    ctx.moveTo(p4.x, p4.y);
    ctx.bezierCurveTo(pc42.x, pc42.y, pc11.x, pc11.y, p1.x, p1.y);
    ctx.bezierCurveTo(pc12.x, pc12.y, pc21.x, pc21.y, p2.x, p2.y);
    ctx.bezierCurveTo(pc22.x, pc22.y, pc31.x, pc31.y, p3.x, p3.y);
    ctx.bezierCurveTo(pc32.x, pc32.y, pc41.x, pc41.y, p4.x, p4.y);
    //knot
    ctx.lineTo(t1.x, t1.y);
    ctx.lineTo(t2.x, t2.y);
    ctx.closePath();
    ctx.fill();
}
function thread(b, ctx) {
    ctx.beginPath();
    for(let i = b.a; i > 0; i -= 1){
        let t = i * rad;
        x = b.x + b.pm * 50 * Math.cos(b.k * t - frames * rad);
        y = b.y + b.pm * 25 * Math.sin(b.k * t - frames * rad) + 50 * t;
        ctx.lineTo(x, y);
    }
    ctx.stroke();
    return p = {
        x: x,
        y: y
    };
}
function Grd(x, y, r, hue) {
    const grd = ctx.createRadialGradient(x - 0.5 * r, y - 1.7 * r, 0, x - 0.5 * r, y - 1.7 * r, r);
    grd.addColorStop(0, "hsla(" + hue + ",10%,65%,.95)");
    grd.addColorStop(0.4, "hsla(" + hue + ",10%,75%,.85)");
    grd.addColorStop(1, "hsla(" + hue + ",10%,55%,.80)");
    return grd;
}
function randomIntFromInterval(mn, mx) {
    return ~~(Math.random() * (mx - mn + 1) + mn);
}
(()=>{
    const date = new Date(2025, 4, 7, 0, 0, 0, 0);
    const daysElement = document.getElementById("days");
    const hoursElement = document.getElementById("hours");
    const minutesElement = document.getElementById("minutes");
    const secondsElement = document.getElementById("seconds");
    setInterval(()=>{
        const now = new Date();
        let delta = Math.abs(date - now) / 1000;
        if (delta > 0) {
            // calculate (and subtract) whole days
            let days = Math.floor(delta / 86400);
            delta -= days * 86400;
            days = days.toString();
            daysElement.innerText = days;
            // calculate (and subtract) whole hours
            let hours = Math.floor(delta / 3600) % 24;
            delta -= hours * 3600;
            hours = hours.toString().padStart(2, "0");
            if (hoursElement.innerText !== hours) hoursElement.innerText = hours;
            // calculate (and subtract) whole minutes
            let minutes = Math.floor(delta / 60) % 60;
            delta -= minutes * 60;
            minutes = minutes.toString().padStart(2, "0");
            if (minutesElement.innerText !== minutes) minutesElement.innerText = minutes;
            // what's left is seconds
            let seconds = delta % 60; // in theory the modulus is not required
            seconds = parseInt(seconds).toString().padStart(2, "0");
            if (secondsElement.innerText !== seconds) secondsElement.innerText = seconds;
        }
    }, 1000);
})();

//# sourceMappingURL=fransheska.53bbf7f6.js.map
