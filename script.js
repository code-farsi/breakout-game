const openBtn = document.getElementById("open-btn");
const closeBtn = document.getElementById("close-btn");
const rules = document.getElementById("rules");
const canvas = document.getElementById("canvas");
const info = document.getElementById("info");
const reset = document.querySelectorAll(".reset");
const heart = document.getElementById("heart");

const ctx = canvas.getContext("2d");
let score = 0;

const bricksRowCount = 5;
const bricksColCount = 9;

let live = 3;

const ball = {
  x: canvas.width / 2,
  y: canvas.height - 26,
  size: 10,
  speed: 0,
  dx: 0,
  dy: 0,
};

const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  w: 80,
  h: 10,
  speed: 8,
  dx: 0,
};

const bricksInfo = {
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 60,
  visible: true,
};

const bricks = [];
for (let i = 0; i < bricksColCount; i++) {
  bricks[i] = [];
  for (let j = 0; j < bricksRowCount; j++) {
    const x = i * (bricksInfo.w + bricksInfo.padding) + bricksInfo.offsetX;
    const y = j * (bricksInfo.h + bricksInfo.padding) + bricksInfo.offsetY;

    bricks[i][j] = { x, y, ...bricksInfo };
  }
}

const init = (speed = 8, paddleW = 80) => {
  score = 0;
  live = 3;

  drawHeart();
  showAllBricks();

  paddle.x = canvas.width / 2 - paddleW / 2;
  paddle.y = canvas.height - 20;
  paddle.w = paddleW;

  ball.speed = speed;
  ball.x = canvas.width / 2;
  ball.y = canvas.height - 26;
  ball.dx = 4;
  ball.dy = -ball.speed;
};

const drawHeart = (live = 3) => {
  let el = "";
  for (let index = 0; index < live; index++) {
    el += `<span class="material-symbols-outlined"> favorite </span>`;
  }

  heart.innerHTML = el;
};

const drawBall = () => {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, 2 * Math.PI);
  ctx.fillStyle = "#0095dd";
  ctx.fill();
  ctx.closePath();
};

const drawPaddle = () => {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = "#0095dd";
  ctx.fill();
  ctx.closePath();
};

const drawScore = () => {
  ctx.font = "20px Vazirmatn";
  ctx.fillText(`امتیاز: ${score}`, canvas.width - 50, 30);
};

const drawBricks = () => {
  bricks.forEach((col) => {
    col.forEach((brick) => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      ctx.fillStyle = brick.visible ? "#0095dd" : "transparent";
      ctx.fill();
      ctx.closePath();
    });
  });
};

const movePaddle = () => {
  paddle.x += paddle.dx;

  if (paddle.x + paddle.w > canvas.width) paddle.x = canvas.width - paddle.w;

  if (paddle.x < 0) paddle.x = 0;
};

const moveBall = () => {
  ball.x += ball.dx;
  ball.y += ball.dy;

  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0)
    ball.dx *= -1;

  if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0)
    ball.dy *= -1;

  if (
    ball.x - ball.size > paddle.x &&
    ball.x + ball.size < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y
  )
    ball.dy = -ball.speed;

  bricks.forEach((col) =>
    col.forEach((brick) => {
      if (brick.visible)
        if (
          ball.x - ball.size > brick.x &&
          ball.x + ball.size < brick.x + brick.w &&
          ball.y + ball.size > brick.y &&
          ball.y - ball.size < brick.y + brick.h
        ) {
          ball.dy *= -1;
          brick.visible = false;

          increaseScore();
        }
    })
  );

  if (ball.y + ball.size > canvas.height) {
    live--;
    drawHeart(live);
    if (live === 0) {
      ball.dx = 0;
      ball.dy = 0;
      ball.speed = 0;
      info.style.visibility = "visible";
      info.childNodes[1].innerHTML = `اشکالی نداره، دوباره تلاش کن. امتیازت ${score} شد!`;
      score = 0;
    }
  }
};

const increaseScore = () => {
  score++;

  if (score % (bricksColCount * bricksRowCount) === 0) {
    ball.dx = 0;
    ball.dy = 0;
    ball.speed = 0;
    info.style.visibility = "visible";
    info.childNodes[1].innerHTML = `باریکلا! هیچی نذاشتی! امتیازت ${score} شد!`;
    init();
  }
};

const showAllBricks = () => {
  bricks.forEach((col) => col.forEach((brick) => (brick.visible = true)));
};

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();
  drawScore();
  drawBricks();
};

const keyDown = (e) => {
  if (e.key === "right" || e.key === "ArrowRight") paddle.dx = paddle.speed;

  if (e.key === "left" || e.key === "ArrowLeft") paddle.dx = -paddle.speed;
};

const keyUp = (e) => {
  if (
    e.key === "right" ||
    e.key === "ArrowRight" ||
    e.key === "left" ||
    e.key === "ArrowLeft"
  )
    paddle.dx = 0;
};

const update = () => {
  movePaddle();
  moveBall();

  draw();

  requestAnimationFrame(update);
};
update();

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

openBtn.addEventListener("click", () => rules.classList.add("show"));
closeBtn.addEventListener("click", () => rules.classList.remove("show"));

for (let index = 0; index < reset.length; index++) {
  reset[index].addEventListener("click", () => {
    switch (reset[index].dataset.mode) {
      case "easy":
        init();
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
