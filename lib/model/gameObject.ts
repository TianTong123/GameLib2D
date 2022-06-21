import GAME from "../game";
import GameBase from "../interface/gameBase";
import View from "../view/view";
import RigidBody from "../rigidBody/rigidBody";
import GameAnimation from "../animation/gameAnimation";
import Scene from "../scene/scene";
import Vector from "../util/vector";
import Result from "./result";
import { KEYCODE } from "../input/keyCode";
import GitInfo from "../gif/gitInfo";
import ImgInfo from "../view/imgInfo";
const { v4: uuidv4 } = require('uuid');
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
    private view?: View;

    // 动画
    private animation?: GameAnimation;

    // 刚体
    private rigidBody?: RigidBody;
    
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

    // 处理垂直碰撞 
    // obj： 撞的对象 distanceV: 嵌进去的垂直距离
    public handleVerticalCollision( obj: GameObject, distanceV: number, distanceH: number): void{
        if(this.isHandlePhysics){
            // 复位处理
            this.y += this.vy >= 0 ? -distanceV : distanceV;//防止一直下落
            // console.log("distanceV: ",distanceV, distanceH);

            // this.x += this.vx >= 0 ? -distanceH : distanceH;//防止卡墙

            // 动量动能守恒处理
            this.conservationOfMomentum(obj);

            // 碰墙处理
            if(!obj.isHandlePhysics){
                // 碰撞后的物理处理
                this.vy = -this.vy * GAME.ENERGY_ATTENUATION_PERCENTAGE;
            }
            
        }
        
        // 调用碰撞
        this.collision(obj);

        // 更新对象
        this.handleUpdate(GAME.REFRESH_FRAME_TIME);
    }

    // 处理水平碰撞
    // obj： 撞的对象，  distanceH: 嵌进去的水平距离
    public handleHorizontalCollision( obj: GameObject, distanceV: number, distanceH: number ): void{
        if(this.isHandlePhysics){
            // 复位处理
            this.x += this.vx >= 0 ? -distanceH : distanceH;//防止卡墙
            // console.log("distanceH: ",distanceH, distanceH);
            // this.y += this.vy >= 0 ? -distanceV : distanceV;//防止一直下落
            
            // 动量动能守恒处理
            this.conservationOfMomentum(obj);
            
            // 碰墙处理
            if(!obj.isHandlePhysics){
                // 碰撞后的物理处理
                this.vx = -this.vx * GAME.ENERGY_ATTENUATION_PERCENTAGE;
            }
            
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
        
        // 创建两小球的速度向量 
        let vectorThis: Vector = new Vector(this.vx, this.vy);
        let vectorObj: Vector = new Vector(obj.getVX(), obj.getVY());

        // 连心线方向的向量
        let vectorHeart: Vector = new Vector(this.x - obj.x, this.y - obj.y);
        // 获取连心线方向的单位向量
        let unitHeart: Vector = vectorHeart.normalize();
        // 连心线的单位向量在切线方向。 就是互相垂直。所以把y取反就行
        let unitTan: Vector = new Vector(-unitHeart.y, unitHeart.x);
        
        // 求各自速度在连心线、切线上的投影长度
        // 自己的
        let v1Heart: number = vectorThis.dot(unitHeart);
        let v1Tan: number = vectorThis.dot(unitTan);
        // 对面的
        let v2Heart: number = vectorObj.dot(unitHeart);
        
        // 各自碰撞后的速度标量（这里是联立动能/动量守恒推出的公式）
        // v₁′ = ( (m₁ - m₂)v₂ + 2m₂v₂ ) / m₁ + m₂
        let v1ScalarAfter = (v1Heart * (this.mass - obj.mass) + 2 * obj.mass * v2Heart) / (this.mass + obj.mass);
        
        // 复原

        // 单位向量加长度，变成正常向量
        // 自己的
        // 连接线上的向量
        let v1VectorHeart: Vector = unitHeart.multiply(v1ScalarAfter);
        // 切线上的向量
        let v1VectorTan: Vector = unitTan.multiply(v1Tan);

        // 切线方向加连心线两个方向的向量相加得到合向量（这就是最终的v₁′）
        let v1After: Vector = v1VectorHeart.add(v1VectorTan);

        // 赋值速度
        this.vx = v1After.x * GAME.ENERGY_ATTENUATION_PERCENTAGE;
        this.vy = v1After.y * GAME.ENERGY_ATTENUATION_PERCENTAGE;   
    }

    // 创建 view
    public createView(url: string, x: number, y: number, width: number, height: number): void {
        let imgInfo: ImgInfo = GAME.ACTIVE_SCENE.getImgInfo(url); 
        this.view = new View(imgInfo, x, y, width, height);
        this.view.setId(this.id);
        GAME.ACTIVE_SCENE.addView(this.view);
    }

    // 创建刚体(先以当前当前大小位置作为刚体大小位置)
    public createRigidBody(width?: number, height?: number, offsetX?: number, offsetY?: number  ): void {
        this.rigidBody = new RigidBody( this, 0, width, height, offsetX, offsetY );
        this.rigidBody.id = this.id;
    }

    // 创建动画
    public createAnimation(url: string, x?: number, y?: number, width?: number, height?: number): void {
        let gifInfo: GitInfo = GAME.ACTIVE_SCENE.getGifInfo(url); 
        this.animation = new GameAnimation( gifInfo, x, y, width, height );
        this.animation.id = this.id; 
        GAME.ACTIVE_SCENE.addAnimation( this.animation );
    }
    // 创建动画
    public switchAnimation(url: string, x?: number, y?: number, width?: number, height?: number): void {
        let gifInfo: GitInfo = GAME.ACTIVE_SCENE.getGifInfo(url); 
        this.animation = new GameAnimation( gifInfo, x, y, width, height );
        this.animation.id = this.id; 
        console.log(gifInfo);
        
        GAME.ACTIVE_SCENE.switchAnimation(this.id, this.animation )
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

    /**
     * 获取 animation
     */
    public getAniMation(): GameAnimation{
        return this.animation as GameAnimation
    }
}