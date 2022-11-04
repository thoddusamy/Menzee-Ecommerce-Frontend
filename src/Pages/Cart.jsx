import { Box, Button, Divider, Image, Text, useToast } from '@chakra-ui/react'
import axios from 'axios'
import React, { useContext } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { Api } from '../Config/Api'
import Lottie from "lottie-react"
import EmptyCartLottie from '../assets/empty_cart.json'
import { MdDeleteForever } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { ContextApi } from '../ContextApi'

const Cart = () => {

    const [cartItems, setCartItems] = useState()
    const [totalAmount, setTotalAmount] = useState(0)
    const [itemsPrice, setItemsPrice] = useState(0)

    const toast = useToast()
    const navigate = useNavigate()
    const context = useContext(ContextApi)

    const fetchCartItems = async () => {
        try {
            let { data } = await axios.get(`${Api.url}/cart/cartitems`, {
                headers: {
                    Authorization: `${localStorage.getItem("menzee_authToken")}`,
                },
            })
            setCartItems(data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchCartItems()
    }, [])

    // ------------ Calculate Total amount ---------------
    const AddItemsPrice = cartItems?.map((item) => item.prod_price * item.quantity)

    const getItemsPrice = AddItemsPrice?.reduce((a, b) => a + b, 0)

    useEffect(() => {
        setItemsPrice(getItemsPrice)
        setTotalAmount(getItemsPrice > 499 ? getItemsPrice + 0 : getItemsPrice + 40)
    })

    // -------------- remove single cart item -------------------
    const handleRemoveSingleItem = async (id) => {
        try {
            let { data } = await axios.delete(`${Api.url}/cart/removeitem/${id}`, {
                headers: {
                    Authorization: `${localStorage.getItem("menzee_authToken")}`,
                },
            })
            toast({
                title: data.message,
                status: 'success',
                position: "bottom",
                duration: 2500,
                isClosable: true,
            })
            fetchCartItems()
        } catch (error) {
            console.log(error);
            toast({
                title: error.response.data.message,
                status: 'error',
                position: "bottom",
                duration: 2500,
                isClosable: true,
            })
        }
    }

    // ------------- set Final amount to context & navigate to address page  --------------
    const handleSetFinalAmount = (amount) => {
        context.setFinalPayment(amount)
        navigate('/dashboard/address/:address')
    }

    return (
        cartItems && cartItems.length !== 0 && cartItems ? <Box
            w='100vw'
            h={{ base: '100%', xl: '85vh', lg: '100%', md: '100%' }}
            mx={{ base: '20px', xl: '150px', lg: '80px', md: '20px' }}
            display='grid'
            gridTemplateColumns={{ base: 'auto', xl: '65% 33%', lg: 'auto', md: 'auto' }}
            gap='2%'
        >
            <Box bg='white'
                overflow='hidden'
                boxShadow='rgba(0, 0, 0, 0.16) 0px 1px 4px'
                borderRadius='3px'
                overflowY='auto'
                minH="180px"
                position='relative'
            >
                <Box textAlign='center'
                    bg='#ff914d'
                    py={2}
                    position='sticky'
                    top='0px'
                    left='0px'
                    zIndex={100}>
                    <Text fontSize='2xl'>CART ITEMS</Text>
                </Box>
                {/* -------- cart container --------- */}
                <Box
                    mt={2}
                    display='flex'
                    flexDir='column'
                    gap={2}
                >
                    {/* -------- cart item --------- */}
                    {
                        cartItems?.map((item) => {
                            return (
                                <Box bg='#e9e9e9'
                                    display='flex'
                                    flexDir={{ base: "column", sm: 'row', md: "row" }}
                                    alignItems='flex-start'
                                    px={7} py={2} key={item._id}
                                >
                                    <Box display='flex'
                                        flexDir={{ base: "column", sm: 'row', md: "row" }}
                                        alignItems={{ base: 'flex-start', md: 'flex-start' }}
                                        justifyContent='center'
                                        w='60%'
                                        gap={{ base: 2, md: 5 }}
                                    >
                                        <Box>
                                            <Image w='100px' h="100px" src={item.prod_img_url1} />
                                        </Box>
                                        <Box display='flex'
                                            flexDir='column'
                                            gap={2}
                                            overflow='hidden'
                                            w="300px"
                                        >
                                            <Text overflow='hidden'
                                                textOverflow='ellipsis'
                                                whiteSpace='nowrap'
                                                fontSize='20px'>{item.prod_name}</Text>
                                            <Text fontSize='18px'>₹{item.prod_price} - <span style={{ fontSize: '15px' }}>size: {item.prod_sizes}</span></Text>
                                            <Text fontSize='14px'>Seller: MenZee Retail</Text>
                                        </Box>
                                    </Box>
                                    <Box display='flex'
                                        flexDir={{ base: "row", sm: "column", lg: 'row', md: 'row' }}
                                        w='40%'
                                        alignItems={{ base: 'center', md: 'flex-start' }}
                                        justifyContent='space-between'
                                        gap={{ base: 4, md: 0 }}
                                    >
                                        <Box display='flex'
                                            alignItems='center'
                                            flexDir={{ base: 'row', md: 'column' }}
                                            gap={{ base: 1, md: 5 }}
                                            mt={{ base: 3, sm: 0, md: 0 }}
                                        >
                                            <Text fontSize='17px'>Quantity</Text>
                                            <Text fontSize={{ base: '17px', md: '20px' }}>{item.quantity}</Text>
                                        </Box>
                                        <Box display='flex'
                                            alignItems='center'
                                            flexDir={{ base: 'row', md: 'column' }}
                                            gap={{ base: 1, md: 5 }}
                                            mt={{ base: 3, sm: 0, md: 0 }}
                                        >
                                            <Text fontSize='17px'>Total</Text>
                                            <Text fontSize={{ base: '17px', md: '20px' }}>₹{item.quantity * item.prod_price}</Text>
                                        </Box>
                                        <Box display='flex'
                                            alignItems='center'
                                            flexDir='column'
                                            gap={5} mt={{ base: 3, sm: 0, md: 0 }}
                                        >
                                            <Button
                                                size='xs'
                                                bg="#ff914d"
                                                _hover={{ bg: "#ff914d" }}
                                                borderRadius='3px'
                                                onClick={() => handleRemoveSingleItem(item._id)}>
                                                <MdDeleteForever fontSize='18px' />
                                            </Button>
                                        </Box>
                                    </Box>
                                </Box>
                            )
                        })
                    }
                </Box>
            </Box>
            <Box bg='white'
                boxShadow='rgba(0, 0, 0, 0.16) 0px 1px 4px'
                borderRadius='3px'
                h='410px'
                overflow='auto'
                position='relative'
            >
                <Box textAlign='center'
                    bg='#ff914d'
                    py={2}
                    position='sticky'
                    top='0px'
                    left='0px'
                    zIndex={100}>
                    <Text fontSize='2xl'>PRICE DETAILS</Text>
                </Box>
                <Box my={5} mx={8}
                    display='flex'
                    flexDir='column'
                    gap={5}
                >
                    <Box display='flex'
                        alignItems='center'
                        justifyContent='space-between'
                        fontSize='18px'
                    >
                        <Text>Price ({cartItems.length} items)</Text>
                        <Text>₹ {itemsPrice}</Text>
                    </Box>
                    <Box display='flex'
                        alignItems='center'
                        justifyContent='space-between'
                        fontSize='18px'
                    >
                        <Text>Discount</Text>
                        <Text color='green'>NIL</Text>
                    </Box>
                    <Box display='flex'
                        alignItems='flex-start'
                        justifyContent='space-between'
                        fontSize='18px'
                    >
                        <Text>Delivery Charges <br />
                            <span style={{ fontSize: '13px' }}>*only apply for less than ₹500 orders</span>
                        </Text>
                        <Text color='green'>{totalAmount > 499 ? "FREE" : "₹ 40"}</Text>
                    </Box>
                </Box>
                <Divider />
                <Box my={5} mx={8}
                    display='flex'
                    alignItems='center'
                    justifyContent='space-between'
                    fontSize='22px'
                    fontWeight='bold'>
                    <Text>Total Amount</Text>
                    <Text>₹ {totalAmount}</Text>
                </Box>
                <Divider />
                <Box my={6} display='flex'
                    alignItems='center'
                    justifyContent='center'
                    w='100%'
                >
                    <Button size='lg' w='50%' borderRadius="3px"
                        bg='#ff914d'
                        _hover={{ bg: '#ff914d' }}
                        onClick={() => handleSetFinalAmount(totalAmount)}>Place Order</Button>
                </Box>
            </Box>
        </Box> : <Box
            display='flex'
            alignItems='center'
            flexDir='column'
        >
            <Box mt={{ base: 0, md: 5, lg: 5, xl: 10 }}>
                <Lottie style={{ height: "350px" }} animationData={EmptyCartLottie} loop={true} />
            </Box>
            <Box display='flex'
                flexDir='column'
                alignItems='center'
            >
                <Text fontSize={{ base: '3xl', md: '4xl' }}>Your Bag is Empty!</Text>
                <Button mt={3}
                    bg='#ff914d'
                    _hover={{ bg: '#ff914d' }}
                    onClick={() => navigate('/dashboard/tshirts/:tshirts')}
                >Shop Now</Button>
            </Box>
        </Box>
    )
}

export default Cart
