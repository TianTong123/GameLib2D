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
import UIObject from "../../lib/ui/UIObject";
import NormalZombie from "../model/zombie/normalZombie";
/**
 * 游戏界面
 */
export default class Panel {
    /**
     * 构造器
     */
    constructor(){}

    public async init(){
        // 创建一个场景
        let scene: Scene =  new Scene();
        // 激活场景
        scene.activeScene();
        
        // 填充资源
        scene.addImgInfo(require("@/assets/interface/background1.jpg"));
        scene.addImgInfo(require("@/assets/UI/Button.png"));
        scene.addGifInfo(require("@/assets/plant/sunflower.gif"));
        scene.addGifInfo(require("@/assets/bullet/PB001.gif"));
        scene.addGifInfo(require("@/assets/plant/Peashooter.gif"));
        scene.addGifInfo(require("@/assets/zombie/Zombie.gif"));
        scene.addGifInfo(require("@/assets/zombie/Zombie2.gif"));
        scene.addGifInfo(require("@/assets/zombie/Zombie3.gif"));
        scene.addGifInfo(require("@/assets/zombie/ZombieDie.gif"));
        scene.addGifInfo(require("@/assets/zombie/ZombieLostHead.gif"));
        // 加载资源
        await scene.loadAssets();
        
        // 设置背景
        let bg: View = new View(scene.getImgInfo(require("@/assets/interface/background1.jpg")), 0, 0, Global.BG_WIDTH, Global.BG_HEIGHT);
        scene.addView(bg);
        new Sunflower(0,  0);
        new Sunflower(0,  1);
        new Sunflower(0,  2);
        new Sunflower(0,  3);
        new Sunflower(0,  4);
        new Sunflower(1,  0);
        setTimeout(async ()=>{
            new Sunflower(1,  1)
        }, 500)
        setTimeout(async ()=>{
            new Sunflower(1,  2)
        }, 1000)
        setTimeout(async ()=>{
            new Sunflower(1,  3)
        }, 1500)
        setTimeout(async ()=>{
            new Sunflower(1,  4)
        }, 2000)
        // new Bullet({ name: "PB00", isPierce: false, hurtValue: 50, speed: 10, isAll: true, range: -1, type: 0, column: 0, row: 0, offsetX: 40, offsetY: 5, width: 26,  height: 20})
        // new Peashooter(0,  0);
        // new Bullet({
        //     name: "PB00",
        //     isPierce: false,
        //     hurtValue: 50,
        //     speed: 0.4,
        //     isAll: true,
        //     range: -1,
        //     type: 0,
        //     column: 0,
        //     row: 0,
        //     offsetX: 0,
        //     offsetY: 0,
        //     width: 26,
        //     height: 20
        //   })
        new Peashooter(2,  0);
        new Peashooter(2,  1);
        new Peashooter(2,  2);
        new Peashooter(2,  3);
        new Peashooter(2,  4);

        new NormalZombie(8,  2);

        // new Peashooter(4,  0);
        // new Peashooter(4,  1);
        // new Peashooter(4,  2);
        // new Peashooter(4,  3);
        // new Peashooter(4,  4);

        // new Peashooter(5,  0);
        // new Peashooter(5,  1);
        // new Peashooter(5,  2);
        // new Peashooter(5,  3);
        // new Peashooter(5,  4);

        // new Peashooter(6,  0);
        // new Peashooter(6,  1);
        // new Peashooter(6,  2);
        // new Peashooter(6,  3);
        // new Peashooter(6,  4);

        // new Peashooter(7,  0);
        // new Peashooter(7,  1);
        // new Peashooter(7,  2);
        // new Peashooter(7,  3);
        // new Peashooter(7,  4);

        // new Sunflower(0,  0);
        
        // new Sunflower(0,  1);
        // new Sunflower(0,  3);
        // new Sunflower(5,  1);
        // new Sunflower(4,  3 );
        // new Sunflower(7,  3 );

        // new Plane(0, 4);
        // new Wall(8,0);


        new UIObject(require("@/assets/UI/Button.png"), 0, 0, 50, 30);
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