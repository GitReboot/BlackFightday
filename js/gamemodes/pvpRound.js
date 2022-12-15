class PvpRound {
    constructor({ map }) {
        this.running = false
        this.map = map
        this.players = new Set()
        this.items = new Set()
        this.tickrate = 60
        this.lastTick
    }

    startGame() {
        // Initialise map.
        

        // Initialise players.
        this.initPlayers()

        // Start listening for key presses within the canvas.
        addEventListeners() 

        // Start the game loop.
        this.running = true
        this.lastTick = Date.now()
        this.loopGame()
        this.animate()
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

        // Update all entities.
        this.players.forEach(player => player.update())

        // Keep updating all entities for a consistent playing experience that does not rely on frames.
        const delay = this.tickrate < Date.now() - this.lastTick ? Date.now() - this.lastTick : this.tickrate
        setTimeout(() => { this.loopGame() }, 1000 / delay)
        this.lastTick = Date.now()
    }

    animate() {
        // Stop the animation once the game should no longer be running.
        if (!this.running) return

        window.requestAnimationFrame(() => { this.animate() })
        
        // Draw all sprites.
        ctx.fillStyle = "#fcfcfc"
        this.map.draw()
        this.map.platforms.forEach(platform => platform.draw())
        this.players.forEach(player => player.draw())
    }

    initPlayers() {
        const player1 = new Player({ 
            width: 30, 
            height: 50, 
            position: this.map.position1,
            direction: 1, 
            controls: settings.controls.player1,
            imageSrc: "media/images/player1.png" 
        })

        const player2 = new Player({ 
            width: 30, 
            height: 50, 
            position: this.map.position2,
            direction: -1, 
            controls: settings.controls.player2,
            imageSrc: "media/images/player2.png" 
        })

        this.players.add(player1)
        this.players.add(player2)
    }
}