class Entity extends Sprite {

    constructor({
        width = 10,
        height = 10,
        position,
        imageSrc
    }) {
        super({widt: width, height: height, position: position, imageSrc: imageSrc})

        this.width = width
        this.height = height
        this.position
        this.velocity
        this.gravity = 0.5
        this.gravityMax = 15
    }
    
    spawn({ position, velocity }) {
        this.position = {
            x: position.x,
            y: position.y
        }

        this.velocity = {
            x: velocity.x,
            y: velocity.y
        }

        this.draw()
    }

    update() {
        // Update the scale in case the canvas size was changed during a game.
        this.scale = canvas.height / 500

        this.applyGravity()
        this.draw()
    }

    applyGravity() {
        if (this.position.y + this.height * this.scale >= canvas.height) {
            this.velocity.y = 0
            this.position.y = canvas.height - this.height * this.scale
        } else {
            this.velocity.y -= this.gravity
            if (this.velocity.y < this.gravityMax * -1) {
                this.velocity.y = this.gravityMax * -1
            }
        }
    }

    move() {
        this.position = {
            x: this.position.x + this.velocity.x,
            y: this.position.y - this.velocity.y
        }
    }

    collidesWith(entity) {
        let horizontalCollision = false
        let verticalCollision = false

        // Check if the left corner of an entity is within the left corner and the right corner of the other entity.
        if (this.position.x <= entity.position.x && entity.position.x <= this.position.x + this.width) horizontalCollision = true
        if (entity.position.x <= this.position.x && this.position.x <= entity.position.x + entity.width) horizontalCollision = true

        // Check if the top of an entity is within the top and the bottom on the other entity.
        if (this.position.y <= entity.position.y && entity.position.y <= this.position.y + this.height) verticalCollision = true
        if (entity.position.y <= this.position.y && this.position.y <= entity.position.y + entity.height) verticalCollision = true

        return horizontalCollision && verticalCollision
    }
}