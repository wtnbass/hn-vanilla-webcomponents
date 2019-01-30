import { html, unsafeHtml, ShadowComponent, connect, mount } from "./utils.js";
import { sharedStyle } from "./shared-style.js";
import { store } from "./store.js";

import "./hn-comment.js";

class HnItem extends connect(store)(ShadowComponent) {
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

  stateChanged(state) {
    if (!state.item) return;
    const {
      url,
      title,
      points,
      user,
      time_ago,
      comments,
      comments_count,
      content
    } = state.item;

    mount(
      html`
        <h3>
          ${content
            ? title
            : html`
                <a href="${url}" target="_blank">${title}</a>
              `}
        </h3>
        <small>
          ${points} points by ${user} ${time_ago} | ${comments_count} comments
        </small>
        ${content
          ? unsafeHtml`
              <p>${content}</p>
            `
          : ""}
        <div>${this.commentList(comments)}</div>
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
