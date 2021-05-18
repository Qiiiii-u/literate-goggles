import {request} from './request.js'

export function sendResetEmail(email){
	return request({
		url: 'login/sendResetEmail',
    data: {
      email
    },
	})
}

export function resetPassword(email, password){
	return request({
		url: 'login/resetPassword',
    data: {
      email,
      password
    },
	})
}


export function login(account, password){
	return request({
		url: 'login/login',
    data: {
      account,
      password
    },
	})
}

