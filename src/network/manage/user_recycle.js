import {
  request
} from '../request.js'

// 用户信息
export function recycleList() {
  return request({
    url: 'user/recycleList'
  })
}

// 恢复用户
export function recycleUser(uid) {
  return request({
    url: 'user/recycleUser',
    data: {
      uid
    }
  })
}

// 批量恢复
export function recycleMore(list) {
  return request({
    url: 'user/recycleMore',
    data: {
      list
    }
  })
}

// 永久删除
export function deleteForever(uid) {
  return request({
    url: 'user/deleteForever',
    data: {
      uid
    }
  })
}
