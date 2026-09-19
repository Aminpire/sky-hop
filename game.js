const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const bestScoreEl = document.getElementById('best-score');
const overlay = document.getElementById('overlay');
const startButton = document.getElementById('startButton');

const groundY = canvas.height - 90;
const gravity = 1900;
const jumpVelocity = -760;
const obstacleBaseSpeed = 420;

const state = {
  running: false,
  gameOver: false,
  score: 0,
  bestScore: Number(localStorage.getItem('sky-hop-best')) || 0,
  lastTime: 0,
  obstacleTimer: 0,
  spawnInterval: 1.35,
  distance: 0,
};

const player = {
  x: 110,
  y: groundY - 54,
  width: 46,
  height: 54,
  velocityY: 0,
  isGrounded: true,
};

const clouds = [
  { x: 120, y: 90, w: 90, h: 28 },
  { x: 330, y: 140, w: 110, h: 30 },
  { x: 620, y: 90, w: 95, h: 26 },
  { x: 805, y: 150, w: 130, h: 32 },
];

const obstacles = [];

function resetGame() {
  player.y = groundY - player.height;
  player.velocityY = 0;
  player.isGrounded = true;
  obstacles.length = 0;
  state.running = true;
  state.gameOver = false;
  state.score = 0;
  state.distance = 0;
  state.obstacleTimer = 0;
  state.lastTime = 0;
  state.spawnInterval = 1.35;
  overlay.classList.remove('visible');
  updateHud();
}

function updateHud() {
  scoreEl.textContent = Math.floor(state.score);
  bestScoreEl.textContent = Math.floor(state.bestScore);
}

function setGameOver() {
  state.running = false;
  state.gameOver = true;
  state.bestScore = Math.max(state.bestScore, Math.floor(state.score));
  localStorage.setItem('sky-hop-best', String(state.bestScore));
  overlay.classList.add('visible');
  overlay.querySelector('h1').textContent = 'Game Over';
  overlay.querySelector('p').textContent = `You scored ${Math.floor(state.score)}. Try again!`;
  startButton.textContent = 'Play Again';
}

function startGame() {
  resetGame();
}

function jump() {
  if (!state.running) {
    startGame();
    return;
  }

  if (player.isGrounded) {
    player.velocityY = jumpVelocity;
    player.isGrounded = false;
  }
}

function spawnObstacle() {
  const type = Math.random() < 0.35 ? 'wide' : 'tall';
  const width = type === 'wide' ? 36 : 28;
  const height = type === 'wide' ? 48 : 78;

  obstacles.push({
    x: canvas.width + 30,
    y: groundY - height,
    width,
    height,
    speed: obstacleBaseSpeed + Math.random() * 60,
    type,
  });
}

function handleInput(event) {
  if (event.code === 'Space' || event.code === 'ArrowUp' || event.code === 'KeyW') {
    event.preventDefault();
    if (state.gameOver || !state.running) {
      startGame();
      return;
    }
    jump();
  }

  if (event.code === 'Enter' && state.gameOver) {
    startGame();
  }
}

function update(dt) {
  if (!state.running) return;

  state.distance += dt * 60;
  state.score += dt * 14;
  state.obstacleTimer += dt;

  if (state.obstacleTimer >= state.spawnInterval) {
    spawnObstacle();
    state.obstacleTimer = 0;
    state.spawnInterval = Math.max(0.9, 1.35 - state.score * 0.01);
  }

  player.velocityY += gravity * dt;
  player.y += player.velocityY * dt;

  if (player.y + player.height >= groundY) {
    player.y = groundY - player.height;
    player.velocityY = 0;
    player.isGrounded = true;
  }

  for (let i = obstacles.length - 1; i >= 0; i--) {
    const obstacle = obstacles[i];
    obstacle.x -= obstacle.speed * dt;

    if (obstacle.x + obstacle.width < 0) {
      obstacles.splice(i, 1);
      continue;
    }

    const intersects =
      player.x < obstacle.x + obstacle.width &&
      player.x + player.width > obstacle.x &&
      player.y < obstacle.y + obstacle.height &&
      player.y + player.height > obstacle.y;

    if (intersects) {
      setGameOver();
      break;
    }
  }

  updateHud();
}

function drawBackground() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#132b43';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (const cloud of clouds) {
    const drift = Math.sin((state.distance + cloud.x) / 60) * 8;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.arc(cloud.x + drift, cloud.y, 18, 0, Math.PI * 2);
    ctx.arc(cloud.x + drift + 25, cloud.y - 8, 22, 0, Math.PI * 2);
    ctx.arc(cloud.x + drift + 52, cloud.y, 18, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = '#345d7d';
  for (let x = 0; x < canvas.width + 60; x += 42) {
    const height = 20 + ((x / 42) % 3) * 10;
    ctx.fillRect(x, groundY - height, 24, height);
  }

  ctx.fillStyle = '#1d9d7a';
  ctx.fillRect(0, groundY + 4, canvas.width, canvas.height - groundY - 4);
}

function drawPlayer() {
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(player.x, player.y, player.width, player.height);

  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(player.x + 8, player.y + 12, player.width - 16, 18);

  ctx.fillStyle = '#1e293b';
  ctx.fillRect(player.x + 10, player.y + 8, 5, 5);
  ctx.fillRect(player.x + 31, player.y + 8, 5, 5);
}

function drawObstacles() {
  for (const obstacle of obstacles) {
    ctx.fillStyle = obstacle.type === 'wide' ? '#f87171' : '#a78bfa';
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.fillRect(obstacle.x + 6, obstacle.y + 8, obstacle.width - 12, 8);
  }
}

function render() {
  drawBackground();
  drawPlayer();
  drawObstacles();
}

function gameLoop(timestamp) {
  const dt = Math.min((timestamp - state.lastTime) / 1000 || 0, 0.03);
  state.lastTime = timestamp;

  update(dt);
  render();
  requestAnimationFrame(gameLoop);
}

startButton.addEventListener('click', () => {
  startGame();
});

document.addEventListener('keydown', handleInput);

overlay.querySelector('h1').textContent = 'Sky Hop';
overlay.querySelector('p').textContent = 'Jump over the floating obstacles and survive as long as you can.';
startButton.textContent = 'Start Game';
updateHud();
requestAnimationFrame(gameLoop);
