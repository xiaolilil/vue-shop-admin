import { request } from './request.js'

export function _users(v) {
    return request({
        url: 'users',
        params: {
            query: v.query,
            pagenum: v.pagenum,
            pagesize:v.pagesize
        }
    })
}

export function _userInfo(v) {
    return request({
        url: `users/${v}`,
    })
}


export function _addUser(v) {
    return request({
        url: 'users',
        method:'post',
        data: v

    })
}

export function _state(id,type) {
    return request({
        url: `users/${id}/state/${type}`,
        method:'put'
    })
}


export function _editUser(v) {
    return request({
        url: `users/${v.id}`,
        method:'put',
        data:{
            email: v.email,
            mobile:v.mobile
        }
    })
}

export function _deleteUser(id) {
    return request({
        url: `users/${id}`,
        method:'delete'
    })
}


export function _roles() {
    return request({
        url: 'roles',
        params: {
        }
    })
}

export function _serachUser(id) {
    return request({
        url: `users/${id}`,
        method:'put'
    })
}


export function _allotUser(id,rid) {
    return request({
        url: `users/${id}/role`,
        method:'put',
        data:{
            rid:rid
        }
    })
}