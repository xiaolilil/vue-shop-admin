import { request } from './request.js'

export function _getOrderList(params) {
    return request({
        url: 'orders',
        params
    })
}

export function _getWuli() {
    return request({
        url: 'kuaidi/1106975712662',
    })
}