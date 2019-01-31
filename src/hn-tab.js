import { html, Component, connect } from "./utils.js";
import { sharedStyle } from "./shared-style.js";
import { store } from "./store.js";

class HnTab extends connect(store)(Component) {
  mounted($) {
    this.$tabs = $.all("[data-view]");
  }

  render() {
    return html`
      <style>
        ${sharedStyle} ul {
          display: flex;
          flex-flow: row;
          list-style: none;
        }
        li {
          margin: 0 5px;
          padding: 0 5px;
        }
        li.selected {
          border-bottom: 2px solid #ff1243;
          cursor: default;
        }
        a {
          color: black !important;
          text-decoration: none;
        }
      </style>
      <nav>
        <ul class="tab">
          <li data-view="news"><a href="#/">News</a></li>
          <li data-view="newest"><a href="#/new">New</a></li>
          <li data-view="best"><a href="#/best">Best</a></li>
          <li data-view="ask"><a href="#/ask">Ask</a></li>
          <li data-view="show"><a href="#/show">Show</a></li>
          <li data-view="jobs"><a href="#/jobs">Job</a></li>
        </ul>
      </nav>
    `;
  }

  static get observedState() {
    return ["view"];
  }

  stateChanged(state, prevState) {
    if (state.view === prevState.view) return;
    this.$tabs.forEach(node => {
      if (node.dataset.view === state.view) {
        node.classList.add("selected");
      } else {
        node.classList.remove("selected");
      }
    });
  }
}

customElements.define("hn-tab", HnTab);
