class Cart extends Sprite {

    constructor({ width, height, position, player }) {
        super({ width: width, height: height, position: position, imageSrc: `./../media/images/miscellaneous/cart-${player.team}.png` })

        this.width = width
        this.height = height
        this.position = position
        this.player = player
    }

}