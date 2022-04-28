import Plant from "../../lib/model/gameObject";

/**
 * Buff 类
 */
export default class Buff {
    // buff 名字
    name: string = "";
    // buff 持续时间
    time: number = 2000;
    constructor( name1: string){
        name: name1
    }
    // 处理
    handle(plant: Plant): void{
        this.time -= 100;
    }

    /**
     * buff 是否结束
     * @returns 时间为0就收工
     */
    isEnd(): Boolean{
        return this.time == 0
    }
}