import Result from "../model/result";

/**
 * 图片资源信息对象
 */
 export default class ImgInfo {
  private url: string; // gif 文件路径（作为唯一值用）
  private img: HTMLImageElement;// 图片对象

  constructor( url: string ){
    this.url = url;
    this.img = new Image();
    this.img.src = url;
  }

  /**
   * 加载图片
   * @returns 返回一个 promise 带 Result 对象的结果。
   */
  public load(): Promise<Result<string>>{
    return new Promise((resolve, reject) => {
      this.img.onload = () => { 
        resolve(new Result(1, "加载成功", "success"));          
      };
      this.img.onerror = (e) =>{
        console.log(e);
        reject(new Result(0, "加载失败", "error"));
      }
    })
  }

  // get
  public getUrl(): string { 
    return this.url;
  }
  public getImg(): HTMLImageElement{ 
    return this.img;
  }
}