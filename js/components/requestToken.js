export default {
  template: `
  <div className="flex column center">
    <span className="flex column center">
        <label for="token_server">Host</label>
        <input id="token_server" type="text" v-model="token_server"/>
    </span>
    <fieldset className="flex column center">
        <legend>Basic Auth</legend>
        <span className="flex column center">
          <label for="client">client</label>
          <input id="client" type="text" v-model="client"/>
        </span>
        <span className="flex column center">
          <label for="secret">secret</label>
          <input id="secret" type="text" v-model="secret"/>
        </span>
    </fieldset>
    <fieldset className="flex column center">
        <legend>url-encoded data</legend>
        <span className="flex column center">
          <label for="redirect_uri">redirect_uri</label>
          <input id="redirect_uri" type="text" v-model="redirect_uri"/>
        </span>
        <span className="flex column center">
          <label for="grant_type">grant_type</label>
          <input id="grant_type" type="text" v-model="grant_type"/>
        </span>
        <span className="flex column center">
          <label for="code">code</label>
          <textarea id="code" cols="30" rows="6" v-bind:value="code"></textarea>
          <div class="tooltip">
                <button v-on:click.prevent="copyToClipboard" v-on:mouseout="outFunc" v-bind:value="code">
                  <span class="tooltiptext" id="myTooltip">{{myToolTip}}</span>
                  Copy
                </button>
            </div>
          </span>
    </fieldset>
    <input type="submit" @click.prevent="handleRequestToken"/>
  </div>
  `,
  props: {
    code: {type: String, required: true}
  },
  data(){
    return {
      token_server: 'http://your_endpoint/oauth2/token',
      client: null,
      secret: null,
      grant_type: 'authorization_code',
      redirect_uri: window.location.href.split('?')[0],
      myToolTip: "Copy to clipboard",
    }
  },
  watch: {
    token_server(cur, prev) {
      this.token_server = cur
    },
    client(cur, prev) {
      this.client = cur
    },
    secret(cur, prev) {
      this.secret = cur
    },
    grant_type(cur, prev) {
      this.grant_type = cur
    },
    redirect_uri(cur, prev) {
      this.redirect_uri = cur
    }
  },
  methods: {
    async handleRequestToken(e){
      sessionStorage.setItem('client', this.client)
      sessionStorage.setItem('secret', this.secret)
      sessionStorage.setItem('token_server', this.token_server)
      let headers = new Headers({
        'Content-type': "application/x-www-form-urlencoded",
        'Authorization': "Basic "+window.btoa(`${this.client}:${this.secret}`)
      })
      let urlencoded = new URLSearchParams({
        grant_type: this.grant_type,
        redirect_uri: this.redirect_uri,
        code: this.code
      });
      try {
        const res = await fetch(this.token_server,{
          method: 'POST',
          headers: headers,
          body: urlencoded,
          redirect: 'follow'
        })
        if (res.ok) {
          const data = await res.json()
          console.log(data)
          sessionStorage.setItem('access_token', data.token)
        }
      } catch (e) {
        console.log(e)
      }
    },
    copyToClipboard(e) {
      navigator.clipboard.writeText(e.target.value)
      this.myToolTip = 'Copied'
    },
    outFunc(e){
      this.myToolTip = 'Copy to clipboard'
    }
  },
  mounted(){
    if (sessionStorage.getItem('client') !== null) {
      this.client = sessionStorage.getItem('client')
    }
    if (sessionStorage.getItem('secret') !== null) {
      this.secret = sessionStorage.getItem('secret')
    }
    if (sessionStorage.getItem('token_server') !== null) {
      this.token_server = sessionStorage.getItem('token_server')
    }
  }
}
