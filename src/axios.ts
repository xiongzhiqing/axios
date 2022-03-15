import Cancel, { isCancel } from "./cancel/cancel";
import CancelToken from "./cancel/cancelToken";
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
axios.CancelToken = CancelToken
axios.isCancel = isCancel
axios.Cancel = Cancel

axios.all = function all(promises) {
  return Promise.all(promises)
}

axios.spread = function spread(callback) {
  return function wrap (arr) {
    return callback.apply(null, arr)
  }
}

axios.create = function create(config) {
  return createInstance(mergeConfig(defaults, config))
}

export default axios