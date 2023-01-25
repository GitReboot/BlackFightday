// Create canvases and canvas rendering contexts.
const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d")

const canvasRed = document.getElementById("redCanvas")
const ctxRed = canvasRed.getContext("2d")

const canvasBlue = document.getElementById("blueCanvas")
const ctxBlue = canvasBlue.getContext("2d")

// Set default configurations.
const settings = new Settings({
    controls: {
        player1: {
            jump: "KeyW",
            left: "KeyA",
            right: "KeyD",
            attack: "KeyS",
            consume: "ShiftLeft"
        },
        player2: {
            jump: "KeyP",
            left: "KeyL",
            right: "Quote",
            attack: "Semicolon",
            consume: "ShiftRight"
        }
    },
    gameResolution: {
        x: 900,
        y: 600
    },
    hudResolution: {
        x: 200,
        y: 600
    },
    gameDuration: 180
})

// Set the canvas widths and heights.
canvas.width = settings.gameResolution.x
canvas.height = settings.gameResolution.y

canvasBlue.width = settings.hudResolution.x
canvasBlue.height = settings.hudResolution.y

canvasRed.width = settings.hudResolution.x
canvasRed.height = settings.hudResolution.y

// Start the game.
const round = new Round()
round.startGame()