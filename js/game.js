'use strict'

const WALL = '&#8251;'
const FOOD = '&middot;'
const EMPTY = ' '
const POWER_FOOD = '🧁'
const CHERRY = '🍒'

var gCherryInterval
var gGame
var gBoard

var intro = new Audio('sound/pacman_beginning.wav')
intro.volume = 0.5

var EatingFruit = new Audio('sound/pacman_eatfruit.wav')
EatingFruit.volume = 0.5

var EatingGhost = new Audio('sound/pacman_eatghost.wav')
EatingGhost.volume = 0.5

var Death = new Audio('sound/pacman_death.wav')
Death.volume = 0.5

var victory = new Audio('sound/victory.wav')
victory.volume = 0.5

var superFood = new Audio('sound/superFood.mp3')
superFood.volume = 0.5

var Food = new Audio('sound/pacman_chomp.wav')
Food.volume = 0.2

intro.addEventListener('ended', function () {

    intro.play();

});



function init() {

    const elStart = document.querySelector('.start')
    elStart.style.display = 'none'

    const elScore = document.querySelector('h2')
    elScore.style.display = 'block'

    gGame = {
        score: 0,
        isOn: true,
        isVictory: false,
        foodCount: 0
    }


    gBoard = buildBoard()
    createPacman(gBoard)
    createGhosts(gBoard)

    renderBoard(gBoard, '.board-container')

    gGame.isOn = true

    gCherryInterval = setInterval(addCherry, 15000)
    closeModal()
    intro.play()
}

function buildBoard() {
    const size = 10
    const board = []

    for (var i = 0; i < size; i++) {
        board.push([]) // board[i] = []

        for (var j = 0; j < size; j++) {
            board[i][j] = FOOD
            gGame.foodCount++
            if (i === 0 || i === size - 1 ||
                j === 0 || j === size - 1 ||
                (j === 3 && i > 4 && i < size - 2)) {
                board[i][j] = WALL
                gGame.foodCount--
            }
        }
    }
    createPowerFood(board)
    return board
}

function createPowerFood(board) {
    board[1][1] = POWER_FOOD
    board[1][board[0].length - 2] = POWER_FOOD
    board[board.length - 2][1] = POWER_FOOD
    board[board.length - 2][board[0].length - 2] = POWER_FOOD
    gGame.foodCount -= 4

}

function updateScore(diff) {
    const elScore = document.querySelector('h2 span')

    // Model
    gGame.score += diff
    // DOM
    elScore.innerText = gGame.score
}

function addCherry() {
    const emptyLocation = getEmptyLocation(gBoard)
    if (!emptyLocation) return
    gBoard[emptyLocation.i][emptyLocation.j] = CHERRY
    renderCell(emptyLocation, CHERRY)
}

function getEmptyLocation(board) {
    var emptyLocations = []

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j] === EMPTY) {
                emptyLocations.push({ i, j })
            }
        }
    }
    if (!emptyLocations.length) return null
    const idx = getRandomIntInclusive(0, emptyLocations.length - 1)
    return emptyLocations[idx]
}

function gameOver() {
    intro.pause()
    intro.currentTime = 0
    Death.play()
    console.log('Game Over')
    clearInterval(gGhostsInterval)
    clearInterval(gCherryInterval)
    gGame.isOn = false

    const msg = gGame.isVictory ? '🥳victorious🥳' : 'Game Over'
    openModal(msg)
    const elBtn = document.querySelector('.modal button')
    elBtn.style.display = 'inline-block'
}

function checkVictory() {
    if (gGame.foodCount === 0) {
        gGame.isVictory = true
        gameOver()
        Death.pause()
        victory.play()
    }
}

function openModal(msg) {
    const elModal = document.querySelector('.modal')
    const elSpan = elModal.querySelector('.msg')
    elSpan.innerText = msg
    elModal.style.display = 'block'
}

function closeModal() {
    const elModal = document.querySelector('.modal')
    elModal.style.display = 'none'
}