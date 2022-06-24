import GameObject from "../../lib/model/gameObject";
import Global from "../public/Global";
import Bullet from "./bullet";
/**
 * 僵尸类
 */
export default abstract class Zombie extends GameObject{
  public HP: number = 50;
  public column: number = 0;
  public row: number = 0;
  public speed: number = 0;
  
  constructor(){
    super();
    this.setVX(this.speed);
  }

  // 碰撞
  collision( gameObject: GameObject ): void {
    // 撞到子弹 
    if( gameObject instanceof Bullet ){
      this.HP -=  gameObject.getHurtValue();
    }
    // 没血就死亡
    // if(this.HP <= 0){
    //   this.switchAni(require("@/assets/zombie/ZombieDie.gif"));
    //   this.setVX(0);
    // }
  }


  /**
   * 设置动画
   * @param url ： gif路径
   */
  setAni( url: string ): void{
    this.createAnimation(url, this.x, this.y, this.width, this.height);
    this.getAniMation().setLoop(true);
  }

  /**
   * 切换动画
   * @param url ： gif路径
   */
  switchAni( url: string ): void{
    this.switchAnimation(url, this.x, this.y, this.width, this.height)
  }

  /**
   * 获取x的偏差值
   */
  public getOffsetX(offsetX?: number): number{
    return this.row * Global.BLOCK_SIZE + Global.BASE_PLANT_X_Offset + (offsetX || 0);
  }

  /**
   * 获取y的偏差值
   */
  public getOffsetY(offsetY?: number): number{
    return this.column * Global.BLOCK_SIZE + Global.BASE_PLANT_Y_Offset + (offsetY || 0);
  }
}