const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  user_info: state => state.user.user_info,
  permission_routes: state => state.user.routes, // 在permission模块中的routes的值
}
export default getters
