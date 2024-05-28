import request from '@/utils/request'

export function getRoles(data) {
  return request({
    url: '/admin/systemroles/rolelist',
    method: 'post',
    data
  })
}
// 添加角色信息
export function addRoles(data) {
  return request({
    url: '/admin/systemroles/addroles',
    method: 'post',
    data
  })
}
// 更新角色
export function editRoles(data) {
  return request({
    url: '/admin/systemroles/editroles',
    method: 'post',
    data
  })
}
// 删除角色
export function deletRoles(data) {
  return request({
    url: '/admin/systemroles/deleteroles',
    method: 'post',
    data
  })
}
// 查看用户所拥有的权限id
export function getUserRolesIds(data) {
  return request({
    url: '/admin/systemroles/distribu',
    method: 'post',
    data
  })
}
export function getAdminUser(data) {
  return request({
    url: '/admin/systemroles/userlist',
    method: 'post',
    data
  })
}

// 更新管理员账号状态

export function updateAdminStatus(data) {
  return request({
    url: '/admin/systemroles/frozen',
    method: 'post',
    data
  })
}

// 查询当前用户的菜单状态

export function getRolesAuth(data) {
  return request({
    url: '/admin/systemroles/authmenus',
    method: 'post',
    data
  })
}

// 更新用户的菜单状态
export function updateRolesAuth(data) {
  return request({
    url: '/admin/systemroles/updateroles',
    method: 'post',
    data
  })
}

//分配角色

export function distributeRoles(data) {
  return request({
    url: '/admin/systemroles/distribute',
    method: 'post',
    data
  })
}