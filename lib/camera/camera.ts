import GAME from "../game";
import GameBase from "../interface/gameBase";

/**
 * 相机类
 */
export default class Camera implements GameBase {

  // 相机坐标
  public x: number;
  public y: number;

  // 相机大小
  private width: number;
  private height: number;

  // 展示内容坐标
  private viewX: number;
  private viewY: number;

  // 相机名字
  private name: string = "";

  // 相机canvas
  private camera: HTMLCanvasElement;
  private CAMERA_CTX: CanvasRenderingContext2D;

  constructor(x: number, y: number, width: number, height: number, viewX: number, viewY: number){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.viewX = viewX;
    this.viewY = viewY;
    // 相机
    this.camera = document.createElement("canvas"); 
    this.camera.width = width;
    this.camera.height = height;
    this.camera.setAttribute("style", `left: ${x}px; top: ${y}px; position: absolute; background-color: #212c35`);
    this.CAMERA_CTX = this.camera.getContext('2d') as CanvasRenderingContext2D;
    // 固定相机
    document.body.append(this.camera);
  }

  // 设置大小
  public setSize(width: number, height: number): void{
    this.width = width;
    this.height = height;
    this.camera.width = width;
    this.camera.height = height;
    GAME.VIEW_WIDTH = width;
    GAME.VIEW_HEIGHT = height;
  }

  // 设置位置
  public setPosition( x: number, y: number ): void{
    this.x = x;
    this.y = y;
  }

  // 设置录像位置
  public setViewPosition(viewX: number, viewY: number): void{
    this.viewX = viewX;
    this.viewY = viewY;
  }

  /**
   * 播放
   * @arg ctx: 渲染结果
   */
  public play( ctx: HTMLCanvasElement ): void{
    this.CAMERA_CTX.clearRect(0, 0, this.width, this.height);
    this.CAMERA_CTX.drawImage(ctx, this.viewX, this.viewY);
  }

  public getName(): string {
    return this.name;
  }
  public setName(value: string) {
    this.name = value;
  }
  public getViewX(): number {
    return this.viewX;
  }
  public setViewX(value: number) {
    this.viewX = value;
  }
  public getViewY(): number {
    return this.viewY;
  }
  public setViewY(value: number) {
    this.viewY = value;
  }
} 