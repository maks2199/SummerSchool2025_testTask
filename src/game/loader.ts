// game/loader.ts
import Matter from "matter-js";
import { levels, Level } from "./levels";
import { createBall } from "./ball";

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

  const goal = Matter.Bodies.rectangle(
    level.goalArea.x,
    level.goalArea.y,
    level.goalArea.width,
    level.goalArea.height,
    { isStatic: true, isSensor: true, render: { fillStyle: "green" } }
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
}
