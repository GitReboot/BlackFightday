class Platform {

    constructor({ 
        width, 
        height, 
        position, 
        isBase 
    }) {
        this.width = width
        this.height = height
        this.position = position
        this.isBase = isBase
    }

    draw(context) {
        context.fillStyle = `#2d160c`

        // We don't need to draw a visual platform if it is the base island.
        if (!this.isBase) {
            context.fillRect(this.position.x, this.position.y, this.width, this.height)
        }
    }

}