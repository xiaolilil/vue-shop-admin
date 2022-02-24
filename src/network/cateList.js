import { request } from './request.js'

export function _getCateList(params) {
    return request({
        url: `categories`,
        params
    })
}

// 获取当前分类的信息
export function _getCateInfo(id) {
    return request({
        url: `categories/${id}`,
    })
}

// 修改分类
export function _editCate(data) {
    return request({
        url: `categories/${data.id}`,
        method:'put',
        data:{cat_name: data.cat_name}
    })
}


export function _deleteCate(id) {
    return request({
        url: `categories/${id}`,
        method:'delete',
    })
}





// 获取当前分类的参数
export function _getAttrs(cateId,id,params) {
    return request({
        url: `categories/${cateId}/attributes/${id}`,
        method:'get',
        params
    })
}

// 编辑参数
export function _editAttrs(cateId,editForm,activeName) {
    return request({
        url: `categories/${cateId}/attributes/${editForm.attr_id}`,
        method:'put',
        data:{
            attr_name: editForm.attr_name,
            attr_sel: activeName
        }
    })
}


// 添加参数
export function _addAttrs(cateId,addForm,activeName) {
    return request({
        url: `categories/${cateId}/attributes`,
        method:'post',
        data:{
            attr_name: addForm.attr_name,
            attr_sel: activeName
        }
    })
}

// 删除参数
export function _deleteAttrs(cateId,id) {
    return request({
        url: `categories/${cateId}/attributes/${id}`,
        method:'delete',
    })
}


// 添加新参数
export function _addNewAttrs(cateId,that) {
    return request({
        url: `categories/${cateId}/attributes/${that.attr_id}`,
        method:'put',
        data:{
            attr_name: that.attr_name,
            attr_sel: that.attr_sel,
            attr_vals: that.attr_vals.join(' ')
        }
    })
}