import {request} from '../request.js'

// 获取用户已购买的课程
export function getCourseList(uid){
	return request({
		url: 'plan/getCourseList',
    data: {
      uid
    },
	})
}

// 删除
export function deletePlan(id){
  return request({
  	url: 'plan/deletePlan',
    data: {
      id
    }
  })
}

// 改变计划状态
export function changePlanStatus(id, uid){
  return request({
  	url: 'plan/changePlanStatus',
    data: {
      id,
      uid
    },
  })
}

// 添加计划
export function addPlan(obj){
  return request({
  	url: 'plan/addPlan',
    data: obj
  })
}

// 获取计划列表
export function getPlanList(uid){
  return request({
  	url: 'plan/getPlanList',
    data: {
      uid
    }
  })
}
