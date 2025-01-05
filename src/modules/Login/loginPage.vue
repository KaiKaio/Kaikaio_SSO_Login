<template>
  <div id="login-page">
    <div class="login-wrapper" v-loading="loading">
      <p class="login-title">Kaikaio</p>
      <LoginForm @loginInfo="getLoginInfo" />
    </div>
    <img class="login-img" src="https://www.bing.com/th?id=OHR.VietnamFalls_ZH-CN9659529108_1920x1080.webp&qlt=50" alt="login_bg">
  </div>
</template>

<script>
import { defineComponent, reactive, ref } from 'vue'
import LoginForm from '../../components/LoginForm.vue'
import axios from '../../config/request';
import jsencrypt from 'jsencrypt';
import { referrerHost } from '../../config/referrerHost'

const LoginPage = defineComponent({
  name: 'LoginPage',
  components: {
    LoginForm
  },
  setup() {
    let loading = ref(true);
    let { referrer } = document;
    const rightful = referrerHost.indexOf(referrer) > -1;
    if(!(referrer && rightful)) {
      referrer = referrerHost[0]
    }
    console.log(referrer, 'referrer')
    const encrypt = new jsencrypt();
    axios.get('/user/public_key').then(({data: {msg}}) => {
      encrypt.setPublicKey(msg);
      loading.value = false;
    })
    const getLoginInfo = ({username, password}) => {
      axios.post('/user/login', {
        userName: username,
        password: encrypt.encrypt(password),
      }).then(({data: { token }}) => {
        window.addEventListener('message', ({data: { msg }}) => {
          if(msg === 'token received') {
            iframe.remove();
            window.location.href = referrer
          }
        }, false);

        const iframe = document.createElement("iframe");
        console.log(referrer, 'iframereferrer')
        iframe.src = referrer;
        iframe.style.display = "none";
        document.body.append(iframe);
        iframe.onload = () => {
          // iframe加载完成后要进行的操作
          iframe.contentWindow.postMessage({
            token,
            method: 'setToken',
          }, referrer);
        }
      }).catch((err) => {
        console.warn(err)
      })
    }
    return {
      loading,
      getLoginInfo
    }
  },
})


export default LoginPage
</script>

<style>
@keyframes play {
  0% {
    opacity: 0;
    /* right: -30%; */
  }
  100% {
    opacity: 1;
    /* right: 7%; */
  }
}

#login-page {
  color: #fff;
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

#login-page .login-img {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  object-fit: cover;
  z-index: -1;
  /* animation-name: play;
  animation-duration: 1s;
  animation-fill-mode: forwards;
  filter: blur(3px); */
  transition: all .3s;
}

#login-page .login-img:hover {
  filter: blur(0px);
}

.login-wrapper {
  width: 300px;
  position: absolute;
  padding: 0px 24px 0px 24px;
  box-shadow: #8d8d8d 0px 2px 4px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 3px;
  border: 1px solid #8d8d8d;
  background-color: rgba(0, 0, 0, 0.6);
}

.login-wrapper .el-form-item__label {
  color: #fff;
}

.login-title {
  font-weight: 700;
  font-size: 18px;
  text-align: center;
  margin-top: 12px;
}
</style>