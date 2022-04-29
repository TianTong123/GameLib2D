import GameBase from "../interface/gameBase";

/**
 * 向量类
 */
export default class Vector implements GameBase {
  // 坐标
  public x: number;
  public y: number;

  // 构造器
  constructor(x: number, y: number){
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
  public dot( v: Vector ): Vector {
    return new Vector( this.x - v.x, this.y - v.y );
  }
}