const fs = require("fs")
const path = require("path")

// Dotenv 是一个零依赖的模块，它能将环境变量中的变量从 .env 文件加载到 process.env 中
const dotenv = require("dotenv")


const envConfig = dotenv.parse(fs.readFileSync(`.env.${process.env.NODE_ENV}`))
for (const i in envConfig) {
  process.env[i] = envConfig[i]
}

console.log(process.env.VITE_APP_PUBLIC_URL, 'VITE_APP_PUBLIC_URL')

module.exports = {
  base: process.env.VITE_APP_PUBLIC_URL,
  outDir: "dist",
  port: 3000,
  // 是否自动在浏览器打开
  open: false,
  // 是否开启 https
  https: false,
  // 服务端渲染
  ssr: false,
  alias: {
    "/@/": path.resolve(__dirname, "./src"),
  },
};
