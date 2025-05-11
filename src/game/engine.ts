// src/game/engine.js
import Matter from "matter-js";

const { Engine, Render, Runner, Bodies, Composite } = Matter;

export const setupEngine = () => {
  const engine = Engine.create();
  const world = engine.world;

  const render = Render.create({
    element: document.body,
    canvas: document.getElementById("gameCanvas") as HTMLCanvasElement,
    engine: engine,
    options: {
      width: 800,
      height: 600,
      wireframes: false,
    },
  });

  Render.run(render);
  Runner.run(Runner.create(), engine);

  return { engine, world };
};
