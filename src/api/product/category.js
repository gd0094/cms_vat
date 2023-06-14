import request from '@/utils/request'
import { getToken } from "@/utils/auth";

// 查询列表
export function listByPage(data) {
    return request({
        url: "/product/category/queries",
        method: "get",
        params: data
    })
}
// 根据id查询列表
export function listById(id){
    return request({
        url: `/product/category/${id}`,
        method: "get",
    })
}
// 添加产品类别
export function addCategory(data){
    return request({
        url: "/product/category",
        method: "post",
        data: data
    })
}
// 更新产品类别
export function updateCategory(data){
    return request({
        url: "/product/category",
        method: "put",
        data: data
    })
}
// 删除产品类别
export function delCategory(id){
    return request({
        url: `/product/category/${id}`,
        method: "delete",
    })
}

// 导出类别
export function exportExcel(){
    return request({
        url: `/product/category/export`,
        method: "get",
        responseType: 'blob', 
        headers: { Authorization: "Bearer " + getToken() }
    })
}

// 导入模板
export function templateExcel(){
    return request({
        url: `/product/category/template`,
        method: "get",
        responseType: 'blob', 
        headers: { Authorization: "Bearer " + getToken() }
    })
}
