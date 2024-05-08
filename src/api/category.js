import request from '@/utils/request'

export function getCategoryList(data) {
  return request({
    url: '/admin/category/list',
    method: 'post',
    data
  })
}


export function addCategory(data){
  return request({
    url: '/admin/category/add',
    method: 'post',
    data
  })
}
// 编辑分类接口

export function editCategory(data){
  return request({
    url: '/admin/category/edit',
    method:'post',
    data
  })
}
export function delCategory(data){
  return request({
    url: '/admin/category/del',
    method: 'post',
    data
  })
}

export function getLabelsList(){
  return request({
    url: '/admin/label/alltags',
    method:'post'
  })
}

