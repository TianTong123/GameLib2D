import GAME from "../game";
import GameBase from "../interface/gameBase";
import View from "../view/view";
import RigidBody from "../rigidBody/rigidBody";
import GameAnimation from "../animation/gameAnimation";
const { v4: uuidv4 } = require('uuid');
import Scene from "../scene/scene";
/**
 * 游戏对象抽象类
 */
export default abstract class GameObject implements GameBase {
    // id
    public id: string = "";

    // 坐标
    public x: number = 0;
    public y: number = 0;

    // 大小
    public width: number = 0;
    public height: number = 0;

    // 视图
    public view?: View;

    // 动画
    public animation?: GameAnimation;

    // 刚体 延迟到后面写点场景来实现
    public rigidBody?: RigidBody;

    // 质量 默认为1
    public mass: number = 1;

    // 是否启用重力 默认关闭 延迟到后面写点场景来实现
    public isUseGravity?: boolean = false;
    // 重力系数 默认为10. 就不整9.8了
    private gravityCoefficient: number = 10;

    // 是否启用摩擦力
    public isUserFriction?: number = 1;
    // 摩擦系数 默认为1 延迟到后面写点场景来实现
    private friction: number = 1;

    // 构造器
    constructor(){
        this.id = uuidv4(); 
        GAME.ACTIVE_SCENE.addGameObject(this);
    };
    
    // 刷新方法方法
    public abstract update(): void;

    // 碰撞方法 延迟到后面写点场景来实现
    public abstract collision( obj: GameObject ): void;

    // 创建 view
    public createView(imgUrl: string, x: number, y: number, width: number, height: number): void {
        this.view = new View(imgUrl, x, y, width, height);
        this.view.setId(this.id);
        this.view.loadImage();
    }

    // 创建刚体(先以当前当前大小位置作为刚体大小位置)
    public createRigidBody(): void {
        this.rigidBody = new RigidBody( this, 0 );
        this.rigidBody.id = this.id;
    }

    // 创建动画
    public createAnimation(url: string, x?: number, y?: number, width?: number, height?: number): void {
        this.animation = new GameAnimation( url, x, y, width, height );
        this.animation.id = this.id;
    }

    // 是否使用重力
    // isUse: true 使用
    public setGravity( isUse: boolean ){
        this.isUseGravity = isUse;
    }

    // 注销方法
    public destroy(): void{
        // 后续更正为只保留gameObjectList, 其他数组就用map来取
        GAME.ACTIVE_SCENE.deleteAnimation(this.id);
        GAME.ACTIVE_SCENE.deleteGameObject(this.id);
        GAME.ACTIVE_SCENE.deleteView(this.id);
        GAME.ACTIVE_SCENE.deleteRigidbody(this.id);
        GAME.ACTIVE_SCENE.start();
    }
}