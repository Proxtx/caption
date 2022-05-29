import {
  componentSetup,
  applyStyleSet,
  attributeChangedCallbackGen,
} from "../lib/component.js";

export class Component {
  args;
  textElem;
  component = {};

  constructor(args) {
    this.args = args;
    this.textElem = this.args.shadowDom.getElementById("text");
    componentSetup(args, this.funcs, this.component);
    this.component.run.styleSet("default");
  }

  funcs = {
    text: (text) => {
      this.textElem.innerText = text;
    },
    styleSet: (name) => {
      applyStyleSet(this.styleSets[name], this.component);
    },
  };

  styleSets = {
    button: {
      letterSpacing: "1px",
      fontWeight: "600",
      textTransform: "uppercase",
      userSelect: "none",
      fontSize: "0.875rem",
      lineHeight: "1.75",
    },

    default: {
      letterSpacing: "unset",
      fontWeight: "unset",
      textTransform: "unset",
      userSelect: "unset",
      fontSize: "calc(100% * var(--scale))",
      lineHeight: "unset",
    },
  };

  attributeChangedCallback = attributeChangedCallbackGen(this.funcs);
}
