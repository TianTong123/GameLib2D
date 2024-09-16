import GAME from "../game";
import GameBase from "../interface/gameBase";
import View from "../view/view";
import RigidBody from "../rigidBody/rigidBody";
import GameAnimation from "../animation/gameAnimation";
import Vector from "../util/vector";
import GitInfo from "../gif/gitInfo";
import ImgInfo from "../view/imgInfo";
const { v4: uuidv4 } = require('uuid');
/**
 * 游戏对象抽象类
 */
export default abstract class GameObject implements GameBase {
    // id
    public id: string = "";
    
    // 名字
    public name: string = "";

    // 坐标
    public x: number = 0;
    public y: number = 0;

    // 大小
    public width: number = 0;
    public height: number = 0;
    public radius: number = 0;

    // 是否显示
    public show: Boolean = true;

    // 视图
    public view?: View;

    // 动画
    public animation?: GameAnimation;

    // 刚体
    public rigidBody?: RigidBody;

    // 旋转角度（顺时针
    public angle: number = 0;

    // 颜色
    public gameObjectColor: string = "#0f0"

    //  rect矩形  circle 圆
    public gameObjectType: string = "rect";

    // 构造器
    constructor(){
        this.id = uuidv4(); 
        GAME.ACTIVE_SCENE.addGameObject(this);
    };
    
    // 刷新方法方法
    public abstract update(deltaTime: number): void;

    // 固定刷新方法方法
    public abstract fixedUpdate(deltaTime: number): void;

    // 碰撞方法 延迟到后面写点场景来实现
    public abstract collision( obj: GameObject ): void;

    // 每帧处理方法
    public handleUpdate(deltaTime: number): void{
        // 调用一次更新事件
        this.update(deltaTime);
    }

    // 固定帧处理办法
    public handleFixedUpdate(deltaTime: number){
        // X轴上力的处理
        this.rigidBody?.handleForceX(deltaTime);
        // Y轴上力的处理
        this.rigidBody?.handleForceY(deltaTime);
        // 更新刚体投影坐标
        this.rigidBody?.setCenter();
        //调用一次固定更新事件
        this.fixedUpdate(deltaTime);
    }

    // 创建 view
    public createView(url: string, x: number, y: number, width: number, height: number, angle?:number): void {
        // 去掉旧的，只保留最新
        GAME.ACTIVE_SCENE.deleteView( this.id );
        let imgInfo: ImgInfo = GAME.ACTIVE_SCENE.getImgInfo(url); 
        this.view = new View(imgInfo, x, y, width, height);
        this.view.setId(this.id);
        GAME.ACTIVE_SCENE.addView(this.view);
        GAME.ACTIVE_SCENE.refreshComponent();
    }

    // 创建刚体(先以当前当前大小位置作为刚体大小位置)   (先暂时弃用，不注释)
    public createRigidBody(width?: number, height?: number, offsetX?: number, offsetY?: number  ): void {
        this.rigidBody = new RigidBody( this, 0, width, height, offsetX, offsetY );
        this.rigidBody.id = this.id;
    }

    /**
     * 设置rigidBody
     * @param rigidBody 
     */
    public setRigidBody( rigidBody: RigidBody ): void{
        this.rigidBody = rigidBody;
    }

    
    // 创建动画
    public createAnimation(url: string, x?: number, y?: number, width?: number, height?: number, angle?:number): void {
       let gifInfo: GitInfo = GAME.ACTIVE_SCENE.getGifInfo(url); 
       this.animation = new GameAnimation( gifInfo, x, y, width, height );
       this.animation.id = this.id; 
       GAME.ACTIVE_SCENE.addAnimation( this.animation );
    }

    // 切换动画
    public switchAnimation(url: string, x?: number, y?: number, width?: number, height?: number, angle?:number): void {
        let gifInfo: GitInfo = GAME.ACTIVE_SCENE.getGifInfo(url); 
        this.animation = new GameAnimation( gifInfo, x, y, width, height );
        this.animation.id = this.id; 
        GAME.ACTIVE_SCENE.switchAnimation(this.id, this.animation )
    }
    
    // 注销方法
    public destroy(): void{
        // 后续更正为只保留gameObjectList, 其他数组就用map来取
        GAME.ACTIVE_SCENE.deleteAnimation(this.id);
        GAME.ACTIVE_SCENE.deleteGameObject(this.id);
        GAME.ACTIVE_SCENE.deleteView(this.id);
        GAME.ACTIVE_SCENE.deleteRigidbody(this.id);
        GAME.ACTIVE_SCENE.refreshComponent();
    }

    /**
     * 获取 animation
     */
    public getAniMation(): GameAnimation{
        return this.animation as GameAnimation
    }

    /**
     * 设置x的位置
     * @param x 坐标
     */
    public setX( x: number ): void{
        this.x = x;
        this.animation?.setX(x);
        this.view?.setX(x);
    }

    /**
     * 设置y的位置
     * @param y 坐标
     */
     public setY( y: number ): void{
        this.y = y;
        this.animation?.setY(this.y);
        this.view?.setY(this.y);
    }
}