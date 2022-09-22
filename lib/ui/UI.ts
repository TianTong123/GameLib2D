import UIObject from "./UIObject";

/**
 * ui场景类 放ui用的，用于存放相对于相机位置不变的 UIObject
 */
export default class UI{

  // 存放 UIObject 数组
  private objList: UIObject[] = [];

  // ui名字（唯一值）
  public NAME: string = "";

  // 是否显示
  public SHOW: Boolean = true;

  /**
   * 添加 ui
   * @param ui UIObject
   */
  public addUIObject( ui: UIObject ): void{
    this.objList.push(ui);
  }

  /**
   * 获取 objList
   * @returns UIObject[]
   */
  public getOBJList():  UIObject[]{
    return this.objList
  }
}