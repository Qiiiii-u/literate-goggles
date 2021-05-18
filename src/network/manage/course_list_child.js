import {request} from '../request.js'

// 信息 总
export function getCourseChild(group_id){
	return request({
		url: 'Course/getCourseChild',
    data: {
      group_id
    }
	})
}

// 删除
export function deleteCourseChild(course_id,group_id){
	return request({
		url: 'Course/deleteCourseChild',
    data: {
      course_id,
      group_id
    }
	})
}

// 编辑
export function editCourseChild(obj){
	return request({
		url: 'Course/editCourseChild',
    data: obj
	})
}

// 新增
export function addCourseChild(obj){
	return request({
		url: 'Course/addCourseChild',
    data: obj
	})
}
