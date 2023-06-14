import request from '@/utils/request'
// 根据spuId查询
export function getAttrKeyBySpuId(spuId) {
    return request({
        url: `/product/attrKey/getAttrKeyBySpuId/${spuId}`,
        method: "get",
    })
}
// 分页查询
export function getAttrKeyByPage(data) {
    return request({
        url: `/product/attrKey/queries`,
        method: "get",
        params:data
    })
}
