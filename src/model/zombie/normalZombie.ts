import GAME from "../../../lib/game";
import RigidBody from "../../../lib/rigidBody/rigidBody";
import Zombie from "../zombie";

export default class NormalZombie extends Zombie{
  private aniFlag = 0;
  constructor(row: number, column: number, width?: number, height?: number) {
    super();
    this.HP = 200;
    this.column = column;
    this.row = row;
    this.speed = -3;
    this.x = this.getOffsetX(-40);
    this.y = this.getOffsetY(-10);
    this.width = width || 120;
    this.height = height || 90;
    this.setAni(require("@/assets/zombie/Zombie2.gif"));
    // this.createRigidBody(30, 80, 45, 0);
    // this.setGravity(true);
    this.getAniMation().setPlaySpeed(1);

    const rb: RigidBody = new RigidBody( this, 0, 30, 80, 45, 0 );
    rb.id = this.id;
    rb.setHandlePhysics(false);
    this.setRigidBody(rb);
  }
  
  public update(deltaTime: number): void {
    // console.log(this.aniFlag);
    
    // 半血二阶段
    if(this.HP < 30 && this.aniFlag == 0){
      this.switchAni(require("@/assets/zombie/ZombieLostHead.gif"));
      this.getAniMation().setLoop(true);
      this.aniFlag = 1;
    }
    // 没血就死亡
    if(this.HP <= 0 && this.aniFlag == 1){
      this.switchAni(require("@/assets/zombie/ZombieDie.gif"));
      this.getAniMation().setLoop(false);
      this.getAniMation().setSpeed(4);
      // this.setVX(0);
      this.aniFlag = 2;
    }
    // 播放完死亡动画后就回收
    if(this.aniFlag == 2 ){
      this.speed = 0; // 死了设速度为0
      GAME.ACTIVE_SCENE.deleteRigidbody(this.id);
      if(this.getAniMation().isOver()){
        // 等动画播放完
        this.destroy();
      }
      
    }
  }

  public fixedUpdate(deltaTime: number): void{
    this.setX(this.x + this.speed * deltaTime )
  }
}