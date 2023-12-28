'use strict'

const PACMAN = '<img class="pacamnImg" src="img/PACMAN.gif"/>'
var gPacman

function createPacman(board) {
    // TODO: initialize gPacman...
    gPacman = {
        location: { i: 3, j: 5 },
        isSuper: false,
        deg: 0
    }
    board[gPacman.location.i][gPacman.location.j] = PACMAN
    gGame.foodCount--
}

function movePacman(ev) {

    if (!gGame.isOn) return

    // TODO: use getNextLocation(), nextCell
    const nextLocation = getNextLocation(ev)
    if (!nextLocation) return

    const nextCell = gBoard[nextLocation.i][nextLocation.j]

    // TODO: return if cannot move
    if (nextCell === WALL) return

    // TODO: hitting a ghost? call gameOver
    if (nextCell === GHOST) {
        if (gPacman.isSuper) {
            EatingGhost.play()
            killGhost(nextLocation)
        } else {
            gameOver()
            return
        }
    } else if (nextCell === FOOD) {
        // Food.play()
        handleFood()
    } else if (nextCell === POWER_FOOD) {
        if (gPacman.isSuper) return
        superFood.play()
        handlePowerFood()
    } else if (nextCell === CHERRY) {
        updateScore(10)
        EatingFruit.play()
    }



    // TODO: moving from current location:
    // TODO: update the model
    gBoard[gPacman.location.i][gPacman.location.j] = EMPTY

    // TODO: update the DOM
    renderCell(gPacman.location, EMPTY)

    // TODO: Move the pacman to new location:
    // TODO: update the model
    gPacman.location = nextLocation
    gBoard[gPacman.location.i][gPacman.location.j] = PACMAN

    // TODO: update the DOM
    renderCell(gPacman.location, getPacmanHTML(gPacman.deg))
}

function getNextLocation(eventKeyboard) {
    const nextLocation = { i: gPacman.location.i, j: gPacman.location.j }

    switch (eventKeyboard.key) {
        case 'ArrowUp':
            gPacman.deg = -90
            nextLocation.i--
            break;

        case 'ArrowDown':
            gPacman.deg = 90
            nextLocation.i++
            break;

        case 'ArrowLeft':
            gPacman.deg = 180
            nextLocation.j--
            break;

        case 'ArrowRight':
            gPacman.deg = 0
            nextLocation.j++
            break;

        default: return null
    }
    return nextLocation
}

function getPacmanHTML(deg) {
    return `<div style="transform: rotate(${deg}deg)">${PACMAN}</div>`
}

function handleFood() {
    gGame.foodCount--
    updateScore(1)
    checkVictory()
}

function handlePowerFood() {
    gPacman.isSuper = true
    renderGhost()
    setTimeout(() => {
        gPacman.isSuper = false
        reviveGhosts()
        renderGhost()
    }, 5000);
}