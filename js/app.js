import loginForm from './components/loginForm.js';
const{ createApp } = Vue

const app = createApp({
  template: `
    <h1>Oauth2 debugger</h1>
    <loginForm></loginForm>
  `,
  components: {
    'loginForm': loginForm
  },
  data() {
    return {
      darkmode: false
    }
  },
  methods: {
    setdarkmode(){
      this.darkmode = !this.darkmode
    },
    colorSchema(mode) {
      return window.matchMedia(`(prefers-color-scheme: ${mode})`).matches
    }
  },
  watch: {
    darkmode(val){
      const appTheme = document.documentElement
      if (val) {
        appTheme.classList.add('light')
        appTheme.classList.remove('dark')
      } else {
        appTheme.classList.remove('light')
        appTheme.classList.add('dark')
      }
    }
  },
  mounted(){
    const appTheme = document.documentElement
    if (this.colorSchema('dark')) {
      this.darkmode = false
      appTheme.classList.remove('light')
      appTheme.classList.add('dark')
    }
    else {
      this.darkmode = true
      appTheme.classList.remove('light')
      appTheme.classList.add('dark')
    }
  }
})

app.mount('#app')
