class Beer extends Powerup {
	constructor({
		width = 10,
		height = 10,
		position,
		name,
		worth,
		weight,
		fragility,
		timer
	}) {
		super({ width: width, height: height, position: position, name: name, worth: worth, weight: weight, fragility: fragility, timer: timer })
	}

	use() {
		super.use()
		this.player.isDrunk = true
		this.player.drunkResistance = 0.5
	}

	stop() {
		super.stop()
		this.player.isDrunk = false
		this.player.drunkResistance = 1
	}
}