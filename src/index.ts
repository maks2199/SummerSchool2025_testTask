// src/main.ts
import { setupEngine } from "./game/engine";
import { createBall } from "./game/ball";
import { levels, Level } from "./game/levels";
import { setupPlacement } from "./game/placement";
import Matter from "matter-js";

const { Bodies, Composite } = Matter;

// Setup the Matter.js engine and world
const { engine, world, render, runner, start } = setupEngine();

// Load the first level (you can change this dynamically later)
const currentLevel: Level = levels[0];

// Create the ball at the level's defined position
const ball = createBall(world, currentLevel.ballPosition);

// Add obstacles for the level
currentLevel.obstacles.forEach((obstacle) => {
  Composite.add(world, obstacle);
});

// Add the goal area (this could be represented as a static body or other logic)
const goalArea = Bodies.rectangle(
  currentLevel.goalArea.x,
  currentLevel.goalArea.y,
  currentLevel.goalArea.width,
  currentLevel.goalArea.height,
  { isStatic: true, isSensor: true, render: { fillStyle: "green" } } // Make it green for visibility
);
Composite.add(world, goalArea);

// Setup placement
const canvas = render.canvas;
const disablePlacement = setupPlacement(world, canvas);

// Hook up Play button
const playButton = document.getElementById("playButton") as HTMLButtonElement;
playButton.addEventListener("click", () => {
  disablePlacement(); // disables further interaction
  playButton.disabled = true;
  start(); // starts the simulation
});

// Add a simple goal detection
Matter.Events.on(engine, "collisionStart", (event) => {
  for (const pair of event.pairs) {
    const bodies = [pair.bodyA, pair.bodyB];
    if (bodies.includes(ball) && bodies.includes(goalArea)) {
      winGame();
    }
  }
});

function winGame() {
  const winDiv = document.getElementById("winMessage");
  if (winDiv) winDiv.style.display = "block";
  Matter.Runner.stop(runner); // optional: stop simulation
}
