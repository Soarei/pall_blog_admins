import request from '@/utils/request'

export function uploadImg(data) {
  return request({
    url: '/admin/upload/uploadImage',
    method: 'post',
    data
  })
}

export function uploadInter() {
  return '/api/admin/upload/uploadFile'
}

export function uploadFileImage(data) {
  return request({
    url: '/admin/upload/uploadFile',
    method: 'post',
    data
  })
}