<template>
  <el-form
    ref="v_loginForm"
    :model="ruleForm"
    :rules="rules"
    label-position="top"
    hide-required-asterisk
    label-width="100px">
    <el-form-item label="用户名" prop="username">
      <el-input v-model="ruleForm.username"></el-input>
    </el-form-item>
    <el-form-item label="密码：" prop="password">
      <el-input type="password" v-model="ruleForm.password"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button class="login-btn" type="primary" @click="submitForm">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'

const LoginForm = defineComponent({
  name: 'LoginForm',
  emits:{
    'loginInfo': payload => {
      if(payload) {
        return true
      }
      console.warn('用户名或者密码不可为空')
      return false
    },
  },
  setup(props, { emit }) {

    const v_loginForm = ref(null);
    const ruleForm = reactive({
      username: '',
      password: ''
    })

    const rules = {
      username: [
        { required: true, message: '用户名不能为空', trigger: 'blur' },
      ],
      password: [
        { required: true, message: '密码不能为空 ', trigger: 'blur' },
      ],
    }

    const submitForm = () => {
      v_loginForm.value.validate((valid) => {
        if (valid) { // Check Pass
          emit('loginInfo', ruleForm);
          return;
        }
        emit('loginInfo', false);
      });
    }

    return {
      ruleForm,
      rules,
      submitForm,
      v_loginForm
    }
  },
})


export default LoginForm

</script>

<style>
.login-btn {
  width: 100%;
}
</style>