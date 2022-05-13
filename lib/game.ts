import Scene from "./scene/scene";
import Render from "./view/render";
/**
 * 游戏类，设置属性
 */
export default class GAME {
  // 基础 X 偏移 （这个是整体的游戏偏离值）
  public static BASE_X_Offset: number = 10;
  // 基础 Y 偏移
  public static BASE_Y_Offset: number = 180;
  // 最大x值
  public static MAX_X: number = 900;
  // 背景宽度
  public static VIEW_WIDTH: number = 1200;
  // 背景高度
  public static VIEW_HEIGHT: number = 440;
  // 渲染
  public static RENDER: Render;
  // 帧数: 现在为60帧
  public static REFRESH_FRAME: number = 1000/60;
  // 固定刷新时间
  public static REFRESH_FRAME_TIME: number = 1000/60/100;
  // 当前活动的场景
  public static ACTIVE_SCENE: Scene;
  // 能量衰减百分比。即碰撞后所损失的能量。1则为弹性碰撞。能量不损失。一直动， 最小值为0
  public static ENERGY_ATTENUATION_PERCENTAGE = 0.85;

  // 初始化
  public static init(): void{
    this.RENDER = new Render(this.BASE_X_Offset, this.BASE_Y_Offset, this.VIEW_WIDTH, this.VIEW_HEIGHT);
  }

  // 游戏启动
  public static start(): void{
    this.RENDER.startRender();
  }
}