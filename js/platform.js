class Platform {

    constructor({ width, height, position }) {
        this.width = width
        this.height = height
        this.position = position
    }

    draw() {
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.draw()
    }

}