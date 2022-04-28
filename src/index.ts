import "../css/index.css";
import "../css/plant.css";
import "../css/interface.css";
import GameInterface from "./control/gameInterface";
import GAME from "../lib/game";
// require('../css/index.css');
// import Sunflower from "./model/plant/sunflower";
// import Sunshine from "./model/sunshine";

GAME.init();
GAME.start();

let gameInterface = new GameInterface();
gameInterface.start();

// new Sunshine({row: 1, column: 2, type:1});
/**
 * 遗漏：
 * 1、view还没实现。(补充 imgOnload promise 方法，确保一定对)
 * 2、Bullet类 和 buff类还得重新优。
 * 3、还没增加对高度（z轴）的处理，思路有了，看桌面的一张a4纸
 * 
 * 后记：
 * 1、这里应该用canvas代替html来进行处理，避免频繁更新大量的DOM元素；
 * 2、GameBase接口或者GameObject抽象类，引入 top、 left, right三轴坐标，用于对应各个游戏对象自己当前位置；
 * 3、所有游戏对象分门别类放进对应的二维数组里面；
 * 4、GameObject抽象类、Bullet类新增运行（run）方法。移动方法里面带上碰撞方法。移动方法交由view来实现；
 * 5、view 用 requestAnimationFrame 刷新，提高帧率；
 * 6、view 每次刷新方法都是遍历全部数组，然后把数组里面的运行方法都执行一遍；
 * 
 * 缺点：
 * 1、运行不够光滑。因为model专注数据操作，所以都是以某个固定单位移动，所以看起来就是一格一格的移动的
 */