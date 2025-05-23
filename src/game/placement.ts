// src/game/placement.ts
import Matter from "matter-js";
import { createPlaceable, PlaceableType } from "./placeables";

export function setupPlacement(
  world: Matter.World,
  canvas: HTMLCanvasElement,
  movableBodies: Matter.Body[]
) {
  let selectedType: PlaceableType | null = null;
  let remainingObjects = 3;
  let rotationAngle = 0;
  let isRightMouseDown = false;
  let rotationInterval: number | null = null;
  let lastHoveredBody: Matter.Body | null = null;
  const placedObjects: Matter.Body[] = [];
  let previewBody: Matter.Body | null = null;
  const mouse = { x: 0, y: 0 };
  let draggingBody: Matter.Body | null = null;
  let offset = { x: 0, y: 0 };

  const handleMouseMove = (event: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;

    if (previewBody) {
      Matter.Body.setPosition(previewBody, { x: mouse.x, y: mouse.y });
      return;
    }
    if (draggingBody) {
      Matter.Body.setPosition(draggingBody, {
        x: mouse.x + offset.x,
        y: mouse.y + offset.y,
      });
      return;
    }

    const hoveringBody = placedObjects.find((body) =>
      Matter.Bounds.contains(body.bounds, mouse)
    );

    // Если курсор покинул предыдущий объект
    if (lastHoveredBody && lastHoveredBody !== hoveringBody) {
      lastHoveredBody.render.fillStyle = (
        lastHoveredBody as any
      ).originalFillStyle;
      lastHoveredBody = null;
    }

    // Если курсор наведен на новый объект
    if (hoveringBody && hoveringBody !== lastHoveredBody) {
      lastHoveredBody = hoveringBody;
      hoveringBody.render.fillStyle = "rgba(211, 81, 58, 0.5)";
    }
  };

  const handleClick = (event: MouseEvent) => {
    console.log("Mouse clicked at:", mouse.x, mouse.y);
    // if (!selectedType || remainingObjects <= 0) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (selectedType && remainingObjects > 0) {
      console.log("Placing object at:", x, y);
      const placedBody = createPlaceable(selectedType, x, y);
      placedBody.render.fillStyle = "rgba(214, 131, 189, 0.75)";
      placedBody.render.lineWidth = 1;
      placedBody.render.strokeStyle = "rgb(80, 79, 79)";
      // 👇 сохраняем оригинальный цвет
      (placedBody as any).originalFillStyle = placedBody.render.fillStyle;

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

      return;
    }
    // Handle click to delete placed objects TODO

    // if (!previewBody) {
    // if not in preview mode
    console.log("Deleting object under cursor");
    const found = placedObjects.find((body) =>
      Matter.Bounds.contains(body.bounds, mouse)
    );

    if (found) {
      Matter.World.remove(world, found);
      const index = placedObjects.indexOf(found);
      if (index !== -1) placedObjects.splice(index, 1);

      remainingObjects++;
      updateRemainingUI(remainingObjects);
      console.log("Deleted object at", mouse.x, mouse.y);
    }
    // }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    console.log("Key pressed:", event.key);
    if (event.key.toLowerCase() === "r" && previewBody) {
      rotationAngle += Math.PI / 8; // rotate 22.5 degrees
      Matter.Body.setAngle(previewBody, rotationAngle);
      console.log("Rotated preview body to angle:", rotationAngle);
    }
  };

  // const handleRightMouseClick = (event: MouseEvent) => {
  //   console.log("Right mouse clicked at:", mouse.x, mouse.y);
  //   event.preventDefault(); // Prevent context menu
  //   rotationAngle += Math.PI / 8; // rotate 22.5 degrees
  //   if (previewBody) {
  //     Matter.Body.setAngle(previewBody, rotationAngle);
  //   }
  //   console.log("Rotated preview body to angle:", rotationAngle);
  // };

  const handleRightMouseDown = (event: MouseEvent) => {
    if (event.button === 2 && previewBody) {
      console.log("Right mouse button down");
      event.preventDefault();
      isRightMouseDown = true;

      rotationInterval = window.setInterval(() => {
        rotationAngle += Math.PI / 180; // rotate 22.5 degrees
        if (previewBody) {
          Matter.Body.setAngle(previewBody, rotationAngle);
        }
      }, 16);
    }
  };
  const handleRightMouseUp = (event: MouseEvent) => {
    if (event.button === 2) {
      isRightMouseDown = false;
      if (rotationInterval !== null) {
        clearInterval(rotationInterval);
        rotationInterval = null;
      }
    }
  };

  // Handle mouse down to start dragging
  const handleMouseDown = (event: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const body = movableBodies.find((b) =>
      Matter.Bounds.contains(b.bounds, { x: mouseX, y: mouseY })
    );

    if (body) {
      draggingBody = body;
      offset.x = body.position.x - mouseX;
      offset.y = body.position.y - mouseY;
    }
  };
  const handleMouseUp = (event: MouseEvent) => {
    draggingBody = null;
  };

  canvas.addEventListener("mousemove", handleMouseMove);
  canvas.addEventListener("click", handleClick);

  // Rotate preview body with right mouse button
  canvas.addEventListener("mousedown", handleRightMouseDown);
  canvas.addEventListener("mouseup", handleRightMouseUp);
  canvas.addEventListener("contextmenu", (e) => e.preventDefault());

  // Handle dragging of movable bodies
  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mouseup", handleMouseUp);

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

  function resetPlacement() {
    placedObjects.forEach((body) => {
      Matter.World.remove(world, body);
    });
    placedObjects.length = 0;
    remainingObjects = 3;
    updateRemainingUI(remainingObjects);
    selectedType = null;

    if (previewBody) {
      Matter.World.remove(world, previewBody);
      previewBody = null;
    }
  }

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
    returnPlacement: () => {
      canvas.addEventListener("mousemove", handleMouseMove);
      canvas.addEventListener("click", handleClick);
      canvas.addEventListener("keydown", handleKeyDown);
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
    },
    getPlacedObjects: () => placedObjects,
    resetPlacement,
  };

  function updateRemainingUI(count: number) {
    const display = document.getElementById("remaining");
    if (display) display.textContent = count.toString();
  }
}
