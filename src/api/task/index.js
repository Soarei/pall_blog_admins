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