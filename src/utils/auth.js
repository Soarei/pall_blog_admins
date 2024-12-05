import Cookies from 'js-cookie'
import storage from 'good-storage'
const TokenKey = 'pallToken'
const UserInfo = 'user_info'
const _perrmisson = 'perrmisson'
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  console.log(token);

  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 存储用户信息
export function setUserInfo(data) {
  return storage.set(UserInfo, data)
}
// 获取用户信息
export function getUserInfoStore() {
  return storage.get(UserInfo) ? JSON.parse(storage.get(UserInfo)) : {}
}
// 移除用户信息

export function removeUserInfo() {
  return storage.remove(UserInfo)
}

// 存取用户的菜单
export function setUserMenus(data) {
  return storage.set(_perrmisson, data)
}

// 获取用户菜单信息

export function getUserMenus() {
  return storage.get(_perrmisson)
}

// 清除用户菜单信息

export function clearUserMenus() {
  return storage.remove(_perrmisson)
}