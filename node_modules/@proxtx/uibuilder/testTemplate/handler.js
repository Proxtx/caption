export const handler = function ({ shadowDom }) {
  this.hasAttribute("name") &&
    (shadowDom.getElementById("name").innerText = this.getAttribute("name"));
};

export const test = () => {
  console.log("test1 test function has been executed");
};
