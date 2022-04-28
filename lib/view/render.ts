import View from "./view";
import GameAnimation from "../animation/gameAnimation";
import GAME from "../game";
import GameObject from "../model/gameObject";
import RigidBody from "../rigidBody/rigidBody";
/**
 * 渲染类
 */
export default class Render{

  // 静态资源 canvas 
  private CTX_STATIC: CanvasRenderingContext2D;
  private CANVAS_STATIC: HTMLCanvasElement;

  // 动画资源 canvas 
  private CTX_ANIMATION: CanvasRenderingContext2D;
  private CANVAS_ANIMATION: HTMLCanvasElement;

  // UI资源 canvas 
  private CTX_UI: CanvasRenderingContext2D;
  private CANVAS_UI: HTMLCanvasElement;

  // 最终版
  public CTX: CanvasRenderingContext2D;

  // 静态资源
  private staticList: Array<View> = [];
  // 动画资源
  private animationList: Array<GameAnimation> = [];
  // UI资源
  private uiList: any = [];
  // gameObject资源
  private gameObjectList: Array<GameObject> = [];
  // 刚体数组
  private rigidBodyList: Array<RigidBody> = [];

  // 宽高
  private width: number;
  private height: number;

  /**
   * 构造器
   */
  constructor(x: number, y: number, width: number, height: number){
    this.width = width;
    this.height = height;
    // 静态资源层
    this.CANVAS_STATIC = document.createElement("canvas"); 
    this.CANVAS_STATIC.width = width;
    this.CANVAS_STATIC.height = height;
    this.CTX_STATIC = this.CANVAS_STATIC.getContext('2d') as CanvasRenderingContext2D;

    // 动画层
    this.CANVAS_ANIMATION = document.createElement("canvas"); 
    this.CANVAS_ANIMATION.width = width;
    this.CANVAS_ANIMATION.height = height;
    this.CTX_ANIMATION = this.CANVAS_ANIMATION.getContext('2d') as CanvasRenderingContext2D;

    // UI层
    this.CANVAS_UI = document.createElement("canvas"); 
    this.CANVAS_UI.width = width;
    this.CANVAS_UI.height = height;
    this.CTX_UI = this.CANVAS_UI.getContext('2d') as CanvasRenderingContext2D;

    // 最终版
    let canvas = document.createElement("canvas"); 
    canvas.width = width;
    canvas.height = height;
    canvas.setAttribute("style", `left: ${x}px; top: ${y}px; position: absolute;`);
    this.CTX = canvas.getContext('2d') as CanvasRenderingContext2D;
    document.body.append(canvas);
  }

  /**
   * 渲染静态资源方法
   * 把 staticList 全部放到 canvas 上
   */
  public renderStatic() {
    for(let i = 0, len = this.staticList.length; i < len; i ++){
      let view: View = this.staticList[i];
      this.CTX_STATIC.drawImage(view.getImg(), view.getX(), view.getY(), view.getWidth(), view.getHeight()); 
    }
    this.CTX.drawImage(this.CANVAS_STATIC, 0, 0);
  }

  /**
   * 渲染动画方法
   */
  public renderAnimation(): void{
    for(let i = 0, len = this.animationList.length; i < len; i ++){
      let ani = this.animationList[i];     
      this.CTX_ANIMATION.drawImage(ani.getCurrentFrame(), ani.getX(), ani.getY(), ani.getWidth(), ani.getHeight());
    }
    this.CTX.drawImage(this.CANVAS_ANIMATION, 0, 0);
  }

  /**
   * 更新 gameObject 
   */
  public updateGameObject(): void {
    for(let i = 0, len = this.gameObjectList.length; i < len; i ++){
      this.gameObjectList[i]?.update();     
      this.gameObjectList[i]?.rigidBody?.setCenter();
    }
  }

  /**
   * 刚体检测
   */
  public handlecollision(): void {
    for(let i = 0, len = this.rigidBodyList.length; i < len; i ++){
      for(let j = i+1, jlen = this.rigidBodyList.length; j < jlen; j ++){
        if(this.rigidBodyList[i].isCollision(this.rigidBodyList[j])){
          // 互相通知对方撞了
          this.rigidBodyList[i].gameObject.collision(this.rigidBodyList[j].gameObject);
          this.rigidBodyList[j].gameObject.collision(this.rigidBodyList[i].gameObject);
        }
      }
    }
  }
  
  // 总渲染
  public render(): void{
    // 静态资源都不动的,所以只渲染一次
    this.clear();
    this.renderStatic();
    this.renderAnimation();
    this.updateGameObject();
    this.handlecollision();
    setTimeout(()=>{
      this.render();
    }, GAME.REFRESH_FRAME)
  }

  /**
   * 清空画布方法
   */
  public clear(): void{
    this.CTX.clearRect(0, 0, this.width, this.height);
    this.CTX_ANIMATION.clearRect(0, 0, this.width, this.height);
    this.CTX_STATIC.clearRect(0, 0, this.width, this.height);
  }

  /**
   * 设置四个数组
   */
  public setList( staticList: Array<View>, animationList: Array<GameAnimation>, uiList: any, gameObjectList: Array<GameObject>, rigidbodyList: Array<RigidBody>): void{
    // 静态资源
    this.staticList = staticList;
    // 动画资源
    this.animationList= animationList;
    // UI资源
    this.uiList = uiList;
    // gameObject 资源
    this.gameObjectList = gameObjectList;
    // 刚体资源
    this.rigidBodyList = rigidbodyList;
  }

  /**
   * 销毁 view
   * @param view 销毁的对象
   */
  public destroyView(view: View): void{
    // 过滤掉
    this.staticList = this.staticList.filter( e => e.getId() != view.getId());
  }
}