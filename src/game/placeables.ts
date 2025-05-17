import Matter from "matter-js";

export type PlaceableType = "wall" | "ramp";

export const createPlaceable = (
  type: PlaceableType,
  x: number,
  y: number
): Matter.Body => {
  const { Bodies } = Matter;
  switch (type) {
    case "wall":
      return Bodies.rectangle(x, y, 100, 20, { isStatic: true });
    case "ramp":
      return Bodies.trapezoid(x, y, 100, 20, 0.5, { isStatic: true });
    default:
      throw new Error(`Unknown placeable type: ${type}`);
  }
};

export const drawBodyPreview = (
  canvas: HTMLCanvasElement,
  type: PlaceableType
) => {
  const ctx = canvas.getContext("2d");

  // Create a Matter body (offscreen)
  const body = createPlaceable(type, 0, 0);

  // Center the body in the canvas
  const offsetX = canvas.width / 2;
  const offsetY = canvas.height / 2;

  if (!ctx) return;
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.beginPath();
  body.vertices.forEach((v, i) => {
    const x = v.x + offsetX;
    const y = v.y + offsetY;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fill();
};
