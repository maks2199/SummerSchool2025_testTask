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
  type: PlaceableType,
  scale = 0.5 // Add a scale parameter (default 0.5)
) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const body = createPlaceable(type, 0, 0);

  // Clear previous drawing
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Compute center of body
  const centerX = (body.bounds.min.x + body.bounds.max.x) / 2;
  const centerY = (body.bounds.min.y + body.bounds.max.y) / 2;

  const offsetX = canvas.width / 2;
  const offsetY = canvas.height / 2;

  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.beginPath();
  body.vertices.forEach((v, i) => {
    const x = (v.x - centerX) * scale + offsetX;
    const y = (v.y - centerY) * scale + offsetY;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fill();
};
