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
    },
  });

  Matter.Render.run(render);
  Matter.Runner.run(Matter.Runner.create(), engine);

  return { engine, world, render };
}
