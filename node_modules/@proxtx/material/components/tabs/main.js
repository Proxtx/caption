import {
  componentSetup,
  attributeChangedCallbackGen,
} from "../lib/component.js";

export class Component {
  component = {};
  funcs = {};
  tabs = [];
  activeTab;
  options;
  shadowDom;
  attributeChangedCallback = attributeChangedCallbackGen(this.funcs);

  constructor(options) {
    this.options = options;
    this.shadowDom = options.shadowDom;
    this.tabsElem = this.shadowDom.getElementById("tabs");
    this.highlighter = this.shadowDom.getElementById("highlighter");
    componentSetup(options, this.funcs, this.component);
    this.addTab("test1234", 0);
    this.addTab("test1234 dsafas df", 0);
    this.addTab("test12", 0);
    this.addTab("test1234 ok 2ia", 0);
    setTimeout(() => {
      this.focusTab(this.tabs[1]);
    }, 1000);
  }

  addTab = async (tabElem) => {
    //
    let tab = {};
    let title = this.generateTitle(tabElem);
    this.tabsElem.appendChild(title);
    tab.title = title;
    await uiBuilder.ready(title);
    this.tabs.push(tab);
    this.unfocusTab(tab);
    title.addEventListener("click", () => {
      this.focusTab(tab);
    });
  };

  focusTab = (tab) => {
    this.activeTab && this.unfocusTab(this.activeTab);
    this.activeTab = tab;
    tab.title.component.textElem.component.textElem.style.color =
      "var(--accentColor)";
    let computedStyle = getComputedStyle(tab.title);
    this.highlighter.style.width = computedStyle.width;
    this.highlighter.style.left = tab.title.offsetLeft + "px";
  };

  unfocusTab = (tab) => {
    tab.title.component.textElem.component.textElem.style.color =
      "var(--greyText)";
  };

  generateTitle = (name) => {
    let button = document.createElement("m-button");
    button.setAttribute("type", "text");
    button.innerText = name;
    uiBuilder.ready(button).then(() => {
      button.component.button.style.margin = "0";
      button.component.button.style.borderRadius = "0";
      button.component.button.style.height = "100%";
    });
    return button;
  };
}
