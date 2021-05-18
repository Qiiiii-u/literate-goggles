import {request} from '../request.js'

// 获取学生列表
export function getStudents(class_id){
	return request({
		url: 'Coachcourse/getStudents',
    data: {
      class_id
    }
	})
}

// 获取用户
export function getUser(class_id,group_id){
	return request({
		url: 'Coachcourse/getUser',
    data: {
      class_id,
      group_id
    }
	})
}

// 删除
export function delUser(id,class_id){
	return request({
		url: 'Coachcourse/delUser',
    data: {
      id,
      class_id
    }
	})
}

// 新增用户
export function addUser(uid,id,class_id){
	return request({
		url: 'Coachcourse/addUser',
    data: {
      uid,
      id,
      class_id
    }
	})
}
