const file = document.getElementById("file");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const input = document.getElementById("text");
const fontInput = document.getElementById("font");
const imageHeightInput = document.getElementById("imageHeight");
const fileName = document.getElementById("name");
const marginInput = document.getElementById("margin");
const textColorElem = document.getElementById("textColor");
const backgroundColorElem = document.getElementById("backgroundColor");
const centerTextCheck = document.getElementById("centerText");
const lineSpacingElem = document.getElementById("lineSpacing");
const textPosition = document.getElementById("textPosition");
const previewButton = document.getElementById("preview");
const resetButton = document.getElementById("reset");
canvas.width = 500;
canvas.height = 500;
let imageHeight = 50;
let img;
let margin = 5;
let textColor = "#ffffff";
let backgroundColor = "#000000";
let centerText = false;
let lineSpacing = 0;
let textPos;

let updateOnChange = [
  input,
  fontInput,
  imageHeightInput,
  marginInput,
  textColorElem,
  backgroundColorElem,
  centerTextCheck,
  lineSpacingElem,
  textPosition,
];

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
  show();
  save();

  let image = canvas
    .toDataURL("image/png")
    .replace("image/png", "image/octet-stream");

  let link = document.createElement("a");
  link.setAttribute("download", fileName.value + ".png");
  link.setAttribute("href", image);
  link.click();
});

const show = () => {
  if (img) {
    let text = prepareText(input.value);
    render(text);
  }
};

const save = () => {
	localStorage.setItem("font", fontInput.value);
	localStorage.setItem("imageHeight", imageHeightInput.value);	
	localStorage.setItem("margin", marginInput.value);	
	localStorage.setItem("lineSpacing", lineSpacingElem.value);	
	localStorage.setItem("textPosition", textPosition.value);	
	localStorage.setItem("name", fileName.value);	
	localStorage.setItem("textColor", textColorElem.value);	
	localStorage.setItem("backgroundColor", backgroundColorElem.value);
	localStorage.setItem("centerText", centerTextCheck.checked);
};
const load = () => {
	font.value = localStorage.getItem("font");
	imageHeightInput.value = localStorage.getItem("imageHeight");
	marginInput.value = localStorage.getItem("margin");
	lineSpacingElem.value = localStorage.getItem("lineSpacing");
	textPosition.value = localStorage.getItem("textPosition");
	fileName.value = localStorage.getItem("name");
	textColorElem.value = localStorage.getItem("textColor");
	backgroundColorElem.value = localStorage.getItem("backgroundColor");
	centerTextCheck.checked = localStorage.getItem("centerText");
};
previewButton.addEventListener("click", show);
document.addEventListener("load", load());

/*for (let i of updateOnChange) {
  i.addEventListener("keyup", show);
  i.addEventListener("change", show);
}*/

const render = (text) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let imageScale = imageHeight / img.height;
  let imageWidth = img.width * imageScale;
  canvas.height = imageHeight;
  if (textPos == "sides") {
    canvas.width = text[0].width + text[1].width + imageWidth;
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, imageHeight);
    ctx.drawImage(img, text[0].width, 0, imageWidth, imageHeight);
    drawText(0, text[0]);
    drawText(text[0].width + imageWidth, text[1]);
  } else if (textPos == "right") {
    canvas.width = text[0].width + imageWidth;
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, imageHeight);
    ctx.drawImage(img, 0, 0, imageWidth, imageHeight);
    drawText(imageWidth, text[0]);
  } else if (textPos == "left") {
    canvas.width = text[0].width + imageWidth;
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, imageHeight);
    ctx.drawImage(img, text[0].width, 0, imageWidth, imageHeight);
    drawText(0, text[0]);
  }
};

