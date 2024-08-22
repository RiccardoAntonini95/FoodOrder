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

    return(
        <Modal open={userProgressCtx.progress === "checkout"} onClose={handleCloseCheckout} >
            <form>
                <h2>Checkout</h2>
                <p>Total Amount:{currencyFormatter.format(cartTotal)} </p>
                <Input type="text" label="Full name" id="full-time" required />
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