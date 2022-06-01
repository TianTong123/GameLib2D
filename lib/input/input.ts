import { KEYCODE } from "./keyCode";


/**
 * 键盘输入类
 * （组合键先放着，后面再来实现）
 */
export default class Input {
  // 键盘按下对应的code值
  public static downKeyCode: number = -1;
  public static downHorizontalKeyCode: number = -1;
  public static downVerticalKeyCode: number = -1;
  // 键盘释放对应的code值
  public static upKeyCode: number = -1;
  // 开始监听键盘事件
  public static startLisEventListenerKeyboard(): void{
    // 键盘按下
    document.onkeydown = (event: KeyboardEvent) => {
      // keyCode被弃用了，所以有横线。后面再用key来替换回去（放在后面做）
      this.downKeyCode = event.keyCode;
      this.downHorizontalKeyCode = event.keyCode;
      this.downVerticalKeyCode = event.keyCode;
    }
    document.onkeyup = (event: KeyboardEvent) => {
      // keyCode被弃用了，所以有横线。后面再用key来替换回去（放在后面做）
      this.upKeyCode = event.keyCode;
    }
  }

  /**
   * 看看谁被按下
   * @param keyCode 键盘的keyCode值
   * @returns boolean:  返回一个布尔值。 按对了keycode 就返回true
   */
  public static getKeyDown( keyCode: number): boolean{
    // 比一下
    let result: boolean = keyCode == this.downKeyCode;
    // 比完就重置
    this.downKeyCode = -1;
    return result
  }

  /**
   * 看看谁被释放
   * @param keyCode 键盘的keyCode值
   * @returns boolean:  返回一个布尔值。 按对了keycode 就返回true
   */
  public static getKeyUp( keyCode: number): boolean{
    // 比一下
    let result: boolean = keyCode == this.upKeyCode;
    // 比完就重置
    this.upKeyCode = -1;
    return result
  }

  /**
   * 获取横轴方向
   * @return  右箭头 d键返回1， 左箭头, a返回 -1， 其他键返回0
   */
  public static getHorizontalAxis(): number {
    let result: number = 0;
    switch(this.downHorizontalKeyCode){
      case KEYCODE.Right:
      case KEYCODE.D:
        result = 1;
        break;
      case KEYCODE.Left:
      case KEYCODE.A:
        result = -1;
        break;
    }
    
    this.downHorizontalKeyCode = -1;
    return result;
  }

  /**
   * 获取纵轴方向
   * @return  下箭头 s键返回1， 上箭头, w返回 -1， 其他键返回0
   */
   public static getVerticallAxis(): number {
    let result: number = 0;
    switch(this.downVerticalKeyCode){
      case KEYCODE.Down:
      case KEYCODE.S:
        result = 1;
        break;
      case KEYCODE.W:
      case KEYCODE.Up:
        result = -1;
        break;
    }
    // 复位
    this.downVerticalKeyCode = -1;
    return result;
  }
}