class Powerup extends Item {
    constructor({
        width = 10,
        height = 10,
        position,
        name,
        worth,
        weight,
        fragility,
        uses,
        timer
    }) {
        super({ width: width, height: height, position: position, name: name, worth: worth, weight: weight, fragility: fragility })

        this.isPowerup = true
        this.timer = timer
        this.consumedTimestamp = 0
    }

    use() {
        if (this.player.powerup) {
            this.player.powerup.stop()
        }

        this.consumedTimestamp = Date.now()
        this.player.powerup = this
        this.player.item = null
        this.player.canAttack = true
        this.remove()

        setTimeout(() => {
            this.player.pickupCooldown = false
        }, 500)

        setTimeout(() => {
            if (this.player.powerup === this) {
                this.stop()
            }
        }, this.timer)
    }

    stop() {
        this.player.powerup = null
    }

    handleStates() {
        if (this.damage > 0) {
            this.remove()
        }
    }
}