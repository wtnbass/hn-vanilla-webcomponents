import { Component } from "./wclib.js";
import { sharedStyle } from "./shared-style.js";
import { store } from "./store.js";

class HnSpinner extends Component.withStore(store) {
  didRender($) {
    this.$spinner = $(".spinner");
  }
  render() {
    return `
      <style>
        ${sharedStyle}
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
          from { transform: rotate(0deg) }
          to { transform: rotate(360deg) }
        }
      </style>
      <div class="spinner"></div>
    `;
  }

  stateChanged(state, prevState) {
    if (state.isLoading === prevState.isLoading) return;

    const { isLoading } = state;
    this.$spinner.style.display = isLoading ? "" : "none";
  }
}

customElements.define("hn-spinner", HnSpinner);
