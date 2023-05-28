import { getColorBackground, getPlayAgainButton, getTimerElement } from "./selectors.js";

function shuffle(array) {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

export const getRandomColorPairs = (count) => {

  const colorList = []
  const hueList = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'monochrome',]

  for (let i = 0; i < count; i++) {
    const rdColor = randomColor({
      luminosity: 'dark',
      hue: hueList[i % count]
    })
    colorList.push(rdColor)
  }

  const fullColorList = [...colorList, ...colorList]

  shuffle(fullColorList)

  return fullColorList
}

export function showReplayButton() {
  const replayButton = getPlayAgainButton()
  if (replayButton) replayButton.classList.add('show')
}

export function hideReplayButton() {
  const replayButton = getPlayAgainButton()
  if (replayButton) replayButton.classList.remove('show')
}

export const getTimerText = (text) => {
  const timerTextElement = getTimerElement()
  if (timerTextElement) timerTextElement.textContent = text
}

export const changeBackgroundColor = (color) => {
  const sectionElement = getColorBackground()
  if (sectionElement) sectionElement.style.backgroundColor = color
}