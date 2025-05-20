// game/loader.ts
import Matter, { Mouse, MouseConstraint, Body } from "matter-js";
import { levels, Level } from "./levels";
import { createBall } from "./ball";

import goalImage from "../assets/goal.png"; // Import image for the ball

export function saveProgress(unlockedLevel: number) {
  localStorage.setItem("unlockedLevel", unlockedLevel.toString());
}

export function getUnlockedLevel(): number {
  return parseInt(localStorage.getItem("unlockedLevel") || "0", 10);
}

export function loadLevel(
  index: number,
  world: Matter.World,
  engine: Matter.Engine,
  onWin: () => void
) {
  Matter.Composite.clear(world, false);
  const level: Level = levels[index];

  const ball = createBall(world, level.ballPosition);

  level.obstacles.forEach((o) => Matter.Composite.add(world, o));
  level.movable.forEach((m) => Matter.Composite.add(world, m));

  const goal = Matter.Bodies.rectangle(
    level.goalArea.x,
    level.goalArea.y,
    level.goalArea.width,
    level.goalArea.height,
    {
      isStatic: true,
      isSensor: true,
      render: {
        fillStyle: "rgba(28, 168, 47, 0.6)",
        strokeStyle: "rgba(28, 168, 47, 0.99)",
        lineWidth: 1,
        sprite: {
          texture: goalImage,
          xScale: 50 / 2083, // diameter devided by resolution
          yScale: 50 / 2083,
        },
      },
    }
  );
  Matter.Composite.add(world, goal);

  // First remove any existing collisionStart listeners
  Matter.Events.off(engine, "collisionStart");

  Matter.Events.on(engine, "collisionStart", (event) => {
    for (const pair of event.pairs) {
      const bodies = [pair.bodyA, pair.bodyB];
      if (bodies.includes(ball) && bodies.includes(goal)) {
        onWin();
        if (index + 1 > getUnlockedLevel()) {
          saveProgress(index + 1);
        }
      }
    }
  });

  return { ball, level };
}

export function resetBall(
  world: Matter.World,
  ball: Matter.Body,
  index: number
) {
  // Matter.Composite.clear(world, false);
  // Matter.Composite.remove(world, ball);

  const level: Level = levels[index];
  // const ball2 = createBall(world, level.ballPosition);

  const startPos = level.ballPosition;
  Matter.Body.setPosition(ball, startPos);
  Matter.Body.setAngle(ball, 0);
  Matter.Body.setVelocity(ball, { x: 0, y: 0 });
  Matter.Body.setAngularVelocity(ball, 0);
}

export function resetLevel(
  index: number,
  world: Matter.World,
  engine: Matter.Engine,
  onWin: () => void
) {
  loadLevel(index, world, engine, onWin);
}

export function resetMovable(
  world: Matter.World,
  movableBodies: Matter.Body[],
  index: number
) {
  for (const body of movableBodies) {
    Matter.World.remove(world, body);
  }

  const level: Level = levels[index];

  level.movable.forEach((m) => Matter.Composite.add(world, m));
}
