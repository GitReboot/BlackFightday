const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d")

let resolution = { x: 900, y: 600 }
setCanvasSize({ resolution: resolution })

const background = new Background()
background.draw()

const player = new Player({ width: 30, height: 50, imageSrc: "media/images/player.png" })
player.spawn({ 
    position: { x: 70, y: 10 }, 
    velocity: { x: 0, y: 0 },
    controls: { 
        jump: "KeyW",
        left: "KeyA",
        right: "KeyD",
        attack: "ShiftLeft"
    }
})

const enemy = new Player({ width: 30, height: 50, imageSrc: "media/images/enemy.png" })
enemy.spawn({
    position: { x: 270, y: 10 }, 
    velocity: { x: 0, y: 0 },
    controls: { 
        jump: "KeyP",
        left: "KeyL",
        right: "Quote",
        attack: "ShiftRight"
    }
})

start()

window.addEventListener("keydown", (event) => {
    console.log(event.code)
    switch (event.code) {
        case player.controls.jump:
            player.inputs.jump = true
            break;
        case player.controls.left:
            player.inputs.left.pressed = true
            if (player.inputs.left.timestamp === 0) player.inputs.left.timestamp = Date.now()
            break;
        case player.controls.right:
            player.inputs.right.pressed = true
            if (player.inputs.right.timestamp === 0) player.inputs.right.timestamp = Date.now()
            break;
        case player.controls.attack:
            player.inputs.attack = true
            break;
        
        case enemy.controls.jump:
            enemy.inputs.jump = true
            break;
        case enemy.controls.left:
            enemy.inputs.left.pressed = true
            if (enemy.inputs.left.timestamp === 0) enemy.inputs.left.timestamp = Date.now()
            break;
        case enemy.controls.right:
            enemy.inputs.right.pressed = true
            if (enemy.inputs.right.timestamp === 0) enemy.inputs.right.timestamp = Date.now()
            break;
        case enemy.controls.attack:
            enemy.inputs.attack = true
            break;
    }
}, false)

window.addEventListener("keyup", (event) => {
    console.log(event.code)
    switch(event.code) {
        case player.controls.jump:
            player.inputs.jump = false
            break;
        case player.controls.left:
            player.inputs.left = {
                pressed: false,
                timestamp: 0
            }
            break;
        case player.controls.right:
            player.inputs.right = {
                pressed: false,
                timestamp: 0
            }
            break;
        case player.controls.attack:
            player.inputs.attack = false
            break;
        
        case enemy.controls.jump:
            enemy.inputs.jump = false
            break;
        case enemy.controls.left:
            enemy.inputs.left = {
                pressed: false,
                timestamp: 0
            }
            break;
        case enemy.controls.right:
            enemy.inputs.right = {
                pressed: false,
                timestamp: 0
            }
            break;
        case enemy.controls.attack:
            enemy.inputs.attack = false
            break;
    }
}, false)