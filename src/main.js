import { createApp } from 'vue'
import { 
  ElButton,
  ElLoading,
  ElMessage,
  ElForm,
  ElFormItem,
  ElInput,
} from 'element-plus';

import App from './App.vue'
import './index.css'

import 'element-plus/lib/theme-chalk/index.css';

const components = [
  ElButton,
  ElForm,
  ElFormItem,
  ElInput,
];

const plugins = [
  ElLoading,
  ElMessage,
];

const app = createApp(App);

app.config.globalProperties.$ELEMENT = { size: 'mini' };

components.forEach(component => {
  app.component(component.name, component)
});

plugins.forEach(plugin => {
  app.use(plugin)
});

app.mount('#app')
