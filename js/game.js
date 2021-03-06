/**
 * SUIKAWARI Game
 */
import { Sprite } from "./sprite.js";
import { openResultModal } from "./modal.js";
const playarea = document.getElementById("gamearea");
const playareaCtx = playarea.getContext("2d");

let onPlaying = false;

const PI = Math.PI;
const PLAYAREA_WIDTH = 1000;
const PLAYAREA_HEIGHT = 680;
const CTRL_RADIUS = 80;
const CTRL_PADDING = 30;
const CTRL_INIT_X = PLAYAREA_WIDTH - CTRL_RADIUS - CTRL_PADDING;
const CTRL_INIT_Y = PLAYAREA_HEIGHT - CTRL_RADIUS - CTRL_PADDING;
const STICK_RADIUS = 20;
const VOLUME = 0.03;
const PLAYER_SPEED = 6;

let crab, player, melon;
let hold = false;
let move = false;

const ptrInCircle = (cx, cy, r) => (x, y) => {
  const [dx, dy] = [x - cx, y - cy];
  return Math.sqrt(dx ** 2 + dy ** 2) <= r;
};

const ptrOnStick = ptrInCircle(CTRL_INIT_X, CTRL_INIT_Y, STICK_RADIUS);

const stick = { x: CTRL_INIT_X, y: CTRL_INIT_Y };

const crash = new Audio("assets/sounds/crash.mp3");
crash.volume = VOLUME + 0.04;
const failed = new Audio("assets/sounds/failed.mp3");
failed.volume = VOLUME + 0.04;
const bgm = new Audio("assets/sounds/bgm.mp3");
bgm.loop = true;
bgm.volume = VOLUME;

const drawController = () => {
  playareaCtx.save();
  playareaCtx.beginPath();
  playareaCtx.arc(CTRL_INIT_X, CTRL_INIT_Y, CTRL_RADIUS, 0, 2 * PI);
  playareaCtx.strokeStyle = "black";
  playareaCtx.fillStyle = "rgba(0, 0, 0, 0.5)";
  playareaCtx.stroke();
  playareaCtx.fill();
  playareaCtx.beginPath();
  playareaCtx.arc(stick.x, stick.y, STICK_RADIUS, 0, 2 * PI);
  playareaCtx.strokeStyle = "black";
  playareaCtx.fillStyle = "rgb(255, 0, 0)";
  playareaCtx.stroke();
  playareaCtx.fill();
  playareaCtx.restore();
};

const drawHitBox = () => {
  playareaCtx.save();
  playareaCtx.beginPath();
  playareaCtx.ellipse(player.x + 180, player.y + 180, 24, 12, 0, 0, 2 * PI);
  playareaCtx.fillStyle = "rgba(0, 0, 120, 0.8)";
  playareaCtx.fill();
  playareaCtx.restore();
  playareaCtx.beginPath();
  playareaCtx.ellipse(player.x + 70, player.y + 185, 36, 12, 0, 0, 2 * PI);
  playareaCtx.fillStyle = "rgba(0, 0, 0, 0.5)";
  playareaCtx.fill();
  playareaCtx.restore();
  playareaCtx.beginPath();
  playareaCtx.ellipse(melon.x + 35, melon.y + 60, 24, 12, 0, 0, 2 * PI);
  playareaCtx.fillStyle = "rgba(0, 0, 0, 0.5)";
  playareaCtx.fill();
  playareaCtx.restore();
  playareaCtx.beginPath();
  playareaCtx.ellipse(crab.x + 26, crab.y + 48, 20, 8, 0, 0, 2 * PI);
  playareaCtx.fillStyle = "rgba(0, 0, 0, 0.5)";
  playareaCtx.fill();
  playareaCtx.restore();
};

const draw = () => {
  playareaCtx.clearRect(0, 0, PLAYAREA_WIDTH, PLAYAREA_HEIGHT);
  player.move();
  drawHitBox();
  playareaCtx.drawImage(...crab.data);
  playareaCtx.drawImage(...melon.data);
  playareaCtx.drawImage(...player.data);
  drawController();
  if (onPlaying) window.requestAnimationFrame(draw);
};

