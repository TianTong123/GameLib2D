// import Bullet from "../model/bullet";
// import Peashooter from "../model/plant/peashooter";
// import Sunflower from "../model/plant/sunflower";
import Global from "./public/Global";
import Scene from "../lib/scene/scene";
import Sunflower from "./model/plant/sunflower";
import View from "../lib/view/view";
import Peashooter from "./model/plant/peashooter";
import Bullet from "./model/bullet";
import GameObject from "../lib/model/gameObject";
import Plane from "./model/plant/plane";
import Wall from "./model/plant/wall";
import Rect from "./model/rect";
import UIObject from "../lib/ui/UIObject";
import NormalZombie from "./model/zombie/normalZombie";
import Panel from "../lib/scene/panel";
import TestPanel from "./scene/testPanel";
import GAME from "../lib/game";
import UI from "../lib/ui/UI";
import Vector from "../lib/util/vector";
import Rect1 from "./model/rect1";
/**
 * 游戏界面
 */
export default class MianPanel extends Panel {

    public assets(): void {
        // 填充资源
        this.scene.addImgInfo(require("@/assets/interface/background1.jpg"));
        this.scene.addImgInfo(require("@/assets/UI/Button.png"));
        this.scene.addImgInfo(require("@/assets/LogoLine.png"));
        this.scene.addImgInfo(require("@/assets/SodRoll.png"));
        this.scene.addImgInfo(require("@/assets/test.png"));
        this.scene.addGifInfo(require("@/assets/plant/sunflower.gif"));
        this.scene.addGifInfo(require("@/assets/plant/testSun.gif"));
        this.scene.addGifInfo(require("@/assets/bullet/PB001.gif"));
        this.scene.addGifInfo(require("@/assets/bullet/PB10.gif"));
        this.scene.addGifInfo(require("@/assets/bullet/pb.gif"));
        this.scene.addGifInfo(require("@/assets/plant/Peashooter.gif"));
        this.scene.addGifInfo(require("@/assets/zombie/Zombie.gif"));
        this.scene.addGifInfo(require("@/assets/zombie/Zombie2.gif"));
        this.scene.addGifInfo(require("@/assets/zombie/Zombie3.gif"));
        this.scene.addGifInfo(require("@/assets/zombie/ZombieDie.gif"));
        this.scene.addGifInfo(require("@/assets/zombie/ZombieLostHead.gif"));
        this.scene.addGifInfo(require("@/assets/zombie/ZombieAttack.gif"));
        this.scene.addImgInfo(require("@/assets/003.png"));
    }

    public run(): void{
        new Rect(0,0,100,200,0);

        new Rect1(300,150,150,170,0);
        
        // 切换 panel
        // setTimeout(async ()=>{
        //     let test: TestPanel = new TestPanel();
        //     this.switchPanel(test);
        // }, 5000)
        // this.scene.addView( new View());
        // 设置背景
    //    let bg: View = new View(this.scene.getImgInfo(require("@/assets/interface/background1.jpg")), -100, 0, Global.BG_WIDTH, Global.BG_HEIGHT);
    //    this.scene.addView(bg);
    //     let sFlower: Sunflower = new Sunflower(0,  0);
    //     sFlower.getAniMation().setPlaySpeed(3);
    //     let sFlower2: Sunflower = new Sunflower(0,  1);
    //     sFlower2.getAniMation().setPlaySpeed(0.35);
    //     new Sunflower(0,  2);
    //     new Sunflower(0,  3);
    //     new Sunflower(0,  4);
    //     new Sunflower(1,  0);
    //     new Sunflower(1,  1);
    //     new Sunflower(1,  2);
    //     new Sunflower(1,  3);
    //     new Sunflower(1,  4);

        
    //     let pShooter: Peashooter = new Peashooter(2,  0);
    //     pShooter.getAniMation().setPlaySpeed(3)
    //     let pShooter1: Peashooter = new Peashooter(2,  1);
    //     pShooter1.setBulletType("445")

        
    //     new Peashooter(2,  2);
    //     new Peashooter(2,  3);
    //     let pShooter3: Peashooter = new Peashooter(2,  4);
    //     pShooter3.setBulletSpeet(0.2)

 
    //     new NormalZombie(9.1,  0);
    //     new NormalZombie(9.3,  1);
    //         new NormalZombie(8,  2);
    //     new NormalZombie(9,  3);
    //     new NormalZombie(9.2,  4);
        
    //     new NormalZombie(10,  0);
    //     new NormalZombie(10.2,  1);
    //     new NormalZombie(9.5,  2);
    //     new NormalZombie(9.9,  3);
    //     new NormalZombie(9.5,  4);
        
    //     setTimeout(()=>{
    //         new NormalZombie(10,  0);
    //         new NormalZombie(10,  1);
    //         new NormalZombie(10,  2);
    //         new NormalZombie(10,  3);
    //         new NormalZombie(10,  4);
    //     },5000)

    //     setTimeout(()=>{
    //         new NormalZombie(10,  0);
    //         new NormalZombie(10,  1);
    //         new NormalZombie(10,  2);
    //         new NormalZombie(10,  3);
    //         new NormalZombie(10,  4);
    //     },2000)
       
        // 下面是随着相机移动的ui
        // 菜单按钮
        // const panel1: UI = new UI();
        // const menuBtn: UIObject = new UIObject(require("@/assets/UI/Button.png"), 0, 0, 50, 30);
        // menuBtn.setClickEvent(()=>{
        //     // 点击将游戏时间速率变为0
        //     GAME.TIME_SCALE = 0;
        //     panel2.SHOW = true;
        //     panel1.SHOW = false;
            
        // })
        // panel1.addUIObject( menuBtn );
        // GAME.UI_MAMAGER.addUI(panel1);

        // // 暂停后的ui
        // const panel2: UI = new UI();
        // panel2.addUIObject( new UIObject(require("@/assets/UI/dialog.png"), 250, 70, 308, 249) );
        // const playBtn: UIObject = new UIObject(require("@/assets/UI/Button.png"), 375, 260, 50, 30);
        // playBtn.setClickEvent(()=>{
        //     // 点击将游戏时间速率变为0
        //     GAME.TIME_SCALE = 1;
        //     panel2.SHOW = false;
        //     panel1.SHOW = true;
        // })
        // panel2.addUIObject(playBtn);
        // panel2.SHOW = false;
        // GAME.UI_MAMAGER.addUI(panel2);

    }

    public getScene(): Scene{
        return this.scene;
    }
}