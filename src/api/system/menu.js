import request from '@/utils/request'
// 查询menu列表
export function listMenu(query) {
    return request({
        url: '/system/menu/list',
        method: 'get',
        params: query
    })
}

// 获取所有目录+菜单
export function treeMenu() {
    return request({
        url: '/menu/tree',
        method: 'get'
    })
}

// 查询menu
export function getMenu(menuId) {
    return request({
        url: '/system/menu/' + menuId,
        method: 'get'
    })
}

// 根据roleId查询菜单
export function getMenusByRoleId(roleId) {
    return request({
        url: '/system/menu/getMenusByRoleId/' + roleId,
        method: 'get'
    })
}

// 新增menu
export function addMenu(data) {
    return request({
        url: '/system/menu',
        method: 'post',
        data: data
    })
}

// 修改menu
export function updateMenu(data) {
    return request({
        url: '/system/menu',
        method: 'put',
        data: data
    })
}

// 删除menu
export function deleteMenu(menuId) {
    return request({
        url: '/system/menu/' + menuId,
        method: 'delete'
    })
}