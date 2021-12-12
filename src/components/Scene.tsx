import { DimensionsType } from "forkengine-core/src/IOAdapter";
import { SceneManager } from "forkengine-core/src/SceneManager";
import React, {ElementRef, RefObject, useRef} from "react";
import {useContext, useEffect} from "react";
import { BehaviorSubject, Observable, Subject } from "rx";
import {RendererContext} from "../renderer/Renderer";
import useResizeAware from 'react-resize-aware';
import {getMousePosition} from "../input/Mouse";
import { Vector2D } from "forkengine-core/src/util/Vector";


import "../styles/SceneView.scss"



export function SceneView(props: {sceneManager: SceneManager}) {
    const context = useContext(RendererContext)
    const elementRef = useRef<HTMLDivElement>(null)

    if(!context) return <div>error, invalid context provided</div>

    const [resizeListener, sizes] =  useResizeAware()

    const dimensions = new BehaviorSubject<DimensionsType>({width: sizes.width? sizes.width : 1, height: sizes.height? sizes.height: 1})
    const mousePosition = new BehaviorSubject<Vector2D | null>(null)
    const click = new Subject<Vector2D>()

    useEffect(() => {
        if(!elementRef.current) return;

        const io = props.sceneManager.getIOAdapter();
        io.setDimensions(dimensions)
        io.setMousePosition(mousePosition)
        io.setClick(click)

        context.renderer.addScene(props.sceneManager, elementRef)
        return () => {
            context.renderer.removeScene(props.sceneManager)
        }
    }, [context, props.sceneManager, elementRef, dimensions, mousePosition, click])
    useEffect(() => {
        dimensions.onNext({width: sizes.width? sizes.width : 1, height: sizes.height? sizes.height: 1})
    }, [sizes.width, sizes.height, dimensions])

    return <div ref={elementRef}
                className={"scene-view"}
                onMouseMove={() => onMouseMove(elementRef, mousePosition)}
                onMouseOut={() => onMouseOut(mousePosition)}
                onClick={(event) => onClick(event, elementRef, click)}>
        {resizeListener}
    </div>
}


function onMouseMove(elementRef: RefObject<HTMLDivElement>, mousePosition: BehaviorSubject<Vector2D | null>) {
    if(!elementRef.current) return;

    const mousePosRaw = getMousePosition()

    mousePosition.onNext(getPositionRelativeToElement(new Vector2D(mousePosRaw.x, mousePosRaw.y), elementRef, true));
}

function onClick(event: React.MouseEvent<HTMLDivElement>, elementRef: RefObject<HTMLDivElement>, click: Subject<Vector2D>) {
    if(!elementRef.current) return;

    const clickPos = getPositionRelativeToElement(new Vector2D(event.pageX, event.pageY), elementRef, true);

    // WTF???
    if(!clickPos) return;

    click.onNext(clickPos)
}

function onMouseOut(mousePosition: BehaviorSubject<Vector2D | null>) {
    mousePosition.onNext(null)
}

export function getPositionRelativeToElement(position: Vector2D, element: React.RefObject<HTMLDivElement>, checkBounds: boolean = true): Vector2D | null {
    if(!element.current) return null

    const rect = element.current.getBoundingClientRect();
    const mousePosition = getMousePosition()
    mousePosition.x -= rect.left
    mousePosition.y -= rect.top

    if(checkBounds) {
        if( mousePosition.x > rect.width ||
            mousePosition.y > rect.height) return null
    }

    return new Vector2D(mousePosition.x, mousePosition.y)
}