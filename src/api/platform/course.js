// /course/insert
import request from '@/utils/request'
import serviceRequest from '@/utils/request-collect'


/*
 *@description:获取轮播图列表
 *@author: pf
 *@date: 2022-12-27 14:03:12
 *@version: V1.0.5
*/
export function getCourseList(data) {
  return request({
    url: '/admin/platform/course/list',
    method: 'get',
    params: data
  })
}
/*
 *@description: 插入轮播图
 *@author: pf
 *@date: 2022-12-27 14:02:51
 *@version: V1.0.5
*/
export function addCourseList(data) {
  return request({
    url: '/admin/platform/course/insert',
    method: 'post',
    data
  })
}

/*
 *@description:更新轮播图
 *@author: pf
 *@date: 2022-12-27 15:04:13
 *@version: V1.0.5
*/

export function updateCourse(data) {
  return request({
    url: '/admin/platform/course/update',
    method: 'post',
    data
  })
}

/*
 *@description:产出轮播图接口
 *@author: pf
 *@date: 2022-12-28 19:03:33
 *@version: V1.0.5
*/

export function delCourse(data) {
  return request({
    url: '/admin/platform/course/del',
    method: 'post',
    data
  })
}

export function getCollectionAudio(data) {
  return request({
    url: '/admin/platform/collect/video',
    method: 'post',
    data
  })
}


// 获取全部音色
export function getallVoiceList() {
  return request({
    url: '/admin/platform/voice/all',
    method: 'post'
  })
}

export function addCollectionGoods(data) {
  return serviceRequest({
    url: 'testcoll',
    method: 'post',
    data
  })
}

export function addTaobao(data) {
  return serviceRequest({
    url: 'collection/taobao',
    method: 'post',
    data
  })
}