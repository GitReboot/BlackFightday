class Powerup extends Item {
    constructor({
        width,
        height,
        position,
        name,
        worth,
        weight,
        fragility,
        isFragile,
        timer
    }) {
        super({ 
            width: width, 
            height: height,
            position: position, 
            name: name, 
            worth: worth, 
            weight: weight, 
            fragility: fragility,
            isFragile: isFragile
        })

        this.isPowerup = true
        this.consumedTimestamp = 0
        this.timer = timer
    }

    /**
     * Consume the powerup and activate it.
     */

    use() {
        // If the player has an active powerup, disable this one first.
        if (this.player.powerup) {
            this.player.powerup.stop()
        }

        // Set the player powerup, activate it and remove the player's item (which was previously the powerup).
        this.consumedTimestamp = Date.now()
        this.player.powerup = this
        this.player.item = null
        this.player.canAttack = true
        this.remove()

        setTimeout(() => {
            this.player.pickupCooldown = false
        }, 500)

        // De-activate the powerup after the timer has expired.
        setTimeout(() => {
            if (this.player.powerup === this) {
                this.stop()
            }
        }, this.timer)
    }

    /**
     * De-activate the powerup.
     */

    stop() {
        this.player.powerup = null
    }

    /**
     * Handle the state of the item.
     */

    handleStates() {
        if (this.damage > 0) {
            this.remove()
        }
    }
}