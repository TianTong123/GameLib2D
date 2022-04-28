import Buff from "../buff";
import GameObject from "../../../lib/model/gameObject";
import GameAnimation from "../../../lib/animation/gameAnimation";
import Plant from "../plant";
// import Sunshine from "../sunshine";

/**
 * 向日葵
 */
export default class Sunflower extends Plant{
    // 构造器
    constructor(row: number, column: number, width?: number, height?: number){
      super();
      this.row = row;
      this.column = column;
      this.x = this.getOffsetX();
      this.y = this.getOffsetY();
      this.width = width || 60;
      this.height = height || 69;
      this.setAni(require("@/assets/plant/sunflower.gif"), this.width, this.height);
      this.createRigidBody();
    }
    
    /**
     * 攻击方法
     */
    update (): void{
      // console.log("欸嘿"); 
    }

    // 碰撞
    collision(): void{
      // console.log("欸嘿"); 
    }
}