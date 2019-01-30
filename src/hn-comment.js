import { html, unsafeHtml, ShadowComponent, connect } from "./utils.js";
import { sharedStyle } from "./shared-style.js";
import { store } from "./store.js";

class HnComment extends connect(store)(ShadowComponent) {
  render() {
    const id = this.getAttribute("item-id");
    const state = store.getState();
    const { user, time_ago, content, comments } = state.comments[id];

    return html`
      <style>
        ${sharedStyle} details {
          margin: 3px 0;
        }
        summary {
          font-size: 0.9em;
          color: grey;
        }
        p {
          line-height: 1.1em;
        }
        .child {
          padding-left: 17px;
        }
      </style>
      <details open>
        <summary>${user} ${time_ago}</summary>
        <p>${unsafeHtml`${content}`}</p>
        <div class="child">
          ${this.commentList(comments)}
        </div>
      </details>
    `;
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

customElements.define("hn-comment", HnComment);
