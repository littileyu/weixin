/**
 * 音频资源配置
 */
class SoundRes{
    // 定义事件音乐路径，Mp3.playEvent调用name即可播放对应path的音乐
    public static eventSoundList = [
        {name:'end',path:'resource/assets/mp3/end.mp3'},
        {name:'explode3',path:'resource/assets/mp3/explode3.mp3'},
        {name:'five1',path:'resource/assets/mp3/five1.mp3'},
        {name:'five2',path:'resource/assets/mp3/five2.mp3'},
        {name:'five3',path:'resource/assets/mp3/five3.mp3'},
        {name:'five4',path:'resource/assets/mp3/five4.mp3'},
        {name:'five5',path:'resource/assets/mp3/five5.mp3'},
        {name:'Notperfect',path:'resource/assets/mp3/Notperfect.mp3'},
    ];

    // 定义背景音乐路径
    public static bgm:string = 'resource/assets/BgM/bgm.mp3'
}