import axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/setMsg.js'
import store from '../store'

// http://127.0.0.1:8888/api/private/v1/
const baseURL = 'https://lianghj.top:8888/api/private/v1/'

// const baseURL = 'http://127.0.0.1:8888/api/private/v1/'



let ajaxTimer = 0;
export function request(config) {
    const http = axios.create({
        baseURL,
        timeOut: 5000
    });
    http.interceptors.request.use(data => {
        ajaxTimer++;
        NProgress.start()
        const token = store.state.user.token.token || getToken("token");
        // console.log(token)
        // if (token != undefined || token != '' || token != null) {
        //     config.headers.Authorization = token
        // }
        data.headers.Authorization = token
        return data;
    }, err => {
        return err
    });
    http.interceptors.response.use(data => {
        ajaxTimer--;
        NProgress.done()
        return data;
    }, err => {
        throw err;
        return err;
    });
    return http(config);

}



// Vue.prototype.$http = axios



// axios.interceptors.request.use(config => {
//         NProgress.start()
//         config.headers.Authorization = window.sessionStorage.getItem('token')
//         return config
//     })
// axios.interceptors.response.use(config => {
//     NProgress.done()
//     return config
// })