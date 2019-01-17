import { Component } from "./utils.js";
import { sharedStyle } from "./shared-style.js";
import { store } from "./store.js";
import { changeLocation } from "./actions.js";

import "./hn-tab.js";
import "./hn-list.js";
import "./hn-item.js";
import "./hn-spinner.js";

class HnApp extends Component.withStore(store) {
  render() {
    return `
      <style>
        ${sharedStyle}
        :host {
          background: #fefefe;
        }
        header {
          position: sticky;
          display: flex;
          flex-flow: row;
          top: 0;
          background: #fefefe;
          padding-bottom: 0.1px;
        }
        h1 {
          font-size: 1.1em;
        }
        main[page="list"] :not(hn-list) {
          display: none;
        }
        main[page="item"] :not(hn-item) {
          display: none;
        }
      </style>
      <header>
        <h1>HN</h1>
        <hn-tab></hn-tab>
      </header>
      <main>
        <hn-list></hn-list>
        <hn-item></hn-item>
      </main>
      <hn-spinner></hn-spinner>
    `;
  }

  didRender($) {
    this.$main = $("main");

    const navigate = () => {
      const path = location.hash.slice(1).replace(/^\//, "");
      changeLocation(path);
    };
    window.addEventListener("popstate", navigate);
    navigate();
  }

  stateChanged(state, prevState) {
    if (state.page !== prevState.page) {
      this.$main.setAttribute("page", state.page);
    }
  }
}

customElements.define("hn-app", HnApp);
