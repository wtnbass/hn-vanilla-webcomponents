import { html, Component, connect, mount } from "./utils.js";
import { sharedStyle } from "./shared-style.js";
import { store } from "./store.js";

import "./hn-comment.js";

class HnItem extends connect(store)(Component) {
  mounted($) {
    this.$item = $(".item");
  }

  render() {
    return html`
      <style>
        ${sharedStyle}
      </style>
      <div class="item"></div>
    `;
  }

  static get observedState() {
    return ["item"];
  }

  stateChanged(state, prevState) {
    if (state.item === prevState.item || !state.item) return;

    const { item } = state;
    mount(
      html`
        <h3>
          ${item.content
            ? item.title
            : html`
                <a href="${item.url}" target="_blank" rel="noopener">
                  ${item.title}
                </a>
              `}
        </h3>
        <small>
          ${item.points} points by ${item.user} ${item.time_ago} |
          ${item.comments_count} comments
        </small>
        ${item.content
          ? html.unsafe`
              <p>${item.content}</p>
            `
          : ""}
        <div>${this.commentList(item.comments)}</div>
      `,
      this.$item
    );
  }

  commentList(comments) {
    if (!comments) return "";
    return comments.map(
      ({ id }) =>
        html`
          <hn-comment item-id=${id}></hn-comment>
        `
    );
  }
}

customElements.define("hn-item", HnItem);
