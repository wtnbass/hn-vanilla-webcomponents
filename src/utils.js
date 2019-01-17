const createEvent = name => ({
  dispatch(detail) {
    window.dispatchEvent(new CustomEvent(name, { detail }));
  },
  subscribe(fn) {
    const listener = e => fn(e.detail);
    window.addEventListener(name, listener);
    return () => window.removeEventListener(name, listener);
  }
});

const genId = () => (Date.now() + Math.random()).toString(16);

export const createStore = (state = {}) => {
  const storeEvent = createEvent(`store-id::${genId()}`);
  let isUpdating = false;

  function updatingError() {
    if (isUpdating) {
      throw new Error("state is updating now");
    }
  }

  function updateState(nextState) {
    try {
      isUpdating = true;
      state = { ...state, ...nextState };
    } finally {
      isUpdating = false;
    }
  }

  return {
    getState() {
      updatingError();
      return state;
    },
    setState(nextState) {
      updatingError();
      updateState(nextState);
      storeEvent.dispatch(state);
    },
    subscribe(fn) {
      return storeEvent.subscribe(fn);
    }
  };
};

export class Component extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" }).appendChild(
      makeTemplate(this.render())
    );

    const $ = s => this.shadowRoot.querySelector(s);
    $.all = s => this.shadowRoot.querySelectorAll(s);

    this.didRender($);
  }

  render() {
    return "";
  }

  didRender($) {}
}

Component.withStore = store =>
  class extends Component {
    connectedCallback() {
      let prevState = {};

      const update = () => {
        const state = store.getState();
        this.stateChanged(state, prevState);
        prevState = state;
      };

      this.__unsubscribe__ = store.subscribe(update);
      update();
    }

    disconnectedCallback() {
      this.__unsubscribe__();
    }

    stateChanged(state, prevState) {}
  };

export const makeTemplate = html => {
  const tmpl = document.createElement("template");
  tmpl.innerHTML = html;
  return tmpl.content.cloneNode(true);
};

export const removeChildren = node => {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
};