const drawText = (xPos, text) => {
  ctx.fillStyle = textColor;
  ctx.font = fontInput.value;
  for (let i in text.lines) {
    let x = xPos + margin;
    if (centerText) {
      x +=
        text.width -
        margin -
        ctx.measureText(text.lines[i]).width / 2 -
        text.width / 2;
    }
    ctx.fillText(
      text.lines[i],
      x,
      text.height * i + text.height + margin - lineSpacing
    );
  }
};

const prepareText = (text) => {
  centerText = centerTextCheck.checked;
  imageHeight = imageHeightInput.value;
  margin = Number(marginInput.value);
  textColor = textColorElem.value;
  backgroundColor = backgroundColorElem.value;
  lineSpacing = Number(lineSpacingElem.value);
  textPos = textPosition.value;
  ctx.font = fontInput.value;
  let parts = [text];
  if (textPos == "sides") {
    parts = calculateSplit(text);
  }
  for (let i in parts) {
    parts[i] = parts[i].split(" ");
  }

  let height =
    ctx.measureText(text).actualBoundingBoxAscent +
    ctx.measureText(text).actualBoundingBoxDescent +
    lineSpacing;
  for (let i in parts) {
    parts[i] = calculateLines(height, parts[i]);
  }
  return parts;
};

const calculateSplit = (text) => {
  let textSplit = text.split(" ");
  let rawSplitPos = Math.round(text.length / 2);
  let splitPos = 0;
  for (let i of textSplit) {
    if (splitPos > rawSplitPos) break;
    splitPos += i.length + 1;
  }
  splitPos - 1;

  let splitBreak = text.split("\n");
  let lineBreakSplit = calculateMiddleOfArrayText(splitBreak);
  if (Math.abs(lineBreakSplit.count - splitPos) < 100) {
    return [
      text.substring(0, lineBreakSplit.count),
      text.substring(lineBreakSplit.count),
    ];
  }
  let sentenceBreak = text.split(".");
  let sentenceBreakSplit = calculateMiddleOfArrayText(sentenceBreak);
  if (Math.abs(sentenceBreakSplit.count - splitPos) < 100) {
    return [
      text.substring(0, sentenceBreakSplit.count),
      text.substring(sentenceBreakSplit.count),
    ];
  }

  return [text.substring(0, splitPos), text.substring(splitPos)];
};

const calculateMiddleOfArrayText = (arrayText) => {
  let currentLetters = 0;
  for (let i of arrayText) {
    currentLetters += i.length;
  }

  let middle = currentLetters / 2;
  let currentCount = 0;
  let i;

  for (i in arrayText) {
    if (currentCount > middle) break;
    currentCount += arrayText[i].length + 1;
  }

  currentCount -= 1;

  try {
    let dist = Math.abs(currentCount - currentLetters);
    if (
      Math.abs(currentCount - arrayText[i - 1].length - currentLetters / 2) <
      dist
    ) {
      currentCount -= arrayText[i - 1].length;
    }
  } catch (e) {
    console.log(e);
  }

  return { pos: i, count: currentCount };
};

const calculateLines = (height, text) => {
  let availableHeight = imageHeight - margin * 2;
  let processedHeight = Infinity;
  let width = 0;
  let lines;
  while (processedHeight > availableHeight) {
    width += 10;
    lines = [[]];
    for (let t of text) {
      let textSplit = t.split("\n");
      for (let i in textSplit) {
        lines[lines.length - 1].push(textSplit[i]);
        if (ctx.measureText(lines[lines.length - 1].join(" ")).width > width) {
          lines.push([lines[lines.length - 1].pop()]);
          let wordLenthMeasure = ctx.measureText(
            lines[lines.length - 1][0]
          ).width;
          if (wordLenthMeasure > width) {
            width = wordLenthMeasure;
          }
        }
        if (textSplit.length > 0 && i != textSplit.length - 1) {
          lines.push([]);
        }
      }
    }
    processedHeight = lines.length * height;
  }

  for (let i in lines) {
    lines[i] = lines[i].join(" ");
  }

  return {
    lines,
    width: width + margin * 2,
    height,
  };
};
