import Scene from "./scene";

/**
 * 画板类
 */
export default abstract class Panel {
  public scene: Scene = new Scene();

  /**
   * 资源方法
   */
  public abstract assets(): void;

  /**
   * 放自己游戏逻辑方法
   */
  public abstract run(): void;

  // getter
  public getScene(): Scene {
    return this.scene;
  }

  public async switchPanel(panel: Panel): Promise<string> {
    try {
      // 激活
      panel.getScene().activeScene();

      // 处理panel
      panel.assets();

      // 加载资源
      await panel.getScene().loadAssets()

      // 载入渲染资源
      panel.getScene().refreshComponent();
      
      // 运行
      panel.run();
      return "成功"
    } catch (err) {
      return "成功"
    }
  }
}