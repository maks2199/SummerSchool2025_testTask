// src/game/placement.ts
import Matter from "matter-js";
import { createPlaceable, PlaceableType } from "./placeables";

export function setupPlacement(world: Matter.World, canvas: HTMLCanvasElement) {
  let selectedType: PlaceableType | null = null;
  let remainingObjects = 3;
  let rotationAngle = 0;

  const placedObjects: Matter.Body[] = [];

  let previewBody: Matter.Body | null = null;
  const mouse = { x: 0, y: 0 };

  const handleMouseMove = (event: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;

    if (previewBody) {
      Matter.Body.setPosition(previewBody, { x: mouse.x, y: mouse.y });
    }
  };

  const handleClick = (event: MouseEvent) => {
    console.log("Mouse clicked at:", mouse.x, mouse.y);
    if (!selectedType || remainingObjects <= 0) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const placedBody = createPlaceable(selectedType, x, y);
    placedBody.render.fillStyle = "rgb(226, 120, 194)";
    placedBody.render.lineWidth = 4;
    placedBody.render.strokeStyle = "rgba(161, 132, 132, 0.56)";

    Matter.Body.setAngle(placedBody, rotationAngle);
    Matter.Composite.add(world, placedBody);
    placedObjects.push(placedBody);

    remainingObjects--;
    updateRemainingUI(remainingObjects);

    if (remainingObjects === 0) {
      selectedType = null;
      if (previewBody) {
        Matter.World.remove(world, previewBody);
        previewBody = null;
      }
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    console.log("Key pressed:", event.key);
    if (event.key.toLowerCase() === "r" && previewBody) {
      rotationAngle += Math.PI / 8; // rotate 22.5 degrees
      Matter.Body.setAngle(previewBody, rotationAngle);
      console.log("Rotated preview body to angle:", rotationAngle);
    }
  };

  const handleRightMouseClick = (event: MouseEvent) => {
    console.log("Right mouse clicked at:", mouse.x, mouse.y);
    event.preventDefault(); // Prevent context menu
    rotationAngle += Math.PI / 8; // rotate 22.5 degrees
    if (previewBody) {
      Matter.Body.setAngle(previewBody, rotationAngle);
    }
    console.log("Rotated preview body to angle:", rotationAngle);
  };

  canvas.addEventListener("mousemove", handleMouseMove);
  canvas.addEventListener("click", handleClick);
  canvas.addEventListener("keydown", handleKeyDown);
  canvas.addEventListener("contextmenu", handleRightMouseClick);

  // UI hook to select which object to place
  (window as any).selectPlaceable = (type: PlaceableType) => {
    selectedType = type;

    if (previewBody) {
      Matter.World.remove(world, previewBody);
      previewBody = null;
    }

    if (selectedType) {
      previewBody = createPlaceable(selectedType, mouse.x, mouse.y);
      previewBody.render.fillStyle = "rgba(156, 156, 167, 0.3)";
      previewBody.render.lineWidth = 1;
      previewBody.render.strokeStyle = "rgba(156, 156, 167, 0.3)";
      previewBody.isSensor = true; // Don't interact with physics
      Matter.World.add(world, previewBody);
    }
  };

  updateRemainingUI(remainingObjects);

  // Return cleanup function
  return {
    disablePlacement: () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("click", handleClick);
      canvas.removeEventListener("keydown", handleKeyDown);
      if (previewBody) {
        Matter.World.remove(world, previewBody);
        previewBody = null;
      }
      selectedType = null;
      (window as any).selectPlaceable = () => {};
    },
    getPlacedObjects: () => placedObjects,
  };

  function updateRemainingUI(count: number) {
    const display = document.getElementById("remaining");
    if (display) display.textContent = count.toString();
  }
}
