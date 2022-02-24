import { setToken,getToken } from '@/utils/setMsg.js'
// token值存入浏览器，在外部封装存取token的方法， 然后导入只在这里或者是路由拦截中使用



const state = {
    userInfo:{
        userId:'',
        username:'',
        userHeadImg:'',
        mobile:''
    },
    token:{
        // token
        token:'' || getToken('token') ,// 调用将token存入浏览器的方法
        // token过期时间 （自己起名）

        // token验证 （自己起名）
    }
}


const getters = {
    menus: state => {
        return state.userInfo;
    },
    token: state => {
        return state.token;
    }
};

const mutations = {
    // 登录成功或是重新登陆，更新state的个人信息
    // 清空时传入空字符串
    setToken(state,tokenObj){
        // 规定这里设置传入token
        state.token.token = tokenObj.token;
        // 规定这里设置token过期时间
        
        // 调用将token存入浏览器的方法
        setToken('token',tokenObj.token)
        state.userInfo.username = tokenObj.username;
        state.userInfo.userId = tokenObj.id;
        state.userInfo.mobile = tokenObj.mobile;

    }
};

const actions = {

};


export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};