/**
 * gif 资源信息对象
 */
export class GitInfo {
  private url: string; // gif 文件路径（作为唯一值用）
  private frames: ImageData[]; // 动画帧列表
  private delay: number;// gif 每一帧播放时长

  constructor( url: string, frames: ImageData[], delay: number){
    this.url = url;
    this.frames = frames;
    this.delay = delay;
  }

  // get

  public getUrl(): string { 
    return this.url;
  }
  public getFrames(): ImageData[] { 
    return this.frames;
  }
  public getdelay(): number { 
    return this.delay;
  }
}