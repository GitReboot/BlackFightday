const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d")

const canvasRed = document.getElementById("redCanvas")
const ctxRed = canvasRed.getContext("2d")

const canvasBlue = document.getElementById("blueCanvas")
const ctxBlue = canvasBlue.getContext("2d")

const settings = new Settings({
    controls: {
        player1: {
            jump: "KeyW",
            left: "KeyA",
            right: "KeyD",
            attack: "KeyC",
            throw: "KeyC"
        },
        player2: {
            jump: "KeyP",
            left: "KeyL",
            right: "Quote",
            attack: "Comma",
            throw: "Comma"
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
    gameDuration: 300
})

canvas.width = settings.gameResolution.x
canvas.height = settings.gameResolution.y

canvasBlue.width = settings.hudResolution.x
canvasBlue.height = settings.hudResolution.y

canvasRed.width = settings.hudResolution.x
canvasRed.height = settings.hudResolution.y

const itemObjects = new Array()
const position = {
    x: canvas.width.x / 2,
    y: -1000
} // Position that is outside of the map.

const item1 = {
    width: 64, 
    height: 44, 
    name: "television", 
    position: position,
    worth: 1000, 
    weight: 4,
    fragility: 2
}

const item2 = {
    width: 20,
    height: 35,
    name: "smartphone",
    position: position,
    worth: 300,
    weight: 2,
    fragility: 3
}

const item3 = {
    width: 50,
    height: 40,
    name: "laptop",
    position: position,
    worth: 800,
    weight: 3,
    fragility: 2
}

const item4 = {
    width: 50,
    height: 40,
    name: "gamestation",
    position: position,
    worth: 500,
    weight: 3,
    fragility: 2
}

const item5 = {
    width: 20,
    height: 35,
    name: "vase",
    position: position,
    worth: 2000,
    weight: 3,
    fragility: 0.5
}

const item6 = {
    width: 30,
    height: 35,
    name: "oil",
    position: position,
    worth: 30,
    weight: 3,
    fragility: 4
}

const item7 = {
    width: 45,
    height: 24,
    name: "mountainbike",
    position: position,
    worth: 900,
    weight: 4,
    fragility: 3
}

const item8 = {
    
}

itemObjects.push(item1)
itemObjects.push(item2)
itemObjects.push(item3)
itemObjects.push(item4)
itemObjects.push(item5)
itemObjects.push(item6)
itemObjects.push(item7)

const maps = new Array()

const map1 = new Map({ 
    name: "Walmart", 
    position1: { x: 180, y: 378 }, 
    position2: { x: 691, y: 378 }, 
    background: "../media/images/backgrounds/walmart.png",
    platforms: [
        new Platform({ width: 631, height: 17, position: { x: 135, y: 429 }, isBase: true }),
        new Platform({ width: 137, height: 17, position: { x: 382, y: 149 }, isBase: false }),
        new Platform({ width: 77, height: 17, position: { x: 158, y: 185 }, isBase: false }),
        new Platform({ width: 77, height: 17, position: { x: 666, y: 185 }, isBase: false }),
        new Platform({ width: 265, height: 20, position: { x: 318, y: 313 }, isBase: false })
    ]
})

const map2 = new Map({
    name: "Microcenter",
    position1: { x: 180, y: 378 }, 
    position2: { x: 691, y: 378 }, 
    background: "../media/images/backgrounds/microcenter.png",
    platforms: [
        new Platform({ width: 631, height: 17, position: { x: 135, y: 429 }, isBase: true }),
        new Platform({ width: 86, height: 17, position: { x: 135, y: 317 }, isBase: false }),
        new Platform({ width: 86, height: 17, position: { x: 680, y: 317 }, isBase: false }),
        new Platform({ width: 483, height: 17, position: { x: 209, y: 203 }, isBase: false }),
        new Platform({ width: 271, height: 20, position: { x: 315, y: 318 }, isBase: false })
    ]
})

const map3 = new Map({
    name: "Target",
    position1: { x: 180, y: 378 }, 
    position2: { x: 691, y: 378 }, 
    background: "../media/images/backgrounds/target.png",
    platforms: [
        new Platform({ width: 631, height: 17, position: { x: 135, y: 429 }, isBase: true }),
        new Platform({ width: 164, height: 17, position: { x: 132, y: 124 }, isBase: false }),
        new Platform({ width: 157, height: 17, position: { x: 607, y: 249 }, isBase: false }),
        new Platform({ width: 313, height: 17, position: { x: 295, y: 288 }, isBase: false })
    ]
})

maps.push(map1)
maps.push(map2)
maps.push(map3)

const round = new Round({ map: maps[Math.floor(Math.random() * maps.length)] })
round.startGame()