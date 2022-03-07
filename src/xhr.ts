import { createError } from "./helpers/error";
import { parseHeaders } from "./helpers/headers";
import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from "./types";

export default function xhr (config: AxiosRequestConfig): AxiosPromise {

  return new Promise((resolve, reject) => {
    const { data, url, method = 'get', headers, responseType, timeout } = config

    const request = new XMLHttpRequest()

    if (responseType) {
      request.responseType = responseType
    }
    // 添加超时属性（单位ms）
    if (timeout) {
      request.timeout = timeout
    }
    request.open(method.toUpperCase(), url, true)

    request.onreadystatechange = function handleLoad () {
      if (request.readyState !== 4) {
        return
      }
      // 网络错误、超时错误时，status = 0
      if (request.status === 0) {
        return
      }

      const responseHeaders = parseHeaders(request.getAllResponseHeaders())
      const responseData = responseType !== 'text' ? request.response : request.responseType

      const response: AxiosResponse = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      }
      // 处理 response 辅助函数
      handleResponse(response)
    }

    // 网络错误
    request.onerror = function handleError() {
      reject(createError('Network Error', config, null, request))
    }
    // 超时错误
    request.ontimeout = function handleTimeout() {
      reject(createError(`Timeout of ${timeout} ms exceeded`, config, 'ECONNABORTED', request))
    }

    Object.keys(headers).forEach((name) => {
        if (data === null && name.toLowerCase() === 'content-type') {
          delete headers[name]
        } else {
          request.setRequestHeader(name, headers[name])
        }
      })

    request.send(data)

    function handleResponse(response: AxiosResponse): void {
      if (response.status >= 200 && response.status < 300) {
        resolve(response)
      } else {
        reject(createError(`Request failed with status code ${response.status}`, config, null, request, response))
      }
    }
  })
}