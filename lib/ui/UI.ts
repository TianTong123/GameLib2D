import Scene from "../scene/scene";
import UIObject from "./UIObject";

/**
 * ui场景类 放ui用的，用于存放相对于相机位置不变的 UIObject
 */
export default abstract class UI{
  // 场景
  protected scene: Scene = new Scene();

  // 存放 UIObject 数组
  public UILIST: UIObject[] = [];

  /**
   * 资源方法
   */
  public abstract assets(): void;
  
  /**
   * 添加 ui
   * @param ui UIObject
   */
  public addUIObject( ui: UIObject ): void{
    this.UILIST.push(ui);
  }

  /**
   * 弃用。（直接在相机CTX渲染,不走scene，可以省去计算部分）
   * 跟随相机方法，跟随着相机的 X 轴的坐标
   */
  // public followCamera(): void {
  //   // 移动部件
  //   this.UILIST.forEach( (e: UIObject) => {
  //     e.x +=  GAME.CAMERA.X;
  //   })
  // }

  // getterg
  public getScene(): Scene {
    return this.scene;
  }
  

  //切换UI
  public async switchUI(ui: UI): Promise<string> {
    try {
      // 激活
      ui.getScene().activeScene();

      // 处理ui
      ui.assets();

      // 加载资源
      await ui.getScene().loadAssets()

      // 载入渲染资源
      ui.getScene().refreshComponent();
      
      // 运行
      // ui.run();
      return "成功"
    } catch (err) {
      return "翻车"
    }
  }
}