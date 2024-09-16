import Input from "../../lib/input/input";
import GameObject from "../../lib/model/gameObject";
import RigidBody from "../../lib/rigidBody/rigidBody";
import { KEYCODE } from "../../lib/input/keyCode";
/**
 * 矩形
 */
export default class Rect extends GameObject{

    constructor(x: number, y: number, width: number, height: number, angle: number, ){
        super();
        this.name = "Rect"
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.angle = angle;
        this.gameObjectColor = "#f00"
        this.setRigid();
    }

    public setRigid(): void{
        const rb: RigidBody = new RigidBody( this, 0,  this.width, this.height, 0, 0);
        rb.id = this.id;
        rb.setGravity(false);
        // rb.setHandlePhysics(true);
        this.setRigidBody(rb);
    }

    public update(deltaTime: number): void {
        if(Input.getKeyDown(KEYCODE.C)){
            this.angle ++;
        }
        if(Input.getKeyDown(KEYCODE.Space)){
            this.angle --;
        }
        // if( Input.getHorizontalAxis())
        this.setX(this.x + Input.getHorizontalAxis()*5);
        this.setY(this.y + Input.getVerticallAxis()*5)
    }

    public fixedUpdate(deltaTime: number): void {

    }

    public collision(obj: GameObject): void {
        console.log("!!!!", obj.name, obj);
    }

}