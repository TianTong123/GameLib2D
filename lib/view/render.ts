import View from "./view";
import GameAnimation from "../animation/gameAnimation";
import GAME from "../game";
import GameObject from "../model/gameObject";
import RigidBody from "../rigidBody/rigidBody";
import UIObject from "../ui/UIObject";
import Vector from "../util/vector";
/**
 * 渲染类
 */
export default class Render {

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
  private CTX_CANVAS: HTMLCanvasElement;
  public CTX: CanvasRenderingContext2D;

  // 静态资源
  private staticList: Array<View> = [];
  // 动画资源
  private animationList: Array<GameAnimation> = [];
  // UI资源
  private UIOBJList: UIObject[] = [];
  // gameObject资源
  private gameObjectList: Array<GameObject> = [];
  // 刚体数组
  private rigidBodyList: Array<RigidBody> = [];
  // 渲染一帧完成时的时间戳
  private timeStamp: number = 0;

  private logo: HTMLImageElement = new Image();
  private logoWidth: number = 0;
  private logoHeight: number = 0;
  /**
   * 构造器
   */
  constructor() {
    // 静态资源层
    this.CANVAS_STATIC = document.createElement("canvas");
    this.CANVAS_STATIC.width = GAME.RENDERER_WIDTH;
    this.CANVAS_STATIC.height = GAME.RENDERER_HEIGHT;
    this.CTX_STATIC = this.CANVAS_STATIC.getContext('2d') as CanvasRenderingContext2D;

    // 动画层
    this.CANVAS_ANIMATION = document.createElement("canvas");
    this.CANVAS_ANIMATION.width = GAME.RENDERER_WIDTH;
    this.CANVAS_ANIMATION.height = GAME.RENDERER_HEIGHT;
    this.CTX_ANIMATION = this.CANVAS_ANIMATION.getContext('2d') as CanvasRenderingContext2D;

    // UI层(现在更名为游戏交互层)
    this.CANVAS_UI = document.createElement("canvas");
    this.CANVAS_UI.width = GAME.RENDERER_WIDTH;;
    this.CANVAS_UI.height = GAME.RENDERER_HEIGHT;
    this.CTX_UI = this.CANVAS_UI.getContext('2d') as CanvasRenderingContext2D;

    // 最终版
    this.CTX_CANVAS = document.createElement("canvas");
    this.CTX_CANVAS.width = GAME.RENDERER_WIDTH;
    this.CTX_CANVAS.height = GAME.RENDERER_HEIGHT;
    this.CTX = this.CTX_CANVAS.getContext('2d') as CanvasRenderingContext2D;

    // LOGO 加载，先扔这里
    this.logoHeight = GAME.VIEW_HEIGHT * 0.3;
    this.logoWidth = this.logoHeight * 1.29;
    this.logo.src = require("../assets/logo.png");
    this.logo.onload = () => {
      this.startAnimation();
    };

    // 点击事件
    GAME.CAMERA.CAMERA_HTML.addEventListener("click", (e: MouseEvent) => {
      this.handleCanvasMouseClickEvent(e, "click");
    });
    // 鼠标按下事件
    //this.CTX_CANVAS.addEventListener("mousedown", (e: MouseEvent) => {
    // console.log("鼠标按下");
    // this.handleCanvasMouseClickEvent(e)
    //})
    // this.CTX_CANVAS.addEventListener("mouseup", (e: MouseEvent) => {
    // console.log("鼠标释放");
    // this.handleCanvasMouseClickEvent(e)
    // })
    // 留着做拖动事件再弄这个
    // document.addEventListener("mousemove", (e: MouseEvent) => {
    //   console.log("鼠标移动");
    // })
  }

  /**
   * 渲染静态资源方法
   * 把 staticList 全部放到 canvas 上
   */
  public renderStatic(): void {
    for (let i = 0, len = this.staticList.length; i < len; i++) {
      let view: View = this.staticList[i];
      this.CTX_STATIC.drawImage(view.getImg(), view.getX(), view.getY(), view.getWidth(), view.getHeight());
    }
    this.CTX.drawImage(this.CANVAS_STATIC, 0, 0);
  }

  /**
   * 渲染UI方法
   * 把 UIOBJList 全部放到 canvas 上
   */
  public renderUI(): void {
    for (let i = 0, len = this.UIOBJList.length; i < len; i++) {
      let view: View = this.UIOBJList[i].view;
      this.CTX_UI.drawImage(view.getImg(), view.getX(), view.getY(), view.getWidth(), view.getHeight());
    }
    this.CTX.drawImage(this.CANVAS_UI, 0, 0);
  }

  /**
   * 渲染跟随相机的ui
   */
  public renderCamerUI(): void {
    const list = GAME.UI_MAMAGER.getAllShowOBJ();
    for (let i = 0, len = list.length; i < len; i++) {
      let view: View = list[i].view;
      GAME.CAMERA.CAMERA_CTX.drawImage(view.getImg(), view.getX(), view.getY(), view.getWidth(), view.getHeight());
    }
  }

  /**
   * 渲染动画方法
   */
  public renderAnimation(): void {
    for (let i = 0, len = this.animationList.length; i < len; i++) {
      let ani = this.animationList[i];
      this.CTX_ANIMATION.drawImage(ani.getCurrentFrame(), ani.getX(), ani.getY(), ani.getWidth(), ani.getHeight());
    }
    this.CTX.drawImage(this.CANVAS_ANIMATION, 0, 0);
  }

