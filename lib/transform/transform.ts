import GameBase from "lib/interface/gameBase";

/**
 * 坐标模块（要不要拆出来。待定）
 * 拆出来的好处：
 *  让 GameObject 成为只是管理模块的类。不再处理其他逻辑
 */
export default class Transform implements GameBase{
  public x: number = 0;
  public y: number = 0;
}