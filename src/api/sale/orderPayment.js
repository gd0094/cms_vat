import request from "@/utils/request";
// 查询所有订单
export function listPaymentByPage(query) {
    return request({
        url: '/order/orderPayment/queries',
        method: 'get',
        params: query
    })
}
