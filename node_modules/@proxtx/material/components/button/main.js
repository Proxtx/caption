import {
  componentSetup,
  attributeChangedCallbackGen,
  applyType,
} from "../lib/component.js";
import { waveListener } from "../lib/effects.js";

export class Component {
  shadowDom;
  textElem;
  button;
  textComponent;
  type = "contained";
  colors;
  component = {};
  disabled;

  funcs = {
    text: (text) => {
      this.textComponent.values.text = text;
    },
    type: (newType) => {
      this.type = newType;
      this.applyType();
    },
    disabled: (disabled) => {
      this.button.disabled = disabled;
      this.disabled = disabled;
      this.typeClasses.global.disabled = disabled;
      this.applyType();
    },
  };

  typeClasses = {
    contained: { contained: true, hoverShadow: true },
    text: { text: true },
    outlined: { text: true, outlined: true },
    global: { disabled: false },
  };

  attributeChangedCallback = attributeChangedCallbackGen(this.funcs);

  constructor(options) {
    return (async () => {
      this.shadowDom = options.shadowDom;

      this.button = this.shadowDom.getElementById("button");
      this.textElem = this.shadowDom.getElementById("text");

      await uiBuilder.ready(this.textElem);

      this.textComponent = this.textElem.component.component;
      this.textComponent.run.styleSet("button");

      this.button.addEventListener("click", (e) => {
        this.updateColors();
        waveListener(e, this.button, this.colors.wave[this.type]);
      });
      this.applyType();

      componentSetup(options, this.funcs, this.component);

      this.updateColors();

      return this;
    })();
  }

  applyType = () => {
    applyType(this.type, this.button, this.typeClasses);
  };

  updateColors = () => {
    this.colors = {
      wave: {
        text: this.component.style.accentColor,
        contained: this.component.style.backgroundColor,
        outlined: this.component.style.accentColor,
      },
    };
  };
}
