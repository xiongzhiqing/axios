import Axios from "./core/Axios";
import { extend } from "./helpers/util";
import { AxiosInstance } from "./types";

// 混合对象
function createInstance(): AxiosInstance {
  const context = new Axios()
  // 指定 this 上下文
  const instance = Axios.prototype.request.bind(context)
  extend(instance, context)
  return instance as AxiosInstance
}
const axios = createInstance()

export default axios