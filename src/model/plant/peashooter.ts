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
    // this.createRigidBody();
    // this.setGravity(true);
  }

  // /**
  //  * 攻击方法
  //  */
  // attack(): void{


  //    new Bullet({
  //     name: "PB00", 
  //     isPierce: false,
  //     hurtValue: 50, 
  //     speed: 10,
  //     isAll: true,
  //     range: -1,
  //     type: 0,
  //     column: this.column,
  //     row: this.row})
  // }

  /**
   * 攻击方法
   */
  update(deltaTime: number): void {
    this.time += 1000/60;
    if( this.time / 3000 > 1){
      new Bullet({
        name: "PB00",
        isPierce: false,
        hurtValue: 50,
        speed: 40,
        isAll: true,
        range: -1,
        type: 0,
        column: this.column,
        row: this.row,
        offsetX: 40,
        offsetY: 5,
        width: 26,
        height: 20
      })
      this.time = 0;
    }
  }

  // 碰撞
  collision(go: GameObject): void {
    // console.log("欸嘿", go); 
  }
}