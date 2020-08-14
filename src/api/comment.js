import request from '@/utils/request'

export function searchList(query) {
  return request({
    url: '/comment/search',
    method: 'get',
    params: query
  })
}

export function del(ids, aids) {
  return request({
    url: '/comment/delete',
    method: 'post',
    params: { ids, aids }
  })
}
