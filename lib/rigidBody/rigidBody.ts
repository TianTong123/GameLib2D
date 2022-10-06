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
  // 偏移量
  private offsetX: number;
  private offsetY: number;

  // 是否进行物理处理 默认不开启
  public isHandlePhysics: boolean = false;

  // x轴上的力
  public forceX: number = 0;
  // x速度
  private vx: number = 0;

  // 质量 默认为1
  public mass: number = 1;

  // y轴方向上的力
  public forceY: number = 0;
  // y速度
  private vy: number = 0;
  // 是否启用重力 默认关闭 延迟到后面写点场景来实现
  public isUseGravity: number = 0;
  // 重力系数 默认为10. 就不整9.8了
  private gravityCoefficient: number = 10;
  // 仿真系数 这玩意用来乘力的，让游戏力的力产生的速度的变化更快
  private realCoefficient: number = 80;

  // 是否启用摩擦力 (放后处理)
  public isUserFriction?: number = 1;
  // 摩擦系数 默认为1
  private frictCoefficient: number = 1;

  constructor(gameObject: GameObject, rotation: number, width?: number, height?: number, offsetX?: number, offsetY?: number) {
    this.gameObject = gameObject;

    this.halfWidth = (width || gameObject.width) / 2;
    this.halfHeight = (height || gameObject.height) / 2;

    // 将坐标轴设置在 刚体 左上角。后面会移动至中心
    this.centerPoint = new Vector(gameObject.x, gameObject.y);

    this.axisX = new Vector(0, 0);
    this.axisY = new Vector(0, 0);

    this.offsetX = offsetX || 0;
    this.offsetY = offsetY || 0;

    // 矩形中心
    this.setRotation(rotation);

    GAME.ACTIVE_SCENE.addRigidbody(this);
  }


  /**********************************************************************************************/
  /**********************************************************************************************/
  /****************************        刚体盒子处理          *************************************/
  /**********************************************************************************************/
  /**********************************************************************************************/


  /** 
   * 获取投影半径
   * 单位向量乘向量得到对应轴投影
   */
  public getProjectionRadius(axis: Vector): number {
    let projectionAxisX: number = axis.dot(this.axisX);
    let projectionAxisY: number = axis.dot(this.axisY);
    return this.halfWidth * projectionAxisX + this.halfHeight * projectionAxisY;
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
    // this.centerPoint = new Vector(GAME.RENDERER_WIDTH - (this.gameObject.x + this.halfWidth + this.offsetX), this.gameObject.y + this.halfHeight + this.offsetY);
    this.centerPoint = new Vector(this.gameObject.x + this.halfWidth + this.offsetX, this.gameObject.y + this.halfHeight + this.offsetY);
    // console.log(this.centerPoint);
    
  }


  /**********************************************************************************************/
  /**********************************************************************************************/
  /****************************        物理处理          *****************************************/
  /**********************************************************************************************/
  /**********************************************************************************************/

  /** 
   * 碰撞检测
   * 当所有的轴都满足两个矩形的投影半径相加大于矩形中心点向量的投影的长度的话。说明这两个矩形在这轴并没有相交。
   * 所以只要有一个不相交，就说明没有相交
   */
  public checkCollision(rigidBody: RigidBody) {
    if (!rigidBody) {
      return false;
    }

    // 向量相减
    let centerDistanceVertor: Vector = this.centerPoint.substract(rigidBody.centerPoint);

    // 四个单位向量，即4个轴，因为是矩形，所以是4个轴
    let axes: Vector[] = [
      this.axisX,
      this.axisY,
      rigidBody.axisX,
      rigidBody.axisY
    ];

    // 只要有轴没有相交，就认为没有碰撞
    // 即两个矩形的中心点距离在x轴投影的长度 大于等于 两个矩形中心点到顶点的距离在x轴上的投影长度之和
    for (let i = 0; i < axes.length; i++) {
      if (this.getProjectionRadius(axes[i]) + rigidBody.getProjectionRadius(axes[i]) <= centerDistanceVertor.dot(axes[i])) {
        return;
      }
    }

    // 辩别方向
    const distanceH: number = centerDistanceVertor.dot(axes[0]) - this.getProjectionRadius(axes[0]) - rigidBody.getProjectionRadius(axes[0]);
    const distanceV: number = centerDistanceVertor.dot(axes[1]) - this.getProjectionRadius(axes[1]) - rigidBody.getProjectionRadius(axes[1]);
    //console.log("-->",centerDistanceVertor.dot(axes[0]),this.getProjectionRadius(axes[0]), rigidBody.getProjectionRadius(axes[0]), centerDistanceVertor.dot(axes[1])  );
    
    // if (distanceH < distanceV) {
    //   // 水平相撞
    //   this.handleHorizontalCollision(rigidBody, distanceV, distanceH);
    //   rigidBody.handleHorizontalCollision(this, distanceV, distanceH);
    //   return
    // }

    // // 垂直相撞
    // this.handleVerticalCollision(rigidBody, distanceV, distanceH);
    // rigidBody.handleVerticalCollision(this, distanceV, distanceH);
    this.handleCollision(rigidBody, distanceV, distanceH);
    rigidBody.handleCollision(this, distanceV, distanceH);
  }

  //  X轴力的处理
  public handleForceX(deltaTime: number): void {
    // 加速度 a =  F / m 
    const accelerationX: number = this.forceX / this.mass;
    // Vt = V0 + at
    this.vx += accelerationX * this.realCoefficient * deltaTime;
    //s = vt
    this.gameObject.setX(this.gameObject.x + this.vx * deltaTime);

    // 用完力了，归零
    this.forceX = 0;
  }

  //  Y轴力的处理 因为我是第三象限，所以是重力减回去
  public handleForceY(deltaTime: number): void {
    // 重力(this.mass * this.gravityCoefficient * this.isUseGravity)减去y轴上的力 得到合力 
    // 加速度 a =  F / m 
    let accelerationY: number = ((this.mass * this.gravityCoefficient * this.isUseGravity) - this.forceY) / this.mass;

    // Vt = V0 + at
    this.vy += accelerationY * this.realCoefficient * deltaTime;

    //s = vt
    this.gameObject.setY(this.gameObject.y += this.vy * deltaTime);

    // 用完力了，归零
    this.forceY = 0;
  }

  /**
   * 设置一个矢量的力
   * @param vector 矢量
   */
  public addForce( vector: Vector ): void{
    this.forceX += vector.x;
    this.forceY += vector.y;
  }

  // 处理垂直碰撞 
  // obj： 撞的对象 distanceV: 嵌进去的垂直距离
  public handleVerticalCollision(rb: RigidBody, distanceV: number, distanceH: number): void {
    if (this.isHandlePhysics) {
      // 复位处理
      // this.y += this.vy >= 0 ? -distanceV : distanceV;//防止一直下落
      
      this.gameObject.setY(this.gameObject.y + (this.vy >= 0 ? -distanceV : distanceV));
      // console.log("distanceV: ",distanceV, distanceH);

      // this.x += this.vx >= 0 ? -distanceH : distanceH;//防止卡墙

      // 动量动能守恒处理
      this.conservationOfMomentum(rb);

      // 碰墙处理
      if (!rb.isHandlePhysics) {
        // 碰撞后的物理处理
        this.vy = -this.vy * GAME.ENERGY_ATTENUATION_PERCENTAGE;
      }

    }

    // 调用碰撞
    this.gameObject.collision(rb.gameObject);

    // 更新对象
    this.gameObject.handleUpdate(0);
  }

  // 处理水平碰撞
  // obj： 撞的对象，  distanceH: 嵌进去的水平距离
  public handleHorizontalCollision(rb: RigidBody, distanceV: number, distanceH: number): void {
    if (this.isHandlePhysics) {
      // 复位处理
      // this.x += this.vx >= 0 ? -distanceH : distanceH;
      this.gameObject.setX(this.gameObject.x + (this.vx >= 0 ? -distanceH : distanceH));//防止卡墙
      // console.log("distanceH: ",distanceH, distanceH);
      // this.y += this.vy >= 0 ? -distanceV : distanceV;//防止一直下落

      // 动量动能守恒处理
      this.conservationOfMomentum(rb);

      // 碰墙处理
      if (!rb.isHandlePhysics) {
        // 碰撞后的物理处理
        this.vx = -this.vx * GAME.ENERGY_ATTENUATION_PERCENTAGE;
      }

    }

    // 调用碰撞
    this.gameObject.collision(rb.gameObject);

    // 更新对象
    this.gameObject.handleUpdate(0)
  }

  // 处理碰撞
  public handleCollision(rb: RigidBody, distanceV: number, distanceH: number): void {
    if (this.isHandlePhysics) {
      // 复位处理
      console.log(distanceH, distanceV);
      
      this.gameObject.setX(this.gameObject.x + (this.vx >= 0 ? -distanceH : distanceH));//防止卡墙
      this.gameObject.setY(this.gameObject.y + (this.vy >= 0 ? -distanceV : distanceV));

      // 动量动能守恒处理
      this.conservationOfMomentum(rb);

      // 碰墙处理
      if (!rb.isHandlePhysics) {
        // 碰撞后的物理处理
        this.vx = -this.vx * GAME.ENERGY_ATTENUATION_PERCENTAGE;
        this.vy = -this.vy * GAME.ENERGY_ATTENUATION_PERCENTAGE;
      }
    }
  }

  // 动量守恒
  private conservationOfMomentum(rb: RigidBody): void {
    // 只对开启物理处理的对象经行动量守恒
    if (!rb.isHandlePhysics) {
      return
    }

    // 创建两小球的速度向量 
    let vectorThis: Vector = new Vector(this.vx, this.vy);
    let vectorObj: Vector = new Vector(rb.getVX(), rb.getVY());

    // 连心线方向的向量
    let vectorHeart: Vector = new Vector(this.gameObject.x - rb.gameObject.x, this.gameObject.y - rb.gameObject.y);
    // 获取连心线方向的单位向量
    let unitHeart: Vector = vectorHeart.normalize();
    // 连心线的单位向量在切线方向。 就是互相垂直。所以把y取反就行
    let unitTan: Vector = new Vector(-unitHeart.y, unitHeart.x);

    // 求各自速度在连心线、切线上的投影长度
    // 自己的
    let v1Heart: number = vectorThis.dot(unitHeart);
    let v1Tan: number = vectorThis.dot(unitTan);
    // 对面的
    let v2Heart: number = vectorObj.dot(unitHeart);

    // 各自碰撞后的速度标量（这里是联立动能/动量守恒推出的公式）
    // v₁′ = ( (m₁ - m₂)v₂ + 2m₂v₂ ) / m₁ + m₂
    let v1ScalarAfter = (v1Heart * (this.mass - rb.mass) + 2 * rb.mass * v2Heart) / (this.mass + rb.mass);

    // 复原

    // 单位向量加长度，变成正常向量
    // 自己的
    // 连接线上的向量
    let v1VectorHeart: Vector = unitHeart.multiply(v1ScalarAfter);
    // 切线上的向量
    let v1VectorTan: Vector = unitTan.multiply(v1Tan);

    // 切线方向加连心线两个方向的向量相加得到合向量（这就是最终的v₁′）
    let v1After: Vector = v1VectorHeart.add(v1VectorTan);

    // 赋值速度
    this.vx = v1After.x * GAME.ENERGY_ATTENUATION_PERCENTAGE;
    this.vy = v1After.y * GAME.ENERGY_ATTENUATION_PERCENTAGE;
  }

  public getVX(): number {
    return this.vx
  }

  public setVX(val: number): void {
    this.vx= val;
  }

  public setVY(val: number): void {
    this.vy = val;
  }
  public getVY(): number {
    return this.vy
  }

  // 是否启用物理处理， true启用
  public setHandlePhysics(val: boolean): void {
    this.isHandlePhysics = val;
  }

  // 是否使用重力
  // isUse: true 使用
  public setGravity(isUse: boolean): void {
    this.isUseGravity = isUse ? 1 : 0;
  }
} 