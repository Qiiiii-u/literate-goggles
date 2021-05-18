import {
  request
} from '../request.js'

// 信息 总
export function getCommendList() {
  return request({
    url: 'Topic/getCommendList'
  })
}

// 删除
export function delCommend(id) {
  return request({
    url: 'Topic/delCommend',
    data: {
      id
    }
  })
}

// 批量删除
export function deleteMoreCommend(list) {
  return request({
    url: 'Topic/deleteMoreCommend',
    data: {
      list
    }
  })
}
