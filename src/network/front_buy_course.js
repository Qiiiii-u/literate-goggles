import {request} from './request.js'

export function userGenerateOrder(group_id, username, price){
	return request({
		url: 'Order/userGenerateOrder',
    data: {
      group_id,
      username,
      price
    },
	})
}

export function userOrderSuccess(id){
  return request({
  	url: 'Order/userOrderSuccess',
    data: {
      id
    },
  })
}
