# SummerSchool2025_testTask

## Installation and run

```shell
npm run start
```

## Libraries

Matter.js - physics engine

## Project structure

```shell
game-project/
│
├── public/              # Static files
│   └── index.html
│
├── src/                 # Source code
│   ├── game/            # Game logic
│   │   ├── engine.js    # Setup Matter.js
│   │   ├── ball.js      # Ball entity
│   │   └── levels.js    # Level definitions
│   ├── ui/              # Optional UI (React or Vanilla)
│   └── main.js          # Game entry point
│
├── assets/              # Images, sounds
├── styles/              # CSS or SCSS
├── package.json
└── README.md
```

| Need           | Tool                            |
| -------------- | ------------------------------- |
| 2D Physics     | `Matter.js`                     |
| Rendering      | `Canvas`, `Phaser`, or `PixiJS` |
| UI             | Vanilla JS or `React`           |
| Asset Handling | Load via `<img>` / Audio APIs   |
| Hosting        | `GitHub Pages`, `Vercel`, etc   |

## Classes

- placement.ts - отвечает за функционал размещения объектов в игре. Обрабатывает предпросмотр размещаемого объекта.

- placeables.ts - набор возможных к размещению объектов.
