import React from "react";
import {Camera, PerspectiveCamera, WebGLRenderer} from "three";
import {SceneManager} from "forkengine-core/src/SceneManager"
import {getMousePosition} from "../input/Mouse";
import { MouseEventHandler } from "forkengine-core/src/MouseEventHandler";
import {getMousePositionRelativeElement} from "../components/Scene";


export type RendererContextType = {
    renderer: ForkengineWebRenderer
}

export const RendererContext = React.createContext<RendererContextType | undefined>(undefined)


export class ForkengineWebRenderer {

    private webGLRenderer!: WebGLRenderer
    private canvas!: React.RefObject<HTMLCanvasElement>

    private scenes: {scene: SceneManager, element: React.RefObject<HTMLDivElement>}[] = []


    constructor() {

    }

    initialize(canvasRef: React.RefObject<HTMLCanvasElement>) {
        this.canvas = canvasRef

        if(!this.canvas.current)
            throw new Error("canvas undefined")

        this.webGLRenderer = new WebGLRenderer({
            canvas: this.canvas.current,
            antialias: true,
            alpha: true
        })
        this.webGLRenderer.setClearColor( 0xffffff, 1 );
        this.webGLRenderer.setPixelRatio( window.devicePixelRatio );

        this.step()
    }


    private updateSize() {
        if(!this.canvas.current)
            throw new Error("canvas undefined")

        const width = this.canvas.current.clientWidth;
        const height = this.canvas.current.clientHeight;

        if ( this.canvas.current.width !== width || this.canvas.current.height !== height ) {

            this.webGLRenderer.setSize( width, height, false );

        }
    }

    private render() {
        if(!this.canvas.current)
            throw new Error("canvas undefined")

        this.updateSize();


        this.canvas.current.style.transform = `translateY(${window.scrollY}px)`;

        this.webGLRenderer.setClearColor( 0xffffff, 0.0);
        this.webGLRenderer.setScissorTest( false );
        this.webGLRenderer.clear();

        this.webGLRenderer.setClearColor( 0xe0e0e0 );
        this.webGLRenderer.setScissorTest( true );

        this.scenes.forEach(item => {
            if(!item.element.current) return;

            const camera = item.scene.getCamera()
            if(!camera) return;

            // get its position relative to the page's viewport
            const rect = item.element.current.getBoundingClientRect();

            // check if it's offscreen. If so skip it
            if ( rect.bottom < 0 || rect.top > this.webGLRenderer.domElement.clientHeight ||
                rect.right < 0 || rect.left > this.webGLRenderer.domElement.clientWidth ) {

                return; // it's off screen
            }

            const mouseHandler = item.scene.getMouseEventHandler()
            if(mouseHandler) {
                // @ts-ignore
                if(item.element.current["mouseover"]) {
                    this.renderMouseHandler(mouseHandler, camera, getMousePositionRelativeElement(item.element)!)
                } else {
                    mouseHandler.clear()
                }
            }

            // set the viewport
            const width = rect.right - rect.left;
            const height = rect.bottom - rect.top;
            const left = rect.left;
            const bottom = this.webGLRenderer.domElement.clientHeight - rect.bottom;

            this.webGLRenderer.setViewport( left, bottom, width, height );
            this.webGLRenderer.setScissor( left, bottom, width, height );

            this.webGLRenderer.render( item.scene.getActiveScene(), camera );
        } );
    }

    private step = () =>  {
        this.render()
        requestAnimationFrame(this.step)
    }


    addScene(scene: SceneManager, element: React.RefObject<HTMLDivElement>) {
        this.scenes.push({scene, element})
    }

    removeScene(scene: SceneManager) {
        this.scenes = this.scenes.filter(item => item.scene !== scene)
    }



    private renderMouseHandler(mouseHandler: MouseEventHandler, camera: Camera, mousePosition: {x: number, y: number}) {
        mouseHandler.render(this.webGLRenderer, camera, mousePosition)
    }

}