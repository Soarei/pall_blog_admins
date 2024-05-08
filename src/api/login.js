import request from '@/utils/request'
// 注册接口
export function pallRegister(data) {
  return request({
    url: '/admin/register',
    method: 'post',
    data
  })
}

// 登录接口
export function pallLogin(data){
  return request({
    url: '/admin/login',
    method: 'post',
    data
  })
}
