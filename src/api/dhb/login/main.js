import request from '@/utils/request'
import qs from 'qs'

export function loginInfo(loginForm) {
  const data = {
    'info': JSON.stringify(loginForm)
  }
  return request({
    method: 'post',
    url: 'user/login',
    data: qs.stringify(data)
  })
}

