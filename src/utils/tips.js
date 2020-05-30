import { Message } from 'element-ui'

export function tips(res) {
  if (!res) return
  Message({
    message: res.message,
    type: res.code === 200 ? 'success' : 'error'
  })
}
