import request from '@/utils/request'

export function getSenstiveList(data) {
  return request({
    url: '/admin/platform/sensitive/list',
    method: 'post',
    data
  })
}

export function insertSensitive(data) {
  return request({
    url: '/admin/platform/sensitive/insert',
    method: 'post',
    data
  })
}

export function deleteSensitive(data) {
  return request({
    url: '/admin/platform/sensitive/delete',
    method: 'post',
    data
  })
}