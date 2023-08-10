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

    function newBrick(x, y) {
        return {
            collision: false,
            x: x,
            y: y
        }
    }

    const paddle = {
        x: 1,
        y: canvas3.height + 190
    }

    for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 20; x++) {
            bricks.push(newBrick(x * 50, y * 30));
            console.log('Im x', x);
            console.log('Im y', y);
        }
    }

    console.log(bricks);

    startButton.addEventListener('click', start);
    pauseButton.addEventListener('click', pause);


    function start() {
        interval = setInterval(drawGame, 16.66);
    }

    function pause() {
        clearInterval(interval);
    };

    function drawPaddle() {
        paddle.y = canvas3.height - 25;
        context.fillStyle = 'red';
        context.fillRect(paddle.x, paddle.y, paddleWidth, paddleHeight);
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

    function drawBricks() {
        context.fillStyle = 'green';

        for (let br = 0; br < bricks.length; br++) {
            if (bricks[br].collision === false) {
                context.fillRect(bricks[br].x, bricks[br].y, brickWidth, brickHeight);
            }
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
            dx++;
            dy++;
            displayScore();
            console.log('bricj collision');
        }
    }
    function displayScore() {
        scoreBox.style.font = 'bold 30px Arial';
        scoreBox.innerText = `score: ${score}`;
        /*context.font = 'bold 30px Arial';
        context.fillStyle = '#ff0000';
        context.fillText(`Score ${score}`, (canvas3.width / 2) - 70, (canvas3.height / 2) - 16);*/
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
        if (ballTop >= paddleTop) {
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

    let direction;
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

    document.addEventListener('keydown', e => {
        direction = e.key;
    });

    document.addEventListener('mousedown', mouseMoveHandler);
    let paddleX = paddle.x += paddleWidth / 2;
    function mouseMoveHandler(e) {

        let relativeX = e.clientX - canvas3.offsetLeft;
        if (relativeX > 0 && relativeX < canvas3.width) {
            paddleX = relativeX - paddleWidth / 2;
        }
    }

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
    function resizeCanvas() {
        canvas3.width = window.innerWidth / 2;
        canvas3.height = window.innerHeight / 2 + 100;
        oneLess = canvas3.height - 1;
        maxX = canvas3.width;
        maxY = canvas3.height;
        context.fillStyle = "purple";
        drawGame();
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
})();

/*function detectCollision() {
       bricks.forEach(brick => {
           if (brick.x + brickWidth < ballx &&
               brick.y + brickHeight > bally &&
               brick.x < ballx + RADIUS * 2 &&
               brick.y < bally + RADIUS * 2) {
               brick.collision = true;
           }
       })
   }
   */
/*for (let c = 0; c < brickColumnCount; c++) {
            bricks[c] = [];
            for (let br = 0; br < brickRowCount; br++) {
                if (bricks[br][c].drawn) {
                    //let x = brickWidth * b;
                    context.fillRect(bricks[br][c].x, 5, brickWidth, brickHeight);
                    context.fillRect(bricks[br][c].y, 5, brickWidth, brickHeight);
                }
            }
        }*/
/*startButton.addEventListener('click', () => {
    console.log('start button clicked');
    start();
});
pauseButton.addEventListener('click', () => {
    console.log('pause button clicked');
    pause();
});*/

//this could be used for a restart button instead
        //ball.x = ball.dx;
        //ball.y = ball.dy;

        //this could be used for a speed button
        //ball.dx += ball.dx;
        //ball.dy += ball.dy;

        //this reverses
        //ball.dx =- ball.dx;
        //ball.dy =- ball.dy;

        //this would stop it
/*dx -= dx;
  dy -= dy;*/
/*
    const myCanvas = document.querySelector('#myCanvas');
    const brush = myCanvas.getContext('2d');
    const color = document.getElementById('color');
    const ballButton = document.getElementById('pickBall');
 
    let allBalls = [];
    let ballIndexer = 0;
 
    let maxX;
    let maxY;
    //let minY = RADIUS;
    function resizeCanvas() {
        myCanvas.width = window.innerWidth;
        myCanvas.height = window.innerHeight;
        maxX = myCanvas.width;
        maxY = myCanvas.height;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
 
    const RADIUS = 50;
 
    function ballCreator(radius, color) {
 
        return {
            x: radius,
            y: radius,
            dx: 10,
            dy: 10,
            color: color
        };
    }
 
 
    let aColor;
    color.addEventListener('change', (event) => {
        console.log(event.target.value);
        aColor = event.target.value;
    });
 
    let newBallsAgain = [];
 
    ballButton.addEventListener('click', () => {
        console.log(aColor);
        newBallsAgain.push(ballCreator(RADIUS, aColor));
        console.log(newBallsAgain);
    });
 
    function displayBalls() {
 
        brush.clearRect(0, 0, maxX, maxY);
        newBallsAgain.forEach(ball => {
 
            brush.beginPath();
            brush.arc(ball.x, ball.y, 50, 0, 2 * Math.PI);
            ball.x += ball.dx;
            ball.y += ball.dy;
            brush.fillStyle = ball.color;
            brush.fill();
 
            if (ball.x + ball.dx < 0 || ball.x + ball.dx > maxX) {
                ball.dx = -ball.dx;
            }
 
            if (ball.y + ball.dy < 0 || ball.y + ball.dy > maxY) {
                ball.dy = -ball.dy;
            }
        });
    }
 
    setInterval(displayBalls, 20);*/

