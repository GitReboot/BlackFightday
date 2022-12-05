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
    }

    draw() {
        const image = new Image(this.width, this.height)
        image.src = this.imageSrc
        ctx.drawImage(image, this.position.x, this.position.y, this.width, this.height)
    }

}