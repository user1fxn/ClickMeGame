
const DOM = {
    canvas: null,
    rectangle: null,
    context: null,
    intervalId: null,
    speed: null,
    missedScore: null,
    clickedScore: null,
    bestScore: null

}

const REC_SIZE = { WIDTH: 40, HEIGHT: 20 };
const REC_POS = { X: 400, Y: 450 };
const BEST_SCORE = "bestScore";

function init() {
    const startBtn = document.querySelector("#startBtn");
    const stoptBtn = document.querySelector("#stoptBtn");
    const rangeInpt = document.querySelector("#rangeInpt");

    DOM.speed = rangeInpt.value;
   
    const inputRangeValue = document.querySelector("#inputRangeValue");
    inputRangeValue.innerText = 'interval: ' + rangeInpt.value;
    rangeInpt.addEventListener('change', function () {
        inputRangeValue.innerText = 'interval: ' + rangeInpt.value;
    });

    DOM.missedScore = document.querySelector("#missedScore");
    DOM.clickedScore = document.querySelector("#clickedScore");
    DOM.bestScore = document.querySelector("#bestScore");
    DOM.clickedScore.innerText = 0;
    DOM.missedScore.innerText = 0;

    DOM.bestScore.innerText = 0;
    try {
        const bestScore = localStorage.getItem(BEST_SCORE);
        if (bestScore) {
            DOM.bestScore.innerText = bestScore;
        }
    } catch (e) { }

    DOM.canvas = document.getElementById("myCanvas");
    DOM.canvas.style.backgroundColor = "lightblue";
    DOM.canvas.classList.add("pointerCanvasEvents");
    DOM.context = DOM.canvas.getContext('2d');
    DOM.rectangle = {
        x: REC_POS.X,
        y: REC_POS.Y
    }
    DOM.canvas.addEventListener('click', function (event) {
        if (_isClickedInside(event)) {
            DOM.clickedScore.innerText = Number(DOM.clickedScore.innerText) + 1;
        }
        else {
            DOM.missedScore.innerText = Number(DOM.missedScore.innerText) + 1;
        }

    }, false);


    function _appendMousePosition(event) {
        const clientRect = DOM.canvas.getBoundingClientRect();
        const cursorPosition = {};
        cursorPosition.x = event.clientX - clientRect.left;
        cursorPosition.y = event.clientY - clientRect.top;
        return cursorPosition
    }

    function _isClickedInside(event) {
        const mouseCursorAt = _appendMousePosition(event);

        if (mouseCursorAt.x < DOM.rectangle.x) return false;
        if (mouseCursorAt.x > (DOM.rectangle.x + REC_SIZE.WIDTH)) return false;
        if (mouseCursorAt.y < DOM.rectangle.y) return false;
        if (mouseCursorAt.y > (DOM.rectangle.y + REC_SIZE.HEIGHT)) return false

        return true;
    }

    startBtn.addEventListener('click', function () {
        DOM.canvas.classList.remove("pointerCanvasEvents");
        const clientRect = DOM.canvas.getBoundingClientRect();
        DOM.intervalId = setInterval(function () {
            DOM.rectangle.x = _getPositionRandom(0, DOM.canvas.width - REC_SIZE.WIDTH);
            DOM.rectangle.y = _getPositionRandom(0, clientRect.height - REC_SIZE.HEIGHT);

            draw();
        }, DOM.speed);

        function _getPositionRandom(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min)
        }
    });

    stoptBtn.addEventListener('click', function () {
        clearInterval(DOM.intervalId);
        DOM.canvas.classList.add("pointerCanvasEvents");

        try {
            const bestScore = Number(DOM.bestScore.innerText);
            const currScore = Number(DOM.clickedScore.innerText);
            if (currScore > bestScore) {
                localStorage.setItem(BEST_SCORE, currScore);
                DOM.bestScore.innerText = currScore;
            }

        } catch (e) { }
        DOM.clickedScore.innerText = 0;
        DOM.missedScore.innerText = 0;
    });

    rangeInpt.addEventListener('change', function () {
        DOM.speed = rangeInpt.value;
        stoptBtn.click();
        startBtn.click()
    });
}

init();

function draw() {
    DOM.context.clearRect(0, 0, DOM.canvas.width, DOM.canvas.height);
    DOM.context.beginPath();
    DOM.context.lineWidth = 0;
    DOM.context.fillStyle = 'red';
    DOM.context.fillRect(DOM.rectangle.x, DOM.rectangle.y, REC_SIZE.WIDTH, REC_SIZE.HEIGHT);
    DOM.context.fill();
    DOM.context.closePath();
}


