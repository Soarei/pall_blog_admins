
import antd from './antd'
//import swiper from './swiper'
export default {
  antd,
  //swiper,
  install(app) {
    app.use(antd)
    //app.use(swiper)

  }
}