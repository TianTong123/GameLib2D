import Gif from "../gif/gif";
import GAME from "../game";
import GameBase from "../interface/gameBase";
import Result from "../model/result";
import GitInfo from "../gif/gitInfo";
/**
 * 动画类
 * 等待补充， 缓存同名文件的gif。下次用的时候直接调用这里，不再启用加载
 * 再开静态动画层，view也需要动画层
 */
export default class GameAnimation implements GameBase{
  public id: string = "";
  //坐标
  public x: number;
  public y: number;
  private width: number = 0;
  private height: number = 0;
  // GIF 对象
  private gifInfo: GitInfo;
  // 每一帧的播放时间，即延时
  private delay: number = 0;
  // 动画帧列表
  private frames: Array<ImageData> = [];
  // 速度快慢，基准值为1，为0就寄了
  private speed: number = 1;
  // 总长度
  private length: number = 0;
  // 总时长
  private timeLength: number = 0;
  private tempCanvas: HTMLCanvasElement;
  // 动画自己的当前播放时间
  private playTime: number = 0; // 当前动画播放时间.超过总时长就重置
  // 构造器
  constructor(gifInfo: GitInfo, x?: number, y?: number, width?: number, height?: number) {
    this.x = x || 0;
    this.y = y || 0;
    this.width = width || 0;
    this.height = height || 0;
    this.gifInfo = gifInfo;
    this.delay = gifInfo.getDelay();
    this.frames = gifInfo.getFrames();
    this.length = this.frames.length;
    this.tempCanvas = gifInfo.getCanvas();
    this.width = this.width || this.tempCanvas.width;
    this.height = this.height || this.tempCanvas.height;
  }

  /**
   * 设置倍速
   * @param val ：number 倍速值
   */
  public setSpeed(val: number): void {
    this.speed = val;
  }

  /**
   * 暂停
   */
  public pauseAnimation(): void {

  }

  /**
   * 获取当前应该播放的tempCanvas
   */
  public getCurrentFrame(): HTMLCanvasElement {
    // 计算当前播放时间
    this.playTime += GAME.REFRESH_FRAME_TIME;
    // 向下取整 ~是否运算, 用32位二进制表示当前值,舍弃小数.然后做否运算,如果为负数就再进行一次补码运算. 相当于 当前数字取负数然后-1
    // 比如 ~2 就是 -2 -1 = 3, 做两次运算就是接上去 -(-3) -1 = 2.因为会舍弃小数,就会有向下取整的效果 
    // 做两次就是正数
    let playIndex: number = ~~(this.playTime / this.delay * this.speed);
    // 超过就重置
    if (playIndex >= this.length) {
      this.playTime = 0;
      playIndex = 0;
    }
    
    (this.tempCanvas.getContext("2d") as CanvasRenderingContext2D).putImageData(this.frames[playIndex], 0, 0);
    return this.tempCanvas;
  }

  /**
   * 设置播放速度
   * @param percentage 大于0就行 来控制播放速度
   */
  public setPlaySpeed( percentage: number): void{
    this.delay /= percentage;
  }

  // getter && setter
  public setX(val: number):void{
    this.x = val;
  }
  public getX(): number{
    return this.x;
  }
  public setY(val: number):void{
    this.y = val;
  }
  public getY(): number{
    return this.y;
  }
  public setWidth(val: number):void{
    this.width = val;
  }
  public getWidth(): number{
    return this.width;
  }
  public setHeight(val: number):void{
    this.height = val;
  }
  public getHeight(): number{
    return this.height;
  }
}