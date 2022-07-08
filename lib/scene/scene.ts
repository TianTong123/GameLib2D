import GameAnimation from "../animation/gameAnimation";
import View from "../view/view";
import GameObject from "../model/gameObject";
import Result from "../model/result";
import GAME from "../game";
import RigidBody from "../rigidBody/rigidBody";
import UIObject from "../ui/UIObject";
import Gif from "../gif/gif";
import ImgInfo from "../view/imgInfo";
import GitInfo from "../gif/gitInfo";
/**
 * 场景类
 */
export default class Scene{
  // 游戏对象数组
  public GAME_OBJECT_LIST: Array<GameObject> = [];
  // 静态资源
  public STATIC_LIST: Array<View> = [];
  // 动画资源
  public ANIMATION_LIST: Array<GameAnimation> = [];
  // UI资源
  public UI_LIST: Array<UIObject> = [];
  // 刚体数组
  public RIGIDBODY_LIST: Array<RigidBody> = [];
  // 静态图片资源
  private imgResources: ImgInfo[] = [];
  // gif资源
  private gifResources: GitInfo[] = [];
  // 音乐资源
  // .... 待扩展
  // 构造器
  constructor(){}

  // 激活当前场景
  public activeScene(): void{
    GAME.ACTIVE_SCENE = this;
  }

  // 加载组件数组，放到 render 进行渲染
  public refreshComponent(): void {
    // 放进渲染数组
    GAME.RENDER.setList(this.STATIC_LIST, this.ANIMATION_LIST, this.UI_LIST, this.GAME_OBJECT_LIST, this.RIGIDBODY_LIST);
  }

  // 加载 scene 里面的资源
  public async loadAssets(): Promise<Result<string>>{ 
    return new Promise(async (resolve, reject) => { 
      let list: Promise<Result<string>>[] = [...this.imgResources.map(e => e.load()), ...this.gifResources.map(e => e.load())]
      let i: number = 0;
      for await ( let res of list ){ // 高级写法 res 是返回的结果
        console.log("资源加载",res, ++i, " / ", list.length);
      }

      resolve(new Result(1, "加载完成", ""));
    }) 
  } 

  // 添加游戏对象
  public addGameObject( obj: GameObject ): void{
    this.GAME_OBJECT_LIST.push( obj );
  }

  // 移除游戏对象
  public deleteGameObject( id: string ): void{
    this.GAME_OBJECT_LIST = this.GAME_OBJECT_LIST.filter( e => e.id !== id );
  }

  // 添加动画资源
  public addAnimation( ani: GameAnimation ): void{
    this.ANIMATION_LIST.push( ani );
  }

  // 移除动画对象
  public deleteAnimation( id: string ): void{
    this.ANIMATION_LIST = this.ANIMATION_LIST.filter( e => e.id !== id );
  }

   // 切换动画对象
  public switchAnimation( id: string, ani: GameAnimation ): void{
    let index: number = this.ANIMATION_LIST.findIndex( e => e.id === id );
    this.ANIMATION_LIST[index] = ani;
  }

  // 添加UI资源
  public addUI( ui: UIObject ): void{
    
    this.UI_LIST.push( ui );
  }

  // 移除UI资源
  public deleteUI( id: string ): void{
    this.UI_LIST = this.UI_LIST.filter( e => e.id !== id );
  }

  // 添加静态资源
  public addView( view: View ): void{
    this.STATIC_LIST.push( view );
  }

  // 移除静态资源
  public deleteView( id: string ): void{
    this.STATIC_LIST = this.STATIC_LIST.filter( e => e.id !== id );
  }

   // 添加静态资源
  public addRigidbody( rigidBody: RigidBody ): void{
    this.RIGIDBODY_LIST.push( rigidBody );
  }

  // 移除静态资源
  public deleteRigidbody( id: string ): void{
    this.RIGIDBODY_LIST = this.RIGIDBODY_LIST.filter( e => e.id !== id );
  }

  // 添加 ImgInfo 对象
  public addGifInfo(url: string): void{
    let info: GitInfo = new GitInfo(url);
    this.gifResources.push(info);
  }

  // 获取 gifInfo 对象
  // 根据 url获取
  public getGifInfo( url: string ): GitInfo{
    // 为什么用index呢？ 因为用其他的可能会返回 undefined
    let index: number = this.gifResources.findIndex(e => e.getUrl() == url);
    return this.gifResources[index];
  }

  // 添加 ImgInfo 对象
  public addImgInfo(url: string): void{
    let info: ImgInfo = new ImgInfo(url);
    this.imgResources.push(info);
  }

  // 获取 ImgInfo 对象
  // 根据 url获取
  public getImgInfo( url: string ): ImgInfo{
    // 为什么用index呢？ 因为用其他的可能会返回 undefined
    let index: number = this.imgResources.findIndex(e => e.getUrl() == url);
    return this.imgResources[index];
  }
}