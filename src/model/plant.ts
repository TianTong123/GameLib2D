import GameObject from "../../lib/model/gameObject";
import Global from "../public/Global";
/**
 * 植物类
 */
export default abstract class Plant extends GameObject{
  public HP: number = 50;
  public column: number = 0;
  public row: number = 0;
  public speed: number = 0;
  
  constructor(){
    super();
  }

  /**
   * 设置动画
   * @param url ： gif路径
   */
  setAni( url: string ){
    this.createAnimation(url, this.x, this.y, this.width, this.height);
    this.getAniMation().setLoop(true)
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