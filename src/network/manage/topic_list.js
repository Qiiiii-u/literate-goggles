import {
  request
} from '../request.js'

// 信息 总
export function getTopicList() {
  return request({
    url: 'Topic/getTopicList'
  })
}

// 删除
export function delTopic(id) {
  return request({
    url: 'Topic/delTopic',
    data: {
      id
    }
  })
}

// 批量删除
export function deleteMore(list) {
  return request({
    url: 'Topic/deleteMore',
    data: {
      list
    }
  })
}
