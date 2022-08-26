import GAME from "../../../lib/game";
import Input from "../../../lib/input/input";
import { KEYCODE } from "../../../lib/input/keyCode";
import GameObject from "../../../lib/model/gameObject";
import Bullet from "../bullet";
import Plant from "../plant";
/**
 * 豌豆射手类
 */
export default class Peashooter extends Plant {
  private time: number = 0;
  // 构造器
  constructor(row: number, column: number, width?: number, height?: number) {
    super();
    this.HP = 50;
    this.column = column;
    this.row = row;
    this.speed = 5000;
    this.x = this.getOffsetX();
    this.y = this.getOffsetY();
    this.width = width || 60;
    this.height = height || 69;
    this.setAni(require("@/assets/plant/Peashooter.gif"));
    this.createRigidBody();
    // this.setGravity(true);
  }

  /**
   * 攻击方法
   */
  update(deltaTime: number): void {
    // if(Input.getKeyDown(KEYCODE.Control_L)){
    //   console.log("我按ctrl了");
      
    // }
    // if(Input.getKeyDown(KEYCODE.A)){
    //   console.log("我按 a了");
    // }
    // if(Input.getHorizontalAxis()){
    //   console.log("我按 横轴");
    // }
    // if(Input.getVerticallAxis()){
    //   console.log("我按 纵轴");
    // }
    // Input.getHorizontalAxis(); Input.getVerticallAxis()
    // console.log(Input.getHorizontalAxis(), Input.getVerticallAxis());
    // console.log(deltaTime, GAME.REFRESH_FRAME_TIME);
    
    this.time += GAME.REFRESH_FRAME_TIME;
    if( this.time / 3000 > 1){
      new Bullet({
        name: "PB00",
        isPierce: false,
        hurtValue: 50,
        speed: 30,
        isAll: true,
        range: -1,
        type: 0,
        column: this.column,
        row: this.row,
        offsetX: 40,
        offsetY: 5,
        width: 15,
        height: 15
      })
      this.time = 0;
    }
  }

  // 碰撞
  collision(go: GameObject): void {
    // console.log("欸嘿", go); 
  }
}