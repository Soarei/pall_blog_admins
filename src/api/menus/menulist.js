import request from '@/utils/request'

export function getMenusList(){
  return request({
    url:'/admin/systemmenus/list',
    method:'post'
  })
}

// 添加菜单信息

export function addMenus(data){
  return request({
    url:'/admin/systemmenus/add',
    method: 'post',
    data
  })
}

// 编辑菜单信息
export function editMenus(data){
  return request({
    url:'/admin/systemmenus/edit',
    method:'post',
    data
  })
}
// 删除菜单信息

export function deleteMenus(data){
  return request({
    url:'/admin/systemmenus/delete',
    method:'post',
    data
  })
}