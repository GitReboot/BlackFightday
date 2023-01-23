class Sprite {
    
    constructor({ 
        width = 10, 
        height = 10, 
        position = { x: 0, y: 0 }, 
        imageSrc = "media/images/icon.png" 
    }) {
        this.scale = canvas.height / 600
        this.width = width
        this.height = height
        this.position = position
        this.imageSrc = imageSrc
        this.isReversed = false
    }

    draw(context) {
        const image = new Image(this.width, this.height)
        image.src = this.imageSrc

        if (this.isReversed) {
            context.translate(this.position.x + this.width, this.position.y)
            context.scale(-1, 1)
            context.drawImage(image, 0, 0)
            context.setTransform(1, 0, 0, 1, 0, 0)
        } else {
            context.drawImage(image, this.position.x, this.position.y, this.width, this.height)
        }

    }

}