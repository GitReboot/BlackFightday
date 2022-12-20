class Map {

    constructor({ name, position1, position2, background, platforms}) {
        this.name = name
        this.position1 = position1
        this.position2 = position2
        this.background = background
        this.platforms = platforms
    }

    draw() {
        const width = settings.resolution.x
        const height = settings.resolution.y

        const image = new Image(width, height)
        image.src = this.background

        ctx.drawImage(image, 0, 0, width, height)

        this.platforms.forEach(platform => {
            platform.draw()
        })
    }

}