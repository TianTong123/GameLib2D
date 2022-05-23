import View from "./view";
import GameAnimation from "../animation/gameAnimation";
import GAME from "../game";
import GameObject from "../model/gameObject";
import RigidBody from "../rigidBody/rigidBody";
import UIObject from "../ui/UIObject";
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
  private UIList: UIObject[] = [];
  // gameObject资源
  private gameObjectList: Array<GameObject> = [];
  // 刚体数组
  private rigidBodyList: Array<RigidBody> = [];
  // 渲染一帧完成时的时间戳
  private timeStamp: number = 0;

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
    // 点击事件
    canvas.addEventListener("click", (e: MouseEvent) => {
      // console.log("点击事件");
      
      this.handleCanvasMouseEvent(e, "click");
    });
    // 鼠标按下事件
    canvas.addEventListener("mousedown", (e: MouseEvent) => {
      // console.log("鼠标按下");
      // this.handleCanvasMouseEvent(e)
    })
    canvas.addEventListener("mouseup", (e: MouseEvent) => {
      // console.log("鼠标释放");
      // this.handleCanvasMouseEvent(e)
    })
    // 留着做拖动事件再弄这个
    // document.addEventListener("mousemove", (e: MouseEvent) => {
    //   console.log("鼠标移动");
    // })
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
   * 渲染UI方法
   * 把 UIList 全部放到 canvas 上
   */
   public renderUI() {
    for(let i = 0, len = this.UIList.length; i < len; i ++){
      let view: View = this.UIList[i].view;
      this.CTX_UI.drawImage(view.getImg(), view.getX(), view.getY(), view.getWidth(), view.getHeight()); 
    }
    this.CTX.drawImage(this.CANVAS_UI, 0, 0);
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
  public updateGameObject(deltaTime: number): void {
    for(let i = 0, len = this.gameObjectList.length; i < len; i ++){
      this.gameObjectList[i]?.handleUpdate(deltaTime);     
    }
  }

  /**
   * 刚体检测
   */
  public handlecollision(): void {
    for(let i = 0, len = this.rigidBodyList.length; i < len; i ++){
      for(let j = i+1, jlen = this.rigidBodyList.length; j < jlen; j ++){
        this.rigidBodyList[i].checkCollision(this.rigidBodyList[j])
      }
    }
  }
  
  // 总渲染
  public render(deltaTime: number): void{
    this.clear();
    this.renderStatic();
    this.renderAnimation();
    this.renderUI();
    this.handlecollision();
    // this.updateGameObject((deltaTime - this.timeStamp)/100);
    // 这里必须固定时间，不然会因为每次时间的不同导致一些意想不到的bug;
    // 这里先前是 计算完所以完成时间的。现在改为固定
    this.updateGameObject(GAME.REFRESH_FRAME_TIME);
    this.timeStamp = deltaTime;
    window.requestAnimationFrame((deltaTime: number)=>{
      this.render(deltaTime);
    })
  }


  // 改为 requestAnimationFrame 渲染
  public startRender(): void {
    // 取得增量时间
    window.requestAnimationFrame((deltaTime: number)=>{
      this.render(deltaTime);
    })
  }



  /**
   * 清空画布方法
   */
  public clear(): void{
    // 静态资源都不动的,所以只渲染一次
    this.CTX.clearRect(0, 0, this.width, this.height);
    this.CTX_ANIMATION.clearRect(0, 0, this.width, this.height);
    this.CTX_STATIC.clearRect(0, 0, this.width, this.height);
    this.CTX_UI.clearRect(0, 0, this.width, this.height);
  }

  /**
   * 设置四个数组
   * 后面来细拆
   */
  public setList( staticList: Array<View>, animationList: Array<GameAnimation>, UIList: any, gameObjectList: Array<GameObject>, rigidbodyList: Array<RigidBody>): void{
    // 静态资源
    this.staticList = staticList;
    // 动画资源
    this.animationList= animationList;
    // UI资源
    this.UIList = UIList;
    // gameObject 资源
    this.gameObjectList = gameObjectList;
    // 刚体资源
    this.rigidBodyList = rigidbodyList;
    //
    // this.CTX_STATIC.clearRect(0, 0, this.width, this.height);
    // this.renderStatic();
  }

  /**
   * 销毁 view
   * @param view 销毁的对象
   */
  public destroyView(view: View): void{
    // 过滤掉
    this.staticList = this.staticList.filter( e => e.getId() != view.getId());
  }

  /**
   * canvas 的事件处理
   * @param e: MouseEvent
   * @param type : 区别是那些事件
   */
  private handleCanvasMouseEvent(e: MouseEvent, type: string): void{
    // 还原游戏坐标
    
    let x: number = e.clientX - GAME.BASE_X_Offset;
    let y: number = e.clientY - GAME.BASE_Y_Offset;
    console.log("===>", x,y);
    // 查找对应的ui资源
    
  }
}