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
        this.uses = uses
        this.timer = timer
    }

    use(speedBoost, strengthBoost, isDrunk) {
        console.log("using powerup")
    }
}