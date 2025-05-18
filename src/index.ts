// src/main.ts
import Matter from "matter-js";

import "./style.css"; // Import CSS styles
//import ballImage from "./assets/ball.jpg"; // Import image for the ball

import { setupEngine } from "./game/engine";
import { createBall } from "./game/ball";
import { levels, Level } from "./game/levels";
import { setupPlacement } from "./game/placement";
import { drawBodyPreview } from "./game/placeables";
import { loadLevel, getUnlockedLevel, resetBall } from "./game/loader";

const gameContainer = document.getElementById("gameContainer")!;
const startScreen = document.getElementById("startScreen")!;

function winGame() {
  const winDiv = document.getElementById("winMessage");
  if (winDiv) winDiv.style.display = "block";
  Matter.Runner.stop(runner); // optional: stop simulation
}

const { Bodies, Composite } = Matter;

// Setup the Matter.js engine and world
const { engine, world, render, runner, start } = setupEngine();

// Setup placement
const canvas = render.canvas;
const { disablePlacement, getPlacedObjects } = setupPlacement(world, canvas);

// Hook up Play button
const playButton = document.getElementById("playButton") as HTMLButtonElement;
playButton.addEventListener("click", () => {
  disablePlacement(); // disables further interaction
  playButton.disabled = true;
  start(); // starts the simulation
});

// Hook up Reset button
const retryButton = document.getElementById("retryButton") as HTMLButtonElement;
retryButton.addEventListener("click", () => {
  // const startPos = levels[currentLevelIndex].ballPosition; // ← позиция уровня

  // Reset the ball position and velocity
  resetBall(world, ball, currentLevelIndex);
  // Stop simulation
  Matter.Runner.stop(runner);

  playButton.disabled = false;

  const winDiv = document.getElementById("winMessage");
  if (winDiv) winDiv.style.display = "none";
});

// // Initialize with first level
// let currentLevelIndex = 0;
// let ball = loadLevel(currentLevelIndex, world, engine, winGame);

let ball: Matter.Body;
let currentLevelIndex = 0;

// Show current level
const levelDisplay = document.getElementById("currentLevelDisplay");
if (levelDisplay) {
  levelDisplay.textContent = `Current Level: ${currentLevelIndex + 1}`;
}

// Setup level selection
document.querySelectorAll("#levelSelect button").forEach((btn) => {
  const levelIndex = parseInt(btn.getAttribute("data-level")!);
  if (levelIndex > getUnlockedLevel()) {
    btn.setAttribute("disabled", "true");
  }

  btn.addEventListener("click", () => {
    currentLevelIndex = levelIndex;

    // Hide start screen and show game
    startScreen.style.display = "none";
    gameContainer.style.display = "block";

    // Load selected level
    ball = loadLevel(currentLevelIndex, world, engine, winGame);

    // Update level display
    const levelDisplay = document.getElementById("currentLevelDisplay");
    if (levelDisplay) {
      levelDisplay.textContent = `Current Level: ${currentLevelIndex + 1}`;
    }

    // Reset button state
    const winDiv = document.getElementById("winMessage");
    if (winDiv) winDiv.style.display = "none";
    playButton.disabled = false;
  });
});

// Object placement buttons

const wallCanvas = document.getElementById("wallPreview") as HTMLCanvasElement;
const rampCanvas = document.getElementById("rampPreview") as HTMLCanvasElement;

window.onload = () => {
  if (wallCanvas) drawBodyPreview(wallCanvas, "wall");
  if (rampCanvas) drawBodyPreview(rampCanvas, "ramp");
};
