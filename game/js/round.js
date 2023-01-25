class Round {
    constructor() {
        this.running = false
        this.gameStart = false
        this.gameEnd = false

        this.map

        this.maps = new Array()
        this.players = new Array()
        this.itemObjects = new Array()
        this.items = new Set()
        this.carts = new Set()

        this.tickrate = 60
        this.timestamp

        this.itemIsSpawning = false
        this.updatePriority = "red"

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
        // Initialise the players, carts and itemObjects.
        this.#initialize()

        // Start listening for key presses within the window.
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
        this.gameEnd = true
    }

    loopGame() {        
        // Stop the game once the game should no longer be running.
        if (!this.running) return
        if (Date.now() - this.timestamp > settings.gameDuration * 1000) this.running = false

        // Spawn item entities.
        // There can be no more than 2 items alive on the map at the same time.
        if (!this.itemIsSpawning && this.items.size < 2) {
            this.itemIsSpawning = true
            setTimeout(() => {
                const itemObject = this.itemObjects[Math.floor(Math.random() * this.itemObjects.length)] // Random item object
                let item

                // Create a new item from the item object.
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

                // Spawn the item onto the map.
                item.spawn()
                this.itemIsSpawning = false
            }, Math.floor(Math.random() * 6 + 4) * 1000) // Item will spawn randomly between 4 and 10 seconds.
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
        setTimeout(() => { 
            this.loopGame() 
        }, 1000 / this.tickrate)
    }

    animate() {
        // Stop the animation once the game should no longer be running.
        if (!this.running) {
            this.displayWinner()   
            return
        }
        
        // Request a new animation frame to draw on.
        window.requestAnimationFrame(() => { this.animate() })

        // Clear the canvas.
        ctx.clearRect(-1, -1, canvas.width + 1, canvas.height + 1)

        // Draw all sprites.
        this.map.draw(ctx)
        this.map.platforms.forEach(platform => platform.draw(ctx))
        this.carts.forEach(cart => cart.draw(ctx))
        this.items.forEach(item => item.draw(ctx))
        this.players.forEach(player => { 
            // Only draw a player if it is alive.
            if (!player.isRespawning) {
                player.draw(ctx) 
            }
        })

        // Display the countdown or timer.
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

        // Draw the HUDs at the side of the main canvas.
        this.drawHud(ctxRed, this.players[0])
        this.drawHud(ctxBlue, this.players[1])
    }

    displayWinner() {
        const player1 = this.players[0]
        const player2 = this.players[1]
        let winner;

        let title
        let message = `$${player1.score} - $${player2.score}`

        // Determine the winner.
        if (player1.score === player2.score) {
            title = `Tie!`
        } else if (player1.score > player2.score) {
            title = `${player1.team.charAt(0).toUpperCase() + player1.team.slice(1)} won!`
            winner = player1
        } else {
            winner = player2
            title = `${player2.team.charAt(0).toUpperCase() + player2.team.slice(1)} won!`
        }

        // Display the winner and the score.
        ctx.textAlign = "center"
        ctx.font = ctx.font.replace(/\d+px/, "100px")

        ctx.fillStyle = "rgba(0, 0, 0, 0.8)"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        ctx.fillStyle = winner ? winner.team : "#aaaaaa"
        ctx.fillText(title, settings.gameResolution.x / 2, 250)
        
        ctx.fillStyle = "#ffffff"
        ctx.fillText(message, settings.gameResolution.x / 2, 350)

        // Prompt the user to return to the main menu.
        setTimeout(() => {
            ctx.font = ctx.font.replace(/\d+px/, "20px")
            ctx.fillText("Press any KEY to return to main menu!", settings.gameResolution.x /2, 550)
            this.endGame()
        }, 5000)
    }

    drawHud(context, player) {
        // Draw the canvas background
        context.fillStyle = "#7896b3"
        context.fillRect(0, 0, settings.hudResolution.x, settings.hudResolution.y)
        
        // Draw the hud background.
        context.fillStyle = "rgba(0, 0, 0, 0.4)"
        context.fillRect(this.hud.position.x, this.hud.position.y, this.hud.width, this.hud.height)

        // Create new character sprite.
        const character = new Sprite({
            width: 42,
            height: 44,
            position: {
                x: 80,
                y: 156
            },
            imageSrc: `./../media/images/characters/player-${player.team}-idle.png`
        })

        // Create new item sprite.
        const item = player.item ? new Sprite({
            width: player.item.width,
            height: player.item.height,
            position: {
                x: 69 + (87 - player.item.width) / 2,
                y: 231 + (70 - player.item.height) / 2
            },
            imageSrc: player.item.imageSrc
        }) : null

        // Create new powerup sprite.
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

        // Invert the hud layout if the player is on the blue team.
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

        // Display the player's score.
        context.textAlign = "center"
        context.font = context.font.replace(/\d+px/, "15px")
        context.fillStyle = "#ffffff"

        context.fillText(`$${player.score}`, 100, 131)

        // Display the health bar.
        context.fillStyle = "#4fa64f"
        context.fillRect(healthX, 231, 14, 250)

        context.fillStyle = "#303e23"
        context.fillRect(healthX, 231, 14, 250 - player.health)

        // Draw the item in hand.
        if (item) {
            item.draw(context)

            context.fillStyle = "#ffffff"
            context.fillText("Worth:", textX, 330)

            context.fillStyle = "#86dc3d"
            context.fillText(`$${player.item.currentWorth}`, textX, 350)
        }

        // Draw the activated powerup.
        if (powerup) {
            powerup.draw(context)

            context.fillStyle = "#ffffff"
            context.fillText("Time left:", textX, 458)

            const countdown = Math.floor((player.powerup.timer - (Date.now() - player.powerup.consumedTimestamp)) / 1000)

            context.fillStyle = "#fdfd66"
            context.fillText(`${countdown} seconds`, textX, 478)
        }

        // Display a respawn countdown or the player image.
        if (player.isRespawning) {
            context.fillStyle = "#fdfd66"
            context.font = context.font.replace(/\d+px/, "50px")
            
            const countdown = 3 - Math.floor((Date.now() - player.deathTimestamp) / 1000)
            context.fillText(countdown, 100, 200)
        } else {
            character.draw(context)
        }
    }

    #initialize() {
        // Initialize maps
        const map1 = new Map({ 
            name: "Walmart", 
            position1: { 
                x: 180, 
                y: 378 
            }, 
            position2: { 
                x: 691, 
                y: 378 
            }, 
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
            position1: { 
                x: 180, 
                y: 378 
            }, 
            position2: { 
                x: 691, 
                y: 378 
            }, 
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
            position1: { 
                x: 180, 
                y: 378 
            }, 
            position2: { 
                x: 691, 
                y: 378 
            }, 
            platforms: [
                new Platform({ width: 631, height: 17, position: { x: 135, y: 429 }, isBase: true }),
                new Platform({ width: 164, height: 17, position: { x: 132, y: 124 }, isBase: false }),
                new Platform({ width: 157, height: 17, position: { x: 607, y: 249 }, isBase: false }),
                new Platform({ width: 313, height: 17, position: { x: 295, y: 288 }, isBase: false })
            ]
        })
        
        this.maps.push(map1)
        this.maps.push(map2)
        this.maps.push(map3)

        // Select a random map.
        this.map = this.maps[Math.floor(Math.random() * this.maps.length)]

        // Initialize players.
        const player1 = new Player({ 
            team: "red",
            width: 42, 
            height: 44, 
            position: this.map.position1,
            direction: 1, 
            controls: settings.controls.player1,
        })

        const player2 = new Player({ 
            team: "blue",
            width: 42, 
            height: 44, 
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

        // Initialize item objects.
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
            fragility: 2,
            isFragile: false
        }
        
        const item2 = {
            width: 14,
            height: 27,
            name: "smartphone",
            position: position,
            worth: 300,
            weight: 2,
            fragility: 3,
            isFragile: false
        }
        
        const item3 = {
            width: 34,
            height: 28,
            name: "laptop",
            position: position,
            worth: 800,
            weight: 3,
            fragility: 2,
            isFragile: false
        }
        
        const item4 = {
            width: 32,
            height: 25,
            name: "gamestation",
            position: position,
            worth: 500,
            weight: 3,
            fragility: 2,
            isFragile: false
        }
        
        const item5 = {
            width: 19,
            height: 42,
            name: "vase",
            position: position,
            worth: 2000,
            weight: 3,
            fragility: 1,
            isFragile: true
        }
        
        const item6 = {
            width: 30,
            height: 30,
            name: "oil",
            position: position,
            worth: 30,
            weight: 3,
            fragility: 4,
            isFragile: false
        }
        
        const item7 = {
            width: 45,
            height: 24,
            name: "mountainbike",
            position: position,
            worth: 900,
            weight: 4,
            fragility: 3,
            isFragile: false
        }
        
        const item8 = {
            width: 13,
            height: 27,
            name: "beer",
            position: position,
            worth: 5,
            weight: 2,
            fragility: 1,
            isFragile: true,
            isPowerup: true,
            timer: 20000
        }
        
        const item9 = {
            width: 13,
            height: 27,
            name: "monster",
            position: position,
            worth: 2,
            weight: 2,
            fragility: 1,
            isFragile: true,
            isPowerup: true,
            timer: 25000
        }
        
        const item10 = {
            width: 13,
            height: 27,
            name: "proteine",
            position: position,
            worth: 3,
            weight: 2,
            fragility: 1,
            isFragile: true,
            isPowerup: true,
            timer: 15000
        }
        
        this.itemObjects.push(item1)
        this.itemObjects.push(item2)
        this.itemObjects.push(item3)
        this.itemObjects.push(item4)
        this.itemObjects.push(item5)
        this.itemObjects.push(item6)
        this.itemObjects.push(item7)
        this.itemObjects.push(item8)
        this.itemObjects.push(item9)
        this.itemObjects.push(item10)
    }

}