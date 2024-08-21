import { useContext } from 'react';
import logo from '../assets/logo.jpg'
import Button from './UI/Button';
import CartContext from '../store/CartContext.jsx'

export default function Header() {
  const cartCtx = useContext(CartContext)
  //uso reduce invece di lenght per evitare che un prodotto con quantità 2 mi dia solo 1 nel carrello
  //reduce viene eseguita una sola volta per ogni item, partendo dal valore 0 e sommando la quantità al numero totale
  const totalCartItem = cartCtx.items.reduce((total, item) => {
    return total + item.quantity
  }, 0)


  return (
    <header id="main-header">
      <div id="title">
        <img src={logo} alt="App food logo" />
        <h1>Food Order Shop</h1>
      </div>
      <nav>
        <Button textOnly>Cart ({totalCartItem})</Button>
      </nav>
    </header>
  );
}
