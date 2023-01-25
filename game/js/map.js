class Map extends Sprite {

    constructor({ 
        name, 
        position1, 
        position2, 
        platforms
    }) {
        super({ 
            width: canvas.width, 
            height: canvas.height, 
            position: { 
                x: 0,
                y: 0
            }, 
            imageSrc: `./../media/images/maps/${name}.png` 
        })

        this.name = name
        this.position1 = position1
        this.position2 = position2
        this.platforms = platforms
    }

    draw(context) {
        super.draw(context)

        this.platforms.forEach(platform => {
            platform.draw(context)
        })
    }

}