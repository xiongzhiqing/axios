import { flattenHeaders } from "../helpers/headers";
import { buildURL, combineURL, isAbsoluteURL } from "../helpers/url";
import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from "../types";
import transform from "./transform";
import xhr from "./xhr";

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  throwIfCancellationRequested(config)
  processConfig(config)
  return xhr(config).then(res => {
    return transformResponseData(res)
  })
}

function processConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config)
  config.data = transform(config.data, config.headers, config.transformRequest)
  // "!" 断言config.method 不为空
  config.headers = flattenHeaders(config.headers, config.method!)
}

export function transformURL(config: AxiosRequestConfig): string {
  let { url, params, paramsSerializer, baseUrl } = config
  if (baseUrl && !isAbsoluteURL(url!)) {
    url = combineURL(baseUrl, url)
  }
  console.log(url, 'url');
  // "!"类型断言 url 不为空
  return buildURL(url!, params, paramsSerializer)
}

function transformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transform(res.data, res.headers, res.config.transformResponse)
  return res
}

function throwIfCancellationRequested(config: AxiosRequestConfig): void {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested()
  }
}