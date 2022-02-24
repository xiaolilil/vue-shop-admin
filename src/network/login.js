import { request } from './request.js'

export function _login(data) {
    return request({
        url: 'login',
        params: data,
        method:'post'
    })
}

export function _menu() {
    return request({
        url: 'menus',
        query: {

        }
    })
}