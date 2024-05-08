import request from '@/utils/request'

export function getCommentList(data){
    return request({
        url:"/admin/comment/list",
        method:"post",
        data
    })
}

// 查询二级评论

export function getSecondList(data){
    return request({
        url:"/admin/comment//second/comment",
        method:"post",
        data
    })
}
