// src/main.ts
import Matter from "matter-js";

import "./style.css"; // Import CSS styles
//import ballImage from "./assets/ball.jpg"; // Import image for the ball

import { setupEngine } from "./game/engine";
import { createBall } from "./game/ball";
import { levels, Level } from "./game/levels";
import { setupPlacement } from "./game/placement";
import { drawBodyPreview } from "./game/placeables";
import {
  loadLevel,
  getUnlockedLevel,
  resetBall,
  resetLevel,
  resetMovable,
} from "./game/loader";

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
    let { ball, level } = loadLevel(currentLevelIndex, world, engine, winGame);

    // Update level display
    const levelDisplay = document.getElementById("currentLevelDisplay");
    if (levelDisplay) {
      levelDisplay.textContent = `Уровень: ${currentLevelIndex + 1}`;
    }

    // Setup placement
    const canvas = render.canvas;
    const {
      disablePlacement,
      returnPlacement,
      getPlacedObjects,
      resetPlacement,
    } = setupPlacement(world, canvas, level.movable);

    // Hook up Play button
    const playButton = document.getElementById(
      "playButton"
    ) as HTMLButtonElement;
    playButton.addEventListener("click", () => {
      disablePlacement(); // disables further interaction
      playButton.disabled = true;
      start(); // starts the simulation
    });

    // Hook up Retry button
    const retryButton = document.getElementById(
      "retryButton"
    ) as HTMLButtonElement;
    retryButton.addEventListener("click", () => {
      returnPlacement(); // enables further interaction
      // const startPos = levels[currentLevelIndex].ballPosition; // ← позиция уровня

      // Reset the ball position and velocity
      resetBall(world, ball, currentLevelIndex);
      // Stop simulation
      Matter.Runner.stop(runner);

      playButton.disabled = false;

      const winDiv = document.getElementById("winMessage");
      if (winDiv) winDiv.style.display = "none";
    });
    // Hook up Reset button
    const resetButton = document.getElementById(
      "resetButton"
    ) as HTMLButtonElement;
    resetButton.addEventListener("click", () => {
      resetLevel(currentLevelIndex, world, engine, winGame); // enables further interaction
      resetPlacement();
      resetMovable(world, level.movable, currentLevelIndex);
    });

    // Reset button state
    const winDiv = document.getElementById("winMessage");
    if (winDiv) winDiv.style.display = "none";
    playButton.disabled = false;
  });
});

let ball: Matter.Body;
let currentLevelIndex = 0;

// Show current level
const levelDisplay = document.getElementById("currentLevelDisplay");
if (levelDisplay) {
  levelDisplay.textContent = `Уровень: ${currentLevelIndex + 1}`;
}

document.getElementById("menu-toggle")?.addEventListener("click", () => {
  startScreen.style.display = "flex";
  gameContainer.style.display = "none";
});

// Object placement buttons

const wallCanvas = document.getElementById("wallPreview") as HTMLCanvasElement;
const rampCanvas = document.getElementById("rampPreview") as HTMLCanvasElement;

window.onload = () => {
  if (wallCanvas) drawBodyPreview(wallCanvas, "wall");
  if (rampCanvas) drawBodyPreview(rampCanvas, "ramp");
};
