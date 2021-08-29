const loadImage = (filename) => {
  const img = new Image();
  img.src = `/assets/img/${filename}`;
  return img;
};

export const Sprite = class {
  constructor(filename, size, pos, area) {
    this.gfx = loadImage(filename);
    this.x = pos?.x ?? 0;
    this.y = pos?.y ?? 0;
    this.w = size.w;
    this.h = size.h;
    this.sx = 0;
    this.sy = 0;
    this.mx = area?.mx ?? 1000;
    this.my = area?.my ?? 680;
  }
  get data() {
    return [this.gfx, this.x, this.y, this.w, this.h];
  }
  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }
  move() {
    this.x = Math.max(0, Math.min(this.mx, this.x + this.sx));
    this.y = Math.max(0, Math.min(this.my, this.y + this.sy));
  }
  moveX(x) {
    this.x += x;
  }
  moveY(y) {
    this.y += y;
  }

  setSpeed(x, y) {
    [this.sx, this.sy] = [x, y];
  }
};
