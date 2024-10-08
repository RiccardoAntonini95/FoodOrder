import { useContext } from "react";
import Error from "./Error.jsx"
import Modal from "./UI/Modal.jsx";
import Input from "./UI/Input.jsx";
import Button from "./UI/Button.jsx";
import CartContext from "../store/CartContext.jsx";
import UserProgressContext from "../store/UserProgressContext.jsx";
import { currencyFormatter } from "../util/formatting";
import useHttp from "../hooks/useHttp.js";

export default function Checkout() {
  const cartCtx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);
  const requestConfig = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };


  const {
    data,
    error,
    isLoading: isSending,
    sendRequest,
    clearData
  } = useHttp("http://localhost:3000/orders", requestConfig, []);

  const cartTotal = cartCtx.items.reduce(
    (totalPrice, item) => totalPrice + item.quantity * item.price,
    0
  );

  function handleCloseCheckout() {
    userProgressCtx.hideCheckout();
  }

  function handleFinish(){
    userProgressCtx.hideCheckout()
    cartCtx.clearCart()
    clearData()
  }

  function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    //evitiamo onChange e useState per non avere re-render ad ogni keystroke non necessari
    const customerData = Object.fromEntries(formData.entries()); //crea un oggetto JS con chiave-valore usando name {full-name: valore, email: valore, }

    sendRequest(
      JSON.stringify({
        order: {
          items: cartCtx.items,
          customer: customerData,
        },
      })
    );
  }

  let actions = (
    <>
      <Button type="button" textOnly onClick={handleCloseCheckout}>
        Close
      </Button>
      <Button>Submit Order</Button>
    </>
  );

  if(isSending){
    actions = <span>Sending order data...</span>
  }

  if(data.length !== 0 && !error){
    return <Modal open={userProgressCtx.progress === "checkout"} onClose={handleCloseCheckout}>
        <h2>Success!</h2>
        <p>Your order was submitted successfully.</p>
        <p className="modal-actions">
            <Button onClick={handleFinish}>Okay</Button>
        </p>
    </Modal>
  }

  return (
    <Modal
      open={userProgressCtx.progress === "checkout"}
      onClose={handleCloseCheckout}
    >
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

        {error && <Error title="Failed to submit order" message={error} />}

        <p className="modal-actions">
            {actions}
        </p>
      </form>
    </Modal>
  );
}
