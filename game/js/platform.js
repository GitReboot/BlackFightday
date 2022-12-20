class Platform {

    constructor({ width, height, position, isBase }) {
        this.width = width
        this.height = height
        this.position = position
        this.isBase = isBase
        this.color = 128
    }

    draw() {
        const opacity = this.isBase ? 0 : 0.6

        ctx.fillStyle = `rgba(${this.color}, ${this.color}, ${this.color}, ${opacity})`
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

}