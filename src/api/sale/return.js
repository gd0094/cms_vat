import request from "@/utils/request";

// 根据orderItemId查询退货记录
export function getReturnByOrderItemId(id) {
    return request({
        url: `/order/orderReturns/byOrderItemId/${id}`,
        method: "get",
    })
}