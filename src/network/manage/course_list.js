import {request} from '../request.js'

// 获取教练ID
export function getAllCoach(){
	return request({
		url: 'Course/getAllCoach'
	})
}

// 信息 总
export function getCourseList(uid){
	return request({
		url: 'Course/getCourseList',
    data: {
      uid
    }
	})
}

// 删除
export function deleteCourseGroup(group_id){
	return request({
		url: 'Course/deleteCourseGroup',
    data: {
      group_id
    }
	})
}

// 编辑
export function editCourseGroup(obj){
	return request({
		url: 'Course/editCourseGroup',
    data: obj
	})
}

// 新增
export function addCourseGroup(obj){
	return request({
		url: 'Course/addCourseGroup',
    data: obj
	})
}
