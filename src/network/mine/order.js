import {request} from '../request.js'

// 订单信息 总
export function getUserAllOrder(status,uid){
	return request({
		url: 'order/getUserAllOrder',
    data: {
      status,
      uid
    }
	})
}

// 删除订单
export function delOrder(id){
	return request({
		url: 'order/delOrder',
    data: {
      id
    }
	})
}

// 恢复订单
export function recycleOrder(id){
	return request({
		url: 'order/recycleOrder',
    data: {
      id
    }
	})
}


// // 恢复订单
// export function cancelOrder(id){
// 	return request({
// 		url: 'order/cancelOrder',
//     data: {
//       id
//     }
// 	})
// }