  /**
   * 更新 gameObject 
   */
  public updateGameObject(deltaTime: number): void {
    for (let i = 0, len = this.gameObjectList.length; i < len; i++) {
      this.gameObjectList[i]?.handleUpdate(deltaTime);
    }
  }

  /**
   * fixed更新 gameObject 
   */
   public fixedUpdateGameObject(deltaTime: number): void {
    for (let i = 0, len = this.gameObjectList.length; i < len; i++) {
      this.gameObjectList[i]?.handleFixedUpdate(deltaTime);
    }
  }

  /**
   * 刚体检测
   */
  public handlecollision(): void {
    for (let i = 0, len = this.rigidBodyList.length; i < len; i++) {
      for (let j = i + 1, jlen = this.rigidBodyList.length; j < jlen; j++) {
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
    this.updateGameObject( (deltaTime - this.timeStamp)/1000 );
    this.timeStamp = deltaTime;
    // 拍摄
    GAME.CAMERA.play(this.CTX_CANVAS);
    // 拍摄完当前帧才绘制UI(先放这里)
    this.renderCamerUI();
  }

  /**
   * 启动渲染
   * 改为 requestAnimationFrame 渲染
   * @param deltaTime 当前帧所需时间
   */
  public startRender(deltaTime: number): void {
    // 乘时间倍率，实现时间快慢
    this.render(deltaTime * GAME.TIME_SCALE);
    // 这里必须固定时间，不然会因为每次时间的不同导致一些意想不到的bug;
    this.fixedUpdateGameObject(GAME.FIXED_REFRESH_FRAME_TIME * GAME.TIME_SCALE);
    // 取得增量时间
    window.requestAnimationFrame((deltaTime: number) => {
      this.startRender(deltaTime);
    })
  }


  /**
   * 清空画布方法
   */
  public clear(): void {
    // 静态资源都不动的,所以只渲染一次
    this.CTX.clearRect(0, 0, GAME.RENDERER_WIDTH, GAME.RENDERER_HEIGHT);
    this.CTX_ANIMATION.clearRect(0, 0, GAME.RENDERER_WIDTH, GAME.RENDERER_HEIGHT);
    this.CTX_STATIC.clearRect(0, 0, GAME.RENDERER_WIDTH, GAME.RENDERER_HEIGHT);
    this.CTX_UI.clearRect(0, 0, GAME.RENDERER_WIDTH, GAME.RENDERER_HEIGHT);
  }

  /**
   * 设置四个数组
   * 后面来细拆
   */
  public setList(staticList: Array<View>, animationList: Array<GameAnimation>, gameObjectList: Array<GameObject>, rigidbodyList: Array<RigidBody>): void {
    // 静态资源
    this.staticList = staticList;
    // 动画资源
    this.animationList = animationList;
    // gameObject 资源
    this.gameObjectList = gameObjectList;
    // 刚体资源
    this.rigidBodyList = rigidbodyList;
    // 不放在UI里面UIObject 资源
    this.UIOBJList = GAME.UI_MAMAGER.UI_OBJ_LIST;
  }

  /**
   * 销毁 view
   * @param view 销毁的对象
   */
  public destroyView(view: View): void {
    // 过滤掉
    this.staticList = this.staticList.filter(e => e.getId() != view.getId());
  }

  /**
   * canvas 的鼠标事件处理
   * @param e: MouseEvent
   * @param type : 区别是那些事件
   */
  private handleCanvasMouseClickEvent(e: MouseEvent, type: string): void {
    // 还原游戏坐标
    let x: number = e.clientX - GAME.BASE_X_Offset;
    let y: number = e.clientY - GAME.BASE_Y_Offset;
    // 查找对应的ui资源
    for (let i = 0, len = this.UIOBJList.length; i < len; i++) {
      this.UIOBJList[i].checkPosInRotationRect(new Vector(x, y));
    }
    this.render(Date.now());
  }

  /**
   * 游戏启动动画
   */
  private num: number = 0;
  private startAnimation(): void {
    this.CTX.drawImage(this.logo, GAME.VIEW_WIDTH / 2 - this.logoWidth * 0.5, GAME.VIEW_HEIGHT / 2 - this.logoHeight * 0.5, this.logoWidth, this.logoHeight);
    this.logoHeight += 0.1;
    this.logoWidth = this.logoHeight * 1.29;
    setTimeout(() => {
      this.num++;
      if (this.num < 180) {
        this.startAnimation();
        GAME.CAMERA.play(this.CTX_CANVAS)
      }
    }, GAME.FIXED_REFRESH_FRAME_TIME)
  }

  /**
   * 进度条处理
   * @param progress 当前进度
   * @param length 总长度
   */
  public loadProgress(progress: number, length: number): void {
    this.CTX.clearRect(0, 0, GAME.RENDERER_WIDTH, GAME.RENDERER_HEIGHT);
    this.CTX.font = "900 23px Arial";
    this.CTX.fillStyle = "#fff";
    this.CTX.fillText(`加载中 ${(progress / length * 100).toFixed(0)}%`, GAME.VIEW_WIDTH - 150, GAME.VIEW_HEIGHT - 30);
    GAME.CAMERA.play(this.CTX_CANVAS);
  }
}