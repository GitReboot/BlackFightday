class Sprite {
    
    constructor({ 
        width = 10, 
        height = 10, 
        position = { 
            x: 0, 
            y: 0 
        }, 
        imageSrc = "media/images/icon.png" 
    }) {
        this.scale = canvas.height / 600
        this.width = width
        this.height = height
        this.position = position
        this.imageSrc = imageSrc
        this.isReversed = false
        this.frame = 0
        this.frames = 0
        this.frameRate = 2
    }

    draw(context) {
        const image = new Image()
        image.src = this.imageSrc

        // Reset the frame if it reached past the max frames.
        const maxFrames = Math.floor(image.width / this.width) - 1   
        if (maxFrames === 0) {
            this.frame = 0
        } 

        // Animate the sprite.     
        if (!(this.frames % (60 / this.frameRate))) {
            if (this.frame < maxFrames) {
                this.frame++
            } else {
                this.frame = 0
            }
        }

        this.frames++

        // Reverse image.
        if (this.isReversed) {
            context.translate(this.position.x + this.width, this.position.y)
            context.scale(-1, 1)
            context.drawImage(image, this.frame * this.width, 0, this.width, this.height, 0, 0, this.width, this.height)
            context.setTransform(1, 0, 0, 1, 0, 0)
        } else {
            context.drawImage(image, this.frame * this.width, 0, this.width, this.height, this.position.x, this.position.y, this.width, this.height)
        }
    }

}