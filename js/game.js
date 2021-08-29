/**
 * SUIKAWWARI Game
 */
const playareaCtx = document.getElementById("gamearea").getContext("2d");

const loadImage = async (filename) => {
  const img = new Image();
  let loaded = false;
  img.addEventListener("load", (e) => {
    loaded = true;
  });
  img.src = `/assets/img/${filename}`;
  return img;
};
let crab, player, melon;

const loadTextures = async () => {
  crab = await loadImage("crab.png");
  player = await loadImage("player.png");
  melon = await loadImage("suica.png");
};

loadTextures();
