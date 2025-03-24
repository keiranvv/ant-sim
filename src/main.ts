import * as Phaser from "phaser";
import { Ant } from "./ant";

let lastUpdate = 0;

var config = {
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
  backgroundColor: "#ffffff",
  physics: {
    default: "arcade",
  },
};

var game = new Phaser.Game(config);

const home = {
  x: 100,
  y: 100,
  radius: 50,
  geometry: new Phaser.Geom.Circle(100, 100, 50),
};
const food = {
  x: 900,
  y: 600,
  radius: 50,
  geometry: new Phaser.Geom.Circle(900, 600, 50),
};

let huntingAnts: Ant[] = [];
let returningAnts: Ant[] = [];

const homeTrails: {
  x: number;
  y: number;
  created: number;
  sprite: Phaser.GameObjects.Sprite;
}[] = [];
const foodTrails: {
  x: number;
  y: number;
  created: number;
  sprite: Phaser.GameObjects.Sprite;
}[] = [];

function preload(this: Phaser.Scene) {
  this.load.image("ant", "/ant.png");
  this.load.image("dot", "/dot.png");
  this.load.image("dot_green", "/dot_green.png");
  this.load.image("dot_red", "/dot_red.png");
  this.load.image("home", "/home.png");
  this.load.image("food", "/food.png");
}

async function create(this: Phaser.Scene) {
  this.physics.world.setBounds(0, 0, 1024, 768);

  this.add.sprite(home.x, home.y, "home");
  this.add.sprite(food.x, food.y, "food");

  for (let i = 0; i < 20; i++) {
    // spawn from a random spot just outside home
    const spawn = {
      x: home.x + Math.cos(Math.random() * Math.PI * 2) * home.radius,
      y: home.y + Math.sin(Math.random() * Math.PI * 2) * home.radius,
    };
    huntingAnts.push(Ant.createAnt(this, spawn.x, spawn.y, 1));
  }

  huntingAnts.forEach((ant) => {
    this.physics.world.enable(ant);
    this.add.existing(ant);
  });
}

function update(this: Phaser.Scene, delta: number) {
  for (let i = huntingAnts.length - 1; i >= 0; i--) {
    const ant = huntingAnts[i];
    if (food.geometry.contains(ant.x, ant.y)) {
      huntingAnts.splice(i, 1);
      returningAnts.push(ant);
    } else {
      const foodTrail = foodTrails.find((trail) =>
        ant.canDetectPoint(trail.x, trail.y)
      );
      if (foodTrail) {
        ant.wander(foodTrail);
      } else {
        ant.wander();
      }
    }
  }

  for (let i = returningAnts.length - 1; i >= 0; i--) {
    const ant = returningAnts[i];
    if (home.geometry.contains(ant.x, ant.y)) {
      returningAnts.splice(i, 1);
      huntingAnts.push(ant);
    } else {
      const homeTrail = homeTrails.find((trail) =>
        ant.canDetectPoint(trail.x, trail.y)
      );

      if (homeTrail) {
        ant.wander(homeTrail);
      } else {
        ant.wander();
      }
    }
  }

  homeTrails.forEach((trail) => {
    const age = +new Date() - trail.created;
    if (age > 60000) {
      homeTrails.shift();
      trail.sprite.destroy();
    }

    const alpha = 1 - age / 60000;

    trail.sprite.setAlpha(alpha);
  });

  foodTrails.forEach((trail) => {
    const age = +new Date() - trail.created;
    if (age > 60000) {
      foodTrails.shift();
      trail.sprite.destroy();
    }

    const alpha = 1 - age / 60000;

    trail.sprite.setAlpha(alpha);
  });

  if (delta - lastUpdate > 200) {
    huntingAnts.forEach((ant) => {
      homeTrails.push({
        x: ant.x,
        y: ant.y,
        created: +new Date(),
        sprite: this.add.sprite(ant.x, ant.y, "dot"),
      });
    });

    returningAnts.forEach((ant) => {
      foodTrails.push({
        x: ant.x,
        y: ant.y,
        created: +new Date(),
        sprite: this.add.sprite(ant.x, ant.y, "dot_green"),
      });
    });

    lastUpdate = delta;
  }
}
