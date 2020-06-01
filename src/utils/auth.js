import store from 'store'

const TokenKey = 'blog_admin_token'
const settingKey = 'user_editor_setting'

export function getToken() {
  return store.get(TokenKey)
}

export function setToken(token) {
  return store.set(TokenKey, token)
}

export function removeToken() {
  return store.remove(TokenKey)
}

export function getSetting() {
  return store.get(settingKey)
}

export function setSetting(setting) {
  return store.set(settingKey, setting)
}

export function removeSetting() {
  return store.remove(settingKey)
}

