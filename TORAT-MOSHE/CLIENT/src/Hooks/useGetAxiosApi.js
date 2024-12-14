import useAxios  from 'axios-hooks'
import { useEffect } from 'react'

 const useGetAxiosApi = (url) => {
    // const{data, louding, error, refetch} = useAxios(url)
    const [{ data, loading, error }, refetch] = useAxios(
        `http://localhost:8000/${url}`
    )

    useEffect(()=>{console.log("data in Axios",data);},[data]);
    useEffect(()=>{console.log("error in Axios", error)},[error])

    return {data, loading, error, refetch} //data, louding, - כל זמן שלא קיבל את הנתונים error, refetch - ע"מ להפעיל מחדש פונקציה לאחר שהיה שינוי בטבלה
}
export default useGetAxiosApi;