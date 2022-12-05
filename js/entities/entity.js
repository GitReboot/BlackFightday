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
        this.positionFrom
        this.position
        this.velocity = { x: 0, y: 0 }
        this.gravity = 0.5
        this.gravityMax = 15
        this.isOnGround = false
        this.currentPlatform
    }
    
    spawn({ position, velocity }) {
        this.position = {
            x: position.x,
            y: position.y
        }
        
        this.positionFrom = this.position

        this.velocity = {
            x: velocity.x,
            y: velocity.y
        }

        this.draw()
    }

    update() {
        this.setPlatform()
        this.applyGravity()
        this.draw()
    }

    applyGravity() {
        if (this.isOnGround && this.collidesWith(this.currentPlatform) && this.currentPlatform.position.y >= this.positionFrom.y) {
            this.velocity.y = 0
            this.position.y = this.currentPlatform.position.y - this.height
        } else {
            this.velocity.y -= this.gravity
            if (this.velocity.y < this.gravityMax * -1) {
                this.velocity.y = this.gravityMax * -1
            }
        }
    }

    move() {
        this.positionFrom = this.position
        this.position = {
            x: this.position.x + this.velocity.x,
            y: this.position.y - this.velocity.y
        }
    }

    collidesWith(object) {
        let horizontalCollision = false
        let verticalCollision = false

        // Check if the left corner of an object is within the left corner and the right corner of the other object.
        if (this.position.x <= object.position.x && object.position.x <= this.position.x + this.width) horizontalCollision = true
        if (object.position.x <= this.position.x && this.position.x <= object.position.x + object.width) horizontalCollision = true

        // Check if the top of an object is within the top and the bottom on the other object.
        if (this.position.y <= object.position.y && object.position.y <= this.position.y + this.height) verticalCollision = true
        if (object.position.y <= this.position.y && this.position.y <= object.position.y + object.height) verticalCollision = true

        return horizontalCollision && verticalCollision
    }

    setPlatform() {
        pvpRound.map.platforms.forEach(platform => {
            if (this.collidesWith(platform)) {
                this.currentPlatform = platform
                this.isOnGround = true
            }
        })
    }
}