import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 引入上面新建的路由文件
import router from './router/index.js'

import store from './store/index.js'

import './network/request.js'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'

import { message } from '@/utils/resetMessage.js' 


const app = createApp(App)
app.config.globalProperties.$msg = message;


//使用路由
app.use(router)
app.use(store)
app.use(ElementPlus, {
    locale: zhCn,
})
app.use(VXETable)
app.mount('#app')
