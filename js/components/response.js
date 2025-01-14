export default {
  template: `
      <div className="flex column center">
        <span v-if="state" className="flex column center">
            <p v-if="state == origState">State is equal than response: <b>{{state}}</b> :)</p>
            <small v-else="">State not equal than original or is null</small>
        </span>
        <span v-if="code" className="flex column center">
            <label for="responseCode">Response code</label>
            <textarea id="responseCode" cols="50" rows="6">{{code}}</textarea>
            <div class="tooltip">
                <button v-on:click.prevent="copyToClipboard" v-on:mouseout="outFunc" v-bind:value="code">
                  <span class="tooltiptext" id="myTooltip">{{myToolTip}}</span>
                  Copy
                </button>
            </div>
        </span>
    </div>
  `,
  props: {
    response: {type: Object, required: true, default: null},
    origState: {type: String, default: null}
  },
  data() {
    return {
      code: null,
      state: null,
      nonce: null
    }
  },
  mounted(){
    this.code = this.response.code
    this.state = this.response.state
    this.nonce = this.response.nonce
  },
  methods: {
    copyToClipboard(e) {
      navigator.clipboard.writeText(e.target.value)
      this.myToolTip = 'Copied'
    },
    outFunc(e){
      this.myToolTip = 'Copy to clipboard'
    }
  }
}
