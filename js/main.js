import { GAME_STATUS, PAIRS_COUNT, GAME_TIME } from './constants.js'
import { changeBackgroundColor, getRandomColorPairs, getTimerText, hideReplayButton, showReplayButton, createTimer } from './utils.js';
import { getActivedLiElement, getAudioElement, getAudioIconElement, getColorElementList, getColorListElement, getPlayAgainButton } from './selectors.js'

// Global variables
let selections = []
let gameStatus = GAME_STATUS.PLAYING

let timer = createTimer({
  second: 30,
  onChange: handleTimeChange,
  onFinish: handleFinishGame
})

function handleTimeChange(second) {
  getTimerText(`${second}s`)
}

function handleFinishGame() {
  gameStatus = GAME_STATUS.FINISHED
  getTimerText('Game over! 😭')
  showReplayButton()
}

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
      clearTimer()
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
    if (gameStatus !== GAME_STATUS.FINISHED) {
      gameStatus = GAME_STATUS.PLAYING
    }
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
  startTimer()
}

function attachEventForReplayButton() {
  const replayButton = getPlayAgainButton()
  if (replayButton) replayButton.addEventListener('click', () => resetGame())
}

function startTimer() {
  timer.start()
}

function clearTimer() {
  timer.clear()
}

function attachSoundForGame() {
  const audio = getAudioElement()
  const iconAudio = getAudioIconElement()

  iconAudio.onclick = function () {
    if (audio.paused) {
      audio.play()
      iconAudio.src = "images/pause.png"
    } else {
      audio.pause()
      iconAudio.src = "images/play.png"
    }
  }
}

(() => {
  initColorList()
  attachEventWhenClick()
  attachEventForReplayButton()
  startTimer()
  attachSoundForGame()
})()