import React, {useContext} from "react";
import "../styles/MainCanvas.scss"
import {RendererContext} from "../renderer/Renderer";

export function MainCanvas(props: {canvasRef: React.RefObject<HTMLCanvasElement>}) {
    return <canvas ref={props.canvasRef} className={"forkengine-canvas"}/>
}