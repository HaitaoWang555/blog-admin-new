import { Message } from 'element-ui'

export function tips(res) {
  if (!res) return
  Message({
    message: res.message,
    type: res.code === 200 ? 'success' : 'error'
  })
}

export function screenLoading(text) {
  const loading = this.$loading({
    lock: true,
    text: text || '加载中',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  return loading
}
