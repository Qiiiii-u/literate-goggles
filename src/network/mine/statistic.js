import {request} from '../request.js'

export function getTimeStatistic(uid){
	return request({
		url: 'Statistic/getTimeStatistic',
    data: {
      uid
    },
	})
}
export function getCountStatistic(uid){
	return request({
		url: 'Statistic/getCountStatistic',
    data: {
      uid
    },
	})
}
