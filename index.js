const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d")

const settings = new Settings({
    controls: {
        player1: {
            jump: "KeyW",
            left: "KeyA",
            right: "KeyD",
            attack: "ShiftLeft"
        },
        player2: {
            jump: "KeyP",
            left: "KeyL",
            right: "Quote",
            attack: "ShiftRight"
        }
    },
    resolution: {
        x: 900,
        y: 600
    }
})

setCanvasSize({ resolution: settings.resolution })

const map = new Map()
const pvpRound = new PvpRound({ map: map })
pvpRound.startGame()