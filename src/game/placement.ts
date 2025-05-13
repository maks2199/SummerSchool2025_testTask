// src/game/placement.ts
import Matter from "matter-js";
import { createPlaceable, PlaceableType } from "./placeables";

export function setupPlacement(world: Matter.World, canvas: HTMLCanvasElement) {
  let selectedType: PlaceableType | null = null;
  let remainingObjects = 3;

  let previewBody: Matter.Body | null = null;
  const mouse = { x: 0, y: 0 };

  // UI hook to select which object to place
  (window as any).selectPlaceable = (type: PlaceableType) => {
    selectedType = type;

    if (previewBody) {
      Matter.World.remove(world, previewBody);
      previewBody = null;
    }

    if (selectedType) {
      previewBody = createPlaceable(selectedType, mouse.x, mouse.y);
      previewBody.render.fillStyle = "rgba(0,0,255,0.3)";
      previewBody.isSensor = true; // Don't interact with physics
      Matter.World.add(world, previewBody);
    }
  };

  // Handle click placement on canvas
  canvas.addEventListener("click", (event) => {
    if (!selectedType || remainingObjects <= 0) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const body = createPlaceable(selectedType, x, y);
    Matter.Composite.add(world, body);

    remainingObjects--;
    updateRemainingUI(remainingObjects);

    if (remainingObjects === 0) {
      selectedType = null;
      if (previewBody) {
        Matter.World.remove(world, previewBody);
        previewBody = null;
      }
    }
  });

  // Update mouse position and preview object
  canvas.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;

    if (previewBody) {
      Matter.Body.setPosition(previewBody, { x: mouse.x, y: mouse.y });
    }
  });

  updateRemainingUI(remainingObjects);
}

function updateRemainingUI(count: number) {
  const display = document.getElementById("remaining");
  if (display) display.textContent = count.toString();
}
