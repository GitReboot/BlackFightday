class Item extends Entity {
    
    constructor({
        width = 10,
        height = 10,
        position,
        name,
        worth,
        weight,
        fragility,
        isFragile
    }) {
        super({ width: width, height: height, position: position, imageSrc: `./../media/images/items/${name}-new.png` })

        this.name = name
        this.state = "new"
        this.worth = worth
        this.currentWorth = worth
        this.weight = weight
        this.damage = 0
        this.isFragile = isFragile
        this.fragility = fragility
        this.player = null
        this.isInAir = false
    }

    /**
     * Update the item"s properties
     */

    update() {
        if (this.player) {
            // If the item is held by a player, make it tag along with this player.
            if (!this.isInAir && this == this.player.item) {
                const direction = this.player.isDrunk ? this.player.direction * -1 : this.player.direction
                const x = direction === -1 ? this.player.position.x - this.width : this.player.position.x + this.player.width
    
                this.isOnGround = false
                this.velocity = { x: 0, y: 0 }
                this.positionFrom = this.position
                this.position = { x: x, y: this.player.position.y }
            } else super.update()
        }

        this.#handleLandings()
        this.handleStates()
        this.#handleCollection()
        this.#handleDeath()
    }

    /**
     * Spawn the item entity on a random location on the map.
     */

    spawn() {
        let location

        // Look for an available spawn location.
        while (!location) {
            // Get a random platform from the map.
            const platforms = round.map.platforms
            const platform = platforms[Math.floor(Math.random() * platforms.length)]
            
            const lowerX = platform.position.x
            const upperX = platform.position.x + platform.width - this.width

            // Define a random position on this platform.
            const position = {
                x: Math.floor(Math.random() * (upperX - lowerX + 1) + lowerX),
                y: platform.position.y - this.height
            }

            const loc = {
                position: position,
                width: this.width,
                height: this.height
            }

            // Make sure there aren"t any items or players on this location already.
            let available = true

            round.items.forEach(item => {
                if (item.collidesWith(loc)) available = false
            })

            round.players.forEach(player => {
                if (player.collidesWith(loc)) available = false
            })

            if (available) location = loc
        }

        this.position = location.position
        round.items.add(this)
    }

    /**
     * Throw the item.
     */

    throw() {
        if (!this.player) return

        this.isInAir = true
        this.velocity.y = 8
        this.velocity.x = 1 / this.weight * 10 * this.player.direction * this.player.strengthBoost
    }

    /**
     * Remove item entity from the round.
     */

    remove() {
        round.items.delete(this)
    }

    #handleLandings() {
        if (!this.isOnGround) return

        if (this.player) {
            this.damage++
        }
    
        this.isInAir = false
        this.velocity.x = 0
        this.player = null
    }

    handleStates() {
        let state;

        // Update the state and worth of the item.
        if (this.damage < this.fragility) {
            state = "new"
        } else if (this.damage < this.fragility * 2) {
            state = "damaged"
            this.currentWorth = this.worth / 2
        } else if (this.damage < this.fragility * 3) {
            state = "broken"
            this.currentWorth = this.worth / 4
        } else {
            this.remove()
        }

        // The vase has a fragility below 1. If the vase is thrown, it should have no worth.
        if (this.isFragile && this.currentWorth != this.worth) {
            this.currentWorth = 0
        }

        this.imageSrc = `./../media/images/items/${this.name}-${state}.png`
    }

    #handleCollection() {
        round.carts.forEach(cart => {
            if (this.collidesWith(cart)) {
                cart.player.score += this.currentWorth
                this.remove()
                return
            }
        }
        )
    }

    #handleDeath() {
        if (this.position.y > canvas.height * 1.2) this.remove()
    }

}