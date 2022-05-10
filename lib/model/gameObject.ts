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

    // 刚体
    public rigidBody?: RigidBody;

    // x轴上的力
    public forceX: number = 0;
    // x速度
    private vx: number = 0;

    // 质量 默认为1
    public mass: number = 1;

    // y轴方向上的力
    public forceY: number = 0;
    // y速度
    private vy: number = 0;
    // 是否启用重力 默认关闭 延迟到后面写点场景来实现
    public isUseGravity: number = 0;
    // 重力系数 默认为10. 就不整9.8了
    private gravityCoefficient: number = 10;

    // 是否启用摩擦力 (放后处理)
    public isUserFriction?: number = 1;
    // 摩擦系数 默认为1
    private frictCoefficient: number = 1;

    // 构造器
    constructor(){
        this.id = uuidv4(); 
        GAME.ACTIVE_SCENE.addGameObject(this);
    };
    
    // 刷新方法方法
    public abstract update(deltaTime: number): void;

    // 碰撞方法 延迟到后面写点场景来实现
    public abstract collision( obj: GameObject ): void;

    // 每帧处理方法
    public handleUpdate(deltaTime: number): void{
        let time = deltaTime / 100;
        // X轴上力的处理
        this.handleForceX(time);
        // Y轴上力的处理
        this.handleForceY(time);
        // 更新刚体投影坐标
        this.rigidBody?.setCenter();
        // 调用一次更新事件
        this.update(deltaTime);
    }

    //  X轴力的处理
    private handleForceX(deltaTime: number): void{
        // 加速度 a =  F / m 
        let accelerationX: number = this.forceX / this.mass;
        // Vt = V0 + at
        this.vx += accelerationX * deltaTime;
        //s = vt
        this.x += this.vx * deltaTime;
        this.animation?.setX(this.x);
        this.view?.setX(this.x);
    }

    //  Y轴力的处理 因为我是第三象限，所以是重力减回去
    private handleForceY(deltaTime: number): void{
        // 重力(this.mass * this.gravityCoefficient * this.isUseGravity)减去y轴上的力 得到合力 
        // 加速度 a =  F / m 
        let accelerationY: number = ( (this.mass * this.gravityCoefficient * this.isUseGravity) - this.forceY) / this.mass;
        
        // Vt = V0 + at
        this.vy += accelerationY * deltaTime;
        
        //s = vt
        this.y += this.vy*deltaTime;
        this.animation?.setY(this.y);
        this.view?.setY(this.y);
    }

    // 处理碰撞 (东西多再分)
    // obj： 撞的对象，  
    // direction： 撞的方向 vertical垂直方向， horizontal：水平方向
    public handleCollision( obj: GameObject, direction: string ): void{
        
        // 碰撞后的物理处理
        if(direction == "vertical"){
            this.vy = -this.vy;
        }
        if(direction == "horizontal"){
            this.vx = -this.vx;
        }
        // 调用碰撞
        this.collision(obj)
    }

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
    public setGravity( isUse: boolean ): void{
        this.isUseGravity = isUse ? 1 : 0;
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

    // 设置v
    public setVX( val: number ): void{
        this.vx = val;
    }
}