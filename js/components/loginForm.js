import response from './response.js'

export default {
  template: `<div>
    <form v-show="!query?.code" @submit.prevent="handleSubmit">
      <label for="auth_uri">Authorize URI <small>(required)</small></label>
      <input id="auth_uri" placeholder="http://your_server/oauth2/authorize" type="text" v-model="auth_uri"/>
      <label for="redirect_uri">Redirect URI <small>(required)</small></label>
      <input id="redirect_uri" type="text" v-model="redirect_uri"/>
      <label for="client_id">Client ID <small>(required)</small></label>
      <input id="client_id" type="text" v-model="client_id"/>
      <label for="scope">Scope <small>(required)</small></label>
      <input id="scope" type="text" v-model="scope"/>
      <label for="state">State</label>
      <input id="state" type="text" v-model="state"/>
      <label for="nonce">Nonce</label>
      <input id="nonce" type="text" v-model="nonce"/>
      <label for="response_type">Response type <small>(required)</small></label>
      <fieldset id="response_type">
        <span>
            <label for="code">code</label>
            <input id="code" type="checkbox" v-model="code" value="code"/>
        </span>
        <span>
            <label for="token">token</label>
            <input id="token" type="checkbox" v-model="token" value="code"/>
        </span>
<!--        <span v-if="code">-->
<!--            <label for="pkce">use PKCE?</label>-->
<!--            <input id="pkce" type="checkbox" name="pkce" value="pkce"/>-->
<!--        </span>-->
      </fieldset>
            <fieldset>
      <legend>Response mode <small>required</small></legend>
        <span>
            <label for="query">query</label>
            <input id="code" type="radio" v-model="response_mode" value="query"/>
        </span>
        <span>
            <label for="form_post">form_post</label>
            <input id="form_post" type="radio" v-model="response_mode" value="form_post"/>
        </span>
        <span>
            <label for="fragment">fragment</label>
            <input id="fragment" type="radio" v-model="response_mode" value="fragment"/>
        </span>
      </fieldset>
      <label for="request">Request</label>
      <textarea id="request" v-model="textarea" cols="50" rows="12"></textarea>
      <input type="submit"/>
    </form>
    <response v-if="query" :response="query" :origState="state"></response>
</div>
  `,
  data(){
    return {
      data: null,
      auth_uri: null,
      redirect_uri: window.location.href.split('index.html')[0],
      client_id: 'client',
      scope: "read",
      state: this.generateState(),
      nonce: this.generateNonce(),
      response_type: "code",
      code: true,
      token: false,
      response_mode: "form_post",
      textarea: null,
      query: null
    }
  },
  mounted() {
    this.updateTextArea()
    const query = new URLSearchParams(window.location.search)
    Array.from(query).forEach(e =>
      this.query = {...this.query, [e[0]]: e[1] }
    )
    if (localStorage.getItem('auth_uri') !== null) {
      this.auth_uri = localStorage.getItem('auth_uri')
    }
    if(window.location.host.includes('127.0.0.1') || window.location.host.includes('localhost')) {
      this.redirect_uri = window.location.href.split('?')[0]
    }
  },
  watch: {
    auth_uri(cur, prev) {
      this.auth_uri = cur
      this.updateTextArea()
    },
    redirect_uri(cur, prev) {
      this.redirect_uri = cur
      this.updateTextArea()
    },
    client_id(cur,prev) {
      this.client_id = cur
      this.updateTextArea()
    },
    scope(cur, prev) {
      this.scope = cur
      this.updateTextArea()
    },
    state(cur, prev) {
      this.state = cur
      this.updateTextArea()
    },
    nonce(cur, prev) {
      this.nonce(cur)
      this.updateTextArea()
    },
    code(cur, prev) {
      this.code = cur
      this.updateResponseType()
    },
    token(cur, prev) {
      this.token = cur
      this.updateTextArea()
    },
    response_mode(cur, prev) {
      this.response_mode = cur
      this.updateTextArea()
    },
    textarea(cur, prev) {
      this.textarea = cur
    }
  },
  methods: {
    handleSubmit(e){
      localStorage.setItem('auth_uri', this.auth_uri);
      localStorage.setItem('state', this.state);
      window.location.href = this.textarea
    },
    updateTextArea(){
      let url = this.auth_uri+'?' + new URLSearchParams({
        client_id: this.client_id,
        redirect_uri: this.redirect_uri,
        scope: this.scope,
        response_type: this.response_type,
        response_mode: this.response_mode,
        state: this.state,
        nonce: this.nonce
      })
      let lineBreak = url.split('?')[0]+'?'+
        "\n"
      url.split('?')[1].split('&').forEach(string => {
        lineBreak += '&'+string+"\n"
      })
      this.textarea = lineBreak
    },
    updateResponseType(e) {
      this.response_type = this.code? 'code' : '' +this.token? ' token' : '';
      this.updateTextArea()
    },
    generateState() {
      let hex = '';
      for (let i = 0; i < 11; i++) {
        hex += Math.floor(Math.random() * 16).toString(16);
      }
      return hex;
    },
    generateNonce() {
      let hex = '';
      for (let i = 0; i < 10; i++) {
        hex += Math.floor(Math.random() * 16).toString(16);
      }
      return hex;
    }
  },
  components: {
    'response': response
  }
}

