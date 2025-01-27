import {useState, useEffect} from 'react'
import client from '../../api/client'

export const usePriceList = () => {
    const [priceList, setPriceList] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchPriceList = async () => {
        try {
            setLoading(true)
            const response = await client.get('/prices')
            
            // Muudab andmed õigesse formaati
            const uniqueLocations = new Set()
            response.data.legs.forEach(leg => {
                uniqueLocations.add(leg.routeInfo.from.name)
                uniqueLocations.add(leg.routeInfo.to.name)
            })

            setPriceList({
                id: response.data.id,
                validUntil: response.data.validUntil,
                locations: Array.from(uniqueLocations).map(name => ({
                    name: name
                })),
                legs: response.data.legs
            })
            
            setError(null)
        } catch (err) {
            console.error('API Error:', err)
            setError('Failed to fetch price list: ' + err.message)
        } finally {
            setLoading(false)
        }
    }

    // Käivitab funktsiooni, kui komponent laaditakse
    useEffect(() => {
        fetchPriceList()
    }, [])

    return {
        priceList,
        loading,
        error,
        refetch: fetchPriceList
    }
}

export default usePriceList