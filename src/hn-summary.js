import { html, Component } from "./utils.js";
import { sharedStyle } from "./shared-style.js";
import { store } from "./store.js";

class HnSummary extends Component {
  render() {
    const id = this.getAttribute("item-id");
    const state = store.getState();
    const news = state.items[id];

    return html`
      <style>
        ${sharedStyle} .summary {
          margin: 2px;
          letter-spacing: -0.01em;
        }
        .summary-details {
          color: #3e3e3e;
        }
        .summary-details a {
          color: #3e3e3e !important;
        }
      </style>
      <div class="summary">
        ${news.domain
          ? html`
              <a class="title" href=${news.url} target="_blank" rel="noopener">
                ${news.title}
              </a>
              <small>(${news.domain})</small>
            `
          : html`
              <a class="title" href="#/item/${news.id}">${news.title}</a>
            `}
        <div class="summary-details">
          <small>
            ${news.points} points by ${news.user} ${news.time_ago} |
            <a href="#item/${news.id}" class="comments">
              ${news.comments_count} comments
            </a>
          </small>
        </div>
      </div>
    `;
  }
}
customElements.define("hn-summary", HnSummary);
