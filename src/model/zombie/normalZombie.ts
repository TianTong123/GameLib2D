import Zombie from "../zombie";

export default class NormalZombie extends Zombie{

  constructor(row: number, column: number, width?: number, height?: number) {
    super();
    this.HP = 200;
    this.column = column;
    this.row = row;
    this.speed = -1;
    this.x = this.getOffsetX(-40);
    this.y = this.getOffsetY(-10);
    this.width = width || 120;
    this.height = height || 90;
    this.setAni(require("@/assets/zombie/Zombie3.gif"));
    this.createRigidBody(30, 80, 45, 0);
    // this.setGravity(true);
    this.setVX(this.speed);
  }
  
  public update(deltaTime: number): void {
    
  }

}