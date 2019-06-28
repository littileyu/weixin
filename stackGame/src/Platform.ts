/** 
 * 平台数据接口。
 * 由于每款游戏通常需要发布到多个平台上，所以提取出一个统一的接口用于开发者获取平台数据信息
 * 推荐开发者通过这种方式封装平台逻辑，以保证整体结构的稳定
 * 由于不同平台的接口形式各有不同，白鹭推荐开发者将所有接口封装为基于 Promise 的异步形式
 */
declare interface Platform {
    getFriendCloudStorage(): Promise<any>;
    
    getUserInfo(): Promise<any>;

    login(): Promise<any>;

    auth(jsCode: String, iv: String, encryptedData: String): Promise<any>;

    setKVData(data): Promise<any>;

    showAuthModal():Promise<any>;

}

class WxPlatform implements Platform {

    name = 'wxgame'
    header = {}
    

    // 开放域获取好友排行
    public async getFriendCloudStorage() {
        return new Promise((resolve, reject) => {
            wx.getFriendCloudStorage({
                keyList: ["socre", "date"],
                success: (res) => {
                    console.log(res);
                    resolve(res);
                },
                fail(err) {
                    reject(err);
                }
            })
        })
    }

    
    public async setKVData(data) {
        return new Promise((resolve, reject) => {
            let dataList = [];
            for (let key in data) {
                dataList.push({ key: key, value: data[key] });
            }
           
        });
    }


    public async login() {
        return new Promise((resolve, reject) => {
            wx.showLoading({
                title: '游戏加载中...',
                mask: true
            })
            wx.login({
                success: (res) => {
                    resolve(res);
                     wx.hideLoading();
                }, fail: (err) => {
                    reject(err);
                    wx.hideLoading();
                }
            });
        });
    }

   
    public async getUserInfo() {
        return new Promise((resolve, reject) => {
            wx.getUserInfo({
                lang:'zh_CN',
                success: function (res) {
                    var userInfo = res.userInfo
                    var nickName = userInfo.nickName
                    var avatarUrl = userInfo.avatarUrl
                    var gender = userInfo.gender //性别 0：未知、1：男、2：女
                    var province = userInfo.province
                    var city = userInfo.city
                    var country = userInfo.country
                    userInfo.encryptedData = res.encryptedData;
                    userInfo.iv = res.iv;
                    console.log(res.openId)
                    resolve(userInfo);
                }, fail: function (err) {
                    reject(err);
                }
            });
        });
    }
    
     public async auth(jsCode, iv, encrytedData) {
        return new Promise((resolve, reject) => {
            let data = {
                code:jsCode,
                iv: iv,
                encryptedData: encrytedData
            }
            let that = this
            wx.request({
                url: Api.baseUrl + '/json/10101.do',
                method: 'POST',
                data: data,
                header: {'content-type':'application/x-www-form-urlencoded'},
                success: function (res) {
                    that.header = {
                        Authorization: res.data.token
                    }
                    wx.hideLoading()
                    resolve(res)
                },
                fail: function (err) {
                    reject(err);
                }
            });
        });
    }

    public  async showAuthModal() {
        wx.hideLoading();
        return new Promise((resolve, reject) => {
            wx.showModal({
                title: '提示',
                content: '请您进行登陆授权',
                showCancel: false,
                cancelText: '',
                confirmText: '去授权',
                success: function (res) {
                    wx.openSetting({
                        success: function (result) {
                            resolve(result);
                        },
                        fail: function (err) {
                            reject(err);
                        }
                    })

                },
            })
        })
    }
}


if (!window.platform) {
    window.platform = new WxPlatform();
}



declare let platform: Platform;

declare interface Window {

    platform: Platform
}





