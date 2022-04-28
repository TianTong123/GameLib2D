/**
 * 结果类
 */
export default class Result<T>{
  // 状态码， 1成功，0失败
  public code: number;
  // 状态信息
  public info: string;
  // 结果值
  public data: T;
  
  /**
   * 构造器
   * @param code 状态码， 1成功，0失败
   * @param info 状态信息
   * @param data 结果值
   */
  constructor(code: number, info: string, data: T){
    this.code = code;
    this.info = info;
    this.data = data;
  }
}