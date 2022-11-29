function start() {
    window.requestAnimationFrame(start)
    background.draw()
    ctx.fillStyle = "#0c0c0c"
    
    player.update()
    enemy.update()

    console.log(player.imageSrc, enemy.imageSrc)
}