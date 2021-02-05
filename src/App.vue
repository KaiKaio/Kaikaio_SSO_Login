<template>
  <LoginForm />
</template>

<script>
import LoginForm from './modules/Login/loginPage.vue'
import { defineComponent } from 'vue'

const App = defineComponent({
  name: 'App',
  components: {
    LoginForm
  },

  setup() {
    return {}
  },
})

export default App
</script>
