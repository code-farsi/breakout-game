const rulesBtn = document.getElementById("rules-btn");
const closeBtn = document.getElementById("close-btn");
const rules = document.getElementById("rules");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const info = document.getElementById("info");
const reset = document.querySelectorAll(".reset");
const heart = document.getElementById("heart");

let score = 0;
let live = 3;

const brickRowCount = 9;
const brickColumnCount = 5;
const totalBricksCount = brickColumnCount * brickRowCount;

// Create ball props
const ball = {
  x: canvas.width / 2,
  y: canvas.height - 26,
  size: 10,
  speed: 0,
  dx: 0,
  dy: 0,
  visible: true,
};

// Create paddle props
const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  w: 80,
  h: 10,
  speed: 8,
  dx: 0,
  visible: true,
};

// Create brick props
const brickInfo = {
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 60,
  visible: true,
};

// Create bricks
const bricks = [];
for (let i = 0; i < brickRowCount; i++) {
  bricks[i] = [];
  for (let j = 0; j < brickColumnCount; j++) {
    const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
    const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
    bricks[i][j] = { x, y, ...brickInfo };
  }
}

function init(speed = 8, paddleW = 80) {
  score = 0;
  live = 3;
  ball.visible = false;
  paddle.visible = false;

  drawHeart();
  showAllBricks();

  paddle.x = canvas.width / 2 - 40;
  paddle.y = canvas.height - 20;
  paddle.w = paddleW;

  ball.speed = speed;
  ball.x = canvas.width / 2;
  ball.y = canvas.height - 26;
  ball.dx = 4;
  ball.dy = -ball.speed;

  ball.visible = true;
  paddle.visible = true;
}

// Draw ball on canvas
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = ball.visible ? "#0095dd" : "transparent";
  ctx.fill();
  ctx.closePath();
}

// Draw paddle on canvas
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = paddle.visible ? "#0095dd" : "transparent";
  ctx.fill();
  ctx.closePath();
}

// Draw score on canvas
function drawScore() {
  ctx.font = "20px Vazirmatn";
  ctx.fillText(`امتیاز: ${score}`, canvas.width - 50, 30);
}

// Draw bricks on canvas
function drawBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      ctx.fillStyle = brick.visible ? "#0095dd" : "transparent";
      ctx.fill();
      ctx.closePath();
    });
  });
}

// Move paddle on canvas
function movePaddle() {
  paddle.x += paddle.dx;

  // Wall detection
  if (paddle.x + paddle.w > canvas.width) {
    paddle.x = canvas.width - paddle.w;
  }

  if (paddle.x < 0) {
    paddle.x = 0;
  }
}

// Move ball on canvas
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Wall collision (right/left)
  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1; // ball.dx = ball.dx * -1
  }

  // Wall collision (top/bottom)
  if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
    ball.dy *= -1;
  }

  // console.log(ball.x, ball.y);

  // Paddle collision
  if (
    ball.x - ball.size > paddle.x &&
    ball.x + ball.size < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y
  ) {
    ball.dy = -ball.speed;
  }

  // Brick collision
  bricks.forEach((column) => {
    column.forEach((brick) => {
      if (brick.visible) {
        if (
          ball.x - ball.size > brick.x && // left brick side check
          ball.x + ball.size < brick.x + brick.w && // right brick side check
          ball.y + ball.size > brick.y && // top brick side check
          ball.y - ball.size < brick.y + brick.h // bottom brick side check
        ) {
          ball.dy *= -1;
          brick.visible = false;

          increaseScore();
        }
      }
    });
  });

  // Hit bottom wall - Lose
  if (ball.y + ball.size > canvas.height) {
    live--;
    drawHeart(live);
    if (live === 0) {
      ball.dx = 0;
      ball.dy = 0;
      ball.speed = 0;
      info.style.visibility = "visible";
      info.childNodes[1].innerHTML = `اشکال نداره، دوباره تلاش کن. امتیازت ${score} شد!`;
      score = 0;
    }
  }
}

const drawHeart = (live = 3) => {
  let element = "";
  for (let index = 0; index < live; index++) {
    element += `<span class="material-symbols-outlined">favorite</span>`;
  }
  heart.innerHTML = element;
};

// Increase score
function increaseScore() {
  score++;

  if (score % (brickRowCount * brickColumnCount) === 0) {
    ball.dx = 0;
    ball.dy = 0;
    ball.speed = 0;
    info.style.visibility = "visible";
    info.childNodes[1].innerHTML = `باریکلا! هیچی نذاشتی! امتیازت ${score} شد!`;
    init();
  }
}

// Make all bricks appear
function showAllBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => (brick.visible = true));
  });
}

// Draw everything
function draw() {
  // clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBall();
  drawPaddle();
  drawScore();
  drawBricks();
}

// Update canvas drawing and animation
function update() {
  movePaddle();
  moveBall();

  // Draw everything
  draw();

  requestAnimationFrame(update);
}

update();

// Keydown event
function keyDown(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    paddle.dx = paddle.speed;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    paddle.dx = -paddle.speed;
  }
}

// Keyup event
function keyUp(e) {
  if (
    e.key === "Right" ||
    e.key === "ArrowRight" ||
    e.key === "Left" ||
    e.key === "ArrowLeft"
  ) {
    paddle.dx = 0;
  }
}

// Keyboard event handlers
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

// Rules and close event handlers
rulesBtn.addEventListener("click", () => rules.classList.add("show"));
closeBtn.addEventListener("click", () => rules.classList.remove("show"));

for (let index = 0; index < reset.length; index++) {
  reset[index].addEventListener("click", () => {
    switch (reset[index].dataset.mode) {
      case "easy":
        init(8);
        info.style.visibility = "hidden";
        break;
      case "normal":
        init(10);
        info.style.visibility = "hidden";
        break;
      case "hard":
        init(12, 100);
        info.style.visibility = "hidden";
        break;
    }
  });
}
