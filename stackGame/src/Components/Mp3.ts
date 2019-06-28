/**
 * 音乐 声音类
 */
class Mp3 {
    /**
     * 播放声音
     * @param {string} sound 声音的资源名
     * @param {number} startTime 开始时间
     * @param {number} loop 是否循环次数，<=0无限循环
     */
   public static playSound(sound:string,startTime:number =0 ,loop:number = 1):void{
       let s:egret.Sound = RES.getRes(sound);
       s.play(startTime, loop);
   }
}