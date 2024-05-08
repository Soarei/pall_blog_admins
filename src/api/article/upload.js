import request from '@/utils/request'

export function uploadImg(data){
  return request({
    url:'/admin/upload/uploadImage',
    method:'post',
    data
  })
}

export function uploadInter(){
  return '/api/admin/upload/images'
}

export function uploadFileImage(data){
  return request({
    url:'/admin/upload/images',
    method:'post',
    data
  })
}