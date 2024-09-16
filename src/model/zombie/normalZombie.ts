import GameObject from "lib/model/gameObject";
import GAME from "../../../lib/game";
import RigidBody from "../../../lib/rigidBody/rigidBody";
import Zombie from "../zombie";
import Plant from "../plant";

export default class NormalZombie extends Zombie{
  private time: number = 0;
  private aniFlag = 0;
  private isAttack: boolean = false;
  private plant: any;

  constructor(row: number, column: number, width?: number, height?: number) {
    super();
    this.attack = 1;
    this.HP = 200;
    this.column = column;
    this.row = row;
    this.speed = -70;
    this.x = this.getOffsetX(-40);
    this.y = this.getOffsetY(-30);
    this.width = width || 130;
    this.height = height || 120;
    this.setAni(require("@/assets/zombie/Zombie2.gif"));
    // this.createRigidBody(30, 80, 45, 0);
    // this.setGravity(true);
    this.getAniMation().setPlaySpeed(3);

    const rb: RigidBody = new RigidBody( this, 0, 30, 50, 45, 0 );
    rb.id = this.id;
    rb.setHandlePhysics(false);
    this.setRigidBody(rb);
  }
  
  public update(deltaTime: number): void {
    if(this.isAttack){
      this.time += deltaTime;
    }
   
    // 先假定每1秒攻击一次
    if( this.isAttack && this.plant.life >= 0 && this.time / 1 > 1){
      this.plant.life -= this.getAttack();
    }
    if( this.isAttack && this.plant.life < this.getAttack() && this.time / 1 > 1){

      this.isAttack = false;
      this.time = 0;
      this.switchAni(require("@/assets/zombie/Zombie2.gif"));
      this.getAniMation().setPlaySpeed(3);
      this.getAniMation().setLoop(true);
      this.aniFlag = 0;
    }
    this.handleAni();
  }

  public fixedUpdate(deltaTime: number): void{
    // 攻击时不移动
    if(!this.isAttack){
      this.setX(this.x + this.speed * deltaTime )
    }
   
  }

  public myCollision(gameObject: GameObject): void {
    if(gameObject instanceof Plant && this.HP > 0){  
      this.isAttack = true;
      this.plant = gameObject as Plant;
      this.aniFlag = 10;
      // this.speed = 0;
      // let pl: Plant = gameObject as Plant;
      // console.log('---》', pl.life );
      // this.switchAni(require("@/assets/zombie/ZombieAttack.gif"));
      // this.getAniMation().setLoop(true);
      // if(pl.life < this.getAttack()){
      //   // this.speed = -35;
      //   this.handleAni();
      // }
    }
  }

  // 处理动画
  private handleAni(): void{
      // 半血二阶段
      if(!this.isAttack && this.HP < 30 && this.aniFlag == 0){
        this.switchAni(require("@/assets/zombie/ZombieLostHead.gif"));
        this.getAniMation().setLoop(true);
        this.aniFlag = 1;
      }
      // 没血就死亡
      if(!this.isAttack && this.HP <= 0 && this.aniFlag == 1){
        this.switchAni(require("@/assets/zombie/ZombieDie.gif"));
        this.getAniMation().setLoop(false);
        this.getAniMation().setSpeed(4);
        this.aniFlag = 10;
      }
      if(this.isAttack && this.aniFlag == 10){
        this.switchAni(require("@/assets/zombie/ZombieAttack.gif"));
        this.getAniMation().setLoop(true);
        this.getAniMation().setPlaySpeed(20);
        this.aniFlag = 9;
      }
      // 播放完死亡动画后就回收
      if(this.aniFlag == 10 ){
        this.speed = 0; // 死了设速度为0
        GAME.ACTIVE_SCENE.deleteRigidbody(this.id);
        if(this.getAniMation().isOver()){
          // 等动画播放完
          this.destroy();
        }
      }
  }
}