import GameAnimation from "lib/animation/gameAnimation";
import GameBase from "lib/interface/gameBase";
import GameObject from "../../lib/model/gameObject";
import Global from "../public/Global";
import Plant from "./plant";
// import Global from "../../lib/public/Global";

/**
 * 子弹类
 */
export default class Bullet extends Plant {
  // 是否穿透 默认不穿透
  private isPierce: boolean = false;
  // 伤害值
  private hurtValue: number = 0;
  // 移动速度(单位秒)
  public speed: number = 0;
  // 射程 默认全程
  private isAll: boolean = true;
  // 射程范围，当 isAll 为false才有用
  private range: number = -1;
  // 子弹类型 0 直线， 1曲线， 2原地 默认直线
  private type: number = 0;
  // 列
  public column: number = -1;
  // 行
  public row: number = -1;

  // 构造器
  constructor(args: {
    name: string;
    isPierce: boolean;
    hurtValue: number;
    speed: number;
    isAll: boolean;
    range: number;
    type: number;
    column: number;
    row: number;
    offsetX: number;
    offsetY: number;
    width: number;
    height: number
  }) {
    super()
    this.isPierce = Boolean(args.isPierce);
    this.hurtValue = args.hurtValue;
    this.speed = args.speed;
    this.isAll = args.isAll;
    if (!this.isAll) {
      this.range = args.range;
    }
    this.type = args.type || 0
    this.row = args.row;
    this.column = args.column;
    this.x = this.getOffsetX(args.offsetX);
    this.y = this.getOffsetY(args.offsetY);
    this.width = args.width || 60;
    this.height = args.height || 69;
    this.createAnimation(require("@/assets/bullet/PB001.gif"), this.x, this.y, this.width, this.height);
    this.createRigidBody(14, 14, 12, 0);
    // this.forceX = 1;
    // this.setGravity(true);
    this.setHandlePhysics(true);
    this.setVX(this.speed);
  }

  /**
    * 刷新方法
    */
  update(deltaTime: number): void {
    // console.log(this.x);
    // this.x =  this.x + this.speed * deltaTime / 1000;// (1000/60/1000);
    // this.view?.setX(this.x);
    // 飞出距离就注销
    if(this.x  > 830 || this.y > 700){
      // console.log("寄了");
      this.destroy();
    }
  }

  // 碰撞
  collision( gameObject: GameObject ): void {
    // console.log("欸嘿", gameObject); 
    // this.destroy();
  }

  /**
   * 子弹移动方法
   */
  move(): void {
    // this.moveTimer = setInterval(() => {
    //   let left: number = Number(this.bg.getAttribute("left")) + this.speed;
    //   // 超出距离死亡
    //   if (left > Global.MAX_X) {
    //     this.death();
    //     return
    //   } else {
    //     // 碰到僵尸死亡。。。。。

    //   }
    //   this.bg.setAttribute("left", left);
    //   this.bg.style.left = `${left}px`;
    // }, Global.BULLET_REFRESH_TIME)
  }

  
}