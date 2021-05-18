import {request} from './request.js'

export function getKnowledgeAll(page){
	return request({
		url: 'Knowledge/getKnowledgeAll',
    data: {
      page
    },
	})
}



export function getCollect(username, type){
  return request({
  	url: 'Collect/getCollect',
    data: {
      username,
      type
    },
  })
}

export function addScanKnow(knowledge_id){
  return request({
  	url: 'Knowledge/addScanKnow',
    data: {
      knowledge_id
    },
  })
}

export function addCollectKnow(uid, knowledge_id){
  return request({
  	url: 'Collect/addCollectKnow',
    data: {
      uid,
      knowledge_id
    },
  })
}