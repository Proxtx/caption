import {
  componentSetup,
  attributeChangedCallbackGen,
  applyType,
  addCustomEventManager,
} from "../lib/component.js";

export class Component {
  component = {};
  funcs = {
    type: (type) => {
      this.type = type;
      this.applyType();
    },
    placeholder: (placeholder) => {
      this.placeholder.innerText = placeholder;
    },
    value: (value) => {
      this.value = value;
    },
  };
  options;
  shadowDom;
  type = "outlined";
  focused = false;
  input;
  placeholder;
  line;
  attributeChangedCallback = attributeChangedCallbackGen(this.funcs);
  typeClasses = {
    input: {
      outlined: {
        input: true,
        inputOutlined: true,
      },
      standard: {
        input: true,
        inputStandard: true,
      },
      filled: {
        input: true,
        inputFilled: true,
      },
    },
    placeholder: {
      outlined: {
        focusedNotActive: {
          placeholderAccentColor: true,
          placeholderOutlinedTop: true,
        },
        focusedActive: {
          placeholderAccentColor: true,
          placeholderOutlinedTop: true,
        },
        notFocusedNotActive: {
          placeholderOutlinedNormal: true,
          placeholderNormalColor: true,
        },
        notFocusedActive: {
          placeholderOutlinedTop: true,
          placeholderNormalColor: true,
        },
      },
      standard: {
        focusedNotActive: {
          placeholderAccentColor: true,
          placeholderOutlinedTop: true,
          placeholderStandard: true,
        },
        focusedActive: {
          placeholderAccentColor: true,
          placeholderOutlinedTop: true,
          placeholderStandard: true,
        },
        notFocusedNotActive: {
          placeholderOutlinedNormal: true,
          placeholderStandard: true,
          placeholderNormalColor: true,
        },
        notFocusedActive: {
          placeholderOutlinedTop: true,
          placeholderStandard: true,
          placeholderNormalColor: true,
        },
      },
      filled: {
        focusedNotActive: {
          placeholderOutlinedTop: true,
          placeholderFilledTop: true,
          placeholderAccentColor: true,
        },
        focusedActive: {
          placeholderOutlinedTop: true,
          placeholderFilledTop: true,
          placeholderAccentColor: true,
        },
        notFocusedNotActive: {
          placeholderOutlinedNormal: true,
          placeholderNormalColor: true,
        },
        notFocusedActive: {
          placeholderOutlinedTop: true,
          placeholderFilledTop: true,
          placeholderNormalColor: true,
        },
      },
    },
    line: {
      outlined: {
        focused: {
          hidden: true,
        },
        notFocused: {
          hidden: true,
        },
      },
      standard: {
        focused: {
          lineFocus: true,
        },
        notFocused: {
          lineNoFocus: true,
        },
      },
      filled: {
        focused: {
          lineFocus: true,
        },
        notFocused: {
          lineNoFocus: true,
        },
      },
    },
    wrap: {
      outlined: {
        wrapOutlined: true,
      },
      standard: {
        wrapStandard: true,
      },
      filled: {
        wrapFilled: true,
      },
    },
  };

  constructor(options) {
    this.options = options;
    this.shadowDom = options.shadowDom;
    this.placeholder = this.shadowDom.getElementById("placeholder");
    this.line = this.shadowDom.getElementById("line");
    this.wrap = this.shadowDom.getElementById("wrap");
    this.input = this.getInput();
    componentSetup(options, this.funcs, this.component);
    this.applyType();
    this.input.addEventListener("focus", this.focusEventChange);
    this.input.addEventListener("blur", this.focusEventChange);
    this.input.addEventListener("input", this.focusEventChange);
    addCustomEventManager(this.options.component, this.input, [
      "change",
      "update",
      "input",
    ]);
  }

  getInput = () => {
    if (!this.options.component.getAttribute("textarea"))
      return this.shadowDom.getElementById("input");
    this.wrap.removeChild(this.shadowDom.getElementById("input"));
    let textArea = document.createElement("textarea");
    textArea.id = "input";
    this.wrap.appendChild(textArea);
    return textArea;
  };

  applyType = () => {
    let namedFocus = this.focused ? "focused" : "notFocused";
    let namedActive = this.input.value ? "Active" : "NotActive";
    applyType(this.type, this.input, this.typeClasses.input);
    applyType(
      namedFocus + namedActive,
      this.placeholder,
      this.typeClasses.placeholder[this.type]
    );
    applyType(namedFocus, this.line, this.typeClasses.line[this.type]);
    applyType(this.type, this.wrap, this.typeClasses.wrap);
  };

  focusEventChange = (e) => {
    this.focused = document.activeElement == this.options.component;
    this.applyType();
  };

  get value() {
    return this.input.value;
  }

  set value(value) {
    this.input.value = value;
    this.focusEventChange();
  }
}
