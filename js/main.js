import { GAME_STATUS } from './constants.js'
import { getRandomColorPairs } from './utils.js';
import { getColorElementList, getColorListElement } from './selectors.js'
import { PAIRS_COUNT } from './constants.js';

// Global variables
let selections = []
let gameState = GAME_STATUS.PLAYING

// TODOs
// 1. Generating colors using https://github.com/davidmerfield/randomColor
// 2. Attach item click for all li elements
// 3. Check win logic
// 4. Add timer
// 5. Handle replay click

function handleClick(liElement) {
  if (!liElement) return
  liElement.classList.add('active');
}

function initColorList() {
  const colorList = getRandomColorPairs(PAIRS_COUNT)
  const liList = getColorElementList()
  liList.forEach((liElement, index) => {
    const overlayElement = liElement.querySelector('.overlay')
    if (overlayElement) overlayElement.style.backgroundColor = colorList[index]
  });
}

function attachEventWhenClick() {
  const ulElement = getColorListElement()
  if (!ulElement) return

  ulElement.addEventListener('click', (e) => {
    handleClick(e.target)
  })

}

//main 
(() => {
  // init colors
  initColorList()

  // attach event
  attachEventWhenClick()

})()