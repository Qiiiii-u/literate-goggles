import {request} from '../request.js'

export function editHeadImg(head_img,uid){
	return request({
		url: 'Userinfo/editHeadImg',
    data: {
      head_img,
      uid
    },
	})
}
export function editPw(uid,oldpw,newpw) {
  return request({
    url: 'Userinfo/editPw',
    data: {
      uid,
      oldpw,
      newpw
    }
  })
}

// 信息 总
export function editInfo(obj) {
  return request({
    url: 'Userinfo/editInfo',
    data: obj
  })
}

export function editBirth(uid, birth) {
  return request({
    url: 'Userinfo/editBirth',
    data: {
      uid,
      birth
    }
  })
}

export function sendEmail(email) {
  return request({
    url: 'login/sendEmail',
    data: {
      email
    }
  })
}
