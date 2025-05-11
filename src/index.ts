import Matter from "matter-js";

const { Engine, Render, Runner, Bodies, Composite } = Matter;

// Create the engine and world
const engine = Engine.create();
const world = engine.world;

// Set up the renderer and attach to the body
const render = Render.create({
  element: document.body,
  canvas: document.getElementById("gameCanvas") as HTMLCanvasElement,
  engine: engine,
  options: {
    width: 800,
    height: 600,
    wireframes: false, // Disable wireframe mode to make it look better
  },
});

// Run the renderer and runner
Render.run(render);
Runner.run(Runner.create(), engine);

// Create the ball
const ball = Bodies.circle(100, 100, 20, { restitution: 0.8 });

// Add the ball to the world
Composite.add(world, ball);

// Create the ground (a static body)
const ground = Bodies.rectangle(400, 580, 810, 60, { isStatic: true });

// Add the ground to the world
Composite.add(world, ground);
