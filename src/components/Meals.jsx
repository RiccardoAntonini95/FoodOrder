import Error from "./Error.jsx";
import MealItem from "./MealItem";
import useHttp from "../hooks/useHttp.js";

const requestConfig = {} //per evitare il loop infinito 

export default function Meals() {
  //destrutturo ciò che mi ritorna il custom hook
  const {
    data: mealsData, //assegno un alias per far continuare a funzionare il codice sottostante
    isLoading,
    error,
  } = useHttp("http://localhost:3000/meals", requestConfig, []); //config come secondo parametro non necessario in quanto richiesta GET

  if(isLoading){
    return <p className="center">Fetching meals..</p>
  }

  if(error){
    return <Error title="Failed to fetch meals" message={error} /> //nel custom hook se c'è un errore è settato sullo state error
  }

  return (
    <ul id="meals">
      {isLoading ? (
        <p>Fetching data...</p>
      ) : (
        mealsData.map((meal) => <MealItem key={meal.id} meal={meal} />)
      )}
    </ul>
  );
}
