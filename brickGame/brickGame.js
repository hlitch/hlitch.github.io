(function () {
    'use strict';

    const canvas3 = document.querySelector('#canvas3');
    const context = canvas3.getContext("2d");
    const startButton = document.getElementById('addBall');
    const pauseButton = document.getElementById('pauseButton');
    const scoreBox = document.getElementById('score');
    let interval;
    const RADIUS = 20;
    let ballx = RADIUS;
    let bally = RADIUS + 75;
    let dx = 6;
    let dy = 6;
    let maxX;
    let maxY;

    let bricks = [];
    let brickWidth = 30;
    let brickHeight = 10;

    const paddleWidth = 150;
    const paddleHeight = 20;

    function resizeCanvas() {
        canvas3.width = window.innerWidth / 2;
        canvas3.height = window.innerHeight / 2 + 100;
        oneLess = canvas3.height - 1;
        maxX = canvas3.width;
        maxY = canvas3.height;
        context.fillStyle = "purple";
        drawGame();
    }

    function start() {
        interval = setInterval(drawGame, 16.66);
    }

    function pause() {
        clearInterval(interval);
    };

    startButton.addEventListener('click', start);
    pauseButton.addEventListener('click', pause);

    function newBrick(x, y) {
        return {
            collision: false,
            x: x,
            y: y
        }
    }

    for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 20; x++) {
            bricks.push(newBrick(x * 49, y * 30));
            console.log('Im x', x);
            console.log('Im y', y);
        }
    }

    function drawBricks() {
        context.fillStyle = 'green';

        for (let br = 0; br < bricks.length; br++) {
            if (bricks[br].collision === false) {
                context.fillRect(bricks[br].x, bricks[br].y, brickWidth, brickHeight);
            }
        }
    }

    const paddle = {
        x: canvas3.width - 400,
        y: canvas3.height + 205
    }

    function drawPaddle() {
        context.fillStyle = 'red';
        context.fillRect(paddle.x, paddle.y, paddleWidth, paddleHeight);
    }

    let direction;

    document.addEventListener('keydown', e => {
        direction = e.key;
    });

    function movePaddle() {
        //let paddleRight = paddle.x += paddleWidth;
        //let paddleLeft = paddle.x -= paddleWidth;
        //direction = paddleRightdirection = paddleLeft
        switch (direction) {
            case 'ArrowRight': direction = paddle.x += paddleWidth
                console.log('I pushed right')
                break;
            case 'ArrowLeft': direction = paddle.x -= paddleWidth
                console.log('I pushed left')
                break;
            case 'mousemove': direction = paddle.x += paddleWidth / 2;
                break;
        }
        return direction;
    }

    function drawBall() {
        context.clearRect(0, 0, maxX, maxY);
        context.beginPath();
        context.arc(ballx, bally, 10, 0, 2 * Math.PI);
        context.fillStyle = 'blue';
        ballx += dx;
        bally += dy;
        context.fill();
        if (ballx < 0 || ballx + dx > maxX) {
            dx = -dx;
        }
        if (bally < 0 || bally + dy > maxY) {
            dy = -dy;
        }
    }


    let score = 0;
    function detectCollision(brick) {
        const brickLeft = brick.x;
        const brickRight = brick.x + brickWidth;
        const brickTop = brick.y;
        const brickBottom = brick.y + brickHeight;

        const ballLeft = ballx;
        const ballRight = ballx + RADIUS;
        const ballTop = bally - RADIUS;
        const ballBottom = bally + RADIUS;

        const horizontalCollision = ballRight >= brickLeft && ballLeft <= brickRight;
        const verticalCollision = ballBottom >= brickTop && ballTop <= brickBottom;

        if (horizontalCollision && verticalCollision) {
            brick.collision = true;
            dy = -dy;
            dx = -dx;
            score++;

        }
        if (brick.collision === true) {
            dx += .5;
            dy += .5;
            displayScore();
            console.log('bricj collision');
        }
    }
    function displayScore() {
        scoreBox.style.font = 'bold 30px Arial';
        scoreBox.innerText = `score: ${score}`;
    }

    let gameOver = false;
    function detectPaddleCollision() {

        const paddleLeft = paddle.x;
        const paddleRight = paddle.x + paddleWidth;
        const paddleTop = paddle.y;
        //const paddleBottom = paddle.y - paddleHeight;

        const ballLeft = ballx;
        const ballRight = ballx + RADIUS;
        const ballTop = bally - RADIUS;
        const ballBottom = bally + RADIUS;

        const horizontalCollision = ballRight >= paddleLeft && ballLeft <= paddleRight;
        const verticalCollision = ballBottom >= paddleTop;
        if (verticalCollision && horizontalCollision) {
            dy = -dy;
            dx = +dx;
            console.log('collision');
        }
        if (ballBottom - 10 >= maxY) {
            gameOver = true;
            pause();
            console.log('Im hitting.... bottom maybe sure');
            context.font = 'bold 32px Arial';
            context.fillStyle = '#ff0000';
            context.fillText(`GAME OVER!!!`, (canvas3.width / 2) - 80, (canvas3.height / 2) - 16);
        }
    }
    if (gameOver) {

    }


    let paddleX = paddle.x += paddleWidth / 2;
    // document.addEventListener('mousedown', mouseMoveHandler);
    // 
    // function mouseMoveHandler(e) {

    //     let relativeX = e.clientX - canvas3.offsetLeft;
    //     if (relativeX > 0 && relativeX < canvas3.width) {
    //         paddleX = relativeX - paddleWidth / 2;
    //     }
    // }

    function updateBricks() {
        for (let b = 0; b < bricks.length; b++) {
            detectCollision(bricks[b]);
        }
        bricks = bricks.filter(brick => !brick.collision);

    }

    function drawGame() {
        //detectCollision();
        updateBricks();
        drawBall();
        drawBricks();
        drawPaddle();
        detectPaddleCollision();
        movePaddle();
    }
    let oneLess;


    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
})();








