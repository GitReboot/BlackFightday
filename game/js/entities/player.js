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
            imageSrc: `../media/images/characters/${character}-${team}.png` 
        })

        this.team = team
        this.character = character
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
        this.isDrunk = false
        this.health = 250
        this.maxHealth = 250
        this.jumps = 0
        this.resistance = 1
        this.slowdown = 0.01
        this.knockback = 4
        this.item = null
        this.attackCooldown = 300
        this.pickupCooldown = false
        this.jumpCooldown = 500
        this.jumpTimestamp = 0
        this.direction = direction
        this.attackRange = width
        this.isAttacked = false
        this.isAttacking = false
        this.isStunned = false
        this.comboCount = 0
        this.maxComboCount = Math.floor(Math.random() * 5 + 5)
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
     * Update the player's properties.
     */

    update() {
        this.#jump()
        this.#walk()
        this.#handleDeaths()
        this.#handleItems()

        if (this.isDead && !this.isRespawning) {
            this.respawn()
        }
        
        if (!this.isAttacked && this.isStunned && this.isOnGround) {
            this.velocity.x = 0
        }

        super.update()
    }

    /**
     * Attempt to attack another player.
     */

    attack() {
        console.log(this.canAttack, this.isRespawning, this.isAttacking)
        if (!this.canAttack || this.isRespawning) return

        this.canAttack = false
        this.isAttacking = true

        const power = Date.now() - this.inputs.attack.timestamp
        const direction = this.direction
        const attackHitbox = {
            width: this.attackRange,
            height: this.height,
            position: {
                x: direction > 0 ? this.position.x + this.width : this.position.x - this.attackRange,
                y: this.position.y
            }
        }

        let attackIsSuccessful = false
        let opponent

        round.players.forEach(player => {
            if (player.collidesWith(attackHitbox) && player.team !== this.team) {
                player.damage(direction, power)
                attackIsSuccessful = true
                opponent = player

                if (player.comboCount <= player.maxComboCount) {
                    setTimeout(() => {
                        this.velocity = {
                            x: direction * this.knockback * 1.5,
                            y: 0
                        }
                        player.isAttacked = false
                    }, 50)
                }
            }
        })

        setTimeout(() => {
            if (attackIsSuccessful) {
                this.velocity = {
                    x: 0,
                    y: 0
                }
            }
        }, 180)

        const comboCount = opponent ? opponent.comboCount : -1

        setTimeout(() => {
            this.canAttack = true
            setTimeout(() => {
                if (opponent && comboCount != opponent.comboCount) {
                    this.isAttacking = false
                }
            }, this.attackCooldown / 2)
        }, this.attackCooldown)
    }

    /**
     * Take damage and receive knockback from another player's attack.
     * 
     * @param {Integer} direction The direction the attacking player is facing.
     * @param {Integer} power The amount of ms the attack has been charged for.
     */

    damage(direction, power) {
        console.log("damaged", direction, power)

        const damage = power > 500 ? power : 500
        let health = this.health
        health -= damage * 44 / 1000

        if (health <= 0) {
            this.isDead = true
            this.deathTimestamp = Date.now()
            this.item = null
            this.position.y = canvas.height + this.height + 20
        } else {
            this.health = health
        }

        this.comboCount++
        this.isStunned = true
        this.isAttacked = true
        this.jumps++

        if (this.comboCount > this.maxComboCount) {
            this.comboCount = 0
            this.maxComboCount = Math.floor(Math.random() * 5 + 5)
            this.velocity = {
                x: direction * this.knockback * 2,
                y: this.knockback * 1.5
            }
        } else {
            this.velocity = {
                x: direction * this.knockback / 1.5,
                y: this.knockback
            }
        }

        const comboCount = this.comboCount

        setTimeout(() => {
            if (comboCount !== this.comboCount) return
            this.isStunned = false
            this.isAttacked = false
        }, this.attackCooldown * 2)
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
            // I chose for a delay of 20 ms, because it's over 16.67 ms, which is our tickrate.
            // This means the jump will stay 0 for at least one tick.
            setTimeout(() => { 
                this.jumps++ 
            }, 20)
        }
    }

    #walk() {
        if (this.isStunned || this.isRespawning || this.isAttacking) return

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
            this.velocity.x = (this.speed.x - slowdown) / Math.pow(this.resistance, 0.75)
        } else {
            this.velocity.x = 0
        }

        // Invert the velocity if the player is moving left.
        if (this.direction === -1 && this.velocity.x > 0) {
            this.velocity.x *= -1
        }
    }

    #handleDeaths() {
        if (this.isDead || this.isRespawning) return
        
        // Handle void deaths.
        const voidHeight = canvas.height * 1.2
        if (this.position.y > voidHeight) {
            this.isDead = true
            this.deathTimestamp = Date.now()
            this.item = null
        }
    }

    #handleItems() {
        if (this.isRespawning) return

        if (this.item) {
            // Throw the item
            if (this.inputs.attack.pressed) {
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
                        this.canAttack = false // Players can't attack when holding an item, only throw it.
                        return
                    }
                }
            })
        }
    }
}