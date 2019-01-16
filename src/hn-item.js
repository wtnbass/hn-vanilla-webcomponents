import { Component, makeTemplate, removeChildren } from "./wclib.js";
import { sharedStyle } from "./shared-style.js";
import { store } from "./store.js";

import "./hn-comment.js";

class HnItem extends Component.withStore(store) {
  didRender($) {
    this.$item = $(".item");
  }

  render() {
    return `
      <style>
        ${sharedStyle}
      </style>
      <div class="item"></div>
    `;
  }

  stateChanged(state, prevState) {
    if (state.item !== prevState.item && state.item) {
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

      removeChildren(this.$item);
      this.$item.appendChild(
        makeTemplate(`
          <h3>
            ${content ? title : `<a href="${url}" target="_blank">${title}</a>`}
          </h3>
          <small>
            ${points} points by ${user} ${time_ago}
            | ${comments_count} comments
          </small>
          ${content ? `<p>${content}</p>` : ""}
          <div>${this.commentList(comments)}</div>
        `)
      );
    }
  }

  commentList(comments) {
    if (!comments) return "";
    return comments
      .map(({ id }) => `<hn-comment item-id=${id}></hn-comment>`)
      .join("");
  }
}

customElements.define("hn-item", HnItem);
