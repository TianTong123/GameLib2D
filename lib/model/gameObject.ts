import GAME from "../game";
import GameBase from "../interface/gameBase";
import View from "../view/view";
import RigidBody from "../rigidBody/rigidBody";
import GameAnimation from "../animation/gameAnimation";
const { v4: uuidv4 } = require('uuid');
import Scene from "../scene/scene";
import Vector from "../util/vector";
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
    
    // 是否进行物理处理 默认不开启
    private isHandlePhysics: boolean = false;

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
        // console.log();
        
        // let time = deltaTime / 100;
        // X轴上力的处理
        this.handleForceX(deltaTime);
        // Y轴上力的处理
        this.handleForceY(deltaTime);
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

    // 处理垂直碰撞 
    // obj： 撞的对象 distanceV: 嵌进去的垂直距离
    public handleVerticalCollision( obj: GameObject, distanceV: number): void{
        if(this.isHandlePhysics){
            // 动量动能守恒处理
            this.conservationOfMomentum(obj);

            // 碰墙处理
            if(!obj.isHandlePhysics){
                // 碰撞后的物理处理
                this.vy = -this.vy * GAME.ENERGY_ATTENUATION_PERCENTAGE;
            }
            this.y += this.vy >= 0 ? distanceV : -distanceV;//防止一直下落
        }
        
        // 调用碰撞
        this.collision(obj);

        // 更新对象
        this.handleUpdate(GAME.REFRESH_FRAME_TIME);
    }

    // 处理水平碰撞
    // obj： 撞的对象，  distanceV: 嵌进去的水平距离
    public handleHorizontalCollision( obj: GameObject, distanceV: number ): void{
        if(this.isHandlePhysics){
            // 动量动能守恒处理
            this.conservationOfMomentum(obj);
            
            // 碰墙处理
            if(!obj.isHandlePhysics){
                // 碰撞后的物理处理
                this.vx = -this.vx * GAME.ENERGY_ATTENUATION_PERCENTAGE;
            }
            this.x += this.vx >= 0 ? distanceV : -distanceV;//防止一直下落
        }
        
        // 调用碰撞
        this.collision(obj);

        // 更新对象
        this.handleUpdate(GAME.REFRESH_FRAME_TIME)
    }

    // 动量守恒
    private conservationOfMomentum( obj: GameObject): void{
        // 只对开启物理处理的对象经行动量守恒
        if(!obj.getHandlePhysic()){
            return
        }
        console.log("寄");
        
        // 创建两小球的速度向量 
        let velocity: Vector = new Vector(this.vx, this.vy);
        let velocityObj: Vector = new Vector(obj.getVX(), obj.getVY());
        // 连心线方向的向量
        let velocitNorm: Vector = new Vector(this.x - obj.x, this.y - obj.y);
        //接下来获取连心线方向的单位向量和切线方向上的单位向量，这些单位向量代表的是连心线和切线的方向：
        let unitVNorm: Vector = velocitNorm.normalize();
        let unitVTan: Vector = new Vector(-unitVNorm.y, unitVNorm.x);
        
        // 求各自速度的投影长度
        // 自己的
        let v1n: number = velocity.dot(unitVNorm);
        let v1t: number = velocity.dot(unitVTan);
        // 对面的
        let v2n: number = velocityObj.dot(unitVNorm);
        let v2t: number = velocityObj.dot(unitVTan);

        // 各自碰撞后的速度（这里是联立动能/动量守恒推出的公式，详情看百度）
        // v₁′ = ( (m₁ - m₂)v₂ + 2m₂v₂ ) / m₁ + m₂
        let v1nAfter = (v1n * (this.mass - obj.mass) + 2 * obj.mass * v2n) / (this.mass + obj.mass);
        let v2nAfter = (v2n * (obj.mass - this.mass) + 2 * this.mass * v1n) / (this.mass + obj.mass);

        if (v1nAfter < v2nAfter) {
            return;
        }
        
        // 单位向量加长度，变成正常向量
        // 自己的
        let v1VectorNorm: Vector = unitVNorm.multiply(v1nAfter);
        let v1VectorTan: Vector = unitVTan.multiply(v1t);
        // 对面的
        let v2VectorNorm: Vector = unitVNorm.multiply(v2nAfter);
        let v2VectorTan: Vector = unitVTan.multiply(v2t);

        // 两个方向合起来得到合速度（合向量）
        let velocity1After: Vector = v1VectorNorm.add(v1VectorTan);
        let velocity2After: Vector = v2VectorNorm.add(v2VectorTan);

        // 赋值速度
        // 给自己赋值
        this.vx = velocity1After.x * GAME.ENERGY_ATTENUATION_PERCENTAGE;
        this.vy = velocity1After.y * GAME.ENERGY_ATTENUATION_PERCENTAGE;
        // 给对面赋值
        obj.setVX(velocity2After.x);
        obj.setVY(velocity2After.y)

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
    public getVX(): number{
        return this.vx
    }

    public setVY( val: number ): void{
        this.vy = val;
    }
    public getVY(): number{
        return this.vy
    }
    
    // 是否启用物理处理， true启用
    public setHandlePhysics( val: boolean ): void{
        this.isHandlePhysics = val;
    }
    public getHandlePhysic(): boolean{
        return this.isHandlePhysics
    }
}