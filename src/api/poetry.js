import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/poetry/list',
    method: 'get',
    params: query
  })
}
export function searchList(query) {
  return request({
    url: '/poetry/search',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/poetry/create',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/poetry/update/' + data.id,
    method: 'post',
    data
  })
}

export function delPoetry(ids) {
  return request({
    url: '/poetry/delete',
    method: 'post',
    params: { ids }
  })
}

export function downloadList(ids) {
  return request({
    url: '/poetry/export',
    method: 'get',
    responseType: 'blob',
    params: { ids }
  })
}