const loadSprites = () => {
  crab = new Sprite(
    "crab.png",
    { w: 50, h: 50 },
    { x: 300, y: 420 },
    { mx: PLAYAREA_WIDTH - 200, my: PLAYAREA_HEIGHT - 170 }
  );
  player = new Sprite(
    "player.png",
    { w: 200, h: 200 },
    {},
    { mx: PLAYAREA_WIDTH - 200, my: PLAYAREA_HEIGHT - 170 }
  );
  melon = new Sprite("suica.png", { w: 70, h: 70 }, { x: 700, y: 400 });
};

const resetPosition = () => {
  player.setPosition(0, 0);
  // crab.setPosition(300, 420);
  // melon.setPosition(700, 400);
};

playarea.addEventListener("mousedown", (e) => {
  e.preventDefault();
  hold = ptrOnStick(e.offsetX, e.offsetY);
});

playarea.addEventListener("mousemove", (e) => {
  e.preventDefault();
  if (!hold) return;
  move = true;
  const d = Math.sqrt(
    (CTRL_INIT_X - e.offsetX) ** 2 + (CTRL_INIT_Y - e.offsetY) ** 2
  );
  const rad = Math.atan2(e.offsetY - CTRL_INIT_Y, e.offsetX - CTRL_INIT_X);
  if (d >= CTRL_RADIUS - STICK_RADIUS) {
    [stick.x, stick.y] = [
      CTRL_INIT_X + (CTRL_RADIUS - STICK_RADIUS) * Math.cos(rad),
      CTRL_INIT_Y + (CTRL_RADIUS - STICK_RADIUS) * Math.sin(rad),
    ];
  } else {
    [stick.x, stick.y] = [e.offsetX, e.offsetY];
  }
  player.setSpeed(
    PLAYER_SPEED * (d / STICK_RADIUS) * Math.cos(rad),
    PLAYER_SPEED * (d / STICK_RADIUS) * Math.sin(rad)
  );
});

const canSplit = () => {
  const p = { x: player.x + 180, y: player.y + 180 };
  const m = { x: melon.x + 35, y: melon.y + 60 };
  const dif = { x: p.x - m.x, y: p.y - m.y };
  const r = Math.sqrt(dif.x ** 2 + dif.y ** 2);
  const rad = Math.atan2(2 * dif.y, dif.x);
  const d = 24 * Math.sqrt(1 + 3 * Math.cos(rad) ** 2);
  return d >= r;
};

const createResultText = (score) => {
  const bonus = 1.0;
  const total = Math.trunc(score * bonus);
  return `SCORE: ${Math.trunc(score)}<br>BONUS: x${bonus}<br>TOTAL: ${total}`;
};

const calcScore = () => {
  const playerShadowX = player.x + 180;
  const playerShadowY = player.y + 180;
  const melonShadowX = melon.x + 35;
  const melonShadowY = melon.y + 60;
  const d = Math.sqrt(
    Math.pow(playerShadowX - melonShadowX, 2) +
      Math.pow(2 * (playerShadowY - melonShadowY), 2)
  );
  return Math.exp(-Math.pow(d / 18, 2)) * Math.pow(10, 6);
};

playarea.addEventListener("mouseup", (e) => {
  e.preventDefault();
  if (!move && hold) {
    console.log("click");
    if (canSplit()) {
      crash.play();
      openResultModal(createResultText(calcScore()));
      onPlaying = false;
      return;
    } else {
      failed.currentTime = 0;
      failed.play();
    }
  } else {
    [stick.x, stick.y] = [CTRL_INIT_X, CTRL_INIT_Y];
    player.setSpeed(0, 0);
  }
  hold = false;
  move = false;
});

playarea.addEventListener("mouseleave", (e) => {
  [stick.x, stick.y] = [CTRL_INIT_X, CTRL_INIT_Y];
  hold = false;
  move = false;
  player.setSpeed(0, 0);
});

export const initGame = () => {
  onPlaying = true;
  resetPosition();
  window.requestAnimationFrame(draw);
  bgm.play();
};

loadSprites();
