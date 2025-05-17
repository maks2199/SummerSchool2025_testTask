// src/main.ts
import Matter from "matter-js";

import "./style.css"; // Import CSS styles

import { setupEngine } from "./game/engine";
import { createBall } from "./game/ball";
import { levels, Level } from "./game/levels";
import { setupPlacement } from "./game/placement";
import { loadLevel, getUnlockedLevel, resetBall } from "./game/loader";

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

// Initialize with first level
let currentLevelIndex = 0;
let ball = loadLevel(currentLevelIndex, world, engine, winGame);

// Show current level
const levelDisplay = document.getElementById("currentLevelDisplay");
if (levelDisplay) {
  levelDisplay.textContent = `Current Level: ${currentLevelIndex + 1}`;
}

// Hook up level selection buttons
document.querySelectorAll("#levelSelect button").forEach((btn) => {
  const levelIndex = parseInt(btn.getAttribute("data-level")!);
  if (levelIndex > getUnlockedLevel()) {
    btn.setAttribute("disabled", "true");
  }

  btn.addEventListener("click", () => {
    currentLevelIndex = levelIndex;
    playButton.disabled = false;

    const winDiv = document.getElementById("winMessage");
    if (winDiv) winDiv.style.display = "none";

    loadLevel(currentLevelIndex, world, engine, winGame);
  });
});
