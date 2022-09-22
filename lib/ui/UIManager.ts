import ImgInfo from "../view/imgInfo";
import UI from "./UI";
import UIObject from "./UIObject";

/**
 * ui管理类
 */
export default class UIManager {
  // 存放 UI 数组
  public UI_LIST: UI[] = [];

  // 存放不放在UI里面的 UIObject 数组
  public UI_OBJ_LIST: UIObject[] = [];

  // 是否全部加载
  // public IS_ALL_LOAD: boolean = false;
  
  // 静态图片资源
  private imgResources: ImgInfo[] = [];
  
  /**
   * 初始化
   */
  public init(): void{
    // this.UI_LIST.forEach( ui => {
    //   this.UI_OBJ_LIST.push(...ui.getOBJList());
    // })
  }

  /**
   * 添加UI资源
   * @param ui: UIObject
   */
  public addUIOBJ( ui: UIObject ): void{
    this.UI_OBJ_LIST.push( ui );
  }

  /**
   * 获取全部显示的UI
   * @returns UI[]
   */
  public getShowUIs(): UI[]{
    return this.UI_LIST.filter( ui => ui.SHOW );
  }
  
  /**
   * 获取ui里面全部要显示的object
   * @returns UIObject[]
   */
  public getAllShowOBJ(): UIObject[]{
    let list: UIObject[] = [];
    const UIList: UI[] = this.getShowUIs();
    UIList.forEach( ui => {
      list.push(...ui.getOBJList().filter( ui => ui.SHOW ))
    })
    return list;
  }

  // 移除UI资源
  public deleteUIOBJ( id: string ): void{
    this.UI_OBJ_LIST = this.UI_OBJ_LIST.filter( e => e.id !== id );
  }
}