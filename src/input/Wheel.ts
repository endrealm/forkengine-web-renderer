import {Subject} from "rx";

export type WheelEvent = {
    delta: number,
    absolute: number,

    cancelEvent: () => void
}



export const Wheel = new Subject<WheelEvent>()


document.addEventListener("wheel", event => {
    Wheel.onNext({
        delta: event.deltaY,
        absolute: event.y,

        cancelEvent: () => {
            event.preventDefault()
        }
    })
})