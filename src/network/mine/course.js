import {request} from '../request.js'

export function getStatusList(uid){
	return request({
		url: 'Coursestatus/getStatusList',
    data: {
      uid
    }
	})
}

export function getPlanTable(uid,time){
	return request({
		url: 'plan/getPlanTable',
    data: {
      uid,
      time
    }
	})
}

export function getCourseTable(uid,time){
	return request({
		url: 'plan/getCourseTable',
    data: {
      uid,
      time
    }
	})
}

export function getCoachCourse(uid){
	return request({
		url: 'coachCourse/getCourse',
    data: {
      uid
    }
	})
}
