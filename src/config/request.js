import axios from 'axios'

const service = axios.create({
  timeout: 20000, // Request Timeout
  baseURL: import.meta.env.VITE_APP_BASE_URL
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
