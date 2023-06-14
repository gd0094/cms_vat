import request from '@/utils/request'

// 分页查询oss列表
export function listOssByPage(query) {
    return request({
        url: '/system/oss/queries',
        method: 'get',
        params: query
    })
}

// 查询oss
export function getOss(id) {
    return request({
        url: `/system/oss/${id}`,
        method: 'get'
    })
}

// 新增oss
export function addOss(data) {
    return request({
        url: '/system/oss/upload',
        method: 'post',
        data: data
    })
}

// 修改oss
// export function updateOss(data) {
//     return request({
//         url: '/system/oss',
//         method: 'put',
//         data: data
//     })
// }

// 删除oss
export function deleteOss(id) {
    return request({
        url: `/system/oss/${id}`,
        method: 'delete'
    })
}