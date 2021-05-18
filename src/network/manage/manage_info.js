import {
  request
} from '../request.js'

// 信息 总
export function editInfo(obj) {
  return request({
    url: 'Userinfo/editInfo',
    data: obj
  })
}
