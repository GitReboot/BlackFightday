class Platform {

    constructor({ width, height, position, isBase }) {
        this.width = width
        this.height = height
        this.position = position
        this.isBase = isBase
    }

    draw() {
        const opacity = this.isBase ? 0 : 1

        ctx.fillStyle = `rgba(45, 22, 12, ${opacity})`
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

}