class Platform {

    constructor({ width, height, position, isBase }) {
        this.width = width
        this.height = height
        this.position = position
        this.isBase = isBase
    }

    draw() {
        const opacity = this.isBase ? 0 : 0.5

        ctx.fillStyle = `rgba(64, 64, 64, ${opacity})`
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

}