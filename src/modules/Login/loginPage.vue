<template>
  <div id="login-page">
    <p class="login-title">Kaikaio-SSO-Login</p>
    <div class="login-wrapper" v-loading="loading">
      <LoginForm @loginInfo="getLoginInfo" />
    </div>
    <img class="login-img" src="http://static.kaikaio.com/article/v2-2d9808f88683a86c71e6c9b1b56277e8_r.jpg" alt="">
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
        iframe.src = referrer;
        console.log(referrer, 'referrer')
        console.log(iframe.src, 'referrer')
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
        console.log(err)
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
    right: -30%;
  }
  100% {
    opacity: 1;
    right: 7%;
  }
}

#login-page {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: #000;
  overflow: hidden;
}

#login-page .login-img {
  position: absolute;
  width: 50%;
  top: 30%;
  animation-name: play;
  animation-duration: 1s;
  animation-fill-mode: forwards;
  filter: blur(3px);
  transition: all .3s;
}

#login-page .login-img:hover {
  filter: blur(0px);
}

.login-wrapper {
  width: 30%;
  position: absolute;
  padding: 12px;
  box-shadow: #8d8d8d 0px 0px 12px;
  left: 20px;
  border-radius: 12px;
  border: 2px solid #8d8d8d;
}

.login-wrapper .el-form-item__label {
  color: #fff;
}

.login-title {
  color: #fff;
  font-weight: 700;
  font-size: 18px;
  text-align: center;
  margin-top: 20px;
}
</style>