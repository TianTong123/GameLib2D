import GameObject from "../model/gameObject";
import GAME from "../game";
import Vector from "../util/vector";

/**
 * 刚体类
 */
export default class RigidBody {
  public id: string = "";
  //旋转角度 0 -360  
  public rotation: number = 0;
  // gobj对象
  public gameObject: GameObject;
  // 矩形中心点坐标
  private centerPoint: Vector;
  // 一半的宽度
  private halfWidth: number;
  // 一半的高度
  private halfHeight: number;
  // 单位向量
  private axisX: Vector;
  private axisY: Vector;

  constructor( gameObject: GameObject, rotation: number ){
    this.gameObject = gameObject;

    this.halfWidth = gameObject.width / 2;
    this.halfHeight = gameObject.height / 2;

    // 将坐标轴设置在 刚体 左上角。后面会移动至中心
    this.centerPoint = new Vector(gameObject.x, gameObject.y) ;
    
    this.axisX = new Vector(0, 0);
    this.axisY = new Vector(0, 0);
    
    // 矩形中心
    this.setRotation(rotation);
    
    GAME.ACTIVE_SCENE.addRigidbody(this);
  }

  /** 
   * 获取投影半径
   * 单位向量乘向量得到对应轴投影
   */
   public getProjectionRadius(axis: Vector): number {
    let projectionAxisX: number = axis.dot(this.axisX);
    let projectionAxisY: number = axis.dot(this.axisY);
    return this.halfWidth  * projectionAxisX + this.halfHeight  * projectionAxisY;
  }

  /** 
   * 碰撞检测
   * 两个矩形的投影半径相加小于矩形中心点向量的投影的长度的话。说明这两个矩形在这轴并没有相交。
   */
  public checkCollision(rigidBody: RigidBody) {
    // if(!rigidBody){
    //   return false;
    // }

    // 向量相减
    let centerDistanceVertor:Vector = this.centerPoint.substract(rigidBody.centerPoint);

    // 四个单位向量 两个就够，有遇到碰撞bug再放开
    let axes: Vector[] = [
      this.axisX,
      this.axisY,
      // rigidBody.axisX,
      // rigidBody.axisY
    ];

    // 只要有轴没有相交，就认为没有碰撞
    // 即两个矩形的中心点距离在x轴投影的长度 大于等于 两个矩形中心点到顶点的距离在x轴上的投影长度之和
    for (let i = 0; i < axes.length; i++) {
      if (this.getProjectionRadius(axes[i]) + rigidBody.getProjectionRadius(axes[i]) <= centerDistanceVertor.dot(axes[i])) {
        return;
      }
    }

    // 辩别方向
    const distanceH: number = this.getProjectionRadius(axes[0]) + rigidBody.getProjectionRadius(axes[0]) - centerDistanceVertor.dot(axes[0]);
    const distanceV: number = this.getProjectionRadius(axes[1]) + rigidBody.getProjectionRadius(axes[1]) - centerDistanceVertor.dot(axes[1])
    if( distanceH < distanceV){
          // 水平相撞
          this.gameObject.handleHorizontalCollision(rigidBody.gameObject, distanceH);
          rigidBody.gameObject.handleHorizontalCollision(this.gameObject, distanceH);
          return
    }
    
    // 垂直相撞
    this.gameObject.handleVerticalCollision(rigidBody.gameObject, distanceV);
    rigidBody.gameObject.handleVerticalCollision(this.gameObject, distanceV);
  }

  /** 
   *  单位向量
   * @param rotation 0 - 360  
   */
  public setRotation(rotation: number) {
    this.rotation = rotation;
    // 计算在x, y偏转角度
    this.axisX = new Vector(Math.cos(rotation), Math.sin(rotation));
    this.axisY = new Vector(-Math.sin(rotation), Math.cos(rotation));
    
    this.getProjectionRadius(this.axisX);
    this.getProjectionRadius(this.axisY);
    this.setCenter();
  }

  /** 
   * 设置中心点
   * gameobject会调用这个更新中心坐标
   */
  public setCenter() {
    this.centerPoint = new Vector(GAME.VIEW_WIDTH-(this.gameObject.x + this.halfWidth)  ,this.gameObject.y + this.halfHeight );
  }
}