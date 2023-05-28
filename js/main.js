import { GAME_STATUS } from './constants.js'
import { changeBackgroundColor, getRandomColorPairs, getTimerText, hideReplayButton, showReplayButton } from './utils.js';
import { getActivedLiElement, getColorElementList, getColorListElement, getPlayAgainButton, getTimerElement } from './selectors.js'
import { PAIRS_COUNT } from './constants.js';

// Global variables
let selections = []
let gameStatus = GAME_STATUS.PLAYING

// TODOs
// 1. Generating colors using https://github.com/davidmerfield/randomColor
// 2. Attach item click for all li elements
// 3. Check win logic
// 4. Add timer
// 5. Handle replay click

function handleClick(liElement) {
  const shouldBlockClick = [GAME_STATUS.BLOCKING, GAME_STATUS.FINISHED].includes(gameStatus)
  const activedLi = liElement.classList.contains('active')
  if (!liElement || activedLi || shouldBlockClick) return
  liElement.classList.add('active');

  selections.push(liElement)
  if (selections.length < 2) return

  const firstColor = selections[0].dataset.color
  const secondColor = selections[1].dataset.color

  const isMatch = firstColor === secondColor

  if (isMatch) {
    changeBackgroundColor(secondColor)
    const isWin = getActivedLiElement().length === 0
    if (isWin) {
      showReplayButton()
      getTimerText('You win! ️🎉')
      gameStatus = GAME_STATUS.FINISHED
    }
    selections = []
    return
  }

  gameStatus = GAME_STATUS.BLOCKING

  setTimeout(() => {
    selections[0].classList.remove('active')
    selections[1].classList.remove('active')
    selections = []
    gameStatus = GAME_STATUS.PLAYING
  }, 500)

}

function initColorList() {
  const colorList = getRandomColorPairs(PAIRS_COUNT)
  const liList = getColorElementList()
  liList.forEach((liElement, index) => {
    liElement.dataset.color = colorList[index]
    const overlayElement = liElement.querySelector('.overlay')
    if (overlayElement) overlayElement.style.backgroundColor = colorList[index]
  });
}

function attachEventWhenClick() {
  const ulElement = getColorListElement()
  if (!ulElement) return

  ulElement.addEventListener('click', (e) => {
    if (e.target.tagName !== 'LI') return
    handleClick(e.target)
  })
}

function resetGame() {
  selections = []
  gameStatus = GAME_STATUS.PLAYING

  hideReplayButton()
  getTimerText('')

  const liList = getColorElementList()
  for (const liElement of liList) {
    liElement.classList.remove('active')
  }
  initColorList()
}

function attachEventForReplayButton() {
  const replayButton = getPlayAgainButton()
  if (replayButton) replayButton.addEventListener('click', () => resetGame())
}

//main 
(() => {
  // init colors
  initColorList()

  // attach event
  attachEventWhenClick()

  attachEventForReplayButton()

})()