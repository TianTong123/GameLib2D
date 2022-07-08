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

  // /**
  //  * 处理方法
  //  */
  public async handle(): Promise<string>{
    try{
      this.assets();
      await this.scene.loadAssets();
      this.run();
      return "成功"
    } catch( err ){
      return "失败"
    }
  }

  // getter
  public getScence(): Scene{
    return this.scene;
  }
}