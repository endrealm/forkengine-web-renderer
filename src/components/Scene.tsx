import { SceneManager } from "modules/core/src/SceneManager";
import React, {useRef} from "react";
import {useContext, useEffect} from "react";
import {RendererContext} from "../renderer/Renderer";

export function Scene(props: {sceneManager: SceneManager}) {
    const context = useContext(RendererContext)
    const elementRef = useRef<HTMLDivElement>(null)

    if(!context) return <div>error, invalid context provided</div>

    useEffect(() => {
        context.renderer.addScene(props.sceneManager, elementRef)

        return () => {
            context.renderer.removeScene(props.sceneManager)
        }
    }, [context, props.sceneManager, elementRef])

    return <div ref={elementRef} />
}