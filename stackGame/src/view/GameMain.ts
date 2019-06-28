/**
 * 游戏主页
 *  Created by wk on 2018/5/12
 */

class GameMain extends eui.Component{

    /**
     * 游戏主体
     */
    private game:eui.Group;
    /**
     * 暂停
     */
    private pauseBtn: eui.Button;

    /**
     * 是否失败
     */
    private isLost:boolean = false;

    /**
     * 顶层容器
     */
    private towerGroup: eui.Group;

    /**
     * 当前楼层数
     */
    private floorNumber: number = 0;

    /**
     * 顶层移动速度
     */
    private speed:number=1800;

    /**
     * 顶层对象
     */
    private topFloor: egret.Bitmap;
    /**
     * 顶层x的距离
     */
    private topXPos: number; 
    /**
     * 顶层的宽度
     */
    private topWidth: number;

    /**
     * 新楼层既运动物体
     */
    private newFloor: egret.Bitmap;
    /**
     * 新楼层x距离
     */
    private newFloorXPos: number;  //新楼层x距离
    /**
     * 新楼层宽度
     */
    private newFloorWidth: number;  //新楼层宽度

    /**
     * 背景
     */
    private bg:eui.Image;
    
    /**
     * 掉落层
     */
    private fallingFloor: egret.Shape;
    private fallingFloorXPos: number;
    private fallingFloorWidth: number;
    
    /**
     * 掉落位置 true 左边 false 右边
     */
    private fallingPos:boolean; 

    /**
     * 计时器
     */
    private timer: egret.Timer;

    /**
     * 分数
     */
    private score :eui.Label;

    /**
     * 容器数组
     */
    private floorGp:any;

    /**
     * 选择角色按钮
     */
    private roleBtn:eui.Button;

    /**
     * 选择角色界面角色容器
     */
    private choseRole:eui.Group;

    /**
     * 选择人物
     */
     private radio100 :eui.RadioButton; //人物1
     private radio200 :eui.RadioButton; //人物2

    /**
     * 返回上一页按钮
     */
    private closeBtn:eui.Image;

    /**
     * 是否为完美重叠的次数
     */
    private perfetNum:number=0;

