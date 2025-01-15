import requestToken from "./requestToken.js";

export default {
  template: `
      <div className="flex column center">
        <span v-if="state" className="flex column center">
            <p v-if="state == origState">State is equal than response: <b>{{state}}</b> :)</p>
            <small v-else="">State not equal than original or is null</small>
        </span>
    </div>
    <requestToken v-if="code" :code="code"></requestToken>
  `,
  props: {
    response: {type: Object, required: true, default: null},
  },
  data() {
    return {
      code: null,
      state: null,
      nonce: null,
      origState: null
    }
  },
  mounted(){
    this.code = this.response.code
    this.state = this.response.state
    this.nonce = this.response.nonce
    this.origState = localStorage.getItem('state')
  },
  methods: {
  },
  components: {
    'requestToken': requestToken
  }
}
