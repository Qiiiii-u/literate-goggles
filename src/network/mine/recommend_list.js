import {request} from '../request.js'

// 获取用户已购买的课程
export function getAllList(){
	return request({
		url: 'Course/getAllList'
	})
}
