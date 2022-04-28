import GameObject from "../model/gameObject";
import GameBase from "../interface/gameBase";
import GAME from "../game";
// import Vector2 from "../model/vector2";

/**
 * 刚体类
 */
export default class RigidBody {
  public id: string = "";
  // 0 -360  
  public rotation: number = 0;
  public gameObject: GameObject;
  private centerPoint: number[];
  private halfWidth: number;
  private halfHeight: number;
  // unit vector of x axis  
  private axisX: number[];
  // unit vector of y axis  
  private axisY: number[];
  // private rotation: number = 0;
  private scaleX: number;
  private scaleY: number;
  private offsetAxisPointDistance: number;

  constructor( gameObject: GameObject, rotation: number ){
    this.gameObject = gameObject;

    this.halfWidth = gameObject.width / 2;
    this.halfHeight = gameObject.height / 2;

    this.scaleX = 1;
    this.scaleY = 1;

    this.centerPoint = [gameObject.x, gameObject.y];
    
    this.axisX = [];
    this.axisY = [];

    let offsetAxisPoint: number[] = [gameObject.x - GAME.VIEW_WIDTH, gameObject.y - GAME.VIEW_HEIGHT];
    
    this.offsetAxisPointDistance = Math.sqrt(this.dot(offsetAxisPoint, offsetAxisPoint));
    
    this.setRotation(rotation);
    
    GAME.ACTIVE_SCENE.addRigidbody(this);
  }

  /** 
   * Get axisX and axisY projection radius distance on axis 
   */
   public getProjectionRadius(axis: number[]): number {

    // axis, axisX and axisY are unit vector  
    // projected axisX to axis  
    let projectionAxisX: number = this.dot(axis, this.axisX);
    // projected axisY to axis  
    let projectionAxisY: number = this.dot(axis, this.axisY);

    return this.halfWidth * this.scaleX * projectionAxisX + this.halfHeight * this.scaleY * projectionAxisY;
  }

  /** 
   * RigidBody is collision with other RigidBody 
   */
  public isCollision(rigidBody: RigidBody): boolean {
    if(!rigidBody){
      return false;
    }
    // two RigidBody center distance vector  
    let centerDistanceVertor: number[] = [
      this.centerPoint[0] - rigidBody.centerPoint[0],
      this.centerPoint[1] - rigidBody.centerPoint[1]
    ];
    // 四个单位向量
    let axes: number[][] = [
      this.axisX,
      this.axisY,
      rigidBody.axisX,
      rigidBody.axisY,
    ];
    for (let i = 0; i < axes.length; i++) {
      // compare OBB1 radius projection add OBB2 radius projection to centerDistance projection  
      if (this.getProjectionRadius(axes[i]) + rigidBody.getProjectionRadius(axes[i]) <= this.dot(centerDistanceVertor, axes[i])) {
        return false;
      }
    }

    return true;
  }


  /** 
   * dot-multiply 
   */
  private dot(axisA: number[], axisB: number[]): number {
    return Math.abs(axisA[0] * axisB[0] + axisA[1] * axisB[1]);
  }

  /** 
   * Set axis x and y by rotation 
   *  整单位向量
   * @param rotation float 0 - 360  
   */
  public setRotation(rotation: number) {
    this.rotation = rotation;

    this.axisX[0] = Math.cos(rotation);
    this.axisX[1] = Math.sin(rotation);

    this.axisY[0] = -Math.sin(rotation);
    this.axisY[1] = Math.cos(rotation);
    
    this.setCenter();
  }

  /** 
   * Set RigidBody center point and will add offsetAxis value 
   */
  public setCenter() {
    let offsetAxisPoint: number[] = [this.gameObject.x - GAME.VIEW_WIDTH, this.gameObject.y - GAME.VIEW_HEIGHT]
    
    this.offsetAxisPointDistance = Math.sqrt(this.dot(offsetAxisPoint, offsetAxisPoint));
    
    let offsetX: number = this.offsetAxisPointDistance * Math.cos(this.rotation);
    let offsetY: number = this.offsetAxisPointDistance * Math.sin(this.rotation);

    this.centerPoint[0] = offsetX;
    this.centerPoint[1] = offsetY + this.gameObject.y;
  }

  /** 
   * Set RigidBody scale x, y 
   */
  public setScale(scaleX: number, scaleY: number) {
    this.scaleX = scaleX;
    this.scaleY = scaleY;
  }

  public getRotation(): number {
    return this.rotation;
  }

  public getCenterX(): number {
    return this.centerPoint[0];
  }

  public getCenterY(): number {
    return this.centerPoint[1];
  }

  public getHalfWidth(): number {
    return this.halfWidth * this.scaleX;
  }

  public getHalfHeight(): number {
    return this.halfHeight * this.scaleY;
  }
}