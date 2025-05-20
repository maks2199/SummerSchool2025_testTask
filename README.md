# SummerSchool2025_testTask

# Геймплей

- ЛКМ - поставить/удалить объект;
- ПКМ - вращать объект;

Объекты на поле:

- Розовые - размещенные игроком и которые игрок может двигать;
- Черные - размещенные на уровне и которые игрок не может двигать.

## Installation and run

```shell
npm run start
```

## Libraries

Matter.js - physics engine

## Core techniques

- localStorage - для сохранения прогресса между сессиями браузера;

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

## Классы

- ball.ts - объект шарика, его создание и свойства;

- engine.ts - отвечает за игровой движок: создание мира, привязку к игровому полю, рендер;

- index.ts - стартовый связующий скрипт;

- levels.ts - список объектов, описывающих параметры уровня: начальная позиция шарика, начальные объекты, местоложение зоны победы;

- loader.ts - обработка уровней: загрузка, разблокировка, сохранение прогресса;

- placeables.ts - набор возможных к размещению объектов.

- placement.ts - отвечает за обработку взаимодействия с объектами в игре. Обрабатывает предпросмотр размещаемого объекта, поворот, размещение и перемещение объектов,

## Разработка

- Как добавить размещаемый объект?

- Как добавить уровень?

## Что улучшить

- Как-то отдельно хранить состояние уровня: с объектами, рендером, состоянием мяча.

- Отрефакторить классы, разграничить ответственность. Пока что не совсем понял, как правильно распределить функции между index, loader, и placement, например. В идеале, index ничего не должен знать об игре?

- Хранение уровней вынести в текстовый файл JSON. Добавить режим редактирования уровней, в котором можно создавать и изменять уровни и сохранять их в формате JSON.
