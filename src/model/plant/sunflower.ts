import Buff from "../buff";
import GameObject from "../../../lib/model/gameObject";
import GameAnimation from "../../../lib/animation/gameAnimation";
import Plant from "../plant";
import GAME from "../../../lib/game";
import Input from "../../../lib/input/input";
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
      this.row = row;
      this.column = column;
      this.x = this.getOffsetX();
      this.y = this.getOffsetY();
      this.width = width || 60;
      this.height = height || 69;
      this.setAni(require("@/assets/plant/sunflower.gif"));
      // this.setAni(require("@/assets/bullet/PB10.gif"));
      // this.createRigidBody(56, 66);
      this.createRigidBody();
      // GAME.CAMERA.setSize(300, 200)
    }
    
    /**
     * 攻击方法
     */
    public update (deltaTime: number): void{
      GAME.CAMERA.setViewPosition(GAME.CAMERA.getViewX() + Input.getHorizontalAxis()*5, GAME.CAMERA.getViewY() + Input.getVerticallAxis()*5);
    }

    public fixedUpdate(deltaTime: number): void {
      
    }

    // 碰撞
    collision(gameObject: GameObject ): void{
      // console.log("欸嘿", gameObject); 
    }
}