import {
  request
} from './request.js'

// 获取所有课程
export function getAllList() {
  return request({
    url: 'Course/getAllList'
  })
}
// 获取目录
export function getMenuList(group_id) {
  return request({
    url: 'Course/getMenuList',
    data: {
      group_id
    }
  })
}

// 获取评论列表
export function getReview(group_id) {
  return request({
    url: 'Course/getReview',
    data: {
      group_id
    }
  })
}

// 评论
export function UserReview(group_id, uid, content, rate) {
  return request({
    url: 'CourseStatus/UserReview',
    data: {
      group_id,
      uid,
      content,
      rate
    }
  })
}

// 统计学习时长
export function addLearnTime(uid, time) {
  return request({
    url: 'Statistic/addLearnTime',
    data: {
      uid,
      time
    }
  })
}

// 更改最近学习
export function changeRecentLearn(uid, group_id, course_name) {
  return request({
    url: 'CourseStatus/changeRecentLearn',
    data: {
      uid,
      group_id,
      course_name
    }
  })
}

// 获取班级列表
export function getClassList(group_id) {
  return request({
    url: 'Course/getClassList',
    data: {
      group_id
    }
  })
}

// 获取学生已加入的班级列表
export function getUserClass(uid) {
  return request({
    url: 'Course/getUserClass',
    data: {
      uid
    }
  })
}

// 加入班级
export function enterClass(uid,class_id) {
  return request({
    url: 'Course/enterClass',
    data: {
      uid,
      class_id
    }
  })
}

// 获取指定课程的信息
export function getCourseDetail(group_id) {
  return request({
    url: 'CourseStatus/getCourseDetail',
    data: {
      group_id
    }
  })
}

// 获取指定课程的视频
export function getCourseVideo(group_id, course_name) {
  return request({
    url: 'CourseStatus/getCourseVideo',
    data: {
      group_id,
			course_name
    }
  })
}

// 置顶、隐藏
export function topHideCourse(id, operate) {
  return request({
    url: 'CourseStatus/topHideCourse',
    data: {
      id,
      operate
    }
  })
}
