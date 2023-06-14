import request from '@/utils/request'
import { getToken } from "@/utils/auth";

// 分页查询列表
export function listProductByPage(query) {
    return request({
        url: "/product/skuInfo/queries",
        method: "get",
        params: query
    })
}
// 根据id查询
export function listProductById(id) {
    return request({
        url: `/product/skuInfo/${id}`,
        method: "get",
    })
}
//  添加具体商品
export function addProduct(data) {
    return request({
        url: "/product/skuInfo",
        method: "post",
        data: data
    })
}
//  更新具体商品
export function updateProduct(data) {
    return request({
        url: "/product/skuInfo",
        method: "put",
        data: data
    })
}

// 查询库存总数
export function getStockCount() {
    return request({
        url: '/product/skuInfo/count',
        method: 'get'
    })
}

// 根据id查询
export function delProductById(id) {
    return request({
        url: `/product/skuInfo/${id}`,
        method: "delete",
    })
}

// 导出库存信息
export function exportExcel(){
    return request({
        url: `/product/skuInfo/export`,
        method: "get",
        responseType: 'blob', 
        headers: { Authorization: "Bearer " + getToken() }
    })
}