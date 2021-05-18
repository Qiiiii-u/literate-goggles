import {request} from '../request.js'

export function getClassInfo(uid){
	return request({
		url: 'Userclass/getClassInfo',
    data: {
      uid
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
