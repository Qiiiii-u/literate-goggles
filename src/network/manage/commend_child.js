import {request} from '../request.js'

// 信息 总
export function getCommendChild(){
	return request({
		url: 'Topic/getCommendChild'
	})
}

// 删除
export function delCommendChild(id){
	return request({
		url: 'Topic/delCommendChild',
    data: {
      id
    }
	})
}

// 批量删除
export function deleteMoreCommendChild(list){
	return request({
		url: 'Topic/deleteMoreCommendChild',
    data: {
      list
    }
	})
}
