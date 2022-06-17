
/**
 * 全局变量
 */
export default class Global {
    // 僵尸数组
    public static ZOMBIE_LIST: []
    // 环境  day: 白天， night： 夜晚
    public static ENV: string;
    // 块的大小
    public static BLOCK_SIZE: number = 70;
    // 基础 植物X 偏移 (因为地图有屋子，栅栏这些，所以有植物 X Y 的偏移值)
    public static BASE_PLANT_X_Offset: number = 220;
    // 基础 植物Y 偏移
    public static BASE_PLANT_Y_Offset: number = 65;
    // 子弹刷新时间
    public static BULLET_REFRESH_TIME: number = 200;
    // 背景宽度
    public static BG_WIDTH: number = 1200;
    // 背景高度
    public static BG_HEIGHT: number = 440;
}