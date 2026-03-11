# Kaikaio SSO Login

Kaikaio 单点登录系统前端项目，基于 Vue 3 + Vite 构建。

## 功能特性

- **Vue 3 & Vite**: 现代化的前端开发体验。
- **Docker 容器化**: 包含完整的 Docker 构建与运行配置。
- **动态配置注入**: 支持在 Docker 运行时通过环境变量注入 `referrerHost` 白名单，无需重新构建镜像。
- **CI/CD**: 集成 GitHub Actions 自动构建与发布流程。

## 快速开始

### 本地开发

1. **安装依赖**

   ```bash
   npm install
   ```

2. **启动开发服务器**

   ```bash
   npm run dev
   ```

   本地开发时，配置读取自 `public/config.js` 文件。

3. **构建生产版本**

   ```bash
   npm run build
   ```

## Docker 部署与配置注入

本项目采用了**运行时配置注入**方案。`referrerHost`（允许的来源域名列表）不再硬编码在构建产物中，而是可以在容器启动时通过环境变量动态指定。

### 1. 构建镜像

```bash
docker build -t kaikaio-sso-login .
```

### 2. 运行容器（重点）

使用 `REFERRER_HOSTS` 环境变量来设置白名单域名。多个域名请使用**逗号**分隔。

**参数说明**：

- `-e REFERRER_HOSTS="..."`:  指定允许的 Referrer Host 列表，逗号分隔，不要包含空格（除非域名本身包含空格，这通常是不可能的）。

**运行示例**：

```bash
# 运行容器，并配置两个允许的域名
docker run -d -p 80:80 \
  -e REFERRER_HOSTS="https://kaikaio.com,https://admin.kaikaio.com,http://localhost:3000" \
  --name sso-login \
  kaikaio-sso-login
```

### 原理说明

1. 容器启动时，入口脚本 `docker-entrypoint.sh` 会读取 `REFERRER_HOSTS` 环境变量。
2. 脚本会根据该变量动态生成 `/usr/share/nginx/html/config.js` 文件。
3. 浏览器加载页面时，会先加载 `config.js`，将配置挂载到 `window.APP_CONFIG`。
4. 应用代码从 `window.APP_CONFIG.referrerHost` 读取白名单。

## CI/CD 流程

本项目包含 GitHub Actions 配置文件 (`.github/workflows/ci.yml`)。

**触发条件**：

- 推送到 `main` 或 `master` 分支。
- 提交 Pull Request 到 `main` 或 `master` 分支。

**自动执行**：

- 自动构建 Docker 镜像。
- 如果是 Push 事件，会自动推送到 DockerHub（需要配置 Secrets）。

**所需 Secrets**：
请在 GitHub 仓库的 Settings -> Secrets and variables -> Actions 中配置：

- `DOCKERHUB_USERNAME`: DockerHub 用户名
- `DOCKERHUB_TOKEN`: DockerHub Access Token
