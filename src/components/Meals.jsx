import { useEffect, useState } from "react"

export default function Meals(){
    const [isLoading, setIsLoading] = useState(true)
    const [mealsData, setMealsData] = useState([])

    useEffect(() => {
        async function fetchMeals() {
            try {
                setIsLoading(true)
                const response = await fetch("http://localhost:3000/meals")
                if(!response.ok){
                    throw new Error("Network response was not ok")
                }
                const meals = await response.json()
                console.log(meals , "dati arrivati")
                setIsLoading(false) 
                setMealsData(meals)
                
            } catch (error) {
                console.error(error)
            }
        }
        fetchMeals()
    }, [])

    return(
        <ul id="meals">
            {isLoading ? <p>Fetching data...</p> : mealsData.map((meal) => (
                <li key={meal.id}>{meal.name}</li>
            ))}
        </ul>
    )
}