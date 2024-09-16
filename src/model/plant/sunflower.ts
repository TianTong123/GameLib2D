import Buff from "../buff";
import GameObject from "../../../lib/model/gameObject";
import GameAnimation from "../../../lib/animation/gameAnimation";
import Plant from "../plant";
import GAME from "../../../lib/game";
import Input from "../../../lib/input/input";
import RigidBody from "../../../lib/rigidBody/rigidBody";
// import Sunshine from "../sunshine";

/**
 * 向日葵
 */
export default class Sunflower extends Plant{
  private x1: number = 0;
  private x2: number = 0;
  
    // 构造器
    constructor(row: number, column: number, width?: number, height?: number){
      super();
      this.name = "plant"
      this.row = row;
      this.column = column;
      this.x = this.getOffsetX();
      this.y = this.getOffsetY();
      this.width = width || 60;
      this.height = height || 69;
      this.setAni(require("@/assets/plant/testSun.gif"));
      // this.setAni(require("@/assets/bullet/PB10.gif"));
      const rb: RigidBody = new RigidBody( this, 0, 60, 30, -20, -20 );
      rb.id = this.id;
      rb.setHandlePhysics(true);
      // 关闭重力
      rb.setGravity(false);
      this.setRigidBody(rb);
      // GAME.CAMERA.setSize(300, 200)
    }
    
    public myCollision(gameObject: GameObject): void {

    }

    /**
     * 攻击方法
     */
    public myUpdate (deltaTime: number): void{
      GAME.CAMERA.setViewPosition(GAME.CAMERA.getViewX() + Input.getHorizontalAxis()*5, GAME.CAMERA.getViewY() + Input.getVerticallAxis()*5);
    }

    public fixedUpdate(deltaTime: number): void {
      
    }

    // // 碰撞
    // collision(gameObject: GameObject ): void{
    //   // console.log("欸嘿", gameObject); 
    // }
}