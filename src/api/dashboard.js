import request from '@/utils/request'

export function getStaticArtile() {
  return request({
    url: '/admin/authorinfo',
    method: 'post',
  })
}
