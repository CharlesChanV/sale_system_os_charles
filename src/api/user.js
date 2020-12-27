import request from '@/utils/request'
import { tokenName } from '@/config'

export async function login(params) {
  return request({
    url: '/login',
    method: 'post',
    params,
  })
}

export async function socialLogin(data) {
  return request({
    url: '/socialLogin',
    method: 'post',
    data,
  })
}

export function getUserInfo(accessToken) {
  //此处为了兼容mock.js使用data传递accessToken，如果使用mock可以走headers
  return request({
    // url: '/userInfo',
    url: '/common/getUserInfo',
    method: 'post',
    data: {
      [tokenName]: accessToken,
    },
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post',
  })
}

// export function register() {
//   return request({
//     url: '/register',
//     method: 'post',
//   })
// }

export function getUserList(params) {
  return request({
    url: '/user',
    method: 'get',
    params,
  })
}
export function changePassword(data) {
  return request({
    url: '/user/changePassword',
    method: 'post',
    data,
  })
}
export function register(data) {
  return request({
    url: '/common/register',
    method: 'post',
    data,
  })
}
