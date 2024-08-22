import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"

export default function Modal({children, open, onClose, className = ''}){
    const modal = useRef()

    useEffect(() => {
        const dialog = modal.current

        if(open){
            dialog.showModal()
        }

        return () => dialog.close()
    }, [open])

    return createPortal(
        <dialog ref={modal} className={`${className} modal`} onClose={onClose} >
            {children}
        </dialog>,
        document.querySelector("#modal")
    )
}