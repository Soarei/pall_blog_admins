import request from '@/utils/request'

export function getArticleList(data) {
  return request({
    url: '/admin/article/list',
    method: 'post',
    data
  })
}

// 添加文章接口
export function addArticle(data) {
  return request({
    url: '/admin/article/add',
    method: 'post',
    data
  })
}

// 更新文章接口
export function updateArticle(data) {
  return request({
    url: '/admin/article/edit',
    method: 'post',
    data
  })
}

// 删除文章接口
export function delArticle(data) {
  return request({
    url: '/admin/article/del',
    method: 'post',
    data
  })
}

// 上传文章标题接口

export function upload(data) {
  return request({
    url: '/admin/upload/uploadFile',
    method: 'post',
    headers: {
      "Content-Type": "multipart/form-data;boundary = boundary",
    },
    data
  })
}