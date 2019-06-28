
// baseUrl:http请求接口地址
const baseUrl = GameConfig.getBasicUrl();
// version:后台定义的游戏id
const app_code = GameConfig.getAppCode();
// app_code:后台定义的游戏版本号
const version = GameConfig.getVersion();


class Api {

    private static token: string;
    public static baseUrl = baseUrl;

    // api地址
    private static uploadRecordsPath = baseUrl + "/records"
    public static bestRecordPath = baseUrl + "/best_record"
    public static getRankingsPath = baseUrl + "/rankings"
    public static getShareUrlPath = baseUrl + "/share_url"
    public static getOpenIdPath = baseUrl + "/users"
    public static postEventPath = baseUrl + "/events"
    public static tunnelPath = baseUrl + "/tunnel"
    public static configurationsPath = baseUrl + "/configurations"

    public static async post(url, data) {
        return new Promise((resolve, reject) => {
            if (!Api.token) {
                reject('token为空，请重新登陆');
            }
            let request = new egret.HttpRequest();
            request.responseType = egret.HttpResponseType.TEXT;
            request.open(url, egret.HttpMethod.POST);
            request.setRequestHeader("Content-Type", "application/json");
            request.setRequestHeader("Authorization", Api.token);
            request.send(data);
            request.addEventListener(egret.Event.COMPLETE, function (evt: egret.Event) {
                let res = <egret.HttpRequest>evt.currentTarget;
                resolve(JSON.parse(res.response))
            }, this)
            request.addEventListener(egret.IOErrorEvent.IO_ERROR, function (evt: egret.IOErrorEvent) {
                reject(evt);
            }, this)
        })
    }

    public static async get(url,noToken?) {
        return new Promise((resolve, reject) => {
            if (!Api.token && !noToken) {
                reject('token为空，请重新登陆');
            }
            let request = new egret.HttpRequest();
            request.responseType = egret.HttpResponseType.TEXT;
            request.open(url, egret.HttpMethod.GET);
            request.setRequestHeader("Authorization", Api.token);
            request.send();
            request.addEventListener(egret.Event.COMPLETE, function (evt: egret.Event) {
                let res = <egret.HttpRequest>evt.currentTarget;
                resolve(JSON.parse(res.response))
            }, this)
            request.addEventListener(egret.IOErrorEvent.IO_ERROR, function (evt: egret.IOErrorEvent) {
                reject(evt);
            }, this)
        })
    }

    public static getToken(){
        return this.token;
    }

    /**
     * uploadRecords 上传成绩，调用后返回true即上传成功，返回false即上传失败
     * @param  {} record_data
     */
    public static async uploadRecords(record_data) {
        let result = true;
        await Api.post(Api.uploadRecordsPath, record_data).catch((e) => {
            result = false;
        });
        return result;
    }

    /**
     * getBestRecord 根据传入的时间范围，调用后返回传入时间范围内最佳成绩，如有错误，则返回null
     * @param  {} timeRange
     */
    public static async getBestRecord(timeRange) {
        let result = null;
        await Api.post(Api.bestRecordPath, timeRange).then((res) => {
            result = res;
        }).catch((e) => {
            result = null;
        });
        return result;
    }

    /**
     * getRankings 调用后返回世界排行榜数据，如有错误，则返回null
     * @param  {} timeRange
     */
    public static async getRankings() {
        let result = null;
        wx.showLoading({
            title: '排行榜加载中...',
            mask: true,
            success: () => { },
            fail: () => { },
            complete: () => { }
        });
        await Api.get(Api.getRankingsPath).then((res) => {
            result = res;
        }).catch((e) => {
            result = null;
        });
        wx.hideLoading();
        return result;
    }

    /**
     * getRankings 调用后返回分享图片链接，如有错误，则返回默认分享图地址
     * @param  {} timeRange
     */
    public static async getShareUrl() {
        let result = '';
        await Api.get(Api.getShareUrlPath).then((res: { url: string }) => {
            result = res.url;
        }).catch((e) => {
            result = '';
        });
        return result;
    }


    /**
     * 查询socket用的地址，return{tunnelId,connectUrl}
     */
    public static async getTunnel() {
        let result = null;
        await Api.get(Api.tunnelPath).then((res: { url: string }) => {
            result = res;
        }).catch((e) => {
            result = null;
        });
        return result;
    }


    // 事件类型字段                打开     单人游戏       上传成绩        重玩      分享           结果群排名     排行榜榜群排名  重生  
    private static event_type = ['open', 'singleGame', 'uploadScore', 'replay', 'normalShare', 'groupResult', 'groupRank', 'reborn'];

    /**
     * 事件埋点
     * @param  {number} event_type
     */
    public static async postEvent(event_type: any) {
        if(isNaN(event_type)){
            event_type = this.event_type.indexOf(event_type)+1;
        }else if(!this.event_type[event_type]){
            event_type = 0;
        }
        if(event_type == 0){
            throw new Error('事件传值不是预设的值');
        }
        Api.post(Api.postEventPath, { event_type: event_type });
    }

    /**
     * 查询版本控制情况
     */
    public static async getConfiguration() {
        let result = null;
        await Api.get(Api.configurationsPath + '?version=' + version + '&app_code=' + app_code,true)
            .then(res => { result = res[0]; })
            .catch(err => { console.warn(err) });
        return result;
    }


    /**
     * 登陆完成，获取token后调用以设置token
     * @param  {string} token
     */
    public static setToken(token: string) {
        Api.token = token;
    }
}