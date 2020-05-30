const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  user: state => state.user.userInfo,
  addRouters: state => state.permission.addRouters,
  routers: state => state.permission.routers
}
export default getters
