import {
  request
} from '../request.js'

export function getCollect(username) {
  return request({
    url: 'Collect/getCollect',
    data: {
      username
    },
  })
}

export function addCollect(uid, group_id) {
  return request({
    url: 'Collect/addCollect',
    data: {
      uid,
      group_id
    },
  })
}

export function cancelCollect(id, uid) {
  return request({
    url: 'Collect/cancelCollect',
    data: {
      id,
      uid
    },
  })
}

// 获取用户已购买的课程
export function judgeCourse(uid) {
  return request({
    url: 'CourseStatus/judgeCourse',
    data: {
      uid
    },
  })
}

// 获取用户的课程信息
export function userCourseIntro(group_id,uid) {
  return request({
    url: 'Coursestatus/userCourseIntro',
    data: {
      group_id,
      uid
    },
  })
}
