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
