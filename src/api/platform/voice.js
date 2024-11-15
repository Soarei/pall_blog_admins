
import request from '@/utils/request'
// 获取音色列表
export function getVoiceList(data) {
  return request({
    url: '/admin/platform/voice/list',
    method: 'post',
    data
  })
}

// 添加音色
export function addVoice(data) {
  return request({
    url: '/admin/platform/voice/add',
    method: 'post',
    data
  })
}

// 删除音色
export function deleteVoice(data) {
  return request({
    url: '/admin/platform/voice/del',
    method: 'post',
    data
  })
}
