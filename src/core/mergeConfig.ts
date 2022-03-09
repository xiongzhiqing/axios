import { deepMerge, isPlainObject } from "../helpers/util";
import { AxiosRequestConfig } from "../types";

const strats = Object.create(null)


// 默认合并策略
function defaultStrate(val1: any, val2: any) : any {
  return typeof val2 !== 'undefined' ? val2 : val1
}

// 默认为val2策略
function fromVal2Strate(val1: any, val2: any): any {
  if (typeof val2 !== 'undefined') {
    return val2
  }
}

// 合并复杂对象的合并策略（headers）
function deepMergeStrate(val1: any, val2: any): any {
  if (isPlainObject(val2)) {
    // 对象深拷贝
    return deepMerge(val1, val2)
  } else if (typeof val2 !== 'undefined') {
    return val2
  } else if (isPlainObject(val1)) {
    // val2 为假
    return deepMerge(val1)
  } else if (typeof val1 !== 'undefined') {
    // val1 存在，且不为空
    return val1
  }
}


// 定义需要使用 fromVal2Strate 的属性名
const strateKeysFromVal2 = ['url', 'params', 'data']

strateKeysFromVal2.forEach(key => {
  strats[key] = fromVal2Strate
})

// 定义需要使用 deepMergeStrate 的属性名
const strateKeysDeepMerge = ['headers']

strateKeysDeepMerge.forEach((key) => {
  strats[key] = deepMergeStrate
})

export default function mergeConfig(config1: AxiosRequestConfig, config2?: AxiosRequestConfig): AxiosRequestConfig {
  if (!config2) {
    config2 = {}
  }

  const config = Object.create(null)

  for(let key in config2) {
    mergeField(key)
  }

  for(let key in config1) {
    // config2中不存在
    if (!config2[key]) {
      mergeField(key)
    }
  }

  function mergeField(key: string): void {
    const strate = strats[key] || defaultStrate
    // "!"类型断言config2不为空
    config[key] = strate(config1[key], config2![key])
  }

  return config
}