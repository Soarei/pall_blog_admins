import request from '@/utils/request'

export function getNoticeList(data) {
  return request({
    url: '/admin/platform/noticeList',
    method: 'post',
    data
  })
}

// 添加公告信息

export function insertNotice(data) {
  return request({
    url: '/admin/platform/insertNotice',
    method: 'post',
    data
  })
}


// 更新公告信息

export function updateNotice(data) {
  return request({
    url: '/admin/platform/updateNotice',
    method: 'post',
    data
  })
}

// 删除公告信息

export function delNotice(data) {
  return request({
    url: '/admin/platform/delNotice',
    method: 'post',
    data
  })
}