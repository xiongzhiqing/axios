import cookie from "../helpers/cookie";
import { createError } from "../helpers/error";
import { parseHeaders } from "../helpers/headers";
import { isURLSameOrigin } from "../helpers/url";
import { isFormData } from "../helpers/util";
import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from "../types";

export default function xhr (config: AxiosRequestConfig): AxiosPromise {

  return new Promise((resolve, reject) => {
    const { data, url, method = 'get', headers, responseType, timeout, cancelToken, withCredentials, xsrfCookieName, xsrfHeaderName, onDownloadProgress, onUploadProgress, auth, validateStatus } = config

    const request = new XMLHttpRequest()

    // "!", 类型断言 url 不是空
    request.open(method.toUpperCase(), url!, true)

    configureRequest()

    addEvents()

    processHeaders()

    processCancel()

    request.send(data)

    function configureRequest():void {
      if (responseType) {
        request.responseType = responseType
      }
      // 添加超时属性（单位ms）
      if (timeout) {
        request.timeout = timeout
      }

      // CORS跨域携带cookie
      if (withCredentials) {
        request.withCredentials = withCredentials
      }
    }

    function addEvents(): void {
      // 网络错误
      request.onerror = function handleError() {
        reject(createError('Network Error', config, null, request))
      }
      // 超时错误
      request.ontimeout = function handleTimeout() {
        reject(createError(`Timeout of ${timeout} ms exceeded`, config, 'ECONNABORTED', request))
      }

      if (onDownloadProgress) {
        request.onprogress = onDownloadProgress
      }

      if (onUploadProgress) {
        request.upload.onprogress = onUploadProgress
      }

      request.onreadystatechange = function handleLoad() {
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
    }

    function processHeaders(): void {

      if (isFormData(data)) {
        delete headers['Content-Type']
      }

      // 是否同允许跨域 或者 是否同域
      if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
        const xsrfValue = cookie.read(xsrfCookieName)
        console.log(xsrfValue, 'xsrfValue');
        if (xsrfValue && xsrfHeaderName) {
          headers[xsrfHeaderName] = xsrfValue
        }

      }

      if (auth) {
        // btoa base64方法
        headers['Authorization'] = 'Basic ' + btoa(auth.username + ':' + auth.password)
      }

      Object.keys(headers).forEach((name) => {
        if (data === null && name.toLowerCase() === 'content-type') {
          delete headers[name]
        } else {
          request.setRequestHeader(name, headers[name])
        }
      })
    }

    function processCancel(): void {
      if (cancelToken) {
        cancelToken.promise.then(reason => {
          request.abort()
          reject(reason)
        })
      }
    }

    function handleResponse(response: AxiosResponse): void {
      if (!validateStatus || validateStatus(response.status)) {
        resolve(response)
      } else {
        reject(createError(`Request failed with status code ${response.status}`, config, null, request, response))
      }
    }
  })
}