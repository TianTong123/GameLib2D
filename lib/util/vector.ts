import GameBase from "../interface/gameBase";

/**
 * 向量类
 */
export default class Vector implements GameBase {
  // 坐标
  public x: number = 0;
  public y: number = 0;

  // 构造器
  constructor(x: number, y: number){
    this.setPoint(x, y)
  }

  // 设置位置
  public setPoint(x: number, y: number){
    this.x = x;
    this.y = y;
  }

  // 向量相加
  public add( v: Vector ): Vector {
    return new Vector( this.x + v.x, this.y + v.y );
  }

  // 向量相减
  public substract( v: Vector ): Vector {
    return new Vector( this.x - v.x, this.y - v.y );
  }

  // 点乘(向量投影)
  public dot( v: Vector ): number {
    return Math.abs(this.x * v.x + this.y * v.y);
  }

  // 向量乘标量（加上长度）
  public multiply(len: number): Vector {
    return new Vector(this.x * len, this.y * len);
  }

  
  // 取单位向量（除去长度）
  public normalize(): Vector {
    // 点到原点距离， 也就是长度
    let distance = Math.sqrt(this.x * this.x + this.y * this.y);
    // 去掉长度
    return new Vector(this.x / distance, this.y / distance);
  }
}