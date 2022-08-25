import "../css/index.css";
import Scene from "./scene/scene";
import Render from "./view/render";
import Input from "./input/input";
import Panel from "./scene/panel";
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
  public static REFRESH_FRAME: number = 60;
  // 固定刷新时间
  public static REFRESH_FRAME_TIME: number = 1000 / 60;
  // 计算频率
  public static COMPUTE_TIME: number = 10; // 以后扩展就是按这个时间来算。计算按这个，渲染按上面
  // 当前活动的场景
  public static ACTIVE_SCENE: Scene;
  // 能量衰减百分比。即碰撞后所损失的能量。1则为弹性碰撞。能量不损失。一直动， 最小值为0
  public static ENERGY_ATTENUATION_PERCENTAGE = 0.7;
  // 误差系数，小于这个就不处理了
  public static ERROR_COEFFICIENT: number = 0.03;
  // public static LOADINGLIST: number[] = []

  // 游戏启动
  public static async start(panel: Panel, width?: number, height?: number, x?: number, y?: number,): Promise<string> {
    try {
      // 屏幕宽高
      const screenWidth:number = document.body.clientWidth;
      const screenHeight:number = document.body.clientHeight;

      // 给基础参数赋值
      this.VIEW_WIDTH = width || screenWidth/2;
      this.VIEW_HEIGHT = height || screenHeight/2;
      this.BASE_X_Offset = x || screenWidth/2 - this.VIEW_WIDTH/2;
      this.BASE_Y_Offset = y || screenHeight/2 - this.VIEW_HEIGHT/2;

      // 3 秒后渲染第一个panel
      setTimeout(async () => {
        // 激活scene
        this.ACTIVE_SCENE = panel.getScene();

        // 处理panel
        panel.assets();

        // 加载资源
        await this.ACTIVE_SCENE.loadAssets();
        
        // 载入渲染资源
        this.ACTIVE_SCENE.refreshComponent();

        // 启动panel
        panel.run();

        // 开始渲染
        this.RENDER.startRender();
      }, 3000)

      // 创建渲染对象
      this.RENDER = new Render(this.BASE_X_Offset, this.BASE_Y_Offset, this.VIEW_WIDTH, this.VIEW_HEIGHT);
      // 启动键盘事件
      Input.startLisEventListenerKeyboard();

      return "游戏启动完毕，起飞！"
    } catch (err) {
      console.log(err);
      return "游戏启动失败，坠机！"
    }
  }
}