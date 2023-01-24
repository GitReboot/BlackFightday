function addEventListeners() {
    window.addEventListener("keydown", onKeyDown, false)
    window.addEventListener("keyup", onKeyUp, false)
}

function removeEventListners() {
    window.removeEventListener("keydown", onKeyDown)
    window.removeEventListener("keyup", onKeyUp)
}

function onKeyDown(event) {
    if (round.gameEnd) {
        window.location.href = "../index.html"
    }

    round.players.forEach(player => {
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
                if (player.inputs.attack.pressed) return
                if (player.inputs.attack.timestamp === 0) player.inputs.attack.timestamp = Date.now()
                player.inputs.attack.pressed = true
                break;
            case player.controls.consume:
                if (player.item && player.item.isPowerup) {
                    player.item.use()
                }
                break;
        }
    })
}

function onKeyUp(event) {
    round.players.forEach(player => {
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
                player.attack()
                player.inputs.attack = {
                    pressed: false,
                    timestamp: 0
                }
                break;
        }
    })
}