import request from '@/utils/request'

// 分页查询列表
export function listSpuByPage(query) {
    return request({
        url: "/product/spuInfo/queries",
        method: "get",
        params: query
    })
}
// 根据id查询列表
export function listSpuById(id) {
    return request({
        url: `/product/spuInfo/${id}`,
        method: "get",
    })
}
// 分页查询列表
export function addProduct(data) {
    return request({
        url: "/product/spuInfo",
        method: "post",
        data: data
    })
}
// 更新产品类别
export function updateProduct(data){
    return request({
        url: "/product/spuInfo",
        method: "put",
        data: data
    })
}
// 删除产品类别
export function delProduct(id){
    return request({
        url: `/product/spuInfo/${id}`,
        method: "delete",
    })
}