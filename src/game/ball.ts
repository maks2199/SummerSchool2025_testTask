// src/game/ball.js
import Matter from "matter-js";

const { Bodies, Body, Composite } = Matter;

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

// export const resetBall = (
//   world: Matter.World,
//   pos: { x: number; y: number }
// ) => {
//   const ball = Matter.Composite.allBodies(world).find(
//     (b) => b.label === "Ball"
//   );
//   if (!ball) return;

//   Matter.Body.setPosition(ball, pos);
//   Matter.Body.setVelocity(ball, { x: 0, y: 0 });
//   Matter.Body.setAngularVelocity(ball, 0);
// };
