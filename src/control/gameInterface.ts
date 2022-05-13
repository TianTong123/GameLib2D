// import Bullet from "../model/bullet";
// import Peashooter from "../model/plant/peashooter";
// import Sunflower from "../model/plant/sunflower";
import Global from "../public/Global";
import Scene from "../../lib/scene/scene";
import Sunflower from "../model/plant/sunflower";
import View from "../../lib/view/view";
import Peashooter from "../model/plant/peashooter";
import Bullet from "../model/bullet";
import GameObject from "../../lib/model/gameObject";
import Plane from "../model/plant/plane";
import Wall from "../model/plant/wall";
/**
 * 游戏界面
 */
export default class GameInterface {
    /**
     * 构造器
     */
    constructor(){}

    public async start(){
        // 创建一个场景
        let scene: Scene =  new Scene();
        // 激活场景
        scene.activeScene();

        // 添加素材
        let bg: View = new View(require("@/assets/interface/background1.jpg"), 0, 0, Global.BG_WIDTH, Global.BG_HEIGHT);
        // scene.addView(bg);
        // new Sunflower(0,  0);
        // new Sunflower(0,  1);
        // new Sunflower(0,  2);
        // new Sunflower(0,  3);
        // new Sunflower(0,  4);
        // new Sunflower(1,  0);
        // setTimeout(async ()=>{
        //     new Sunflower(1,  1)
        // }, 500)
        // setTimeout(async ()=>{
        //     new Sunflower(1,  2)
        // }, 1000)
        // setTimeout(async ()=>{
        //     new Sunflower(1,  3)
        // }, 1500)
        // setTimeout(async ()=>{
        //     new Sunflower(1,  4)
        // }, 2000)
        //new Bullet({ name: "PB00", isPierce: false, hurtValue: 50, speed: 10, isAll: true, range: -1, type: 0, column: 0, row: 0, offsetX: 40, offsetY: 5, width: 26,  height: 20})
        new Peashooter(0,  0);
        // new Peashooter(2,  1);
        // new Peashooter(1,  1);
        // new Peashooter(2,  2);
        // new Peashooter(2,  3);
        // new Peashooter(2,  4);

        // new Sunflower(0,  0);
        
        new Sunflower(0,  2);
        new Sunflower(0,  3);
        new Sunflower(5,  1);
        // new Sunflower(4,  3 );
        // new Sunflower(7,  3 );

        new Plane(0, 4);
        new Wall(8,0);
        // setTimeout(async ()=>{
        //     new Peashooter(3,  1)
        // }, 500)
        // setTimeout(async ()=>{
        //     new Peashooter(3,  2)
        // }, 1000)
        // setTimeout(async ()=>{
        //     new Peashooter(3,  3)
        // }, 1500)
        // setTimeout(async ()=>{
        //     new Peashooter(3,  4)
        // }, 2000)
        // setTimeout(async ()=>{
        //     new Peashooter(3,  0)
        // }, 2500)
        // 加载资源
        // await scene.loadAssets();

        // 启动
        scene.start();
    }
}