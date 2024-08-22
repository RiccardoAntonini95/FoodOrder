import { useCallback, useEffect, useState } from "react";

async function sendHttpRequest(url, config){

    const response = await fetch(url, config)
    const resData = await response.json()

    if(!response.ok){
        throw new Error(
            resData.message || "Something went wrong with the request"
        );      
    }

    return resData
}

export default function useHttp(url, config, initialData){
    const [error, setError] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [data, setData] = useState(initialData)

    function clearData(){
        console.log("sono clear data")
        setData(initialData)
        console.log(initialData)
    }
    
    const sendRequest = useCallback(async function sendRequest(data){ // per il checkout component mi serve passare il body della request 
        setIsLoading(true)
        try {
            const resData = await sendHttpRequest(url, {...config, body: data})
            setData(resData)
        } catch (error) {
            setError(error.message || "Something went wrong")
        }
        setIsLoading(false)
    }, [url, config]) //se una delle due cambia ci serve una nuova funzione
    
    //invoco la funzione ma aggiungendola all'array di dipendenze dato che viene definita fuori, dovrò anche usare useCallback per evitare loop infiniti
    //perchè aggiornando gli state rieseguo useHttp e creo un nuovo oggetto sendRequest 
    useEffect(() => {
        if(!config || (config.method === "GET" || !config.method)){
            sendRequest();
        }
    }, [sendRequest, config])

    //esposti per essere utilizzati quando chiamo l'hook useHttp nei componenti
    return{
        data,
        isLoading,
        error,
        sendRequest, //esponendola posso far si che i component che usano questo hook possano chiamarla quando necessario, ad esempio al submit del form checkout
        clearData
    }
}