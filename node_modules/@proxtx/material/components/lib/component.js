export const componentSetup = (options, funcs, componentExport) => {
  let component = componentExport;
  Object.assign(component, { run: funcs, document: options.shadowDom });
  let values = new Proxy(options, {
    get: (target, p) => {
      return target[p];
    },

    set: (target, p, value) => {
      target[p] = value;
      component.run[p](value);
      return value || true;
    },
  });

  component.values = values;

  let style = new Proxy(
    {},
    {
      get: (target, p) => {
        return getComputedStyle(options.component).getPropertyValue("--" + p);
      },

      set: (target, p, value) => {
        return (
          options.component.style.setProperty("--" + p, value) || value || true
        );
      },
    }
  );

  component.style = style;

  for (let i of options.component.attributes) {
    try {
      component.run[i.name]?.(genAttributeFromString(i.value));
    } catch (e) {
      console.log(e);
    }
  }
};

export const applyStyleSet = (styleSet, component) => {
  for (let i of Object.keys(styleSet)) {
    component.style[i] = styleSet[i];
  }
};

export const attributeChangedCallbackGen = (funcs) => {
  return (name, oldValue, newValue) => {
    newValue = genAttributeFromString(newValue);
    funcs[name]?.(newValue);
  };
};

const genAttributeFromString = (string) => {
  try {
    string = JSON.parse(string);
  } catch {}
  return string;
};

export const addCustomEventManager = (targetElement, source, listenFor) => {
  for (let i of listenFor) {
    source.addEventListener(i, (e) => {
      let E = new e.constructor(e.type, e);
      targetElement.dispatchEvent(E);
    });
  }
};

export const applyType = (type, elem, typeClasses) => {
  let classes = typeClasses[type];
  elem.className = objectKeysToArray({
    ...classes,
    ...typeClasses.global,
  }).join(" ");
};

const objectKeysToArray = (obj) => {
  let arr = [];
  for (let i of Object.keys(obj)) {
    if (obj[i]) arr.push(i);
  }
  return arr;
};