    public constructor() {
        super();

        this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.onCreateComplete, this);
        this.skinName = "resource/game_skins/GameMain.exml";
        this.width = GameConfig.stageWidth;
        this.height = GameConfig.stageHeight;
    }
     
    /**
     * 场景创造
     */
     private onCreateComplete(event: eui.UIEvent): void {
        this.removeEventListener(eui.UIEvent.CREATION_COMPLETE, this.onCreateComplete, this);
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickHandler, this);
        this.roleBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickHandler, this);
        this.game.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickHandler, this);
        this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickHandler, this);
        this.timer = new egret.Timer(100, 1);
        //注册事件侦听器
        this.timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE,this.timerComFunc,this);
        this.init();
     }

     /**
      * 游戏初始化
    */
     private init(): void{ 
        this.floorGp=['kongm_png','kongdd_png','konghq_png','konghq-y_png','kongm-y_png'];
        this.score.text='0';
        this.isLost=false;
        this.perfetNum=0;
        var shp0:egret.Shape = new egret.Shape();
        shp0.x = 165;
        shp0.y = 0;
        shp0.graphics.beginFill(0xff0000,0);
        shp0.graphics.drawRect(0,0,420,80);
        shp0.graphics.endFill();
        this.towerGroup.addChild( shp0 );
        this.topXPos = shp0.x;
        this.topWidth = shp0.width;

        this.floorNumber = 1;
        this.newFloor= this.createBitmapByName("kong_png");
        let rect1:egret.Rectangle = new egret.Rectangle(0,0,376,80);
        this.newFloor.scale9Grid =rect1;
        this.newFloor.width=shp0.width;
        this.newFloor.height=80;
        this.newFloor.x = 0;
        this.newFloor.y = -80;
        this.towerGroup.addChild(this.newFloor);
        this.floorMoveAnimation();
     }

     /**
    * 点击事件回调
    */
    private onClickHandler(event: egret.TouchEvent): void {
        event.stopPropagation();
        switch (event.currentTarget) {
            case this.pauseBtn:
                let panel = new eui.Panel();
                panel.title = "Title";
                panel.horizontalCenter = 0;
                panel.verticalCenter = 0;
                this.addChild(panel);
                break; 
            case this.roleBtn:
                 this.openRole();
                 console.log(123);
                break;  
            case this.closeBtn:
                this.comeBack();
                break;    
            case this.game:
                if(!this.isLost){
                    this.newFloorXPos = this.newFloor.x;
                    this.newFloorWidth = this.newFloor.width;
                    let difference =  this.topXPos - this.newFloorXPos;
                    egret.Tween.removeTweens(this.newFloor);
                    this.towerGroup.removeChild(this.newFloor);
                    if(difference > this.newFloorWidth || difference+this.newFloorWidth<0){ //左边失败并且无重叠或者右边失败无重叠
                        this.isLost = true;
                        this.fallingFloorXPos = this.newFloorXPos;
                        this.fallingFloorWidth = this.newFloorWidth;
                        this.perfetNum=0;
                        console.log('游戏结束')
                    }
                    else if( difference < this.newFloorWidth && difference >= GameConfig.stageWidth/100){ //成功左边掉
                        this.fallingPos = true;
                        this.topWidth = this.newFloorWidth - difference;
                        this.fallingFloorXPos = this.newFloorXPos;
                        this.fallingFloorWidth = difference;
                        this.perfetNum=0;
                         this.score.text=Number(this.score.text)+1+'';
                    }else if(difference<-GameConfig.stageWidth/100 && -difference <= this.topWidth){ //成功右边掉
                        this.fallingPos = false;
                        this.topWidth = this.topWidth + difference;
                        this.topXPos = this.newFloorXPos;
                        this.fallingFloorXPos = this.topXPos + this.topWidth;
                        this.fallingFloorWidth = -difference;
                        this.perfetNum=0;
                        this.score.text=Number(this.score.text)+1+'';
                    }else{                 //完美叠
                        this.fallingFloorWidth =0;
                        this.perfetNum++;
                        this.score.text=Number(this.score.text)+1+'';
                    }
                    this.floorAnimation();
                }else{
                    console.log(this.isLost);
                }
                break;
        }
    }
    
    /**
     * 选择人物
     */
    /**
     * radio button切换选择
     */
    private onRadioChangeHandler(event: eui.UIEvent): void {
         event.stopPropagation();
        if(Number(event.currentTarget.value)==100){
            this.radio100.visible=true;
            this.radio200.visible=false; 
        }
        if(Number(event.currentTarget.value)==200){
            this.radio200.visible=true;
            this.radio100.visible=false; 
        }
    }
    /**
    * 生成叠层
    */
    private floorAnimation(): void{
        let randName=this.floorGp[Math.round(Math.random()*4)];
        console.log('连续完美重叠次数：'+this.perfetNum);
        if(!this.isLost){
            if(this.floorNumber%2==0 && this.newFloor.width >GameConfig.stageWidth/10){
                this.topFloor = this.createBitmapByName("home_png");
                let rect:egret.Rectangle = new egret.Rectangle(60,0,376,80);
                this.topFloor.scale9Grid =rect;
                this.topFloor.x = this.topXPos-60;
                this.topFloor.y = -this.floorNumber*80;
                this.topFloor.width= this.topWidth+120;
                this.topFloor.height=80;
                this.towerGroup.addChild(this.topFloor);
            }else{
                this.topFloor=this.createBitmapByName(randName);
                this.topFloor.x = this.topXPos;
                this.topFloor.y = -this.floorNumber*80;
                this.topFloor.width= this.topWidth;
                this.topFloor.height=80;
                this.towerGroup.addChild(this.topFloor);
            }
            egret.Tween.get(this.towerGroup ).to({y:this.towerGroup.y + 40}, 200);
            this.timer.start();
        }
        
        this.fallingFloor =  new egret.Shape();
        this.fallingFloor.x = this.fallingFloorXPos;
        this.fallingFloor.y = -this.floorNumber*80;
        this.fallingFloor.graphics.beginFill( 0xff0000, 1);
        this.fallingFloor.graphics.drawRect( 0, 0, this.fallingFloorWidth, 80);
        this.fallingFloor.graphics.endFill();
        this.towerGroup.addChild( this.fallingFloor );
        let fallingFloorOffsetX,fallingFloorRotation;
        if(this.fallingPos){
            fallingFloorOffsetX = this.fallingFloor.x - 50;
            fallingFloorRotation = -30;
        }else{
            fallingFloorOffsetX = this.fallingFloor.x + 50;
            fallingFloorRotation = 30;
        }
        egret.Tween.get( this.fallingFloor ).to({x: fallingFloorOffsetX, rotation: fallingFloorRotation}, 100).to({y:  this.fallingFloor.y + 200, alpha: 0,}, 500).call( () => {
             this.towerGroup.removeChild( this.fallingFloor )
        } );
        
    }

    /**
    * 计时结束下一轮
    */
    private timerComFunc(): void {
        let isTrue=Math.round(Math.random());
        let isRight;       
        this.floorNumber++;
        this.newFloor= this.createBitmapByName("kong_png");
        let rect1:egret.Rectangle = new egret.Rectangle(0,0,376,80);
        this.newFloor.scale9Grid =rect1;
        this.newFloor.width=this.topWidth;
        this.newFloor.height=80;
        if(isTrue){
            this.newFloor.x = 0;
            isRight=true;
        }else{
            this.newFloor.x =GameConfig.stageWidth-this.newFloor.width;
            isRight=false;
        }
        this.newFloor.y = -this.floorNumber*80;
        this.towerGroup.addChild(this.newFloor); 
        if(this.perfetNum>0){
           this.speed=(1.8-0.015*(this.floorNumber-1))*1000;
        }else{
           this.speed=(1.8-0.015*(this.floorNumber-1))*1000*(GameConfig.stageWidth-this.newFloor.width)/(GameConfig.stageWidth*0.56)
        }
        this.floorMoveAnimation(this.speed,isRight);
    }
   

    /**
     * 楼层移动
     */
    private floorMoveAnimation(speed:number=1800,isRight:boolean=true):void{
        console.log(speed);
        if(isRight){
            egret.Tween.get(this.newFloor,{loop:true}).to({x: GameConfig.stageWidth-this.newFloor.width},speed)
                                                .to({x:0},speed)
        }else{
             egret.Tween.get(this.newFloor,{loop:true}).to({x:0},speed)
                                                .to({x:GameConfig.stageWidth-this.newFloor.width},speed)
        }       
    }

    /**
     * 打开选择角色界面
     */
    private openRole():void{
         this.choseRole.visible=true;
         egret.Tween.get(this.choseRole).to({alpha:1},300);
    }

    /**
     * 返回主页面
     */
    private comeBack():void{
        egret.Tween.get(this.choseRole).to({alpha:0},300).call(()=>{
            this.choseRole.visible=false;
        });
    }
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name: string): egret.Bitmap {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }
     
}