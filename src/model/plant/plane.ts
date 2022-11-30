import GameObject from "../../../lib/model/gameObject";
import RigidBody from "../../../lib/rigidBody/rigidBody";
import Bullet from "../bullet";
import Plant from "../plant";
/**
 * 豌豆射手类
 */
export default class Plane extends Plant {
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
    this.width = width || 800;
    this.height = height || 80;
    this.createView(require("@/assets/test.png"), this.x, this.y, this.width, this.height);

    // this.setGravity(true);
    // this.rigidBody.des
    const rb: RigidBody = new RigidBody( this, 0,  this.width, this.height, 0, -5);
    rb.id = this.id;
    rb.setGravity(false);
    this.setRigidBody(rb);
    
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
  public update(deltaTime: number): void {
    
  }

  
  public fixedUpdate(deltaTime: number): void {

  }

  // 碰撞
  public collision(go: GameObject): void {
    // console.log("欸嘿", go); 
  }
}