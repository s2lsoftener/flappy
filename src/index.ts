import * as PIXI from 'pixi.js';
import { Container } from 'pixi.js';

const root = document.createElement('div');
document.body.appendChild(root);
const score = document.createElement('div');
document.body.appendChild(score);
const reload = document.createElement('button');
reload.innerHTML = 'Reload';
document.body.appendChild(reload);
reload.addEventListener('pointerdown', () => {
  location.reload();
});

const internalWidth = 600;
const internalHeight = 960;

const app = new PIXI.Application({
  width: 600,
  height: 960,
  backgroundColor: 0x999999,
});

const circle = new PIXI.Graphics();
circle.beginFill(0x770000);
const radius = 50;
circle.drawCircle(0, 0, radius);
circle.endFill();
circle.pivot.set(0.5);

function makeObstacle(): PIXI.Graphics[] {
  const total = internalHeight * 0.65;
  const width = internalWidth * 0.2;
  const box1Height = Math.max(total * Math.random(), internalHeight * 0.2);
  const box2Height = total - box1Height;

  const box1 = new PIXI.Graphics();
  box1.beginFill(0x005500);
  box1.drawRect(0, 0, width, box1Height);
  box1.endFill();

  const box2 = new PIXI.Graphics();
  box2.beginFill(0x000055);
  box2.drawRect(0, 0, width, box2Height);
  box2.endFill();

  return [box1, box2];
}

const obstacles = new Container();
const g = 8 / 60;
let circleVelocity = 0;
let internalScore = 0;

let ticker = 0;
function play(dt: number): void {
  ticker = (ticker + 1) % 3000000000;
  obstacles.children.forEach((obstacle) => {
    obstacle.x -= 5;
  });
  obstacles.children.forEach((obstacle) => {
    if (obstacle.x <= -300) {
      obstacles.removeChild(obstacle);
      obstacle.destroy();
      internalScore += 0.5;
      score.innerHTML = `${Math.round(internalScore)}`;
    }
  });

  circleVelocity += g;
  circle.y += circleVelocity;

  if (ticker % 120 === 0) {
    const [box1, box2] = makeObstacle();
    box1.x = internalWidth;
    box1.y = 0;

    box2.x = internalWidth;
    box2.y = internalHeight - box2.height;

    obstacles.addChild(box1, box2);
  }

  // Check if the circle is touching the rectangles.
  // For each side of the rectangle, check if the distance to the center of the circle
  // is less than the circle's radius.
  obstacles.children.forEach((obstacle) => {
    // Collide with side
    const obs = obstacle as PIXI.Graphics;
    const cirPos = circle.getGlobalPosition();
    const obsPos = obs.getGlobalPosition();
    const withinY = cirPos.y > obsPos.y - radius && cirPos.y < obsPos.y + obs.height + radius;
    const withinX = cirPos.x > obsPos.x - radius && cirPos.x < obsPos.x + obs.width + radius;
    const withinTop = cirPos.y < obsPos.y && cirPos.y > obsPos.y - radius;
    const withinBot = cirPos.y > obsPos.y && cirPos.y < obsPos.y + radius;

    // Side collision
    if (withinY && Math.abs(obsPos.x - cirPos.x) < radius) {
      app.ticker.remove(play);
      console.log('Collision');
    }
  });
}

function init(): void {
  const { stage } = app;

  stage.addChild(circle);
  stage.addChild(obstacles);
  circle.position.set(100, 500);

  app.view.onpointerdown = () => {
    circleVelocity -= 4;
    console.log('clicked');
  };

  app.ticker.add(play);

  root.appendChild(app.view);

  app.view.style.width = `${document.body.clientWidth}px`;
  app.view.style.height = `${document.body.clientWidth * (internalHeight / internalWidth)}px`;
}

init();
