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
/**
 * 添加笔记
 * @param {Number} noteMenu.parentId 父级ID
 * @param {String} noteMenu.name 文件/文件夹 名称
 * @param {String} noteMenu.menuType 笔记类型 folder 文件夹 file 文件
 */
export function addMenu(noteMenu) {
  return request({
    url: '/note/create',
    method: 'post',
    data: noteMenu
  })
}

/**
 * 删除笔记
 * @param {Number} id 笔记ID
 */
export function delMenu(id) {
  return request({
    url: '/note/delete/' + id,
    method: 'post'
  })
}

/**
 * 修改笔记
 * @param {Number} id 笔记ID
 * @param {String} name 笔记名称
 */
export function updateMenu(id, name) {
  return request({
    url: '/note/update/' + id,
    method: 'post',
    params: {
      name
    }
  })
}

/**
 * 上传文件夹
 * @param {*} formData 文件夹
 * @param {*} id 父级文件夹ID
 */
export function uploadNoteDir(formData, id) {
  return request({
    url: '/note/uploadDir',
    method: 'post',
    params: { id },
    data: formData
  })
}

/**
 * 下载笔记
 */
export function download(id) {
  return request({
    url: '/note/download',
    method: 'get',
    params: { id },
    responseType: 'blob'
  })
}
