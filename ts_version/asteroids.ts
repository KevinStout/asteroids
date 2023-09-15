// Note to use this file you will need to run it through a transpiler.

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let canvasWidth = 1400;
let canvasHeight = 800;
let keys: { [key: string]: boolean } = {};
let ship: Ship;
let bullets: Bullet[] = [];
let asteroids: Asteroid[] = [];
let score = 0;
let lives = 3;

document.addEventListener("DOMContentLoaded", SetupCanvas);

function SetupCanvas() {
  canvas = document.getElementById("my-canvas") as HTMLCanvasElement;
  ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ship = new Ship();
  for (let i = 0; i < 8; i++) {
    asteroids.push(new Asteroid());
  }

  // This allows you to use more than one key at a time
  document.body.addEventListener("keydown", function (e) {
    keys[e.code] = true;
  });
  document.body.addEventListener("keyup", function (e) {
    keys[e.code] = false;
    if (e.code === "Space") {
      bullets.push(new Bullet(ship.angle));
    }
  });
  Render();
}

class Ship {
  visible: boolean;
  x: number;
  y: number;
  movingForward: boolean;
  speed: number;
  velX: number;
  velY: number;
  rotateSpeed: number;
  radius: number;
  collisionRadius: number;
  angle: number;
  strokeColor: string;
  noseX: number;
  noseY: number;

  constructor() {
    this.visible = true;
    this.x = canvasWidth / 2;
    this.y = canvasHeight / 2;
    this.movingForward = false;
    this.speed = 0.1;
    this.velX = 0;
    this.velY = 0;
    this.rotateSpeed = 0.001;
    this.radius = 15;
    this.collisionRadius = 11;
    this.angle = 0;
    this.strokeColor = "white";
    this.noseX = canvasWidth / 2 + 15;
    this.noseY = canvasHeight / 2;
  }

  Rotate(dir: number) {
    this.angle += this.rotateSpeed * dir;
  }

  Update() {
    let radians = (this.angle / Math.PI) * 180;
    if (this.movingForward) {
      this.velX += Math.cos(radians) * this.speed;
      this.velY += Math.sin(radians) * this.speed;
    }
    if (this.x < this.radius) {
      this.x = canvas.width;
    }
    if (this.x > canvas.width) {
      this.x = this.radius;
    }
    if (this.y < this.radius) {
      this.y = canvas.height;
    }
    if (this.y > canvas.height) {
      this.y = this.radius;
    }
    this.velX *= 0.99;
    this.velY *= 0.99;

    this.x -= this.velX;
    this.y -= this.velY;
  }

  Draw() {
    ctx.strokeStyle = this.strokeColor;
    ctx.beginPath();
    let vertAngle = (Math.PI * 2) / 3;
    let radians = (this.angle / Math.PI) * 180;
    this.noseX = this.x - this.radius * Math.cos(radians);
    this.noseY = this.y - this.radius * Math.sin(radians);
    for (let i = 0; i < 3; i++) {
      ctx.lineTo(this.x - this.radius * Math.cos(vertAngle * i + radians), this.y - this.radius * Math.sin(vertAngle * i + radians));
    }
    ctx.closePath();
    ctx.stroke();
  }
}

class Bullet {
  visible: boolean;
  x: number;
  y: number;
  angle: number;
  height: number;
  width: number;
  speed: number;
  velX: number;
  velY: number;

  constructor(angle: number) {
    this.visible = true;
    this.x = ship.noseX;
    this.y = ship.noseY;
    this.angle = angle;
    this.height = 4;
    this.width = 4;
    this.speed = 5;
    this.velX = 0;
    this.velY = 0;
  }

  Update() {
    let radians = (this.angle / Math.PI) * 180;
    this.x -= Math.cos(radians) * this.speed;
    this.y -= Math.sin(radians) * this.speed;
  }

