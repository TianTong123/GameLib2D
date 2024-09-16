import GAME from "../../../lib/game";
import Input from "../../../lib/input/input";
import { KEYCODE } from "../../../lib/input/keyCode";
import GameObject from "../../../lib/model/gameObject";
import Bullet from "../bullet";
import Plant from "../plant";
import RigidBody from "../../../lib/rigidBody/rigidBody";
/**
 * 豌豆射手类
 */
export default class Peashooter extends Plant {
 
  private time: number = 0;
  private bulletSpeet: number = 3;
  private bulletType: string = "PB10";
  // 构造器
  constructor(row: number, column: number, width?: number, height?: number) {
    super();
    this.name = "plant"
    this.HP = 50;
    this.column = column;
    this.row = row;
    this.speed = 5000;
    this.x = this.getOffsetX();
    this.y = this.getOffsetY();
    this.width = width || 60;
    this.height = height || 69;
    this.setAni(require("@/assets/plant/Peashooter.gif"));
    const rb: RigidBody = new RigidBody( this, 0, 60, 69, -20, 0 );
    rb.id = this.id;
    rb.setHandlePhysics(true);
    // 关闭重力
    rb.setGravity(false);
    this.setRigidBody(rb);
    // this.setAni(require("@/assets/bullet/PB10.gif"));
    // this.setGravity(true);
  }

  public myCollision(gameObject: GameObject): void {

  }

  /**
   * 攻击方法
   */
   public myUpdate(deltaTime: number): void {
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
    // console.log(deltaTime, GAME.FIXED_REFRESH_FRAME_TIME);
    
   
  }
  
  public fixedUpdate(deltaTime: number): void {
    this.time += deltaTime;
    if( this.time / this.bulletSpeet > 1){
      new Bullet({
        name: "PB00",
        isPierce: false,
        hurtValue: 1000,
        speed: 300,
        isAll: true,
        range: -1,
        type: 0,
        column: this.column,
        row: this.row,
        offsetX: 40,
        offsetY: 5,
        width: 60,
        height: 60,
        bulletType: this.bulletType
      })
      this.time = 0;
    }
  }

  // 设置子弹速度
  public setBulletSpeet( speed: number ): void{
    this.bulletSpeet = speed;
  }

  // 设置子弹类类型
  public setBulletType( type: string ): void{
    this.bulletType = type;
  }

  // // 碰撞
  // public collision(go: GameObject): void {
  //   // console.log("欸嘿", go); 
  // }
}