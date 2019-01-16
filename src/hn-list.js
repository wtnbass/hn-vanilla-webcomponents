import { Component, makeTemplate, removeChildren } from "./wclib.js";
import { sharedStyle } from "./shared-style.js";
import { store } from "./store.js";

import "./hn-summary.js";

class HnList extends Component.withStore(store) {
  didRender($) {
    this.$list = $(".list");
  }

  render() {
    return `
      <style>
        ${sharedStyle}
        ul {
          list-style: none;
        }
        li {
          margin: 7px 0;
        }
      </style>
      <ul class="list"></ul>
    `;
  }

  createList(list) {
    for (const news of list) {
      this.$list.appendChild(
        makeTemplate(`
          <li>
            <hn-summary item-id=${news.id}></hn-summary>
          </li>
        `)
      );
    }
  }

  stateChanged(state, prevState) {
    if (state.list !== prevState.list) {
      removeChildren(this.$list);
      this.createList(state.list);
    }
    if (state.error) {
      removeChildren(this.$list);
      this.$list.appendChild(document.createTextNode("Error"));
    }
  }
}

customElements.define("hn-list", HnList);
