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
        this.positionFrom = position
        this.position = position
        this.velocity = { x: 0, y: 0 }
        this.gravity = 0.5
        this.gravityMax = 15
        this.isOnGround = false
        this.isOnWall = {
            left: false,
            right: false
        }
        this.platform

        this.draw(ctx)
    }

    /**
     * Update the entity's properties
     */

    update() {
        this.#setLatestPlatform()
        this.#applyGravity()
        this.#handlePlatformCollision()
        this.#move()
        this.#handleBorderCollision()
    }


    /**
     * Check if this entity's hitbox is colliding with another object's hitbox.
     * 
     * @param {Object} object The object to compare hitboxes with.
     * @returns {Boolean} Whether both hitboxes collide with eachother.
     */

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

    #move() {
        this.positionFrom = this.position
        this.position = {
            x: this.position.x + this.velocity.x,
            y: this.position.y - this.velocity.y
        }
    }

    #applyGravity() {
        this.velocity.y -= this.gravity

        // Make sure acceleration stops at the maximum gravity.
        if (this.velocity.y < this.gravityMax * -1) {
            this.velocity.y = this.gravityMax * -1
        }
    }   

    #setLatestPlatform() {
        for (const platform of round.map.platforms) {
            if (this.collidesWith(platform)) this.platform = platform
        }
    }

    #handlePlatformCollision() {
        const platform = this.platform

        if (platform) {
            if (!this.collidesWith(platform)) {
                this.isOnGround = false
                return
            }

            // The velocity determines which direction the player is moving. The current position should then be inside the platform hitbox and the positionFrom should be outside the platform hitbox.
            const fromTop = this.velocity.y < 0 && this.position.y + this.height >= platform.position.y && this.positionFrom.y + this.height <= platform.position.y
            const fromBottom = this.velocity.y > 0 && this.position.y <= platform.position.y + platform.height && this.positionFrom.y >= platform.position.y + platform.height
            const fromLeft = this.velocity.x >= 0 && this.position.x + this.width >= platform.position.x && this.positionFrom.x + this.width <= platform.position.x
            const fromRight = this.velocity.x <= 0 && this.position.x <= platform.position.x + platform.width && this.positionFrom.x >= platform.position.x + platform.width

            // Player moved into platform from the top.
            if (fromTop) {
                this.position.y = platform.position.y - this.height
                this.velocity.y = 0
                this.isOnGround = true
            } else {
                this.isOnGround = false
            }

            // Normal platforms should only have collision from the top.
            if (!platform.isBase) {
                this.isOnWall.left = false
                this.isOnWall.right = false
                return
            }

            // We don't want the player to be teleported if they are on top of a platform.
            if (this.isOnGround) return

            // Player moved into platform from the bottom.
            if (fromBottom) {
                this.position.y = platform.position.y + platform.height
            }

            // Player moved into platform from the left.
            if (fromLeft) {
                this.position.x = platform.position.x - this.width
                this.isOnWall.left = true
            } else {
                this.isOnWall.left = false
            }

            // Player moved into platform from the right.
            if (fromRight) {
                this.position.x = platform.position.x + platform.width
                this.isOnWall.right = true
            } else {
                this.isOnWall.right = false
            }
        }
    }

    #handleBorderCollision() {
        if (this.position.x < 0) {
            this.velocity.x = 0
            this.position.x = 0
        } 
        
        if (this.position.x + this.width > canvas.width) {
            this.velocity.x = 0
            this.position.x = canvas.width - this.width
        }
    }
}