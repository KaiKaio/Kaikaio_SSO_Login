import axios from 'axios'

const urlMap = {
  development: 'http://localhost:4000/api',
  test: 'https://api.kaikaio.com/api',
  production: 'https://api.kaikaio.com/api',
}
console.log(process.env, 'process.env')
const service = axios.create({
  timeout: 20000, // Request Timeout
  baseURL: urlMap[process.env.NODE_ENV]
})

service.interceptors.request.use(
  config => {
    const { token } = localStorage
    if(token) {
      config.headers['authorization'] = `Bearer ${token}`;
    }
    return config
  },
  error => {
    console.log(error) // For Debug
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    return response
  },
  error => {
    return Promise.reject(error)
  }
)

export default service
