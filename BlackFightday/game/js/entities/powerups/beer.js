class Beer extends Powerup {
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
			isFragile: isFragile,
			timer: timer 
		})
	}

    /**
     * Consume the powerup and activate it.
     */

	use() {
		super.use()
		this.player.isDrunk = true
		this.player.drunkResistance = 0.5
	}

    /**
     * De-activate the powerup.
     */

	stop() {
		super.stop()
		this.player.isDrunk = false
		this.player.drunkResistance = 1
	}
}