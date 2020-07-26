import request from '@/utils/request'

/**
 * 笔记树
 */
export function treeList() {
  return request({
    url: '/note/treeList',
    method: 'get'
  })
}

export function addMenu(noteMenu) {
  return request({
    url: '/note/create',
    method: 'post',
    data: noteMenu
  })
}
