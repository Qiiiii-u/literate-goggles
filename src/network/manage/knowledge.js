import {request} from '../request.js'

// 信息 总
export function getKnowledgeList(uid){
	return request({
		url: 'Knowledge/getKnowledgeList',
    data: {
      uid
    }
	})
}

// 删除
export function delKnowledge(knowledge_id){
	return request({
		url: 'Knowledge/delKnowledge',
    data: {
      knowledge_id
    }
	})
}

// 编辑
export function editKnowledge(obj){
	return request({
		url: 'Knowledge/editKnowledge',
    data: obj
	})
}

// 增加
export function addKnowledge(obj){
	return request({
		url: 'Knowledge/addKnowledge',
    data: obj
	})
}

// 批量删除
export function deleteMore(list){
	return request({
		url: 'Knowledge/deleteMore',
    data: {
      list
    }
	})
}
