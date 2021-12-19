import React from "react";

type Position = {
    x: number,
    y: number
}

let currentPosition: Position = {x:0,y:0}

function handleMouseMove(event: MouseEvent) {
    currentPosition.x = event.x;
    currentPosition.y = event.y;
}

document.addEventListener("mousemove", handleMouseMove)



export function getMousePosition() {
    return {x: currentPosition.x, y: currentPosition.y}
}


export function handleRightClickEvent(event: React.MouseEvent<HTMLDivElement>, callback: (event: React.MouseEvent<HTMLDivElement>) => void): boolean {
    event.preventDefault();
    callback(event);
    return false;
}