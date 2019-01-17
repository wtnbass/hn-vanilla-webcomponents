import { createStore } from "./utils.js";

export const store = createStore({
  isLoading: false,
  error: null,
  list: [],
  items: {},
  item: null,
  comments: {},
  page: "",
  view: "news"
});