  Draw() {
    ctx.fillStyle = "white";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Asteroid {
  visible: boolean;
  x: number;
  y: number;
  speed: number;
  radius: number;
  angle: number;
  strokeColor: string;
  collisionRadius: number;
  level: number;

  constructor(x?: number, y?: number, radius?: number, level?: number, collisionRadius?: number) {
    this.visible = true;
    this.x = x || Math.floor(Math.random() * canvasWidth);
    this.y = y || Math.floor(Math.random() * canvasHeight);
    this.speed = 1;
    this.radius = radius || 50;
    this.angle = Math.floor(Math.random() * 359);
    this.strokeColor = "white";
    this.collisionRadius = collisionRadius || 46;
    this.level = level || 1;
  }

  Update() {
    var radians = (this.angle / Math.PI) * 180;
    this.x += Math.cos(radians) * this.speed;
    this.y += Math.sin(radians) * this.speed;
    if (this.x < this.radius) {
      this.x = canvas.width;
    }
    if (this.x > canvas.width) {
      this.x = this.radius;
    }
    if (this.y < this.radius) {
      this.y = canvas.height;
    }
    if (this.y > canvas.height) {
      this.y = this.radius;
    }
  }

  draw() {
    ctx.beginPath();
    var vertAngle = (Math.PI * 2) / 6;
    var radians = (this.angle / Math.PI) * 180;
    for (let i = 0; i < 6; i++) {
      ctx.lineTo(this.x - this.radius * Math.cos(vertAngle * i + radians), this.y - this.radius * Math.sin(vertAngle * i + radians));
    }
    ctx.closePath();
    ctx.stroke();
  }
}

function CircleCollision(p1x: number, p1y: number, r1: number, p2x: number, p2y: number, r2: number) {
  let radiusSum;
  let xDiff;
  let yDiff;
  radiusSum = r1 + r2;
  xDiff = p1x - p2x;
  yDiff = p1y - p2y;
  if (radiusSum > Math.sqrt(xDiff * xDiff + yDiff * yDiff)) {
    return true;
  } else {
    return false;
  }
}

function DrawLifeShips() {
  let startX = 1350;
  let startY = 10;
  let points: [number, number][] = [
    [9, 9],
    [-9, 9],
  ];
  ctx.strokeStyle = "white";
  for (let i = 0; i < lives; i++) {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    for (let j = 0; j < points.length; j++) {
      ctx.lineTo(startX + points[j][0], startY + points[j][1]);
    }
    ctx.closePath();
    ctx.stroke();
    startX -= 30;
  }
}

function Render() {
  ship.movingForward = keys["KeyW"];
  if (keys["KeyD"]) {
    ship.Rotate(1);
  }
  if (keys["KeyA"]) {
    ship.Rotate(-1);
  }
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.fillStyle = "white";
  ctx.font = "21px Arial";
  ctx.fillText("SCORE: " + score.toString(), 20, 35);
  if (lives <= 0) {
    ship.visible = false;
    ctx.fillStyle = "white";
    ctx.font = "50px Arial";
    ctx.fillText("GAME OVER", canvasWidth / 2 - 150, canvasHeight / 2);
  }

  if (asteroids.length !== 0) {
    for (let k = 0; k < asteroids.length; k++) {
      if (CircleCollision(ship.x, ship.y, ship.collisionRadius, asteroids[k].x, asteroids[k].y, asteroids[k].collisionRadius)) {
        ship.x = canvasWidth / 2;
        ship.y = canvasHeight / 2;
        ship.velX = 0;
        ship.velY = 0;
        lives -= 1;
      }
    }
  }

  if (asteroids.length !== 0 && bullets.length !== 0) {
    // the loop1 and break loop1 are used to break out of the nested loop when a collision is detected
    loop1: for (let l = 0; l < asteroids.length; l++) {
      for (let m = 0; m < bullets.length; m++) {
        if (CircleCollision(bullets[m].x, bullets[m].y, 3, asteroids[l].x, asteroids[l].y, asteroids[l].collisionRadius)) {
          if (asteroids[l].level === 1) {
            // break the asteroid into two smaller asteroids
            // push the new asteroids into the asteroids array
            asteroids.push(new Asteroid(asteroids[l].x - 5, asteroids[l].y - 5, 25, 2, 22));
            asteroids.push(new Asteroid(asteroids[l].x + 5, asteroids[l].y + 5, 25, 2, 22));
          } else if (asteroids[l].level === 2) {
            // break the asteroid into two smaller asteroids
            // push the new asteroids into the asteroids array
            asteroids.push(new Asteroid(asteroids[l].x - 5, asteroids[l].y - 5, 15, 3, 12));
            asteroids.push(new Asteroid(asteroids[l].x + 5, asteroids[l].y + 5, 15, 3, 12));
          }
          asteroids.splice(l, 1);
          bullets.splice(m, 1);
          score += 20;
          break loop1;
        }
      }
    }
  }

  DrawLifeShips();

  if (ship.visible === true) {
    ship.Update();
    ship.Draw();
  }
  if (bullets.length !== 0) {
    for (let i = 0; i < bullets.length; i++) {
      bullets[i].Update();
      bullets[i].Draw();
    }
  }
  if (asteroids.length !== 0) {
    for (let j = 0; j < asteroids.length; j++) {
      asteroids[j].Update();
      asteroids[j].draw();
    }
  }
  requestAnimationFrame(Render);
}
