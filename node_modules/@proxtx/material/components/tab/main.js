import {
  componentSetup,
  attributeChangedCallbackGen,
} from "../lib/component.js";

export class Component {
  component = {};
  funcs = {};
  options;
  shadowDom;
  attributeChangedCallback = attributeChangedCallbackGen(this.funcs);

  constructor(options) {
    this.options = options;
    this.shadowDom = options.shadowDom;
    componentSetup(options, this.funcs, this.component);
  }
}
