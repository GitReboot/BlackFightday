class Map {

    constructor() {
        this.name
        this.position1
        this.position2
        this.background
        this.platforms = new Set()
    }

    load({ name, position1, position2, background }) {
        this.name = name
        this.position1 = position1
        this.position2 = position2
        this.background = background

        this.createPlatforms()
    }

    draw() {
        ctx.fillStyle = "#47ceeb"
        ctx.fillRect(0, 0 , canvas.width, canvas.height)

        this.platforms.forEach(platform => {
            platform.update()
        })
    }

    update() {
        this.draw()
    }

    createPlatforms() {
        switch(this.name.toLowerCase()) {
            case "walmart":
                this.platforms.add(new Platform({ width: 100, height: 20, position: { x: 50, y: 500 } }))
                this.platforms.add(new Platform({ width: 300, height: 200, position: { x: 250, y: 300 } }))
        }
    }

}