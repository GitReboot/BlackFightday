class Round {
    constructor({ map }) {
        this.running = false
        this.map = map
        this.players = new Array()
        this.carts = new Set()
        this.items = new Set()
        this.tickrate = 60
        this.timestamp
        this.itemIsSpawning = false
        this.updatePriority = "red"
        this.gameStart = false
        this.gameEnd = false
        this.hud = new Sprite({
            width: 114,
            height: 374,
            position: {
                x: 43,
                y: 113
            },
            imageSrc: "./../media/images/miscellaneous/hud.png"
        })
    }

    startGame() {
        // Initialize players.
        const player1 = new Player({ 
            team: "red",
            character: "player",
            width: 30, 
            height: 50, 
            position: this.map.position1,
            direction: 1, 
            controls: settings.controls.player1,
        })

        const player2 = new Player({ 
            team: "blue",
            character: "player",
            width: 30, 
            height: 50, 
            position: this.map.position2,
            direction: -1, 
            controls: settings.controls.player2,
        })

        this.players.push(player1)
        this.players.push(player2)

        // Initialize shopping carts.
        const cart1 = new Cart({
            width: 90,
            height: 60,
            position: {
                x: 0,
                y: canvas.height - 60
            },
            player: player1
        })

        const cart2 = new Cart({
            width: 90,
            height: 60,
            position: {
                x: canvas.width - 90,
                y: canvas.height - 60
            },
            player: player2
        })

        this.carts.add(cart1)
        this.carts.add(cart2)

        // Start listening for key presses within the canvas.
        addEventListeners() 

        // Start the game loop.
        this.running = true
        this.timestamp = Date.now()
        this.loopGame()
        this.animate()

        setTimeout(() => {
            this.players.forEach(player => {
                player.canAttack = true
            })
            this.gameStart = true
            this.timestamp = Date.now()
        }, 4000);
    }

    endGame() {
        // Stop listening for key presses within the canvas.
        removeEventListeners()

        // Stop the game loop.
        this.running = false
    }

    loopGame() {        
        // Stop the game once the game should no longer be running.
        if (!this.running) return
        if (Date.now() - this.timestamp > settings.gameDuration * 1000) this.running = false

        // Spawn item entities.
        if (!this.itemIsSpawning && this.items.size < 2) {
            this.itemIsSpawning = true
            setTimeout(() => {
                const itemObject = itemObjects[Math.floor(Math.random() * itemObjects.length)]
                let item

                if (itemObject.isPowerup) {
                    switch (itemObject.name) {
                        case "beer":
                            item = new Beer(itemObject)
                            break;
                        case "monster":
                            item = new Monster(itemObject)
                            break;
                        case "proteine":
                            item = new Proteine(itemObject)
                            break;
                    }
                } else {
                    item = new Item(itemObject)
                }

                item.spawn()
                this.itemIsSpawning = false
            }, (Math.floor(Math.random() * (15 - 10)) + 10) * 1000)
        }

        // Update all entities.
        this.items.forEach(item => item.update())
        const player1 = this.players[0]
        const player2 = this.players[1]

        // To make hit trading fair, we alternate updates between players.
        if (this.updatePriority === "red") {
            player1.update()
            player2.update()
            this.updatePriority = "blue"
        } else {
            player2.update()
            player1.update()
            this.updatePriority = "red"
        }

        // Keep updating all entities for a consistent playing experience that does not rely on frames.
        setTimeout(() => { this.loopGame() }, 1000 / this.tickrate)
    }

    animate() {
        // Stop the animation once the game should no longer be running.
        if (!this.running) {
            this.displayWinner()   
            return
        }
        
        window.requestAnimationFrame(() => { this.animate() })
        ctx.clearRect(-1, -1, canvas.width + 1, canvas.height + 1)

        // Draw all sprites.
        this.map.draw(ctx)
        this.map.platforms.forEach(platform => platform.draw(ctx))
        this.carts.forEach(cart => cart.draw(ctx))
        this.items.forEach(item => item.draw(ctx))
        this.players.forEach(player => { if (!player.isRespawning) player.draw(ctx) })

        ctx.textAlign = "center"
        ctx.font = ctx.font.replace(/\d+px/, "65px")
        ctx.fillStyle = "#ffffff"

        if (!this.gameStart) {
            const countdown = 3 - Math.floor((Date.now() - this.timestamp) / 1000)
            ctx.fillText(countdown, 450, 70)
        } else {
            const secondsLeft = settings.gameDuration - (Date.now() - this.timestamp) / 1000
            const minutes = ("0" + parseInt(secondsLeft / 60)).slice(-2) 
            const seconds = ("0" + parseInt(secondsLeft % 60)).slice(-2)
    
            const countdown = `${minutes}:${seconds}`
            ctx.fillText(countdown, 450, 70)
        }

        this.drawHud(ctxRed, this.players[0])
        this.drawHud(ctxBlue, this.players[1])
    }

    displayWinner() {
        const player1 = this.players[0]
        const player2 = this.players[1]
        let winner;

        let title
        let message = `$${player1.score} - $${player2.score}`

        if (player1.score === player2.score) {
            title = `Tie!`
        } else if (player1.score > player2.score) {
            title = `${player1.team.charAt(0).toUpperCase() + player1.team.slice(1)} won!`
            winner = player1
        } else {
            winner = player2
            title = `${player2.team.charAt(0).toUpperCase() + player2.team.slice(1)} won!`
        }

        ctx.textAlign = "center"
        ctx.font = ctx.font.replace(/\d+px/, "100px")

        ctx.fillStyle = "rgba(0, 0, 0, 0.8)"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        ctx.fillStyle = winner ? winner.team : "#aaaaaa"
        ctx.fillText(title, settings.gameResolution.x / 2, 250)
        
        ctx.fillStyle = "#ffffff"
        ctx.fillText(message, settings.gameResolution.x / 2, 350)

        setTimeout(() => {
            ctx.font = ctx.font.replace(/\d+px/, "20px")
            ctx.fillText("Press any KEY to return to main menu!", settings.gameResolution.x /2, 550)
            this.gameEnd = true
        }, 5000)
    }

    drawHud(context, player) {
        context.fillStyle = "#7896b3"
        context.fillRect(0, 0, settings.hudResolution.x, settings.hudResolution.y)
        
        context.fillStyle = "rgba(0, 0, 0, 0.4)"
        context.fillRect(this.hud.position.x, this.hud.position.y, this.hud.width, this.hud.height)

        const character = new Sprite({
            width: 30,
            height: 50,
            position: {
                x: 85,
                y: 156
            },
            imageSrc: `./../media/images/characters/${player.character}-${player.team}.png`
        })

        const item = player.item ? new Sprite({
            width: player.item.width,
            height: player.item.height,
            position: {
                x: 69 + (87 - player.item.width) / 2,
                y: 231 + (70 - player.item.height) / 2
            },
            imageSrc: player.item.imageSrc
        }) : null

        const powerup = player.powerup ? new Sprite({
            width: player.powerup.width,
            height: player.powerup.height,
            position: {
                x: 69 + (87 - player.powerup.width) / 2,
                y: 359 + (70 - player.powerup.height) / 2
            },
            imageSrc: player.powerup.imageSrc
        }) : null

        let healthX = 49
        let textX = 110

        if (player.team === "blue") {
            this.hud.isReversed = true
            character.isReversed = true

            // Change locations of sprites inside the reversed hud.
            healthX += 88
            textX -= 19

            if (item) {
                item.position.x -= 20
            }

            if (powerup) {
                powerup.position.x -= 20
            }
        } else {
            this.hud.isReversed = false
            character.isReversed = false
        }
        
        this.hud.draw(context)

        context.textAlign = "center"
        context.font = context.font.replace(/\d+px/, "15px")
        context.fillStyle = "#ffffff"

        context.fillText(`$${player.score}`, 100, 131)

        context.fillStyle = "#4fa64f"
        context.fillRect(healthX, 231, 14, 250)

        context.fillStyle = "#303e23"
        context.fillRect(healthX, 231, 14, 250 - player.health)

        if (item) {
            item.draw(context)

            context.fillStyle = "#ffffff"
            context.fillText("Worth:", textX, 330)

            context.fillStyle = "#86dc3d"
            context.fillText(`$${player.item.currentWorth}`, textX, 350)
        }

        if (powerup) {
            powerup.draw(context)

            context.fillStyle = "#ffffff"
            context.fillText("Time left:", textX, 458)

            const countdown = Math.floor((player.powerup.timer - (Date.now() - player.powerup.consumedTimestamp)) / 1000)

            context.fillStyle = "#fdfd66"
            context.fillText(`${countdown} seconds`, textX, 478)
        }

        if (player.isRespawning) {
            context.fillStyle = "#fdfd66"
            context.font = context.font.replace(/\d+px/, "50px")
            
            const countdown = 3 - Math.floor((Date.now() - player.deathTimestamp) / 1000)
            context.fillText(countdown, 100, 200)
        } else {
            character.draw(context)
        }
    }

}