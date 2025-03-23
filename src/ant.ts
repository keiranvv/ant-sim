import * as Phaser from "phaser";
// ANGLES ARE ALL IN DEGREES
export class Ant extends Phaser.GameObjects.Container {
  x: number;
  y: number;
  speed: number;
  sprite: Phaser.GameObjects.Sprite;
  collider: Phaser.Geom.Circle;

  static createAnt(scene: Phaser.Scene, x: number, y: number, speed: number) {
    // random radian angle
    const angle = Math.random() * Math.PI * 2;
    return new Ant(scene, x, y, angle, speed);
  }

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    angle: number,
    speed: number
  ) {
    super(scene, x, y, []);

    const sprite = new Phaser.GameObjects.Sprite(this.scene, 0, 0, "ant");
    sprite.scale = 0.3;

    const middleDetector = new Phaser.GameObjects.Sprite(
      this.scene,
      20,
      0,
      "dot_red"
    );
    middleDetector.scale = 3 / 2;
    const leftDetector = new Phaser.GameObjects.Sprite(
      this.scene,
      10,
      20,
      "dot_red"
    );
    leftDetector.scale = 3 / 2;

    const rightDetector = new Phaser.GameObjects.Sprite(
      this.scene,
      10,
      -20,
      "dot_red"
    );

    rightDetector.scale = 3 / 2;

    this.add(sprite);
    this.add(middleDetector);
    this.add(leftDetector);
    this.add(rightDetector);

    this.setRotation(angle);

    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sprite = sprite;

    this.collider = new Phaser.Geom.Circle(x, y, 15);
  }

  canDetectPoint(x: number, y: number) {
    // create a 20px circle in front of the ant
    const detectionCircle = new Phaser.Geom.Circle(
      this.x + Math.cos(this.rotation) * 30,
      this.y + Math.sin(this.rotation) * 30,
      30
    );

    return detectionCircle.contains(x, y);
  }

  wander(bias: { x: number; y: number } | null = null) {
    // this.setX(this.x + this.speed);

    // Slight random variations in rotation:
    if (bias === null) {
      this.setRotation(this.rotation + (Math.random() * 0.1 - 0.05));
    } else {
      const angleToBias = this.getAngleTo(bias.x, bias.y);
      this.setRotation(angleToBias);
    }

    this.setX(this.x + Math.cos(this.rotation) * this.speed);
    this.setY(this.y + Math.sin(this.rotation) * this.speed);
    // if (bias === null) {
    //   this.angle += Math.random() * 0.1 - 0.05;
    // } else {
    //   // have a higher chance of moving towards the bias, but not guaranteed
    //   const angleToBias = this.getAngleTo(bias.x, bias.y);
    //   this.angle = angleToBias;
    // }

    // if (this.x < 0) {
    //   this.setX(0);
    //   this.setAngle()
    //   this.angle += Math.random() * 0.1 - 0.1;
    //   this.angle = Math.PI - this.angle;
    // }

    // if (this.x > 1024) {
    //   this.setX(1024);
    //   this.angle += Math.random() * 0.1 - 0.1;
    //   this.angle = Math.PI - this.angle;
    // }

    // if (this.y < 0) {
    //   this.setY(0);
    //   this.angle += Math.random() * 0.1 - 0.1;
    //   this.angle = -this.angle;
    // }

    // if (this.y > 768) {
    //   this.setY(768);
    //   this.angle = Math.random() * 0.1 - 0.1
    //   this.angle = -this.angle;
    // }

    // this.moveTowards(this.angle);
  }

  getAngleTo(x: number, y: number) {
    const dx = x - this.x;
    const dy = y - this.y;

    return Math.atan2(dy, dx);
  }
}
