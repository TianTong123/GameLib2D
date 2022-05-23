import View from "../view/view";
import GameBase from "../interface/gameBase";
const { v4: uuidv4 } = require('uuid');
import GAME from "../game";


// UI 对象
export default class UIObject implements GameBase{
  // 坐标
  public x: number = 0;
  public y: number = 0;
  // 大小
  private width: number = 0;
  private height: number = 0;

  // id
  public id: string = "";

  //层级 （往后有空补充完整）
  public zIndex: number = 0;

  // 视图资源
  public view: View;

  // 构造器
  // 参数就字面意思 url:图片地址
  constructor( url: string, x?: number, y?: number, width?: number, height?: number ){
    this.id = uuidv4(); 
    this.x = x || 0;
    this.y = y || 0;
    this.width = width || 0;
    this.height = height || 0;
    this.view = new View(url, this.x, this.y, this.width, this.height);
    this.view.setId(this.id);
    this.view.loadImage(); // 这个返回的是promise, 如果有出现加载bug就用 await 接一下
    GAME.ACTIVE_SCENE.addUI(this);
  };

  // 点击事件
  public click( e: MouseEvent ): void{
    console.log("我被点了", this)
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