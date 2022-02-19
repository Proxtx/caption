const file = document.getElementById("file");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const input = document.getElementById("text");
const fontInput = document.getElementById("font");
const imageHeightInput = document.getElementById("imageHeight");
const marginInput = document.getElementById("margin");
canvas.width = 500;
canvas.height = 500;
let imageHeight = 50;
let img;
let margin = 5;

let updateOnChange = [input, fontInput, imageHeightInput, marginInput];

file.addEventListener("change", (evt) => {
  if (file.files && file.files[0]) {
    img = new Image();
    img.src = URL.createObjectURL(file.files[0]);
    img.onload = () => {
      show();
    };
  }
});

document.getElementById("download").addEventListener("click", () => {
  let image = canvas
    .toDataURL("image/png")
    .replace("image/png", "image/octet-stream");

  let link = document.createElement("a");
  link.setAttribute("download", "caption.png");
  link.setAttribute("href", image);
  link.click();
});

const show = () => {
  if (img) {
    let text = prepareText(input.value);
    render(text);
  }
};

for (let i of updateOnChange) {
  i.addEventListener("keyup", show);
}

const render = (text) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let imageScale = imageHeight / img.height;
  let imageWidth = img.width * imageScale;
  canvas.height = imageHeight;
  canvas.width = text[0].width + text[1].width + imageWidth;
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, text[0].width + text[1].width + imageWidth, imageHeight);
  ctx.drawImage(img, text[0].width, 0, imageWidth, imageHeight);
  ctx.fillStyle = "white";
  drawText(0, text[0]);
  drawText(text[0].width + imageWidth, text[1]);
};

const drawText = (xPos, text) => {
  ctx.font = fontInput.value;
  for (let i in text.lines) {
    ctx.fillText(
      text.lines[i],
      xPos + margin,
      text.height * i + text.height + margin
    );
  }
};

const prepareText = (text) => {
  imageHeight = imageHeightInput.value;
  margin = Number(marginInput.value);
  ctx.font = fontInput.value;
  let words = text.split(" ");
  let parts = [words.splice(0, words.length / 2), words];
  let height =
    ctx.measureText(text).actualBoundingBoxAscent +
    ctx.measureText(text).actualBoundingBoxDescent;
  for (let i in parts) {
    parts[i] = calculateLines(height, parts[i]);
  }
  return parts;
};

const calculateLines = (height, text) => {
  let lineBreaks = 0;
  for (let i of text) {
    i.match("\n") && lineBreaks++;
  }

  let lineCount = Math.floor((imageHeight - margin * 2) / height) - lineBreaks;
  let wordCount = Math.floor(text.length / lineCount) + 1;
  let lines = [];
  for (let i in text) {
    if (i % wordCount == 0) {
      lines.push([]);
    }
    let lineSplit = text[i].split("\n");
    lines[lines.length - 1].push(lineSplit[0]);
    if (lineSplit.length > 1) {
      lines.push([lineSplit[1]]);
    }
  }
  for (let i in lines) {
    lines[i] = lines[i].join(" ");
  }
  let width = 0;
  for (let i of lines) {
    let mWidth = ctx.measureText(i).width + margin * 2;
    if (mWidth > width) width = mWidth;
  }

  return { lines, width, height, lineCount };
};
