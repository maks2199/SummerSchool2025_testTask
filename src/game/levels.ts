// src/game/levels.ts
import { Bodies } from "matter-js";

// Define a level interface for structure
export interface Level {
  ballPosition: { x: number; y: number };
  obstacles: Matter.Body[];
  goalArea: { x: number; y: number; width: number; height: number };
}

// Define levels
export const levels: Level[] = [
  {
    ballPosition: { x: 100, y: 100 },
    obstacles: [
      Bodies.rectangle(300, 400, 200, 20, { isStatic: true }),
      Bodies.circle(500, 200, 30, { isStatic: true }),
    ],
    goalArea: { x: 700, y: 500, width: 50, height: 50 },
  },
  {
    ballPosition: { x: 150, y: 150 },
    obstacles: [
      Bodies.rectangle(400, 350, 250, 20, { isStatic: true }),
      Bodies.rectangle(600, 250, 100, 20, { isStatic: true }),
    ],
    goalArea: { x: 750, y: 550, width: 50, height: 50 },
  },
  // Add more levels as needed
];
