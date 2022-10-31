import { createContext, useState } from 'react'

export const ContextApi = createContext()

export const DataProvider = ({ children }) => {

    const [regEmail, setRegEmail] = useState('')
    const [productsData, setProductsData] = useState()
    const [cartData, setCartData] = useState()
    const [cartLength, setCartLength] = useState()
    const [wishlistLength, setWishlistLength] = useState()
    const [finalPayment, setFinalPayment] = useState(0)

    return (
        <ContextApi.Provider
            value={{
                regEmail,
                setRegEmail,
                productsData,
                setProductsData,
                cartData,
                setCartData,
                cartLength,
                setCartLength,
                finalPayment,
                setFinalPayment,
                wishlistLength,
                setWishlistLength,
            }}
        >
            {children}
        </ContextApi.Provider>
    )
}
