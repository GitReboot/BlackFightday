class Player extends Entity {

    constructor({
        width = 10,
        height = 10,
        direction,
        imageSrc
    }) {
        super({ width: width, height: height, imageSrc: imageSrc })

        this.controls = {
            jump: "KeyW",
            left: "KeyA",
            right: "KeyD",
            attack: "ShiftLeft"
        }
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
        this.previousDirection = direction
        this.jumps = 0
        this.resistance = 1
        this.slowdown = 0.01
    }

    spawn({ position, velocity, controls }) {
        super.spawn({ position: position, velocity: velocity })

        this.controls = controls
    }

    /**
     * Update the player's properties.
     */

    update() {
        this.#jump()
        this.#walk()

        super.update()
    }

    #jump() {
        if (this.isOnGround) {
            this.resistance = 1
            this.jumps = 0
        } else {
            this.resistance += this.slowdown
        }

        // if (this.direction != this.previousDirection) {
        //     this.resistance = 1
        // }

        if (this.inputs.jump && this.isOnGround) {
            this.velocity.y += this.speed.y
            setTimeout(() => { this.jumps++ }, 20)
        }

        this.previousDirection = this.direction
    }

    #walk() {
        const toLeft = this.inputs.left.pressed && this.inputs.left.timestamp > this.inputs.right.timestamp
        const toRight = this.inputs.right.pressed && this.inputs.right.timestamp > this.inputs.left.timestamp

        if (toLeft) {
            this.direction = 'L'

            if (this.isOnWall.right) {
                this.velocity.x = 0
                return
            }
        }

        if (toRight) {
            this.direction = 'R'

            if (this.isOnWall.left) {
                this.velocity.x = 0
                return
            }
        }

        // Set the velocity to the player speed when it is moving in any direction.
        if ((this.inputs.left.pressed || this.inputs.right.pressed || this.jumps > 0 && this.velocity.x !== 0)) {
            this.velocity.x = this.speed.x / Math.pow(this.resistance, 0.75)
        } else {
            this.velocity.x = 0
        }

        // Invert the velocity if the player is moving left.
        if (this.direction === 'L' && this.velocity.x > 0) {
            this.velocity.x *= -1
        }

        console.log(this.velocity.x)
    }
}