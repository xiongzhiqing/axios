import axios, { AxiosError } from "../../src/index";

axios({
  url: '/error/get1'
}).then(console.log).catch(console.log)

axios({
  url: '/error/get'
}).then(console.log).catch(console.log)

setTimeout(() => {
  axios({
    url: '/error/get'
  }).then(console.log).catch(console.log)
}, 5000)

axios({
  url: '/error/timeout',
  timeout: 2000
}).then(console.log).catch((err: AxiosError) => {
  console.log(err.message, err.code, err.config, err.request)
})