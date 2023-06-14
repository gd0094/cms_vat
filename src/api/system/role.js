import request from '@/utils/request'

// 查询所有role
export function listAllRole() {
    return request({
        url: '/system/role/listAll',
        method: 'get'
    })
}

// 分页查询role列表
export function listRoleByPage(query) {
    return request({
        url: '/system/role/queries',
        method: 'get',
        params: query
    })
}

// 查询role
export function getRole(id) {
    return request({
        url: '/system/role/' + id,
        method: 'get'
    })
}

// 根据userID查询role
export function getRolesByUserId(id) {
    return request({
        url: '/system/role/getRolesByUserId/' + id,
        method: 'get'
    })
}

// 新增role
export function addRole(data) {
    return request({
        url: '/system/role',
        method: 'post',
        data: data
    })
}

// 修改role
export function updateRole(data) {
    return request({
        url: '/system/role',
        method: 'put',
        data: data
    })
}

// 删除role
export function deleteRole(id) {
    return request({
        url: '/system/role/' + id,
        method: 'delete'
    })
}

// 保存授权菜单
export function authMenu(data) {
    return request({
        url: '/system/role/authMenu',
        method: 'post',
        data: data
    })
}

