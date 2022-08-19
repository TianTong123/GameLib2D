import Scene from "../scene/scene";

/**
 * ui类 放ui用的（其实就panel类）
 */
export default abstract class UI{
  public scene: Scene = new Scene();

  /**
   * 资源方法
   */
  public abstract assets(): void;

  /**
   * 放自己游戏逻辑方法
   */
  public abstract run(): void;

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
      ui.run();
      return "成功"
    } catch (err) {
      return "翻车"
    }
  }
}