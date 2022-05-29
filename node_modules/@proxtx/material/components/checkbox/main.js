import {
  componentSetup,
  addCustomEventManager,
  attributeChangedCallbackGen,
} from "../lib/component.js";

import { waveListenerCenter } from "../lib/effects.js";

export class Component {
  checkBox;
  wrap;
  component = {};
  funcs = {
    check: (check) => {
      this.checked = check;
    },
    switch: () => {
      this.funcs.check(!this.checked);
    },
  };
  options;
  shadowDom;
  attributeChangedCallback = attributeChangedCallbackGen(this.funcs);

  constructor(options) {
    this.options = options;
    this.shadowDom = options.shadowDom;
    this.checkBox = this.shadowDom.getElementById("checkbox");
    componentSetup(options, this.funcs, this.component);
    this.wrap = this.shadowDom.getElementById("wrap");
    this.wrap.addEventListener("click", (e) => {
      if (e.target != this.checkBox) this.funcs.switch();
    });
    this.wrap.addEventListener("click", (e) => {
      waveListenerCenter(e, this.wrap, this.component.style.accentColor);
    });

    addCustomEventManager(this.options.component, this.checkBox, [
      "change",
      "update",
    ]);
  }

  get checked() {
    return this.checkBox.checked;
  }

  set checked(check) {
    this.checkBox.checked = check;
  }
}
