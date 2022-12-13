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

const maps = new Array()

const map1 = new Map({ 
    name: "Walmart", 
    position1: { x: 192, y: 10 }, 
    position2: { x: 703, y: 10 }, 
    background: "media/images/backgrounds/walmart.png",
    platforms: new Set([
        new Platform({ width: 631, height: 17, position: { x: 135, y: 429 }, isBase: true }),
        new Platform({ width: 137, height: 17, position: { x: 382, y: 149 }, isBase: false }),
        new Platform({ width: 77, height: 17, position: { x: 158, y: 185 }, isBase: false }),
        new Platform({ width: 77, height: 17, position: { x: 666, y: 185 }, isBase: false }),
        new Platform({ width: 265, height: 20, position: { x: 318, y: 313 }, isBase: false })
    ])
})

maps.push(map1)

const pvpRound = new PvpRound({ map: maps[0] })
pvpRound.startGame()