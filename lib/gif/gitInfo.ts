import Result from "../model/result";
import Gif from "./gif";

/**
 * gif 资源信息对象
 */
export default class GitInfo {
  private url: string; // gif 文件路径（作为唯一值用）
  private frames: ImageData[]; // 动画帧列表
  private delays: number[];// gif 所有帧播放时长
  private canvas: HTMLCanvasElement | undefined;
  private totalTime: number = 0; // 播放总时间

  constructor( url: string ){
    this.url = url;
    this.frames = [];
    this.delays = [];
  }

  /**
   * 加载gif
   * @returns 返回一个 promise 带 Result 对象的结果。
   */
  public load(): Promise<Result<string>>{
    return new Promise((resolve, reject) => {
      let gif: Gif = new Gif();
      gif.load(this.url).then( res => {
        this.delays = res.getDelayList();
        this.frames = res.getFrames();
        this.canvas = res.getTempCanvas();
        this.totalTime = this.delays[this.delays.length - 1];
        resolve(new Result(1, "加载成功", "success"));    
      }).catch( err => { 
        console.log(err);
        reject(new Result(0, "加载失败", "error"));
      })
    })
  }

  // get
  public getUrl(): string { 
    return this.url;
  }
  public getFrames(): ImageData[] { 
    return this.frames;
  }
  public getDelayList(): number[] { 
    return this.delays;
  }
  public getTotalTime(): number { 
    return this.totalTime;
  }
  public getCanvas(): HTMLCanvasElement { 
    return this.canvas as HTMLCanvasElement;
  }
}