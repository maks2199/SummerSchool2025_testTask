// src/game/engine.ts
import Matter from "matter-js";

export function setupEngine() {
  const engine = Matter.Engine.create();
  const world = engine.world;

  const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;

  const render = Matter.Render.create({
    engine,
    canvas,
    options: {
      width: 800,
      height: 600,
      wireframes: false,
      background: "#fafafa",
      // showDebug: true,
      showVelocity: true,
      showCollisions: true,
      showPositions: true,
    },
  });

  Matter.Render.run(render);

  const runner = Matter.Runner.create();

  return {
    engine,
    world,
    render,
    runner,
    start: () => Matter.Runner.run(runner, engine),
  };
}
