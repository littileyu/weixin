/**
 * 封装微信小游戏api方法
 * 
 */
 const PLATFORM: WxPlatform = new WxPlatform();

class WxKit {

    /**
     * 调用login完成getUserInfo版登陆操作
     */
    public static async login() {
        let code = null;
        let userInfo = null;
        let result = null;
        await PLATFORM.login()
            .then((res: { code?}) => { code = res.code })
            .catch(err => { console.warn(err) });
        await PLATFORM.getUserInfo()
            .then((res: { iv?, enctypecode?}) => { userInfo = JSON.parse(JSON.stringify(res)) })
            .catch(async err => {
                await WxKit.reAuth()
                    .then((res: { iv?, encryptedData?}) => { userInfo = JSON.parse(JSON.stringify(res)) });
            })
        await PLATFORM.auth(code, userInfo.iv, userInfo.encryptedData)
            .then(res => { result = JSON.parse(JSON.stringify(res));})
            .catch(err => { console.warn(err) });
        Api.setToken(result.data.data.token);
        UserData.setUserData(result.data.data);
        console.log('数据:'+result.data.data.token);
        // Api.postEvent('open');
        console.log('login_success');
        return result;    
    }

    /**
     * getUserInfo授权失败时重新弹出需授权弹窗,若拒绝则继续弹出
     */
    private static async reAuth() {
        wx.hideLoading();
        return new Promise((resolve, reject) => {
            PLATFORM.showAuthModal()
                .then(async (res: { authSetting }) => {
                    if (res.authSetting['scope.userInfo']) {
                        await PLATFORM.getUserInfo().then(res => { resolve(res); })
                    } else {
                        await WxKit.reAuth().then(res => { resolve(res); });
                    }
                })
        })
    }

    /**
     * 设置默认分享
     */
    public static setDefaultShare() {
        console.log('share');
        wx.showShareMenu({
            withShareTicket: true,
            success: void (0),
            fail: void (0)
        });
        wx.onShareAppMessage(function(){
            return {
                title: GameConfig.shareTitle,
                imageUrl: GameConfig.shareImg
            }
        });
    }  
    /**
     * 开发数据域
     */
     public static linkOpenData(message: {}, width?: number, height?: number) {
        let basic = {
            isDisplay: "true",
            token: Api.getToken(),
            userInfo: UserData.getUserData()
        }

        for (let key in message) {
            basic[key] = message[key];
            console.log('开发数据的键值对：'+message)
        }

        let open_data_container = new egret.Sprite();
        let openDataContext = wx.getOpenDataContext();
        const bitmapdata = new egret.BitmapData(window["sharedCanvas"]);
        bitmapdata.$deleteSource = false;
        const texture = new egret.Texture();
        texture._setBitmapData(bitmapdata);
        let bitmap: egret.Bitmap;
        bitmap = new egret.Bitmap(texture);
        bitmap.width = width || GameConfig.stageWidth;
        bitmap.height = height || GameConfig.stageWidth;
        bitmap.name = "openData";
        open_data_container.addChild(bitmap);

        egret.startTick((timeStarmp: number) => {
            egret.WebGLUtils.deleteWebGLTexture(bitmapdata.webGLTexture);
            bitmapdata.webGLTexture = null;
            return false;
        }, this);
       
        openDataContext.postMessage({
            isDisplay: "true",
            text: 'hello',
            year: (new Date()).getFullYear()
        });
        console.log(23456)

        return open_data_container;
    }
}




