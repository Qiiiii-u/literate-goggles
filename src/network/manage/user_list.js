import {request} from '../request.js'

// 启用账号
export function changeUserStatus(uid){
	return request({
		url: 'user/changeUserStatus',
    data: {
      uid
    }
	})
}

// 删除用户
export function deleteUser(uid){
	return request({
		url: 'user/deleteUser',
    data: {
      uid
    }
	})
}

// 批量删除
export function deleteMore(list){
	return request({
		url: 'user/deleteMore',
    data: {
      list
    }
	})
}

// 用户信息 总
export function getList(){
	return request({
		url: 'user/getList'
	})
}

// 编辑信息
export function editUser(obj){
	return request({
		url: 'user/editUser',
    data: obj
	})
}

// 新增用户
export function addUser(obj){
	return request({
		url: 'user/addUser',
    data: obj
	})
}
