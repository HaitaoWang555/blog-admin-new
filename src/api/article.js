import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/article/list',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: '/article/' + id,
    method: 'get'
  })
}

export function createArticle(data) {
  return request({
    url: '/article/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/article/update/' + data.id,
    method: 'post',
    data
  })
}

export function delArticles(ids) {
  return request({
    url: '/article/delete',
    method: 'post',
    params: { ids }
  })
}
export function upload(list, option) {
  return request({
    url: '/upload/local',
    method: 'post',
    data: list,
    onUploadProgress: e => {
      if (e.total > 0) {
        e.percent = e.loaded / e.total * 100
      }
      option.onProgress(e)
    }
  })
}
/**
 * MarkdownEditor 模式下 上传图片
 * @param {*} list 图片
 */
export function uploadImgInMd(list) {
  return request({
    url: '/article/upload/img',
    method: 'post',
    data: list
  })
}
export function uploadArticle(list, option) {
  return request({
    url: '/article/upload',
    method: 'post',
    data: list,
    onUploadProgress: e => {
      if (e.total > 0) {
        e.percent = e.loaded / e.total * 100
      }
      option.onProgress(e)
    }
  })
}
export function uploadArticleDir(formData) {
  return request({
    url: '/article/uploadDir',
    method: 'post',
    data: formData
  })
}
