const warnings = { min: 'Min is 2', max: 'Max is 50' };
let dimension = [5, 5];
const board = document.getElementById('pixel-board');
const clearBtn = document.getElementById('clear-board');
const generateBtn = document.getElementById('generate-board');
const pencils = document.getElementsByClassName('color');
const initialPencilsColors = ['#000000', '#ff0000', '#00ff00', '#0000ff'];
const pixelToColor = document.getElementsByClassName('pixel');
const heigthInput = document.getElementById('board-heigth');
const widthInput = document.getElementById('board-width');
const heigthWarning = document.getElementById('heigth-warning');
const widthWarning = document.getElementById('width-warning');

function setPencils() {
  for (let pencilsIndex = 0; pencilsIndex < (pencils.length - 1); pencilsIndex += 1) {
    pencils[pencilsIndex].setAttribute('value', initialPencilsColors[pencilsIndex]);
  }
}

function saveColors() {
  const savedColors = [];
  for (let storageIndex = 0; storageIndex < 4; storageIndex += 1) {
    savedColors[storageIndex] = pencils[storageIndex].value;
  }
  localStorage.setItem('pencilsColors', JSON.stringify(savedColors));
}

function recoverColors() {
  const recoveredColors = JSON.parse(localStorage.getItem('pencilsColors'));
  for (let setIndex = 0; setIndex < 4; setIndex += 1) {
    pencils[setIndex].setAttribute('value', recoveredColors[setIndex]);
  }
}

function restoreBoard() {
  if (localStorage.getItem('boardHeigth') !== null && localStorage.getItem('boardWidth') !== null) {
    dimension[0] = JSON.parse(localStorage.getItem('boardHeigth'));
    dimension[1] = JSON.parse(localStorage.getItem('boardWidth'));
  }
}

function createBoard() {
  restoreBoard();
  const columns = [];
  for (let lineIndex = 0; lineIndex < dimension[0]; lineIndex += 1) {
    for (let columIndex = 0; columIndex < dimension[1]; columIndex += 1) {
      columns[columIndex] = document.createElement('div');
      columns[columIndex].classList = 'pixel';
      columns[columIndex].style.backgroundColor = 'white';
      columns[columIndex].style.border = '1px solid rgba(0, 0, 0, 0.4)';
      board.appendChild(columns[columIndex]);
    }
  }
  board.style.gridTemplateColumns = `repeat(${dimension[0]}, 1fr)`;
  board.style.width = (dimension[0] < 12) ? `${7 * dimension[0]}vmin` : '82vmin';
}

function selectedOne(event) {
  const initialSelected = document.querySelector('.selected');
  const newSlct = event.target;
  initialSelected.classList.remove('selected');
  newSlct.classList.add('selected');
}

function coloredPixel(event) {
  const pixelToFill = event;
  const colorToFill = document.querySelector('.selected').value;
  pixelToFill.target.style.border = (colorToFill !== '#ffffff') ? '1px solid transparent' : '1px solid rgba(0, 0, 0, 0.4)';
  pixelToFill.target.style.backgroundColor = colorToFill;
}

function saveArt() {
  const savedArt = [];
  for (let artIndex = 0; artIndex < pixelToColor.length; artIndex += 1) {
    savedArt[artIndex] = pixelToColor[artIndex].style.backgroundColor;
  }
  localStorage.setItem('pixelBoard', JSON.stringify(savedArt));
}

function recoverArt() {
  const recoveredArt = JSON.parse(localStorage.getItem('pixelBoard'));
  for (let recoverIndex = 0; recoverIndex < pixelToColor.length; recoverIndex += 1) {
    pixelToColor[recoverIndex].style.backgroundColor = recoveredArt[recoverIndex];
  }
}

function clearPixels() {
  for (let clearIndex = 0; clearIndex < pixelToColor.length; clearIndex += 1) {
    pixelToColor[clearIndex].style.backgroundColor = 'white';
    pixelToColor[clearIndex].style.border = '1px solid rgba(0, 0, 0, 0.4)';
  }
  saveArt();
}

function saveBoard() {
  localStorage.setItem('boardHeigth', JSON.stringify(dimension[0]));
  localStorage.setItem('boardWidth', JSON.stringify(dimension[1]));
}

function hAnalyzer() {
  const heigth = parseInt(heigthInput.value, 10);

  if (heigth < 2) {
    heigthWarning.innerHTML = warnings.min;
    heigthWarning.style.visibility = 'visible';
    return heigth < 2;
  }
  if (heigth > 50) {
    heigthWarning.innerHTML = warnings.max;
    heigthWarning.style.visibility = 'visible';
    return heigth > 50;
  }

  heigthWarning.style.visibility = 'hidden';
  return false;
}

function wAnalyzer() {
  const width = parseInt(widthInput.value, 10);

  if (width < 2) {
    widthWarning.innerHTML = warnings.min;
    widthWarning.style.visibility = 'visible';
    return width < 2;
  }
  if (width > 50) {
    widthWarning.innerHTML = warnings.max;
    widthWarning.style.visibility = 'visible';
    return width > 50;
  }

  widthWarning.style.visibility = 'hidden';
  return false;
}

function strictlyOnload() {
  if (localStorage.getItem('pencilsColors') === null) {
    setPencils();
    saveColors();
  } else {
    recoverColors();
  }
  createBoard();
  if (localStorage.getItem('pixelBoard') === null) {
    saveArt();
  }
  recoverArt();
}

function events() {
  pencils[pencils.length - 1].addEventListener('click', (event) => {
    event.preventDefault();
  });
  for (let saveIndex = 0; saveIndex < (pencils.length - 1); saveIndex += 1) {
    pencils[saveIndex].addEventListener('input', saveColors);
  }
  for (let clickIndex = 0; clickIndex < pencils.length; clickIndex += 1) {
    pencils[clickIndex].addEventListener('click', selectedOne);
  }
  heigthInput.addEventListener('input', hAnalyzer);
  widthInput.addEventListener('input', wAnalyzer);
  clearBtn.addEventListener('click', clearPixels);
  for (let pixelIndex = 0; pixelIndex < pixelToColor.length; pixelIndex += 1) {
    pixelToColor[pixelIndex].addEventListener('click', coloredPixel);
    pixelToColor[pixelIndex].addEventListener('click', saveArt);
  }
}

function newBoard() {
  const sizeInput = [0, 0];
  sizeInput[0] = parseInt(widthInput.value, 10);
  sizeInput[1] = parseInt(heigthInput.value, 10);
  if (Number.isNaN(sizeInput[0]) || Number.isNaN(sizeInput[1]) || wAnalyzer() || hAnalyzer()) {
    return;
  }
  dimension = sizeInput;
  board.innerHTML = '';
  saveBoard();
  createBoard();
  localStorage.removeItem('pixelBoard');
  events();
}

window.onload = () => {
  strictlyOnload();
  events();
  generateBtn.addEventListener('click', newBoard);
};
