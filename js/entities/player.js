class Player extends Entity {

    constructor({
        width = 10,
        height = 10,
        position,
        direction,
        controls,
        imageSrc
    }) {
        super({ width: width, height: height, position: position, controls: controls, imageSrc: imageSrc })

        this.isDead = false
        this.spawnPosition = this.position
        this.controls = controls
        this.inputs = {
            jump: false,
            left: {
                pressed: false,
                timestamp: 0
            },
            right: {
                pressed: false,
                timestamp: 0
            },
            attack: false
        }
        this.speed = {
            x: 5,
            y: 13.5
        }
        this.direction = direction
        this.jumps = 0
        this.resistance = 1
        this.slowdown = 0.01
    }

    spawn({ position, velocity, controls }) {
        super.spawn({ position: position, velocity: velocity })

        this.spawnPosition = {
            x: position.x,
            y: position.y
        }

        this.controls = controls
    }


    respawn() {
        if (!this.isDead) return

        this.isDead = false
        this.position = this.spawnPosition
        this.velocity = {
            x: 0,
            y: 0
        }
    }

    /**
     * Update the player's properties.
     */

    update() {
        this.#jump()
        this.#walk()
        this.#handleDeaths()
        this.respawn()

        super.update()
    }

    #jump() {
        // If the player is in the air, make sure the player will face more horizontal resistance. Otherwise, reset the resistance if the player reaches a platform.
        if (!this.isOnGround) {
            this.resistance += this.slowdown
        } else {
            this.resistance = 1
            this.jumps = 0
        }

        // Make the player jump and increment the jump count.
        if (this.inputs.jump && this.isOnGround) {
            this.velocity.y += this.speed.y
            // Delay the incrementation of the jump count.
            // We do this because if players hold the jump button, their jump count will never reach 0.
            // We need the jump count to be 0 to reset the horizontal velocity in the #walk() method.
            // I chose for a delay of 20 ms, because it's over 16.67 ms, which is our tickrate.
            // This means the jump will stay 0 for at least one tick.
            setTimeout(() => { this.jumps++ }, 20)
        }
    }

    #walk() {
        const toLeft = this.inputs.left.pressed && this.inputs.left.timestamp > this.inputs.right.timestamp
        const toRight = this.inputs.right.pressed && this.inputs.right.timestamp > this.inputs.left.timestamp

        if (toLeft) {
            this.direction = -1

            // Prevent the player to glitch against a wall when moving into it.
            if (this.isOnWall.right) {
                this.velocity.x = 0
                return
            }
        }

        if (toRight) {
            this.direction = 1

            // Prevent the player to glitch against a wall when moving into it.
            if (this.isOnWall.left) {
                this.velocity.x = 0
                return
            }
        }

        // Set the velocity to the player speed with applied resistance when it is moving in any direction or if it is in the middle of a jump.
        if ((this.inputs.left.pressed || this.inputs.right.pressed || this.jumps > 0 && this.velocity.x !== 0)) {
            this.velocity.x = this.speed.x / Math.pow(this.resistance, 0.75)
        } else {
            this.velocity.x = 0
        }

        // Invert the velocity if the player is moving left.
        if (this.direction === -1 && this.velocity.x > 0) {
            this.velocity.x *= -1
        }
    }

    #handleDeaths() {
        if (this.isDead) return
        
        // Handle void deaths.
        const voidHeight = settings.resolution.y * 1.2
        if (this.position.y > voidHeight) this.isDead = true
    }
}