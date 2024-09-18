const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

const clear = document.getElementById("clear");
const gridSize = document.getElementById("grid-size");
const gridSizeDisplay = document.getElementById("grid-size-display");
const colorPicker = document.getElementById("color-picker");

// Functions:

function setCanvasSize(size) {
  const boardWidth = document.getElementById("board").offsetWidth;
  const boardHeight = document.getElementById("board").offsetHeight;
  const cellSize = Math.min(boardWidth, boardHeight) / size;
  canvas.width = size * cellSize;
  canvas.height = size * cellSize;
}

function drawGrid(size) {
  const cellSize = canvas.width / size;
  context.clearRect(0, 0, canvas.width, canvas.height);

  context.strokeStyle = "#000";
  context.lineWidth = 1;

  for (let i = 0; i <= size; i++) {
    context.beginPath();
    context.moveTo(i * cellSize, 0);
    context.lineTo(i * cellSize, canvas.height);
    context.stroke();

    context.beginPath();
    context.moveTo(0, i * cellSize);
    context.lineTo(canvas.width, i * cellSize);
    context.stroke();
  }
}

const initialSize = gridSize.value;
setCanvasSize(initialSize);
drawGrid(initialSize);

function updateGridSize() {
  const newSize = gridSize.value;
  gridSizeDisplay.textContent = newSize;
  setCanvasSize(newSize);
  drawGrid(newSize);
}

gridSize.addEventListener("input", updateGridSize);

window.addEventListener("resize", () => {
  const newSize = gridSize.value;
  setCanvasSize(newSize);
  drawGrid(newSize);
});

let painting = false;
let color = "#000000"; // Default color
let lastX = 0;
let lastY = 0;

function startDrawing(e) {
  e.preventDefault();
  painting = true;
  const [x, y] = getCoordinates(e);
  lastX = x;
  lastY = y;
}

function stopDrawing() {
  painting = false;
  context.beginPath();
}

function draw(e) {
  if (!painting) return;

  const [x, y] = getCoordinates(e);

  context.lineWidth = 5;
  context.lineCap = "round";
  context.strokeStyle = color;

  context.beginPath();
  context.moveTo(lastX, lastY);
  context.lineTo(x, y);
  context.stroke();

  lastX = x;
  lastY = y;
}

function getCoordinates(e) {
  const rect = canvas.getBoundingClientRect();
  if (e.type.startsWith('touch')) {
    const touch = e.touches[0];
    return [touch.clientX - rect.left, touch.clientY - rect.top];
  }
  return [e.clientX - rect.left, e.clientY - rect.top];
}

// Event listeners for mouse and touch
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mousemove", draw);

canvas.addEventListener("touchstart", startDrawing);
canvas.addEventListener("touchend", stopDrawing);
canvas.addEventListener("touchmove", draw);

// Clear canvas function
function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid(gridSize.value); // Redraw the grid after clearing the canvas
}

// Add event listener to the clear button
clear.addEventListener("click", clearCanvas);

// Update color when color picker value changes
colorPicker.addEventListener("input", (e) => {
  color = e.target.value;
});
