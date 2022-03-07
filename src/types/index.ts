/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2022-03-04 14:14:51
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2022-03-07 10:02:30
 * 所有公共类型定义文件
 */

export type Method = 'get' | 'GET' | 'delete' | 'DELETE' | 'head' | 'HEAD' | 'options' | 'OPTIONS' | 'post' | 'POST' | 'put' | 'PUT' | 'patch' | 'PATCH'

export interface AxiosRequestConfig {
  url: string
  method?: Method
  data?: any
  params?: any
  headers?: any
  responseType?: XMLHttpRequestResponseType
  timeout?: number
}

export interface AxiosResponse {
  data: any
  status: number
  statusText: string
  headers: any
  config: AxiosRequestConfig
  request: any
}

export  interface AxiosPromise extends Promise<AxiosResponse>{

}

export interface AxiosError extends Error {
  isAxiosError: boolean
  config: AxiosRequestConfig
  code?: string | null
  request?: any
  response?: AxiosResponse
}