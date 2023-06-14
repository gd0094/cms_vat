import request from '@/utils/request'

// 获取商品类别饼图数据
export function getCategoryPieSales() {
  return request({
    url: '/order/order/categoryPieSales',
    method: 'get'
  })
}

// 指定年份的月度销量图
export function getMonthSales(data){
  return request({
    url: '/order/order/monthSales',
    method: 'get',
    params: data
  })
}