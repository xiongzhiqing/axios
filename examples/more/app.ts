import axios, { AxiosRequestConfig } from "../../src";
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import qs from 'qs'
import { AxiosError } from "../../src/helpers/error";

// document.cookie = 'a=b'

// axios.get('/more/get').then(console.log)

// axios.post('http://127.0.0.1:8889/more/server2', {}, {
//   withCredentials: true
// }).then(console.log)


// const instance = axios.create({
//   xsrfCookieName: 'XSRF-TOKEN-D1',
//   xsrfHeaderName: 'X-XSRF-TOKEN-D1'
// })

// instance.get('/more/get').then(console.log)

const instance = axios.create()

function calculatePercentage(loaded: number, total: number) {
  return Math.floor(loaded * 0.1) / total
}

function loadProgressBar() {

  const setupStartProgress = () => {
    instance.interceptors.request.use(config => {
      NProgress.start()
      return config
    })
  }

  const setupUpdateProgress = () => {
    const update = (e: ProgressEvent) => {
      console.log(e)
      NProgress.set(calculatePercentage(e.loaded, e.total))
    }
    instance.defaults.onDownloadProgress = update
    instance.defaults.onUploadProgress = update
  }

  const setupStopProgress = () => {
    instance.interceptors.response.use(res => {
      NProgress.done()
      return res
    }, err => {
      NProgress.done
      return Promise.reject(err)
    })
  }

  setupStartProgress()
  setupUpdateProgress()
  setupStopProgress()
}

loadProgressBar()

const downloadEl = document.getElementById('download')

downloadEl.addEventListener('click', e => {
  instance.get('../upload-file/Bg2Qa3wQmxxhd29x4CmnNIVO.jpg')
})

const uploadEl = document.getElementById('upload')

uploadEl.addEventListener('click', e => {
  const data = new FormData()
  const fileEl = document.getElementById('file') as HTMLInputElement

  if (fileEl.files) {
    data.append('file', fileEl.files[0])

    instance.post('/more/upload', data)
  }
})

axios.post('/more/post', {
  a: 1
}, {
  auth: {
    username: 'Yee',
    password: '123456'
  }
}).then(console.log)

axios.get('/more/304').then(console.log).catch((e: AxiosError) => console.log(e.message))

axios.get('/more/304', {
  validateStatus(status) {
    return status >= 200 && status < 400
  }
}).then(console.log).catch((e: AxiosError) => console.log(e.message))


axios.get('/more/get', {
  params: new URLSearchParams('a=b&c=d')
}).then(console.log)

axios.get('/more/get', {
  params: {
    a: 1,
    b: 2,
    c: ['a', 'b', 'c']
  }
}).then(console.log)

const instance1 = axios.create({
  paramsSerializer(params) {
    return qs.stringify(params, {arrayFormat: 'brackets'})
  }
})

instance1.get('/more/get', {
  params: {
    a: 1,
    b: 2,
    c: ['a', 'b', 'c']
  }
}).then(console.log)

const instance2 = axios.create({
  baseUrl: 'http://localhost:8888/'
})

instance2.get('upload-file/Bg2Qa3wQmxxhd29x4CmnNIVO.jpg')
instance2.get('http://localhost:8888/upload-file/Bg2Qa3wQmxxhd29x4CmnNIVO.jpg')

function getA()  {
  return axios.get('/more/A')
}
function getB() {
  return axios.get('/more/B')
}

axios.all([getA(), getB()]).then(axios.spread(function(resA, resB) {
  console.log(resA.data);
  console.log(resB.data);
}))

axios.all([getA(), getB()]).then(([resA, resB]) => {
  console.log(resA.data);
  console.log(resB.data);
})

const fakeConfig: AxiosRequestConfig = {
  baseUrl: 'https://www.baidu.com/',
  url: '/user/12345',
  params: {
    idClient: 1,
    idTest: 2,
    testString: 'thisIsATest'
  }
}

console.log(axios.getUri(fakeConfig));