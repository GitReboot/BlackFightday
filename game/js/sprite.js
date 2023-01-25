class Sprite {
    
    constructor({ 
        width, 
        height, 
        position, 
        imageSrc 
    }) {
        this.image
        this.isReversed = false
        this.width = width
        this.height = height
        this.position = position
        this.imageSrc = imageSrc
        this.frame = 0
        this.frames = 0
        this.frameRate = 4
    }

    /**
     * Draw the sprite onto the canvas.
     * 
     * @param {CanvasRenderingContext2D} context The context of the canvas to draw the sprite onto.
     */

    draw(context) {
        // Update the sprite image.
        this.image = new Image()
        this.image.src = this.imageSrc

        // Reverse image.
        if (this.isReversed) {
            context.translate(this.position.x + this.width, this.position.y)
            context.scale(-1, 1)
            context.drawImage(this.image, this.frame * this.width, 0, this.width, this.height, 0, 0, this.width, this.height)
            context.setTransform(1, 0, 0, 1, 0, 0)
        } else {
            context.drawImage(this.image, this.frame * this.width, 0, this.width, this.height, this.position.x, this.position.y, this.width, this.height)
        }
    }

    /**
     * Update the sprite's properties
     */

    update() {
        // Reset the frame if it reached past the max frames.
        const maxFrames = Math.floor(this.image.width / this.width) - 1   
        if (maxFrames === 0) {
            this.frame = 0
        } 

        // Increment the frame to animate the spritesheet.     
        if (!(this.frames % (60 / this.frameRate))) {
            if (this.frame < maxFrames) {
                this.frame++
            } else {
                this.frame = 0
            }
        }

        this.frames++
    }

}