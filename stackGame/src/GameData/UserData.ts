/**
 * 个人信息模块
 */
class UserData{
    private static openId:string; //openId
    private static id:string;     //个人id
    private static avatar_url:string; //头像
    private static nickname:string;  //昵称
    private static gender:string; //性别
    private static userInfo:{} 


    public static getOpenId(){
        return this.openId;
    }

    public static getId(){
        return this.id;
    }

    public static getUserData(){
        return JSON.parse(JSON.stringify(this.userInfo));
    }

    public static setUserData(userData:{avatar_url,id,nickname,gender,open_id}){  //保存个人信息
        this.avatar_url = userData.avatar_url;
        this.openId = userData.open_id;
        this.nickname = userData.nickname;
        this.gender = userData.gender;
        this.id = userData.id;
        this.userInfo = userData;
    }
}