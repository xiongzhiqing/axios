import { isDate, isPlainObject, isURLSearchParams } from "./util"

interface URLOrigin {
  protocol: string
  host: string
}

function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/ig, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/ig, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/ig, '[')
    .replace(/%5D/ig, ']')
}
export function buildURL(url: string, params?: any, paramsSerializer?: (params: any) => string): string {
  if (!params) {
    return url
  }
  let serializedParams

  if (paramsSerializer) {
    serializedParams = paramsSerializer(params)
  } else if (isURLSearchParams(params)) {
    serializedParams = params.toString()
  } else {
    const parts: string[] = []

    Object.keys(params).forEach((key) => {
      let val = params[key]

      if (val === null || val === undefined) {
        return
      }

      let values = []

      if (Array.isArray(val)) {
        values = val
        key += '[]'
      } else {
        values = [val]
      }

      values.forEach(value => {
        if (isDate(value)) {
          value = value.toISOString()
        } else if (isPlainObject(value)) {
          value = JSON.stringify(value)
        }

        parts.push(`${encode(key)}=${encode(value)}`)
      })
    })

    serializedParams = parts.join('&')
  }

  if (serializedParams) {
    const markIndex = url.indexOf('#')
    // 过滤掉hash
    if (markIndex !== -1) {
      url = url.slice(0, markIndex)
    }
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  }
  return url
}

export function isAbsoluteURL(url: string): boolean {
  // 绝对地址
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}

export function combineURL(baseUrl: string, relativeUrl?: string): string {
  // 清理掉baseUrl 后面的"/"和 relativeUrl 前面的“/”
  return relativeUrl ? (baseUrl.replace(/\/+$/, '') + '/' + relativeUrl.replace(/^\/+/, '')) : baseUrl
}

export function isURLSameOrigin(requestURL: string): boolean {
  // 协议、域名，确定是否同域请求
  const parsedOrigin = resolveURL(requestURL)
  return parsedOrigin.protocol === currentOrigin.protocol && parsedOrigin.host === currentOrigin.host
}

const urlParsingNode = document.createElement('a')
const currentOrigin = resolveURL(window.location.href)

function resolveURL(url: string): URLOrigin {
  urlParsingNode.setAttribute('href', url)
  const { protocol, host} = urlParsingNode

  return {
    protocol,
    host
  }
}