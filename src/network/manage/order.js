import {request} from '../request.js'

// 订单信息 总
export function getOrderList(status){
	return request({
		url: 'order/getOrderList',
    data: {
      status
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

// 永久删除
export function deleteForever(id){
	return request({
		url: 'order/deleteForever',
    data: {
      id
    }
	})
}

// 批量删除
export function deleteMore(list){
	return request({
		url: 'order/deleteMore',
    data: {
      list
    }
	})
}

// 编辑信息
export function editOrder(obj){
	return request({
		url: 'order/editOrder',
    data: obj
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
