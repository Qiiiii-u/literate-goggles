import {request} from '../request.js'

// 百科信息 总
export function getMessageList(status){
	return request({
		url: 'message/getMessageList',
    data: {
      status
    }
	})
}

// 删除订单
export function delMessage(id){
	return request({
		url: 'message/delMessage',
    data: {
      id
    }
	})
}

// 永久删除
export function delForeverMessage(id){
	return request({
		url: 'message/delForeverMessage',
    data: {
      id
    }
	})
}

// 编辑百科
export function editMessage(obj){
	return request({
		url: 'message/editMessage',
    data: obj
	})
}

// 新增百科
export function addMessage(obj){
	return request({
		url: 'message/addMessage',
    data: obj
	})
}

// 恢复百科
export function recycleMessage(id){
	return request({
		url: 'message/recycleMessage',
    data: {
      id
    }
	})
}

// 发布百科
export function publishMessage(id){
	return request({
		url: 'message/publishMessage',
    data: {
      id
    }
	})
}
