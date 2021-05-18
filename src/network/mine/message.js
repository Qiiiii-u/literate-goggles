import {request} from '../request.js'

export function getUserMessageList(uid){
	return request({
		url: 'Message/getUserMessageList',
    data: {
      uid
    },
	})
}

export function userReadMessage(obj){
  return request({
  	url: 'Message/userReadMessage',
    data: obj
  })
}

export function userDeleteMessage(id, uid){
  return request({
  	url: 'Message/userDeleteMessage',
    data: {
      id,
      uid
    },
  })
}
