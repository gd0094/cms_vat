import request from '@/utils/request'

// 获取消息历史记录
export function getChatHistory(id) {
    return request({
        url: '/im/chatHistory/getChatHistory/' + id,
        method: 'get'
    })
}