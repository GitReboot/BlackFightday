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
    position1: { x: 180, y: 374 }, 
    position2: { x: 691, y: 374 }, 
    background: "../media/images/backgrounds/walmart.png",
    platforms: new Set([
        new Platform({ width: 631, height: 17, position: { x: 135, y: 429 }, isBase: true }),
        new Platform({ width: 137, height: 17, position: { x: 382, y: 149 }, isBase: false }),
        new Platform({ width: 77, height: 17, position: { x: 158, y: 185 }, isBase: false }),
        new Platform({ width: 77, height: 17, position: { x: 666, y: 185 }, isBase: false }),
        new Platform({ width: 265, height: 20, position: { x: 318, y: 313 }, isBase: false })
    ])
})

const map2 = new Map({
    name: "Microcenter",
    position1: { x: 180, y: 374 }, 
    position2: { x: 691, y: 374 }, 
    background: "../media/images/backgrounds/microcenter.png",
    platforms: new Set([
        new Platform({ width: 631, height: 17, position: { x: 135, y: 429 }, isBase: true }),
        new Platform({ width: 86, height: 17, position: { x: 135, y: 317 }, isBase: false }),
        new Platform({ width: 86, height: 17, position: { x: 680, y: 317 }, isBase: false }),
        new Platform({ width: 483, height: 17, position: { x: 209, y: 203 }, isBase: false }),
        new Platform({ width: 271, height: 20, position: { x: 315, y: 318 }, isBase: false })
    ])
})

const map3 = new Map({
    name: "Target",
    position1: { x: 180, y: 374 }, 
    position2: { x: 691, y: 374 }, 
    background: "../media/images/backgrounds/target.png",
    platforms: new Set([
        new Platform({ width: 631, height: 17, position: { x: 135, y: 429 }, isBase: true }),
        new Platform({ width: 164, height: 17, position: { x: 132, y: 124 }, isBase: false }),
        new Platform({ width: 157, height: 17, position: { x: 607, y: 249 }, isBase: false }),
        new Platform({ width: 313, height: 17, position: { x: 295, y: 288 }, isBase: false })
    ])
})

maps.push(map1)
maps.push(map2)
maps.push(map3)

const pvpRound = new PvpRound({ map: maps[Math.floor(Math.random() * 3)] })
pvpRound.startGame()