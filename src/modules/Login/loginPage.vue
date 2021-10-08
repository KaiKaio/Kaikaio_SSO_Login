<template>
  <div id="login-page">
    <div class="login-wrapper" v-loading="loading">
      <img
        class="login-img"
        src="http://static.kaikaio.com/article/v2-2d9808f88683a86c71e6c9b1b56277e8_r.jpg"
        alt=""
      />
      <div class="login-form-wrapper">
        <div class="logo">
          <svg class="icon logo-icon" aria-hidden="true">
            <use xlink:href="#icon-cat"></use>
          </svg>
          <h3>Kaikaio - SSO</h3>
        </div>
        
        <LoginForm class="login-form" @loginInfo="getLoginInfo" />
      </div>
      
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, ref } from "vue";
import LoginForm from "../../components/LoginForm.vue";
import axios from "../../config/request";
import jsencrypt from "jsencrypt";
import { referrerHost } from "../../config/referrerHost";

const LoginPage = defineComponent({
  name: "LoginPage",
  components: {
    LoginForm,
  },
  setup() {
    let loading = ref(true);
    let { referrer } = document;
    const encrypt = new jsencrypt();

    axios
      .get("/user/verifyToken")
      .then(
        () => {
          if (referrer) {
            handleReferrer(localStorage.token);
          }
        },
        (err) => {
          console.error(err, " => Token 失效");
          return new Promise((resolve, reject) => {
            resolve();
          });
        }
      )
      .then(() => {
        const rightful = referrerHost.indexOf(referrer) > -1;
        if (!(referrer && rightful)) {
          referrer = referrerHost[0];
        }

        return axios.get("/user/public_key");
      })
      .then(({ data: { msg } }) => {
        encrypt.setPublicKey(msg);
        loading.value = false;
      });

    const getLoginInfo = ({ username, password }) => {
      axios
        .post("/user/login", {
          userName: username,
          password: encrypt.encrypt(password),
        })
        .then(({ data: { token } }) => {
          localStorage.setItem("token", token);

          handleReferrer(token);
        })
        .catch((err) => {
          console.warn(err);
        });
    };

    const handleReferrer = (token) => {
      window.addEventListener(
        "message",
        ({ data: { msg } }) => {
          if (msg === "token received") {
            iframe.remove();
            window.location.href = referrer;
          }
        },
        false
      );

      const iframe = document.createElement("iframe");
      console.log(referrer, "iframeReferrer");
      iframe.src = referrer;
      iframe.style.display = "none";
      document.body.append(iframe);
      iframe.onload = () => {
        // iframe加载完成后要进行的操作
        iframe.contentWindow.postMessage(
          {
            token,
            method: "setToken",
          },
          referrer
        );
      };
    };
    return {
      loading,
      getLoginInfo,
    };
  },
});

export default LoginPage;
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
  min-width: 240px;
  min-height: 500px;
  width: 100vw;
  height: 100vh;
  background-color: #f0f6ff;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

#login-page .login-img {
  border-radius: 12px 0px 0px 12px;
  width: 60%;
  object-fit: cover;
  object-position: center;
}

#login-page .login-wrapper {
  min-width: inherit;
  min-height: inherit;
  width: 80%;
  height: 70%;
  box-shadow: #ccc 4px 4px 6px;
  background-color: #fff;
  border-radius: 12px;
  display: flex;
}

#login-page .login-wrapper .login-form-wrapper {
  flex: 1;
  padding: 8px 8px 8px 8px;
}

#login-page .login-wrapper .login-form-wrapper .login-form {
  margin-top: 36px;
  margin-right: 20px;
}

#login-page .login-wrapper .login-form-wrapper .logo {
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

#login-page .login-wrapper .login-form-wrapper .logo .logo-icon {
  width: 50px;
  height: 50px;
}

#login-page .login-wrapper .login-form-wrapper .logo > h3 {
  font-size: 28px;
  line-height: 28px;
  font-weight: bold;
  color: #555;
}


.login-wrapper .el-form-item__label {
  color: #333;
}
</style>
