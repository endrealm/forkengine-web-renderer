import { DimensionsType } from "forkengine-core/src/Config";
import { SceneManager } from "forkengine-core/src/SceneManager";
import React, {useRef} from "react";
import {useContext, useEffect} from "react";
import { BehaviorSubject, Observable } from "rx";
import {RendererContext} from "../renderer/Renderer";
import useResizeAware from 'react-resize-aware';



import "../styles/SceneView.scss"
import {getMousePosition} from "../input/Mouse";

export function SceneView(props: {sceneManager: SceneManager}) {
    const context = useContext(RendererContext)
    const elementRef = useRef<HTMLDivElement>(null)

    if(!context) return <div>error, invalid context provided</div>

    const [resizeListener, sizes] =  useResizeAware()

    const dimensions = new BehaviorSubject<DimensionsType>({width: sizes.width? sizes.width : 1, height: sizes.height? sizes.height: 1})

    useEffect(() => {
        if(!elementRef.current) return;

        props.sceneManager.getConfig().setDimensions(dimensions)

        context.renderer.addScene(props.sceneManager, elementRef)
        return () => {
            context.renderer.removeScene(props.sceneManager)
        }
    }, [context, props.sceneManager, elementRef, dimensions])
    useEffect(() => {
        dimensions.onNext({width: sizes.width? sizes.width : 1, height: sizes.height? sizes.height: 1})
    }, [sizes.width, sizes.height, dimensions])

    return <div ref={elementRef}
                className={"scene-view"}
                onMouseOver={(event) => setOnMouseOver(true, elementRef, event)}
                onMouseOut={(event) => setOnMouseOver(false, elementRef,event)}>
        {resizeListener}
    </div>
}


function setOnMouseOver(isMouseOver: boolean, ref: React.RefObject<HTMLDivElement>, event: React.MouseEvent<HTMLDivElement>) {
    if(ref.current) {
        // @ts-ignore
        ref.current["mouseover"] = isMouseOver
    }
}

export function getMousePositionRelativeElement(element: React.RefObject<HTMLDivElement>): {x: number, y: number} | null {
    if(!element.current) return null

    const rect = element.current.getBoundingClientRect();
    const mousePosition = getMousePosition()
    mousePosition.x -= rect.left
    mousePosition.y -= rect.top
    return mousePosition
}