// import GameBase from "lib/interface/gameBase";
// import Global from "../../lib/public/Global";
// import Point from "../../lib/model/point";
// /**
//  * 阳光
//  */
// export default class Sunshine {
//     // 列
//     public column: number = -1; 
//     // 行
//     public row: number = -1;
//     // 背景
//     public bg: any = document.createElement("div"); 
//     // 阳光类型， 0小阳光 1中阳光 2 大阳光
//     private type: number = 0;
//     // 存活时间，设定为10秒
//     private life: number = 15000;
//     private lifeTimer: any = null;
//     // 位置列表
//     private poisitionList: Array<Point> = [
//         new Point(0,  0 ),
//         new Point(30, 30),
//         new Point(30, 0),
//         new Point(-10,  30),
//     ]
//     // 构造器
//     constructor( args:{ row: number; column: number; type: number; positionType: number } ){
//         this.type = args.type;
//         this.column = args.column;
//         this.row = args.row;
//         this.initView(args.positionType);
//         // 调用 死亡方法
//         this.death(1);
//     }
    
//     /**
//      * 获取阳光值
//      * @returns 阳光值
//      */
//     getSunshineValue(): number{
//         let result: number = -1;
//         switch( this.type ){
//             case 0:
//                 result = 25;
//                 break;
//             case 1:
//                 result = 50;
//         }
//         // 马上消失
//         this.death(0);
//         return 50
//     }

//     /**
//      * 死亡方法
//      * @param { number } type 0 马上死亡， 1自然死亡
//      */
//     death(type: number): void{
//         if(type == 0){
//             document.body.removeChild(this.bg);
//             clearTimeout(this.lifeTimer);
//         }else{
//             this.lifeTimer = setTimeout(()=>{
//                 document.body.removeChild(this.bg);
//             }, this.life);
//         }
//     }

//     /**
//      * 初始化DOM 
//      * @param { number } poisitionType 出生位置
//      */
//     initView( poisitionType: number ): void{
//         // 设置类名
//         this.bg.setAttribute("class", `sunshine sunshine${this.type}`);
//         // 添加点击事件 (直接引用的话，会导致getSunshineValue里面的this指向错误，所以用箭头函数包裹着)
//         this.bg.addEventListener( "click",()=>(this.getSunshineValue()) );
//         // 设置位置
//         this.bg.style.left = `${this.row * Global.BLOCK_SIZE + Global.BASE_X_Offset + Global.BASE_PLANT_X_Offset + this.poisitionList[poisitionType].X}px`;
//         this.bg.style.top = `${this.column * Global.BLOCK_SIZE + Global.BASE_Y_Offset + Global.BASE_PLANT_Y_Offset + this.poisitionList[poisitionType].Y}px`;

//         // 放进去
//         document.body.append(this.bg);
//     }
// }