class Player extends Entity {

    constructor({
        team,
        character,
        width = 10,
        height = 10,
        position,
        direction,
        controls,
    }) {
        super({ 
            width: width, 
            height: height, 
            position: position, 
            imageSrc: `../media/images/characters/${character}-${team}-idle.png` 
        })

        this.team = team
        this.character = character
        this.state = "idle"
        this.isJumping = false
        this.isWalking = false
        this.opponent
        this.score = 0
        this.isDead = false
        this.deathTimestamp = 0
        this.canAttack = false
        this.isRespawning = false
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
            attack: {
                pressed: false, 
                timestamp: 0
            },
            throw: false
        }
        this.speed = {
            x: 5,
            y: 13.8
        }
        this.speedBoost = 1
        this.strengthBoost = 1
        this.drunkResistance = 1
        this.isDrunk = false
        this.health = 250
        this.maxHealth = 250
        this.jumps = 0
        this.resistance = 1
        this.slowdown = 0.01
        this.knockback = 4
        this.item = null
        this.powerup = null
        this.attackCooldown = 300
        this.pickupCooldown = false
        this.jumpCooldown = 500
        this.jumpTimestamp = 0
        this.direction = direction
        this.attackRange = width
        this.isAttacked = false
        this.isAttacking = false
        this.isStunned = false
        this.comboLength = 0
        this.maxComboLength = Math.floor(Math.random() * 5 + 5)
        this.knockbackDirection = 0
        this.knockbackMultiplier = {
            x: 4,
            y: 4
        }
        this.damage = 0
        this.damageMultiplier = 8
        this.heavyAttackTimer = 500
    }

    /**
     * Bring the player back to their spawn location.
     */

    respawn() {
        this.isRespawning = true
        this.health = this.maxHealth

        setTimeout(() => {
            this.isDead = false
            this.isRespawning = false
            this.position = this.spawnPosition
            this.velocity = {
                x: 0,
                y: 0
            }
        }, 3500)
    }

    /**
     * Update the player"s properties.
     */

    update() {
        this.#jump()
        this.#walk()
        this.#handleDamage()
        this.#handleDeaths()
        this.#handleItems()
        this.#handleKnockback()
        this.#handleStates()

        if (this.isDead && !this.isRespawning) {
            this.respawn()
        }

        super.update()
    }

    /**
     * Attempt to attack another player.
     */

    attack() {
        if (this.isRespawning || !this.canAttack || this.isStunned) return

        this.canAttack = false
        this.isAttacking = true

        let power = Date.now() - this.inputs.attack.timestamp

        if (power < 500) {
            power = 500
        } else if (power > 1500) {
            power = 1500
        }

        const direction = this.isDrunk ? this.direction * -1 : this.direction
        const attackBox = {
            width: this.attackRange,
            height: this.height,
            position: {
                x: direction > 0 ? this.position.x + this.width : this.position.x - this.attackRange,
                y: this.position.y
            }
        }

        round.players.forEach(player => {
            if (player.collidesWith(attackBox) && player.team !== this.team) {
                player.isAttacked = true
                player.knockbackDirection = direction
                player.damage = power * this.strengthBoost * player.drunkResistance

                this.opponent = player 
                this.isStunned = true
            }
        })

        setTimeout(() => {
            this.canAttack = true
            this.isAttacking = false
            this.isStunned = false

            this.velocity = {
                x: 0,
                y: 0
            }
        }, this.attackCooldown)
    }


    #jump() {
        if (this.isStunned || this.isRespawning) return

        // If the player is in the air, make sure the player will face more horizontal resistance. Otherwise, reset the resistance if the player reaches a platform.
        if (!this.isOnGround) {
            this.resistance += this.slowdown
        } else {
            this.resistance = 1
            this.jumps = 0
        }

        // Make the player jump and increment the jump count.
        if (this.inputs.jump && (this.isOnGround || this.jumps < 1) && Date.now() - this.jumpTimestamp > this.jumpCooldown) {
            this.jumpTimestamp = Date.now()
            this.velocity.y = this.speed.y

            // Delay the incrementation of the jump count.
            // We do this because if players hold the jump button, their jump count will never reach 0.
            // We need the jump count to be 0 to reset the horizontal velocity in the #walk() method.
            // I chose for a delay of 20 ms, because it"s over 16.67 ms, which is our tickrate.
            // This means the jump will stay 0 for at least one tick.
            setTimeout(() => { 
                this.jumps++ 
            }, 20)
        }
    }

    #walk() {
        if (this.isStunned || this.isRespawning || this.isAttacking) return
        if (this.inputs.attack.pressed && Date.now() - this.inputs.attack.timestamp > this.heavyAttackTimer && this.isOnGround) {
            this.velocity = {
                x: 0,
                y: 0
            }
            return
        }

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
            const slowdown = this.item ? this.item.weight / 2 : 0
            this.velocity.x = (this.speed.x * this.speedBoost - slowdown) / Math.pow(this.resistance, 0.75)
            this.isWalking = true
        } else {
            this.velocity.x = 0
        }

        // Invert the velocity if the player is moving left.
        if (this.direction === -1 && this.velocity.x > 0) {
            this.velocity.x *= -1
        }

        if (this.isDrunk) {
            this.velocity.x *= -1
        }
    }

    #die() {
        this.isDead = true
        this.deathTimestamp = Date.now()
        this.item = null
        this.health = this.maxHealth
        this.isAttacking = false
        this.isAttacked = false
        this.isStunned = false
        this.isOnWall = {
            right: false,
            left: false
        }
        
        if (this.powerup) {
            this.powerup.stop()
        } 
    }

    #handleStates() {
        // Reverse the player image depending on the direction it is facing.
        const direction = this.isDrunk ? this.direction * -1 : this.direction
        if (direction < 0) {
            this.isReversed = true
        } else {
            this.isReversed = false
        }

        // Update the state of the image, to fit the action the player is performing.
        if (this.isAttacking) {
            this.state = "attacking"
        } else if (this.jumps >= 1) {
            this.state = "jumping"
        } else if (this.isWalking && this.isOnGround) {
            this.state = "walking"
            this.isWalking = false
        } else {
            this.state = "idle"
        }

        this.imageSrc = `../media/images/characters/${this.character}-${this.team}-${this.state}.png`
    }

    #handleKnockback() {
        if (!this.isStunned || this.isAttacked) return

        // Set the horizontal velocity to 0, once a player lands after an attack.
        if (this.hasLanded) {
            this.velocity.x = 0
        }

        const direction = this.isDrunk ? this.direction * -1 : this.direction
        if (this.opponent && this.isAttacking) {
            if (this.opponent.hasLanded) {
                this.velocity.x = 0
            } else if (this.opponent.damage <= 500 * this.strengthBoost) {
                this.velocity = {
                    x: direction * (this.opponent.damage / 1000) * this.knockbackMultiplier.x,
                    y: 0
                }
            }
        }
    }

    #handleDamage() {
        if (!this.isAttacked) return

        if (!this.hasLanded) {
            this.isAttacked = false
            return
        }

        this.health -= this.damageMultiplier * this.damage / 1000
        this.comboLength++

        if (this.comboLength < this.maxComboLength) {
            this.velocity = {
                x: this.knockbackDirection * (this.damage / 1000) * this.knockbackMultiplier.x,
                y: (this.damage / 1000) * this.knockbackMultiplier.y
            }
        } else {
            this.item = null
            this.pickupCooldown = true

            setTimeout(() => {
                this.pickupCooldown = false
                this.canAttack = true
            }, 500)

            this.comboLength = 0
            this.maxComboLength = Math.floor(Math.random() * 5 + 5)
            this.velocity = {
                x: 1.5 * this.knockbackDirection * this.knockbackMultiplier.x,
                y: 1.5 * this.knockbackMultiplier.y
            }
        }

        this.knockbackDirection = 0
        this.isStunned = true
        this.hasLanded = false

        const comboLength = this.comboLength
        setTimeout(() => {
            if (comboLength === this.comboLength) {
                this.isStunned = false
                this.isAttacked = false
                this.comboLength = 0
            }
        }, this.attackCooldown * 2)
    }

    #handleDeaths() {
        if (this.isDead || this.isRespawning) return

        // Kill the player if it is has no health.
        if (this.health <= 0) {
            this.#die()
            this.position.y = canvas.height * 1.2 + this.height // Otherwise player would still be at death location, and could be damaged by the other player.
        }
        
        // Kill the player if it falls into the void.
        const voidHeight = canvas.height * 1.2
        if (this.position.y > voidHeight) {
            this.#die()
        }
    }

    #handleItems() {
        if (this.isRespawning) return

        if (this.item) {
            // Throw the item
            if (this.inputs.attack.pressed && !this.isStunned) {
                this.pickupCooldown = true
                this.item.throw()
                this.item = null

                setTimeout(() => {
                    this.pickupCooldown = false
                    this.canAttack = true
                }, 500)
            }

            // Remove held item if the player dies.
            if (this.isDead) {
                this.item.remove()
                this.item = null
            }
        } else if (!this.pickupCooldown) {
            // Pick up an item.
            round.items.forEach(item => {
                if (this.collidesWith(item)) {
                    // Only pick up an item if no other player is holding it.
                    if (!item.player) {
                        item.player = this
                        this.item = item
                        this.canAttack = false // Players can"t attack when holding an item, only throw it.
                        return
                    }
                }
            })
        }
    }
}