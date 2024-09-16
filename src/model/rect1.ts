import Input from "../../lib/input/input";
import GameObject from "../../lib/model/gameObject";
import RigidBody from "../../lib/rigidBody/rigidBody";
import { KEYCODE } from "../../lib/input/keyCode";
/**
 * 矩形
 */
export default class Rect1 extends GameObject{

    constructor(x: number, y: number, width: number, height: number, angle: number, ){
        super();
        this.name = "Rect1"
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.angle = angle;
        this.setRigid();
    }

    public setRigid(): void{
        const rb: RigidBody = new RigidBody( this, 0,  this.width, this.height, 0, 0);
        rb.id = this.id;
        rb.setGravity(false);
        this.setRigidBody(rb);
    }

    public update(deltaTime: number): void {
    }

    public fixedUpdate(deltaTime: number): void {

    }

    public collision(obj: GameObject): void {
        // console.log("????", obj.name);
        
    }

}