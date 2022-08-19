/**
 * 视图类
 */
import ImgInfo from "./imgInfo";
export default class View{
  // 图片信息
  private img: HTMLImageElement;
  // 自己的id
  public id: string = "";
  // x坐标
  private x: number = -1;
  // y坐标
  private y: number = -1;
  // 宽
  private width: number = 0;
  // 高
  private height: number = 0;

  /**
   * 构造器
   */
  constructor(imgInfo: ImgInfo, x?: number, y?: number, width?: number, height?: number){
    this.img = imgInfo.getImg();
    this.x = x || 0;
    this.y = y || 0;
    this.width = width || 0;
    this.height = height || 0;
  }

  /**
   * 设置信息
   * @param imgInfo 图片路径, x：横坐标， y:纵坐标, widt:宽， height:高
   */
  // setInfo(imgInfo: ImgInfo, x: number, y: number, width: number, height: number){
  //   this.id = uuidv4(); 
  //   this.imgInfo = imgInfo;
  //   this.x = x;
  //   this.y = y;
  //   this.width = width;
  //   this.height = height;
  // }


  /**
   * 获取图片
   * @returns 返回图片
   */
   public getImg(): HTMLImageElement{
    return this.img;
  }

  /**
   * 获取id
   * @returns 返回id
   */
  public getId(): string{
    return this.id
  }

  /**
   * 设置id
   * @params id: uuid
   */
   public setId( id: string ): void{
    this.id = id;
  }

  /**
   * 获取x
   * @returns 返回x
   */
  public getX(){
    return this.x ;
  }

  /**
   * 获取偏移值x
   * @returns 返回偏移值x
   */
  public getOffsetX(){
    return 0//this.x * GAME.BLOCK_SIZE + GAME.BASE_PLANT_X_Offset;
  }

  /**
   * 设置x
   * @params x: x坐标
   */
  public setX( x: number ): void{
    this.x = x;
  }

  /**
   * 获取y
   * @returns 返回y
   */
  public getY(){
    return this.y;
  }

  /**
   * 获取偏移值y
   * @returns 返回偏移值y
   */
  public getOffsetY(){
    return 0//this.y * GAME.BLOCK_SIZE  + GAME.BASE_PLANT_Y_Offset;
  }

  /**
   * 设置y
   * @params y: y坐标
   */
  public setY( y: number ): void{
    this.y = y;
  }

  /**
   * 设置width
   * @params width: 宽度
   */
   public setWidth( width: number ): void{
    this.width = width;
  }

  /**
   * 获取width
   * @returns 返回width
   */
  public getWidth(){
    return this.width;
  }

  /**
   * 设置height
   * @params height: 高度
   */
   public setHeight( height: number ): void{
    this.height = height;
  }

  /**
   * 获取height
   * @returns 返回height
   */
  public getHeight(){
    return this.height;
  }
}