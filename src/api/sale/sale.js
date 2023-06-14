import request from "@/utils/request";
// 开始新的销售
export function makeNewSale(params) {
    return request({
        url: '/order/order/makeNewSale',
        method: 'get',
        params: params
    })
}
// 录入订单明细
export function enterItem(data) {
    return request({
        url: '/order/order/enterItem',
        method: 'post',
        data: data
    })
}
// 结束录入
export function endSale(data) {
    return request({
        url: '/order/order/endSale',
        method: 'post',
        data: data
    })
}

// 确认支付
export function makePayment(data) {
    return request({
        url: '/order/order/makePayment',
        method: 'post',
        data: data
    })
}


// 删除一行订单明细
export function deleteOrderItem(data) {
    return request({
        url: '/order/order/deleteOrderItem',
        method: 'post',
        data: data
    })
}

// 支付宝支付创建二维码
export function tradePrecreate(data) {
    return request({
        url: '/order/order/trade-precreate',
        method: 'post',
        data: data
    })
}

// 查询支付宝支付状态
export function tradeQuery(params) {
    return request({
        url: '/order/order/trade-query',
        method: 'get',
        params: params
    })
}

// 完成订单
export function completeOrder(params) {
    return request({
        url: '/order/order/completeOrder',
        method: 'get',
        params: params
    })
}

// 取消订单
export function cancelOrder(params) {
    return request({
        url: '/order/order/cancelOrder',
        method: 'get',
        params: params
    })
}

// 查询订单总数
export function getOrderCount() {
    return request({
        url: '/order/order/count',
        method: 'get'
    })
}

// 查询总销售额
export function getTotalSales() {
    return request({
        url: '/order/order/totalSales',
        method: 'get'
    })
}

// 暂挂订单
export function pendingOrder(data) {
    return request({
        url: '/order/order/pendingOrder',
        method: 'post',
        data: data
    })
}

// 获取订单
export function pickOrder(query) {
    return request({
        url: '/order/order/pickOrder',
        method: 'get',
        params: query
    })
}