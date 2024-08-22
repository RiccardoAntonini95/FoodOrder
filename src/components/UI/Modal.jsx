import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"

export default function Modal({children, open, className = ''}){
    const modal = useRef()

    useEffect(() => {
        if(open){
            modal.current.showModal()
        } else{
            modal.current.close()
        }
    }, [open])

    return createPortal(
        <dialog ref={modal} className={`${className} modal`}>
            {children}
        </dialog>,
        document.querySelector("#modal")
    )
}