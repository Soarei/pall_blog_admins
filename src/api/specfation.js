import request from '@/utils/request'

export function getLabelList(data) {
  return request({
    url: '/admin/label/list',
    method: 'post',
    data
  })
}

export function addLabels(data) {
    return request({
      url: '/admin/label/add',
      method: 'post',
      data
    })
  }

// 编辑接口
export function editLabels(data){
  return request({
    url: '/admin/label/editlabel',
    method:'post',
    data
  })
}
// 删除规格接口
export function deleteLabels(data){
  return request({
    url: '/admin/label/deletelabel',
    method: 'post',
    data
  })
}

// 获取全部分类

export function getAllLabels(data){
  return request({
    url: '/admin/label/alllist',
    method:'post',
    data
  })
}