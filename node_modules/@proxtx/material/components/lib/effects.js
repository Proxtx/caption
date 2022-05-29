export const wave = (elem, x, y, color) => {
  let waveElem = document.createElement("div");
  waveElem.className = "wave";
  waveElem.style.left = x + "px";
  waveElem.style.top = y + "px";
  waveElem.style.backgroundColor = color;
  elem.appendChild(waveElem);
  setTimeout(() => {
    elem.removeChild(waveElem);
  }, 3000);
};

export const waveListener = (e, elem, color) => {
  let bounds = elem.getBoundingClientRect();
  wave(elem, e.clientX - bounds.left, e.clientY - bounds.top, color);
};

export const waveListenerCenter = (e, elem, color) => {
  let bounds = elem.getBoundingClientRect();
  wave(elem, bounds.width / 2, bounds.height / 2, color);
};
