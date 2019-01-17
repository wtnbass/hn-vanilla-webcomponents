import { store } from "./store.js";

export const changeLocation = path => {
  const paths = path.split("/");
  switch (paths[0]) {
    case "":
      return selectTab("news");
    case "new":
      return selectTab("newest");
    case "best":
    case "ask":
    case "show":
    case "jobs":
      return selectTab(path);
    case "item":
      return fetchItem(paths[1]);
    default:
      break;
  }
};

const selectTab = view => {
  store.setState({ view, page: "list" });
  return fetchList();
};

const requestList = () =>
  store.setState({
    isLoading: true,
    error: null,
    list: [],
    items: {}
  });

const successList = list =>
  store.setState({
    isLoading: false,
    list,
    items: mapify(list)
  });

const errorFetch = error =>
  store.setState({
    isLoading: false,
    error
  });

const requestItem = () =>
  store.setState({
    isLoading: true,
    error: null,
    item: {},
    comments: {}
  });

const successItem = item =>
  store.setState({
    isLoading: false,
    item,
    page: "item",
    comments: normalizeComments(item)
  });

const fetchList = () => {
  const { view } = store.getState();
  requestList();
  return fetch(`https://node-hnapi.herokuapp.com/${view}`)
    .then(res => res.json())
    .then(successList)
    .catch(errorFetch);
};

const fetchItem = id => {
  requestItem();
  return fetch(`https://node-hnapi.herokuapp.com/item/${id}`)
    .then(res => res.json())
    .then(successItem)
    .catch(errorFetch);
};

const mapify = list =>
  list.reduce(
    (items, item) => ({
      ...items,
      [item.id]: item
    }),
    {}
  );

const normalizeComments = item => {
  let comments = {};

  const reduce = _comments =>
    _comments.forEach(c => {
      comments = { ...comments, [c.id]: c };
      if (c.comments.length > 0) {
        reduce(c.comments);
      }
    });
  reduce(item.comments);

  return comments;
};
