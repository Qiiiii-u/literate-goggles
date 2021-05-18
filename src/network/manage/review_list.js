import {
  request
} from '../request.js'

// 信息 总
export function getReviewList(uid) {
  return request({
    url: 'Course/getReviewList',
    data: {
      uid
    }
  })
}

// 删除
export function delReview(id) {
  return request({
    url: 'Course/delReview',
    data: {
      id
    }
  })
}

// 批量删除
export function deleteMore(list) {
  return request({
    url: 'Course/deleteMore',
    data: {
      list
    }
  })
}
