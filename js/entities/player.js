class Player extends Entity {

    constructor({
        width = 10,
        height = 10,
        imageSrc
    }) {
        super({ width: width, height: height, imageSrc: imageSrc })

        this.width = width
        this.height = height
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
        this.speed = 10
        this.jumpPower = 15
    }

    spawn({ position, velocity, controls }) {
        super.spawn({ position: position, velocity: velocity })

        this.controls = controls
    }

    move() {
        if (this.inputs.jump && this.velocity.y === 0) {
            this.velocity.y += this.jumpPower
        }

        if (!this.inputs.left.pressed && !this.inputs.right.pressed && this.velocity.x !== 0) {
            for (let i = this.speed * 10; i > 0; i--) {
                // Check whether the horizontal velocity is positive or negative, then apply smooth slowdown.
                if (this.velocity.x === Math.abs(this.velocity.x)) {
                    this.velocity.x -= 0.1
                } else {
                    this.velocity.x += 0.1
                }
            }
        } else if (this.inputs.left.pressed && this.inputs.left.timestamp > this.inputs.right.timestamp) {
            this.velocity.x = this.speed * -1
        } else if (this.inputs.right.pressed && this.inputs.right.timestamp > this.inputs.left.timestamp) {
            this.velocity.x = this.speed
        }

        super.move()
    }

    update() {
        this.move()
        super.update()
    }

}