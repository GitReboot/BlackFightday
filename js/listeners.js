function addEventListeners() {
    window.addEventListener("keydown", onKeyDown, false)
    window.addEventListener("keyup", onKeyUp, false)
}

function removeEventListners() {
    window.removeEventListener("keydown", onKeyDown)
    window.removeEventListener("keyup", onKeyUp)
}

function onKeyDown(event) {
    pvpRound.players.forEach(player => {
        switch (event.code) {
            case player.controls.jump:
                player.inputs.jump = true
                player.isJumping = true
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
        }
    })
}

function onKeyUp(event) {
    pvpRound.players.forEach(player => {
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
        }
    })
}