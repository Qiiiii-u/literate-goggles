import {request} from '../request.js'

// 获取班级列表
export function getClassInfo(uid){
	return request({
		url: 'Coachcourse/getClassInfo',
    data: {
      uid
    }
	})
}

// 获取课程列表
export function getCourse(uid){
	return request({
		url: 'Coachcourse/getCourse',
    data: {
      uid
    }
	})
}

// 删除
export function delClass(id){
	return request({
		url: 'Coachcourse/delClass',
    data: {
      id
    }
	})
}

// 编辑信息
export function editClass(obj){
	return request({
		url: 'Coachcourse/editClass',
    data: obj
	})
}

// 新增用户
export function addClass(obj){
	return request({
		url: 'Coachcourse/addClass',
    data: obj
	})
}
