import axios from '../../src/index'

axios({
  method: 'get',
  url: '/base/get',
  params: {
    foo: ['bar', 'baz']
  }
})

axios({
  url: '/base/get',
  params: {
    foo: {
      bar: 'baz'
    }
  }
})

const date = new Date()

axios({
  url: '/base/get',
  params: {
    date
  }
})

axios({
  url: '/base/get',
  params: {
    foo: '@:$, '
  }
})

axios({
  url: '/base/get',
  params: {
    foo: 'bar',
    baz: null
  }
})

axios({
  url: '/base/get#hash',
  params: {
    foo: 'bar',
  }
})

axios({
  url: '/base/get?bar=baz',
  params: {
    foo: 'bar',
  }
})

axios({
  method: 'post',
  url: '/base/post',
  data: {
    a: 1,
    b: 2
  }
}).then(console.log)

axios({
  method: 'post',
  url: '/base/post',
  responseType: 'json',
  data: {
    a: 3,
    b: 4
  }
}).then(console.log)

const paramsString = 'q=URLUtils.searchParams&topic=api'
const searchParams = new URLSearchParams(paramsString)
axios({
  method: 'post',
  url: '/base/post',
  data: searchParams
}).then(console.log)

axios({
  method: 'post',
  url: '/base/post',
  headers: {
    'content-type': 'application/json',
    'Accept': 'application/json, text/plain, */*'
  },
  data: {
    a: 1,
    b: 2
  }
}).then(console.log)

const arr = new Int32Array([21, 31])
axios({
  method: 'post',
  url: '/base/buffer',
  data: arr
})