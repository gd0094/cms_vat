import request from "@/utils/request";
import { getToken } from "@/utils/auth";

// 分页查询user列表
export function listUserByPage(query) {
  return request({
    url: "/system/user/queries",
    method: "get",
    params: query,
  });
}

// 查询user
export function getUser(id) {
  return request({
    url: "/system/user/" + id,
    method: "get",
  });
}

// 新增user
export function addUser(data) {
  return request({
    url: "/system/user",
    method: "post",
    data: data,
  });
}

// 修改user
export function updateUser(data) {
  return request({
    url: "/system/user",
    method: "put",
    data: data,
  });
}

// 删除user
export function deleteUser(id) {
  return request({
    url: "/system/user/" + id,
    method: "delete",
  });
}

// 保存授权角色
export function authRole(data) {
  return request({
    url: "/system/user/authRole",
    method: "post",
    data: data,
  });
}

// 获取联系人
export function getContacts() {
  return request({
    url: "/system/user/getContacts",
    method: "get",
  });
}

// 获取个人信息
export function getUserInfo() {
  return request({
    url: "/system/user/getUserInfo",
    method: "get",
  });
}

// 修改用户密码
export function updatePassword(data) {
  return request({
    url: "/system/user/updatePassword",
    method: "post",
    data: data,
  });
}

// 更新用户信息
export function updateUserInfo(data) {
  return request({
    url: "/system/user/updateUserInfo",
    method: "post",
    data,
  });
}

// 导出类别
export function exportExcel(){
  return request({
      url: `/system/user/export`,
      method: "get",
      responseType: 'blob', 
      headers: { Authorization: "Bearer " + getToken() }
  })
}

// 导入模板
export function templateExcel(){
  return request({
      url: `/system/user/template`,
      method: "get",
      responseType: 'blob', 
      headers: { Authorization: "Bearer " + getToken() }
  })
}

