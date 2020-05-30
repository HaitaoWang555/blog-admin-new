import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/metas/list',
    method: 'get',
    params: query
  })
}

export function createMetas(data) {
  return request({
    url: '/metas/create',
    method: 'post',
    data
  })
}

export function updateMetas(data) {
  return request({
    url: '/metas/update/' + data.id,
    method: 'post',
    data
  })
}

export function delMetas(ids) {
  return request({
    url: '/metas/delete',
    method: 'post',
    params: { ids }
  })
}

export function delMeta(id) {
  return request({
    url: '/metas/delete/' + id,
    method: 'post'
  })
}

export function downloadList(ids) {
  return request({
    url: '/metas/download',
    method: 'get',
    responseType: 'blob',
    params: { ids }
  })
}
export function downloadTemplate() {
  return request({
    url: '/metas/downloadTemplate',
    method: 'get',
    responseType: 'blob'
  })
}
export function importMeta(list, option) {
  return request({
    url: '/metas/import',
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
