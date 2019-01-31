import { html, Component } from "./utils.js";
import { sharedStyle } from "./shared-style.js";

class HnSpinner extends Component {
  mounted($) {
    this.$spinner = $(".spinner");
  }
  render() {
    return html`
      <style>
        ${sharedStyle} :host(hidden) {
          display: none;
        }
        .spinner {
          position: absolute;
          top: calc(50% - 50px);
          left: calc(50% - 50px);
          width: 100px;
          height: 100px;
          border-radius: 50%;
          border: 5px solid #eee;
          border-left-color: #bbb;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      </style>
      <div class="spinner"></div>
    `;
  }
}

customElements.define("hn-spinner", HnSpinner);
