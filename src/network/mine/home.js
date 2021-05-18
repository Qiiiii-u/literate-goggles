import {request} from '../request.js'

export function getTopic(uid){
	return request({
		url: 'Topic/getTopic',
    data: {
      uid
    }
	})
}

export function agreeTopic(uid,id){
	return request({
		url: 'Topic/agreeTopic',
    data: {
      uid,
      id
    }
	})
}

export function agreeCommend(uid,id){
	return request({
		url: 'Topic/agreeCommend',
    data: {
      uid,
      id
    }
	})
}

export function publishReview(uid,id,content){
	return request({
		url: 'Topic/publishReview',
    data: {
      uid,
      id,
      content
    }
	})
}
export function publishCommend(uid,id,content){
	return request({
		url: 'Topic/publishCommend',
    data: {
      uid,
      id,
      content
    }
	})
}
