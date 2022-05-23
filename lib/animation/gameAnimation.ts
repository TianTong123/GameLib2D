import Gif from "../gif/gif";
import GAME from "../game";
import GameBase from "../interface/gameBase";
import Result from "../model/result";
/**
 * 动画类
 */
export default class GameAnimation implements GameBase{
  public id: string = "";
  //坐标
  public x: number;
  public y: number;
  private width: number = 0;
  private height: number = 0;
  // 路径
  private url: string;
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
  private tempCanvas: HTMLCanvasElement | undefined;
  // 动画自己的当前播放时间
  private playTime: number = 0; // 当前动画播放时间.超过总时长就重置
  // 构造器
  constructor(url: string, x?: number, y?: number, width?: number, height?: number) {
    this.x = x || 0;
    this.y = y || 0;
    this.width = width || 0;
    this.height = height || 0;
    this.url = url;
    // this.load();
  }

  // 加载方法
  public load(): Promise<Result<String>>{
    return new Promise((resolve, reject) => {
      new Gif().load(this.url).then(res => {
        this.delay = res.getDelay();
        this.frames = res.getFrames();
        this.length = this.frames.length;
        this.tempCanvas = res.getTempCanvas();
        this.width = this.width || this.tempCanvas.width;
        this.height = this.height || this.tempCanvas.height;
        // GAME.ACTIVE_SCENE.addAnimation(this);
        resolve(new Result(1, "加载成功", "success"));
      }).catch( err => {
        reject(new Result(0, "加载失败", "error"));
      });
    })
  };

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
    this.playTime += GAME.REFRESH_FRAME;
    // 向下取整 ~是否运算, 用32位二进制表示当前值,舍弃小数.然后做否运算,如果为负数就再进行一次补码运算. 相当于 当前数字取负数然后-1
    // 比如 ~2 就是 -2 -1 = 3, 做两次运算就是接上去 -(-3) -1 = 2.因为会舍弃小数,就会有向下取整的效果 
    // 做两次就是正数
    let playIndex: number = ~~(this.playTime / this.delay * this.speed);
    // 超过就重置
    if (playIndex >= this.length) {
      this.playTime = 0;
      playIndex = 0;
    }
    ((this.tempCanvas as HTMLCanvasElement).getContext("2d") as CanvasRenderingContext2D).putImageData(this.frames[playIndex], 0, 0);
    return this.tempCanvas as HTMLCanvasElement;
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