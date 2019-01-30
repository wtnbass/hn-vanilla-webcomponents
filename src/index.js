import { store } from "./store.js";
import { sharedStyle } from "./shared-style.js";

import "./hn-app.js";

// style
const style = document.createElement("style");
style.data = sharedStyle;
document.head.appendChild(style);

// title
const $title = document.querySelector("title");
store.subscribe(() => {
  const title = getTitle(store.getState());
  if ($title.innerHTML !== title) {
    $title.innerHTML = title;
  }
});

const getTitle = state => {
  let title = "HN";
  let moreInfo;
  if (state.page === "list") {
    moreInfo = state.view;
  } else if (state.page === "item") {
    moreInfo = state.item.title;
  }

  if (moreInfo) {
    title += " - " + moreInfo;
  }
  return title;
};
