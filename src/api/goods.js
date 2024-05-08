import request from '@/utils/request'

export function getGoods(data) {
  return request({
    url: '/api/ycInfo/getYcList',
    method: 'post',
    data
  })
}

export function addGoods(data) {
  return request({
    url: '/api/ycInfo/addYc',
    method: 'post',
    data
  })
}

// 删除商品接口

export function delGoods(data) {
  return request({
    url: '/api/ycInfo/deleteYc',
    method: 'get',
    params: data
  })
}

// 修改商品接口

export function updateGoods(data) {
  return request({
    url: '/api/ycInfo/updateYc',
    method: 'post',
    data
  })
}

export function uploadImg(data) {
  return request({
    url: '/api/ycInfo/updateYc',
    method: 'post',
    data
  })
}