# wxgame
  小游戏分为两部分：游戏主域,开放数据域 离屏画布（即好友排行 群排行等）
 ## 游戏主体
    stackGame 
     游戏主入口Main.ts 进入游戏后 先调用loading 主要是为了加载游戏对应的资源文件,加载完成后创建场景，随即调用wx授权api(以前是自动授权，现在需要用户手动点击授权)
     resource：游戏ui,音乐文件资源 游戏主体渲染
     src
      Components:公用组件  wx调用api mp3的文件播放  网络请求http  公用方法utils
      GameData:游戏配置文件GameConfig 音乐资源配置 SoundRes 个人信息配置 userData
      view:游戏主体逻辑 GameMain
  ##排行榜
    openDataContext 开发数据域（本质是离屏画布无法对其进行操作，主要调用微信api 去拿好友排行榜和群排行榜 getFriendCloudStorage getGroupCloudStorage）
    主域调用开放数据域数据，调用WxKit.linkOpenData ,传入type决定获取数据类型为好友排行，群组排行

      
      

