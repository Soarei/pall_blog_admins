import request from '@/utils/request'

export function getSenstiveList(data) {
  return request({
    url: '/admin/sensitive/list',
    method: 'get',
    params: data
  })
}

export function insertSensitive(data) {
  return request({
    url: '/admin/sensitive/insert',
    method: 'post',
    data
  })
}