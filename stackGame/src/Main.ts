//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
class Main extends eui.UILayer {
    
    protected createChildren(): void {
        super.createChildren();

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }

        //inject the custom material parser
        //注入自定义的素材解析器
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());

        GameConfig.stageWidth = this.stage.stageWidth;
        GameConfig.stageHeight = this.stage.stageHeight;
       
        this.runGame().catch(e => {
            console.log(e);
        })
    }

    
   

    private async runGame() {
        await this.loadResource()
        this.createGameScene();
        const result = await RES.getResAsync("description_json")
        await WxKit.login();
        const userInfo = await platform.getUserInfo();
        console.log(userInfo);
        console.log(123);

    }

    private async loadResource() {
        try {
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            await RES.loadConfig("resource/default.res.json", "resource/");
            await this.loadTheme();
            await RES.loadGroup("preload", 0, loadingView);
            this.stage.removeChild(loadingView);
        }
        catch (e) {
            console.error(e);
        }
    }

    private loadTheme() {
        return new Promise((resolve, reject) => {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            let theme = new eui.Theme("resource/default.thm.json", this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, () => {
                resolve();
            }, this);

        })
    } 
   
   


    /**
     * 创建场景界面
     * Create scene interface
     */
    protected createGameScene(): void {
          // 设置默认分享
        WxKit.setDefaultShare();  
        let scene = new GameMain();
        this.addChild(scene); 

         // 调用开放数据域获取好友排行榜
        let friend_ranking_btn = eKit.createSprite({ x: 20, y: 500 });
        this.addChild(friend_ranking_btn);
        let friend_ranking_btn_bg = eKit.createRect([0, 0, 120, 60], { beginFill: { color: 0x9988ff, alpha: 1 } }, { touchEnabled: true });
        friend_ranking_btn.addChild(friend_ranking_btn_bg);
        friend_ranking_btn.addChild(eKit.createText('好友排行榜', { width: 120, height: 60, size: 20, textAlign: 'center', verticalAlign: 'middle' }));
        friend_ranking_btn_bg.addEventListener(egret.TouchEvent.TOUCH_TAP, async () => {
            let open_data:egret.Sprite = WxKit.linkOpenData({});
            // this.addChild(open_data);
            // console.log('开放数据域：'+open_data[0])
        }, this);
        // 播放背景音乐
        Mp3.playSound('bgm_mp3', 0, -1);
       
    }
    
   
}
