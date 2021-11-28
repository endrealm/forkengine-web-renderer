type Position = {
    x: number,
    y: number
}

let currentPosition: Position = {x:0,y:0}

function handleMouseMove(event: MouseEvent) {
    currentPosition.x = event.x;
    currentPosition.y = event.y;
}

document.onmousemove = handleMouseMove



export function getMousePosition() {
    return {x: currentPosition.x, y: currentPosition.y}
}