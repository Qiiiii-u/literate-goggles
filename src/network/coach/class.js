import {request} from '../request.js'

export function getClassInfo(uid){
	return request({
		url: 'coachCourse/getClassInfo',
    data: {
      uid
    },
	})
}

export function addTimeTables(obj){
	return request({
		url: 'plan/addTimeTables',
    data: obj
	})
}

export function delTimeTables(id){
	return request({
		url: 'plan/delTimeTables',
    data: {
      id
    },
	})
}

export function getTimeTables(class_id){
	return request({
		url: 'plan/getTimeTables',
    data: {
      class_id
    },
	})
}

export function getStudents(class_id){
	return request({
		url: 'coachCourse/getStudents',
    data: {
      class_id
    },
	})
}

export function getLeave(class_id,uid){
	return request({
		url: 'coachCourse/getLeave',
    data: {
      class_id,
      uid
    },
	})
}

export function getTrainLog(class_id,uid){
	return request({
		url: 'coachCourse/getTrainLog',
    data: {
      class_id,
      uid
    },
	})
}

export function addTrainLog(obj){
	return request({
		url: 'coachCourse/addTrainLog',
    data: obj
	})
}

export function addLeave(obj){
	return request({
		url: 'coachCourse/addLeave',
    data: obj
	})
}
