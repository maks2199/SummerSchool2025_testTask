// src/game/ball.js
import Matter from "matter-js";

const { Bodies } = Matter;

interface Position {
  x: number;
  y: number;
}

export const createBall = (
  world: Matter.World,
  position: Position
): Matter.Body => {
  const ball = Bodies.circle(position.x, position.y, 20, { restitution: 0.8 });
  Matter.World.add(world, ball);
  return ball;
};
