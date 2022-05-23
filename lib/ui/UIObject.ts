import View from "../view/view";
import GameBase from "../interface/gameBase";
const { v4: uuidv4 } = require('uuid');
import GAME from "../game";
import Vector from "../util/vector";


// UI 对象
export default class UIObject implements GameBase{
  // 坐标
  public x: number = 0;
  public y: number = 0;
  // 大小
  private width: number = 0;
  private height: number = 0;

  // 旋转角度（可以考虑的扩展）
  private rotation: number = 0

  // id
  public id: string = "";

  //层级
  public zIndex: number = 0;

  // 视图资源
  public view: View;

  // 构造器
  // 参数就字面意思 url:图片地址
  constructor( url: string, x?: number, y?: number, width?: number, height?: number, zIndex?: number){
    this.id = uuidv4(); 
    this.x = x || 0;
    this.y = y || 0;
    this.width = width || 0;
    this.height = height || 0;
    this.zIndex = zIndex || 0;
    this.view = new View(url, this.x, this.y, this.width, this.height);
    this.view.setId(this.id);
    this.view.loadImage(); // 这个返回的是promise, 如果有出现加载bug就用 await 接一下
    GAME.ACTIVE_SCENE.addUI(this);
  };

  // 点击事件
  public click(): void{
    console.log("我被点了", this)
  }

  /**
   * 检测自己是不是被点击
   *  思路是拿到一个点后，给他计算旋转后的坐标是不是落在没有旋转的矩形内
   * @param point: 被点击的坐标
   */
  public checkPosInRotationRect( point: Vector ): void{
    // rigidbody 的常规操作，取一半，拿中心点
    let halfWidth: number = this.width / 2;
    let halfHeight: number = this.height / 2;
    let centerPoint: Vector = new Vector(GAME.VIEW_WIDTH-(this.x + halfWidth), this.y + halfHeight );
    let targetX = point.x;
    let targetY = point.y;
    let r = -this.rotation * (Math.PI / 180);
    let nTempX = centerPoint.x + (targetX - centerPoint.x) * Math.cos(r) - (targetY - centerPoint.y) * Math.sin(r);
    let nTempY = centerPoint.y + (targetX - centerPoint.x) * Math.sin(r) + (targetY - centerPoint.y) * Math.cos(r);
    if (nTempX > centerPoint.x - halfWidth && nTempX < centerPoint.x + halfWidth && nTempY > centerPoint.y - halfHeight && nTempY < centerPoint.y + halfHeight) {
      this.click()
    }
  }

  // 创建view  url:图片地址
  // public createView( url: string ): void {
  //   this.view = new View(url, this.x, this.y, this.width, this.height);
  //   this.view.setId(this.id);
  //   this.view.loadImage(); // 这个返回的是promise, 如果有出现加载bug就用 await 接一下
  //   GAME.ACTIVE_SCENE.addUI(this.view);
  // }


  // 添加已有view 暂定
  public addView( view: View ): void{
    // this.view = 
  }

  // 注销方法
  public destroy(): void{
    // 后续更正为只保留gameObjectList, 其他数组就用map来取
    GAME.ACTIVE_SCENE.deleteUI(this.id);
    GAME.ACTIVE_SCENE.start();
  } 
}