import { html, Component, connect, mount } from "./utils.js";
import { sharedStyle } from "./shared-style.js";
import { store } from "./store.js";

import "./hn-summary.js";

class HnList extends connect(store)(Component) {
  mounted($) {
    this.$list = $(".list");
  }

  render() {
    return html`
      <style>
        ${sharedStyle} ul {
          list-style: none;
        }
        li {
          margin: 7px 0;
        }
      </style>
      <ul class="list"></ul>
    `;
  }

  static get observedState() {
    return ["list"];
  }

  stateChanged(state, prevState) {
    if (state.list === prevState.list) return;
    mount(
      html`
        ${
          state.list.map(
            news => html`
              <li><hn-summary item-id=${news.id}></hn-summary></li>
            `
          )
        }
      `,
      this.$list
    );
  }
}

customElements.define("hn-list", HnList);
