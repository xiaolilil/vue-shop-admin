import { request } from './request.js'

export function _getGoodsList(data) {
    return request({
        url: 'goods',
        params: data,
    })
}

export function _addGoods(data) {
    return request({
        url: 'goods',
        method:'post',
        params: data,
    })
}

export function _deleteGoods(id) {
    return request({
        url: `goods/${id}`,
        method:'delete',
    })
}

export function _editGoods(id,data) {
    return request({
        url: `goods/${id}`,
        method:'put',
        data
    })
}

export function _searchGoods(id) {
    return request({
        url: `goods/${id}`,
    })
}



// 添加商品 路由

export function _getCateList() {
    return request({
        url: `categories`,
    })
}


// 获取商品分类参数
export function _getCateManyParams(cateId) {
    return request({
        url: `categories/${cateId}/attributes`,
        params:{sel:"many"}
    })
}

export function _getCateOnlyParams(cateId) {
    return request({
        url: `categories/${cateId}/attributes`,
        params:{sel:"only"}
    })
}

export function _upload(data) {
    return request({
        url: `upload`,
        method:'post',
        data
    })
}


// 添加商品
export function _addShop(data) {
    return request({
        url: 'goods',
        method:'post',
        data:data
    })
}