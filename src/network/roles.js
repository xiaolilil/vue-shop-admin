import { request } from './request.js'

// 角色列表
export function _roles() {
    return request({
        url: 'roles',

    })
}

// 添加角色
export function _addRoles(data) {
    return request({
        url: 'roles',
        method:'post',
        data
    })
}

// 获取对应ID角色列表
export function _getRoles(id) {
    return request({
        url: `roles/${id}`,
    })
}

// 编辑角色
export function _editRoles(id,data) {
    return request({
        url: `roles/${id}`,
        method:'put',
        data
    })
}

// 删除角色
export function _deleteRoles(id) {
    return request({
        url: `roles/${id}`,
        method:'delete',
    })
}

// 获取权限树列表  树状显示权限
export function _tree() {
    return request({
        url: `rights/tree`,
        method:'get',
    })
}

// 编辑树形列表数据
export function _allotRights(id,v) {
    return request({
        url: `roles/${id}/rights`,
        method:'post',
        data:{rids:v}
    })
}

// 删除一级权限
export function _deleteRights1(roleId,rightsId) {
    return request({
        url: `roles/${roleId}/rights/${rightsId}`,
        method:'delete'
    })
}








//   =====   rights   =====

// 获取权限列表
export function _getRightsList() {
    return request({
        url: `rights/list`,
    })
}