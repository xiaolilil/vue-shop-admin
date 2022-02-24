import { createRouter, createWebHistory } from 'vue-router'
import { getToken } from '@/utils/setMsg.js'
import routes from './routes.js'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const router = createRouter({
    history: createWebHistory(),
    // scrollBehavior: () => ({
    //     y: 0
    // }),
    routes
})


//白名单
// const whiteList = ['/login']



router.beforeEach((to, from,next) => {
    NProgress.start();
    if(getToken('token') && getToken('token') != null){
        if(to.path == '/login'){
            next('/home')
        }else{
            next()
        }
    }else{
        if( to.path == '/login'){
            next();
        }else {
            next('/login')
        }
    }
})



//路由进入完毕：关闭进度条
router.afterEach(() => {
    // 关闭进度条动画
    NProgress.done();

});

export default router