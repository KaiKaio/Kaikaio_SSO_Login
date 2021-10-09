<template>
  <div id="login-page">
    <div class="login-wrapper" v-loading="loading">
      <!-- <img
        class="login-img"
        src="http://static.kaikaio.com/article/v2-2d9808f88683a86c71e6c9b1b56277e8_r.jpg"
        alt=""
      /> -->

      <div class="swiper-container login-swiper">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="imgItem in imgList" :key="imgItem.hsh">
            <img :src="`https://cn.bing.com${imgItem.url}`" alt="" />
          </div>
        </div>
        <!-- 如果需要分页器 -->
        <div class="swiper-pagination"></div>

        <div class="swiper-button-prev"></div>
        <!--左箭头。如果放置在swiper-container外面，需要自定义样式。-->
        <div class="swiper-button-next"></div>
        <!--右箭头。如果放置在swiper-container外面，需要自定义样式。-->
      </div>

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
import { defineComponent, reactive, ref, onMounted } from "vue";
import LoginForm from "../../components/LoginForm.vue";
import axios from "../../config/request";
import jsencrypt from "jsencrypt";
import { referrerHost } from "../../config/referrerHost";

import Swiper, {
  Autoplay,
  EffectCoverflow,
  EffectFade,
  Pagination,
  Navigation,
} from "swiper";
Swiper.use([Autoplay, EffectCoverflow, EffectFade, Pagination, Navigation]);
import "swiper/swiper-bundle.min.css";
import "swiper/swiper.less";


const LoginPage = defineComponent({
  name: "LoginPage",
  components: {
    LoginForm,
  },
  setup() {
    onMounted(() => {
      new Swiper(".login-swiper", {
        pagination: {
          el: ".swiper-pagination",
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
          hideOnClick: true,
        },
        autoplay: {
          delay: 3000,
          disableOnInteraction: true, // 用户操作Swiper之后，是否禁止Autoplay。默认为true：停止
        },
        effect: 'fade',
        on: {
          navigationShow: function () {
            console.log("按钮显示了");
          },
        },
      });
    })

    let loading = ref(true);
    let imgList = ref([]);
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
    
    axios.get('/fetchBingWallpaper').then((res) => {
      imgList.value = res.data.data
    })

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
      imgList,
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

#login-page .login-img {
  border-radius: 12px 0px 0px 12px;
  
  object-fit: cover;
  object-position: center;
}

#login-page .login-wrapper .login-swiper {
  width: 60%;
}

#login-page .login-wrapper .login-swiper .swiper-slide > img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

#login-page .login-wrapper .login-form-wrapper {
  flex: 1;
  padding: 40px 8px 8px 8px;
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
