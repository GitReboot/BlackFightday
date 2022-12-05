class PvpRound {
    constructor({ map }) {
        this.running = false
        this.map = map
        this.players = new Set()
        this.items = new Set()
    }

    startGame() {
        // Initialise map.
        this.map = new Map()
        this.map.load({ name: "walmart", position1: { x: 70, y: 10 }, position2: { x: 270, y: 10 }, background: "media/images/backgrounds/walmart.png" })

        // Initialise players.
        this.initPlayers()

        // Start listening for key presses within the canvas.
        addEventListeners() 

        // Start the game loop.
        this.running = true
        this.loopGame()
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

        console.log(this.map)

        window.requestAnimationFrame(() => { this.loopGame() })

        ctx.fillStyle = "#fcfcfc"
        this.map.draw()
        ctx.fillStyle = "#0c0c0c"
        this.map.platforms.forEach(platform => platform.update())
        this.players.forEach(player => player.update())
    }

    initPlayers() {
        const player1 = new Player({ width: 30, height: 50, imageSrc: "media/images/player1.png" })
        const player2 = new Player({ width: 30, height: 50, imageSrc: "media/images/player2.png" })

        player1.spawn({
            position: this.map.position1,
            velocity: { x: 0, y: 0 },
            controls: settings.controls.player1
        })

        player2.spawn({
            position: this.map.position2,
            velocity: { x: 0, y: 0 },
            controls: settings.controls.player2
        })

        this.players.add(player1)
        this.players.add(player2)
    }
}