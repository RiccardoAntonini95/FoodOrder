import { act, createContext, useContext, useReducer } from "react";

export const CartContext = createContext({
  items: [],
  addItem: (item) => {},
  removeItem: (id) => {},
});

function cartReducer(state, action) {
  if (action.type === "ADD_ITEM") {
    //controllo che non esista già nell'array items dello state il prodotto che voglio aggiungere, così cambio solo la quantità se c'è
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.item.id
    );
    const updatedItems = [...state.items];

    if (existingCartItemIndex > -1) {
      //perchè findIndex ritorna -1 se non trova l'item
      const existingItem = state.items[existingCartItemIndex];
      //aggiorno la quantità dell'oggetto in questione
      const updatedItem = {
        ...existingItem, //modificando l'oggetto all'indice giusto
        quantity: existingItem.quantity + 1, //con la proprietà quantity
      };
      //sovrascrivo nell'array i nuovi dati all'indice trovato
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      updatedItems.push({ ...action.item, quantity: 1 }); //se aggiungo un nuovo oggetto devo assicurarmi che abbia la proprietà quantity per non generare errori
    }
    //il reducer ritorna il precedente state sovrascrivendolo coi nuovi dati
    return { ...state, items: updatedItems };
  }
  if (action.type === "REMOVE_ITEM") {
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.id
    );
    const existingCartItem = state.items[existingCartItemIndex];
    const updatedItems = [...state.items];

    if (existingCartItem.quantity === 1) {
      //rimuovo con splice, partendo dall'index e togliendo un elemento
      updatedItems.splice(existingCartItemIndex, 1);
    } else {
      const updatedItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity - 1,
      };
      updatedItems[existingCartItemIndex] = updatedItem
    }
    return {...state, items: updatedItems}
  }

  return state;
}

export function CartContextProvider({ children }) {
  const [cartState, dispatchCartAction ] = useReducer(cartReducer, { items: [] });
  
  function addItem(item){
      dispatchCartAction({type: 'ADD_ITEM', item}) //scrivendo solo item qui ho scritto item: item
    }
    
    function removeItem(id){
        dispatchCartAction({type: 'REMOVE_ITEM', id}) //javascript shortcut id: id
    }
    
    const cartContext = {
      items: cartState.items,
      addItem, //addItem: addItem
      removeItem //same
    }

    console.log(cartContext)

  return <CartContext.Provider value={cartContext}>{children}</CartContext.Provider>;
}

export default CartContext;
