import request from "@/utils/request";

// 根据手机号获取会员信息
export function getMemberByPhone(params) {
    return request({
        url: '/member/member/getMemberByPhone',
        method: 'get',
        params: params
    })
}
// 查询列表
export function listMemberByPage(data) {
    return request({
        url: "/member/member/queries",
        method: "get",
        params: data
    })
}
// 根据id查询列表
export function listMemberById(id){
    return request({
        url: `/member/member/${id}`,
        method: "get",
    })
}
// 添加产品类别
export function addMember(data){
    return request({
        url: "/member/member/",
        method: "post",
        data: data
    })
}
// 更新产品类别
export function updateMember(data){
    return request({
        url: "/member/member/",
        method: "put",
        data: data
    })
}
// 删除产品类别
export function delMember(id){
    return request({
        url: `/member/member/${id}`,
        method: "delete",
    })
}
// 查询会员总数
export function getMemberCount() {
    return request({
        url: '/member/member/count',
        method: 'get'
    })
}
