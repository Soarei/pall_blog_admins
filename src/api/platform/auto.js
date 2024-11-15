// /course/insert
import request from '@/utils/request'
import serviceRequest from '@/utils/request-collect'

export function getGoodsList(data) {
  return request({
    method: 'post',
    url: '/admin/platform/collect/goodslist',
    data
  })
}
// 删除商品
export function deleteGoods(data) {
  return request({
    method: 'post',
    url: '/admin/platform/collect/goods/delete',
    data
  })
}
/* 单品采集商品api */
export function colletSignGoods(data) {
  return request({
    method: 'post',
    url: '/admin/platform/collect/signgoods',
    data
  })
}
/* 单品1688商品入库*/
export function colletTaobaoGoods(data) {
  return request({
    method: 'post',
    url: '/admin/platform//collect/taobao',
    data
  })
}
