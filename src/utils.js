export const html = (strings, ...values) => ({
  strings,
  values,
  unsafe: false
});

export const unsafeHtml = (strings, ...values) => ({
  strings,
  values,
  unsafe: true
});

const render = ({ strings, values, unsafe }) =>
  strings.map((s, i) => s + resolveValue(values[i], unsafe)).join("");

const isTagged = maybeTagged =>
  typeof maybeTagged === "object" &&
  Array.isArray(maybeTagged.strings) &&
  Array.isArray(maybeTagged.values);

const resolveValue = (value, unsafe) => {
  if (value == null) return "";
  if (Array.isArray(value))
    return value.map(v => resolveValue(v, unsafe)).join("");
  if (isTagged(value)) return render(value);
  if (unsafe) return String(value);
  return String(value).replace(/[&"'`<>]/g, c => `&#${c.charCodeAt(0)};`);
};

const createNode = html => {
  const tmpl = document.createElement("template");
  tmpl.innerHTML = html;
  return tmpl.content;
};

export const removeChildren = node => {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
};

export const mount = (tagged, root) => {
  removeChildren(root);
  const html = render(tagged);
  root.appendChild(createNode(html));
};

const createComponentClass = ({ shadow }) =>
  class Component extends HTMLElement {
    constructor() {
      super();
      shadow && this.attachShadow({ mode: "open" });
      mount(this.render(), this.rootNode);

      const $ = s => this.rootNode.querySelector(s);
      $.all = s => this.rootNode.querySelectorAll(s);
      this.mounted($);
    }

    get rootNode() {
      return shadow ? this.shadowRoot : this;
    }

    render() {
      throw new Error("render() must be implemented.");
    }

    mounted($) {}
  };

export const LightComponent = createComponentClass({ shadow: false });

export const ShadowComponent = createComponentClass({ shadow: true });

export const createPubSub = name => ({
  publish(detail) {
    window.dispatchEvent(new CustomEvent(name, { detail }));
  },
  subscribe(f) {
    const l = e => f(e.detail);
    window.addEventListener(name, l);
    return () => window.removeEventListener(name, l);
  }
});

export const createStore = initialState => {
  let state = initialState;

  const { publish, subscribe } = createPubSub(
    `state(${String(Math.random()).slice(2)})`
  );

  return {
    getState() {
      return state;
    },
    setState(nextState) {
      state = { ...state, ...nextState };
      publish(state);
    },
    subscribe(f) {
      return subscribe(f);
    }
  };
};

export const connect = store => baseClass =>
  class extends baseClass {
    static get observedState() {
      return baseClass.constructor.observedState;
    }

    constructor() {
      super();
      let prevState = {};

      const shouldUpdate = (state, prevState) =>
        !this.observedState ||
        this.observedState.length === 0 ||
        this.observedState.some(name => state[name] === prevState[name]);

      this.__unsubscribe__ = store.subscribe(() => {
        const state = store.getState();
        if (shouldUpdate(state, prevState)) {
          this.stateChanged(state);
          prevState = state;
        }
      });

      const state = store.getState();
      this.stateChanged(state);
    }

    disconnectedCallback() {
      this.__unsubscribe__();
    }

    stateChanged(state) {}
  };
