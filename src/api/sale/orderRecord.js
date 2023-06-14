import request from "@/utils/request";
// 查询所有订单
export function listOrderByPage(query) {
    return request({
        url: '/order/order/queries',
        method: 'get',
        params: query
    })
}

// 根据id查询订单

export function getOrder(id) {
    return request({
        url: `/order/order/${id}`,
        method: "get",
    })
}

// 根据id删除订单
export function delOrder(id){
    return request({
        url: `/order/order/${id}`,
        method: "delete"
    })
}

// 退货
export function returnOrderItem(data) {
    return request({
        url: '/order/order/returnOrderItem',
        method: 'post',
        data: data
    })
}