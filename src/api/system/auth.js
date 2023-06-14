import request from "@/utils/request";
// 登录
export function login(data) {
  return request({
    url: "/system/auth/login",
    method: "post",
    data,
  });
}

// 获取登录用户信息
export function getInfo() {
  return request({
    url: "/system/auth/getInfo",
    method: "get",
  });
}

// 退出登录
export function logout() {
  return request({
    url: "/system/auth/logout",
    method: "get",
  });
}

// 获取动态路由
export function getRouters() {
  return request({
    url: "/system/auth/getRouters",
    method: "get",
  });
}
