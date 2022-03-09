import Axios from "./core/Axios";
import mergeConfig from "./core/mergeConfig";
import defaults from "./defaults";
import { extend } from "./helpers/util";
import { AxiosRequestConfig, AxiosStatic } from "./types";

// 混合对象
function createInstance(config: AxiosRequestConfig): AxiosStatic {
  const context = new Axios(config)
  // 指定 this 上下文
  const instance = Axios.prototype.request.bind(context)
  extend(instance, context)
  return instance as AxiosStatic
}
const axios = createInstance(defaults)

axios.create = function create(config) {
  return createInstance(mergeConfig(defaults, config))
}

export default axios