
// Minimal loop and input. Keep only the bike/player with jump mechanics (issue #2).
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Ground configuration
const GROUND_HEIGHT = 20; // px

// State: player (bike) and physics
const state = {
  player: {
    x: 40,
    y: 0, // set in restart()
    w: 28,
    h: 18,
    vy: 0,
    speed: 3,
    onGround: false,
  },
  gravity: 0.8,
  jumpImpulse: -12,
  running: true,
  keys: { left: false, right: false },
};

// Input: track left/right and handle jump on keydown
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') state.keys.left = true;
  if (e.key === 'ArrowRight') state.keys.right = true;
  if (e.code === 'Space') {
    // prevent page scrolling on Space
    e.preventDefault();
    // only start a jump on keydown (AC: must be on ground)
    if (state.player.onGround) {
      state.player.vy = state.jumpImpulse;
      state.player.onGround = false;
    }
  }
});
document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowLeft') state.keys.left = false;
  if (e.key === 'ArrowRight') state.keys.right = false;
});

document.getElementById('btn-restart').addEventListener('click', () => restart());

function restart() {
  // place player on ground
  state.player.x = 40;
  state.player.y = canvas.height - GROUND_HEIGHT - state.player.h;
  state.player.vy = 0;
  state.player.onGround = true;
  state.running = true;
}

function update() {
  if (!state.running) return;

  // Player horizontal movement (left/right arrows)
  if (state.keys.left) state.player.x -= state.player.speed;
  if (state.keys.right) state.player.x += state.player.speed;
  state.player.x = window.utils.clamp(state.player.x, 0, canvas.width - state.player.w);

  // Player vertical physics (gravity)
  state.player.vy += state.gravity;
  state.player.y += state.player.vy;

  // Ground collision: prevent going through ground
  const groundY = canvas.height - GROUND_HEIGHT;
  if (state.player.y + state.player.h >= groundY) {
    state.player.y = groundY - state.player.h;
    state.player.vy = 0;
    state.player.onGround = true;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw ground
  ctx.fillStyle = '#0b1220';
  ctx.fillRect(0, canvas.height - GROUND_HEIGHT, canvas.width, GROUND_HEIGHT);
  ctx.strokeStyle = '#334155';
  ctx.strokeRect(0, canvas.height - GROUND_HEIGHT, canvas.width, GROUND_HEIGHT);

  // Player (simple bike rectangle + small wheel circles)
  ctx.fillStyle = '#f97316';
  ctx.fillRect(state.player.x, state.player.y, state.player.w, state.player.h);
  // wheels
  ctx.fillStyle = '#111827';
  const wheelRadius = 6;
  ctx.beginPath();
  ctx.arc(state.player.x + 6, state.player.y + state.player.h + wheelRadius - 2, wheelRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(state.player.x + state.player.w - 6, state.player.y + state.player.h + wheelRadius - 2, wheelRadius, 0, Math.PI * 2);
  ctx.fill();
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

restart();
loop();

