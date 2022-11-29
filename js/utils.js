function setCanvasSize({ resolution }) {
    canvas.width = resolution.x
    canvas.height = resolution.y

    // Get the div below the game canvas to match to the canvas width.
    const buttonMenu = document.getElementById("buttonMenu")
    buttonMenu.style.width = resolution.x + "px"
}