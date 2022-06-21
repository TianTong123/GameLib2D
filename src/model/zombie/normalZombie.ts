import Zombie from "../zombie";

export default class NormalZombie extends Zombie{
  private aniFlag = 0;
  constructor(row: number, column: number, width?: number, height?: number) {
    super();
    this.HP = 200;
    this.column = column;
    this.row = row;
    this.speed = -0.3;
    this.x = this.getOffsetX(-40);
    this.y = this.getOffsetY(-10);
    this.width = width || 120;
    this.height = height || 90;
    this.setAni(require("@/assets/zombie/Zombie2.gif"));
    this.createRigidBody(30, 80, 45, 0);
    // this.setGravity(true);
    this.setVX(this.speed);
    this.getAniMation().setPlaySpeed(1);
  }
  
  public update(deltaTime: number): void {
    // 半血二阶段
    if(this.HP <= 100 && this.aniFlag == 0){
      this.switchAni(require("@/assets/zombie/ZombieLostHead.gif"));
      this.aniFlag = 1;
    }
    // 没血就死亡
    if(this.HP <= 0 && this.aniFlag == 1){
      this.switchAni(require("@/assets/zombie/ZombieDie.gif"));
      this.setVX(0);
      this.aniFlag = 2;
    }
    if(this.aniFlag == 2){
      
    }
  }

}