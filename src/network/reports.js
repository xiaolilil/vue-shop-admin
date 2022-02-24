import { request } from './request.js'

// 角色列表
export function _getData() {
    return request({
        url: 'reports/type/1',
    })
}
