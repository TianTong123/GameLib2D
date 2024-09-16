import View from "../view/view";
import GameBase from "../interface/gameBase";
const { v4: uuidv4 } = require('uuid');
import GAME from "../game";
import Vector from "../util/vector";
import ImgInfo from "../view/imgInfo";


// UI 对象
export default class UIObject implements GameBase{
  // 坐标
  public x: number = 0;
  public y: number = 0;
  // 大小
  private width: number = 0;
  private height: number = 0;

  // 是否显示
  public SHOW: Boolean = true;

  // 旋转角度（可以考虑的扩展）
  private angle: number = 0;
  
  // 是否相对， true： 相对于相机固定， false， 相对于scene 固定
  // private isRelavite: boolean = false;

  // id
  public id: string = "";

  //层级
  public zIndex: number = 0;

  // 视图资源
  public view: View;

  // 点击事件
  private clickEvent: Function = ()=>{};

  // 构造器
  // 参数就字面意思 url:图片地址
  constructor( url: string, x?: number, y?: number, width?: number, height?: number, zIndex?: number){
    this.id = uuidv4(); 
    this.x = x || 0;
    this.y = y || 0;
    this.width = width || 0;
    this.height = height || 0;
    this.zIndex = zIndex || 0;
    const imgInfo: ImgInfo = new ImgInfo(url);
    imgInfo.load();
    this.view = new View(imgInfo, this.x, this.y, this.width, this.height);
    this.view.setId(this.id);
  };

  // 点击事件
  public click(): void{
    this.clickEvent();
  }

  public setClickEvent( fun: Function ): void{
    this.clickEvent = fun;
  }

  /**
   * 检测自己是不是被点击
   *  思路是拿到一个点后，给他计算旋转后的坐标是不是落在没有旋转的矩形内
   * @param point: 被点击的坐标
   */
  public checkPosInAngleRect( point: Vector ): void{
    // rigidbody 的常规操作，取一半，拿中心点
    const halfWidth: number = this.width / 2;
    const halfHeight: number = this.height / 2;
    const centerPoint: Vector = new Vector(this.x + halfWidth, this.y + halfHeight );
    // 转换角度
    const r: number = -this.angle * (Math.PI / 180);
    // 拿到旋转后的坐标
    const nTempX: number = centerPoint.x + (point.x - centerPoint.x) * Math.cos(r) - (point.y - centerPoint.y) * Math.sin(r);
    const nTempY: number = centerPoint.y + (point.x - centerPoint.x) * Math.sin(r) + (point.y - centerPoint.y) * Math.cos(r);
    if (nTempX > centerPoint.x - halfWidth && nTempX < centerPoint.x + halfWidth && nTempY > centerPoint.y - halfHeight && nTempY < centerPoint.y + halfHeight) {
      this.click()
    }
  }

  // 注销方法
  public destroy(): void{
    // 后续更正为只保留gameObjectList, 其他数组就用map来取
    GAME.UI_MAMAGER.deleteUIOBJ(this.id);
  } 
}