import {request} from '../request.js'

export function getUserIp(){
	return request({
		url: 'home/getUserIp',
	})
}

export function getStatistic(){
	return request({
		url: 'home/getStatistic',
	})
}

export function addViews(){
	return request({
		url: 'home/addViews',
	})
}
