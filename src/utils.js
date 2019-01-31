export const html = (strings, ...values) => ({ strings, values });

html.unsafe = (strings, ...values) => ({ strings, values, unsafe: true });

export const render = ({ strings, values, unsafe }) =>
  strings.map((s, i) => s + resolve(values[i], unsafe)).join("");

const isTagged = maybeTagged =>
  typeof maybeTagged === "object" &&
  Array.isArray(maybeTagged.strings) &&
  Array.isArray(maybeTagged.values);

const resolve = (value, unsafe) => {
  if (value == null) return "";
  if (Array.isArray(value)) return value.map(v => resolve(v, unsafe)).join("");
  if (isTagged(value)) return render(value);
  if (unsafe) return String(value);
  return String(value).replace(/[&"'`<>]/g, c => `&#${c.charCodeAt(0)};`);
};

export const mount = (tagged, root) => {
  while (root.firstChild) {
    root.removeChild(root.firstChild);
  }
  const tmpl = document.createElement("template");
  tmpl.innerHTML = render(tagged);
  root.appendChild(tmpl.content);
};

export class Component extends HTMLElement {
  static get useShadow() {
    return true;
  }

  constructor() {
    super();

    let rootNode = this;
    if (this.constructor.useShadow) {
      rootNode = this.attachShadow({ mode: "open" });
    }

    mount(this.render(), rootNode);

    const $ = s => rootNode.querySelector(s);
    $.all = s => rootNode.querySelectorAll(s);
    this.mounted($);
  }

  render() {
    throw new Error("render() must be implemented.");
  }

  mounted($) {}
}

export const createStore = initialState => {
  let state = initialState;
  let listeners = [];

  return {
    getState() {
      return state;
    },
    setState(nextState) {
      state = { ...state, ...nextState };
      listeners.forEach(l => l());
    },
    subscribe(f) {
      listeners.push(f);
      return () => this.unsubscribe(f);
    },
    unsubscribe(f) {
      listeners = listeners.filter(l => l !== f);
    }
  };
};

export const connect = store => baseClass =>
  class extends baseClass {
    constructor() {
      super();
      let prevState = {};

      this.__unsubscribe__ = store.subscribe(() => {
        const state = store.getState();
        this.stateChanged(state, prevState);
        prevState = state;
      });

      const state = store.getState();
      this.stateChanged(state, prevState);
    }

    disconnectedCallback() {
      this.__unsubscribe__();
    }

    stateChanged(state, prevState) {}
  };
