import Modal from "./UI/Modal.jsx"
import Input from "./UI/Input.jsx"
import Button from "./UI/Button.jsx"
import CartContext from "../store/CartContext.jsx"
import UserProgressContext from "../store/UserProgressContext.jsx"
import { currencyFormatter } from "../util/formatting"
import { useContext } from "react"

export default function Checkout(){
    const cartCtx = useContext(CartContext)
    const userProgressCtx = useContext(UserProgressContext)
    const cartTotal = cartCtx.items.reduce((totalPrice, item) => totalPrice + item.quantity * item.price, 0)

    function handleCloseCheckout(){
        userProgressCtx.hideCheckout();
    }

    function handleSubmit(event){
        event.preventDefault()

        const formData = new FormData(event.target)
        //evitiamo onChange e useState per non avere re-render ad ogni keystroke non necessari
        const customerData = Object.fromEntries(formData.entries()) //crea un oggetto JS con chiave-valore usando name {full-name: valore, email: valore, }

        fetch("http://localhost:3000/orders", {
            method:'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                order: {
                    items: cartCtx.items,
                    customer: customerData
                }
            })
        })
    }

    return(
        <Modal open={userProgressCtx.progress === "checkout"} onClose={handleCloseCheckout} >
            <form onSubmit={(e) => handleSubmit(e)}>
                <h2>Checkout</h2>
                <p>Total Amount:{currencyFormatter.format(cartTotal)} </p>
                <Input type="text" label="Full name" id="name" required />
                <Input type="email" label="E-mail" id="email" required />
                <Input type="text" label="Street" id="street" required />
                <div className="control-row">
                    <Input type="text" label="Postal Code" id="postal-code" required />
                    <Input type="text" label="City" id="city" required />
                </div>

                <p className="modal-actions">
                    <Button type="button" textOnly onClick={handleCloseCheckout}>Close</Button>
                    <Button>Submit Order</Button>
                </p>
            </form>
        </Modal>
    )
}