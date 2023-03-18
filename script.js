// Captured element
let dimension = 5; // Usado nos requisitos 6, 13, 14 e 15;
const buttonColors = document.getElementById('button-random-color');
const board = document.getElementById('pixel-board');
const colors = []; // guardará os elementos html das 4 cores da paleta e é globalmente acessável
const clearBtn = document.getElementById('clear-board');
const generateBtn = document.getElementById('generate-board');

function randomColor() { // gera as cores rgb aleatoriamente
  const rdmColor = [];
  for (let colorIndex = 0; colorIndex < 3; colorIndex += 1) { // cria aleatoriamente a cor rgb, usei como referência esse artigo https://www.rustcodeweb.com/2021/07/how-to-generate-random-rgb-color-using-javascript.html
    rdmColor[colorIndex] = Math.floor(Math.random() * 256);
    if (rdmColor[0] + rdmColor[1] + rdmColor[2] === 765) { // se a soma dos três números rgb for 765, 255 + 255 + 255 = branco
      colorIndex = 0; // o for pra criar a cor reinicia
    }
  }
  return `rgb(${rdmColor[0]}, ${rdmColor[1]}, ${rdmColor[2]})`;
}

function createPallet() {
  const colorsPallete = document.getElementById('color-palette'); // captura a sections que terá a palte
  for (let index = 0; index < 5; index += 1) { // for que irá criar os elementos span que serão as cores da paleta
    colors[index] = document.createElement('div'); // cria o elemento span
    colors[index].classList.add('color'); // adiciona a classe 'color'
    if (index === 0) {
      colors[index].style.backgroundColor = 'black';
      colors[index].classList.add('selected')
    } else if (index === 1) {
      colors[index].style.backgroundColor = 'white';
    } else {
      colors[index].style.backgroundColor = randomColor();
    }
    colorsPallete.appendChild(colors[index]);
  }
}

function recreatePallet() {
  for (let remakeIndex = 2; remakeIndex < colors.length; remakeIndex += 1) {
    colors[remakeIndex].style.backgroundColor = randomColor();
  }
}

function storageColors() {
  const savedColors = [];
  for (let storageIndex = 0; storageIndex < 5; storageIndex += 1) {
    savedColors[storageIndex] = colors[storageIndex].style.backgroundColor;
  }
  localStorage.setItem('colorPalette', JSON.stringify(savedColors));
}

function recoverColors() {
  const recoveredColors = JSON.parse(localStorage.getItem('colorPalette'));
  for (let setIndex = 0; setIndex < 5; setIndex += 1) {
    colors[setIndex].style.backgroundColor = recoveredColors[setIndex];
  }
}

function restoreBoard() {
  if (localStorage.getItem('boardSize') !== null) {
    dimension = JSON.parse(localStorage.getItem('boardSize'));
  }
}

function createBoard() {
  restoreBoard();
  const columns = [];
  let gridColums = '';
  for (let lineIndex = 0; lineIndex < dimension; lineIndex += 1) {
    for (let columIndex = 0; columIndex < dimension; columIndex += 1) {
      columns[columIndex] = document.createElement('div');
      columns[columIndex].classList = 'pixel';
      columns[columIndex].style.backgroundColor = 'white';
      columns[columIndex].style.border = '1px solid rgba(0, 0, 0, 0.4)'
      board.appendChild(columns[columIndex]);
    }
    gridColums += 'auto ';
  }
  board.style.gridTemplateColumns = gridColums;
}


function selectedOne(event) {
  const initialSelected = document.querySelector('.selected');
  initialSelected.classList.remove('selected');
  event.target.classList.add('selected');
}

function coloredPixel(event) {
  const pixelToFill = event;
  const colorToFill = document.querySelector('.selected').style.backgroundColor;
  pixelToFill.target.style.border = (colorToFill !== 'white') ? '1px solid transparent' : '1px solid rgba(0, 0, 0, 0.4)';
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

function sizeLimiter() {
  if (dimension < 2) {
    dimension = 2;
  }
  if (dimension > 50) {
    dimension = 50;
  }
}

function saveBoard() {
  JSON.stringify(localStorage.setItem('boardSize', dimension));
}

function newBoard() {
  const sizeInput = parseInt(document.getElementById('board-size').value, 10); // Para o requisito 13
  if (Number.isNaN(sizeInput)) {
    window.alert('Invalid Board!');
    return;
  }
  dimension = sizeInput;
  board.innerHTML = '';
  sizeLimiter();
  saveBoard();
  createBoard();
  localStorage.removeItem('pixelBoard');
  events(); // Chama todos os events novamente para estarem prontos para serem usados pelo novo board
}

function strictlyOnload() {
  createPallet();
  if (localStorage.getItem('colorPalette') === null) {
    storageColors();
  }
  recoverColors();
  createBoard();
  if (localStorage.getItem('pixelBoard') === null) {
    saveArt();
  }
  recoverArt();
}

//Captures for the events function
const newSelected = document.getElementsByClassName('color');
const pixelToColor = document.getElementsByClassName('pixel');

function events() {
  buttonColors.addEventListener('click', recreatePallet);
  buttonColors.addEventListener('click', storageColors);
  clearBtn.addEventListener('click', clearPixels);
  for (let clickIndex = 0; clickIndex < newSelected.length; clickIndex += 1) {
    newSelected[clickIndex].addEventListener('click', selectedOne);
  }
  for (let pixelIndex = 0; pixelIndex < pixelToColor.length; pixelIndex += 1) {
    pixelToColor[pixelIndex].addEventListener('click', coloredPixel);
    pixelToColor[pixelIndex].addEventListener('click', saveArt);
  }
  generateBtn.addEventListener('click', newBoard);
}

window.onload = () => {
  strictlyOnload();
  events();
};
