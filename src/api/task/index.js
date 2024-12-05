import request from '@/utils/request'
//获取任务列表
export function getTaskList(data) {
  return request({
    url: '/admin/task/list',
    method: 'post',
    data
  })
}
export function addTask(data) {
  return request({
    url: '/admin/task/addtask',
    method: 'post',
    data
  })
}
/* 素材库 */
export function getHabitsRespons() {
  return request({
    url: '/admin/task/mater/list',
    method: 'post',
  })
}