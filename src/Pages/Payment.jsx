import { Box, Button, Text, useToast } from '@chakra-ui/react'
import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Api } from '../Config/Api'
import { ContextApi } from '../ContextApi'
import BrandLogo from '../assets/brand_logo2.png'

const Payment = () => {

    const context = useContext(ContextApi)
    const navigate = useNavigate()
    const toast = useToast()

    const [payMode, setPayMode] = useState('')
    const [userAddress, setUserAddress] = useState()

    // console.log(context.cartData);

    // --------------- fetch user Address ---------------------

    const fetchUserAddress = async (res, req) => {
        try {
            let { data } = await axios.get(`${Api.url}/address`, {
                headers: {
                    Authorization: `${localStorage.getItem("menzee_authToken")}`,
                },
            })
            setUserAddress(data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchUserAddress()
    }, [])

    // ---------- handle payment ---------------
    const handlePaymentOption = async () => {
        if (payMode === "cash") {
            try {
                let orderValues = {
                    items: context.cartData,
                    total_amount: context.finalPayment,
                    payment_mode: "cash on delivery",
                    payment_done: false,
                    address: [userAddress]
                }
                let { data } = await axios.post(`${Api.url}/orders/orderbyuserid`, orderValues, {
                    headers: {
                        Authorization: `${localStorage.getItem("menzee_authToken")}`,
                    },
                })
                if (data.orderSuccess === true) {
                    navigate('/dashboard/orderplaced/:orderplaced')
                } else if (data.orderSuccess === false) {
                    toast({
                        title: data.message,
                        status: 'error',
                        position: "top-right",
                        duration: 3500,
                        isClosable: true,
                    })
                }
            } catch (error) {
                console.log(error);
                toast({
                    title: error.response.data.message,
                    status: 'error',
                    position: "top-right",
                    duration: 3500,
                    isClosable: true,
                })
            }
        } else if (payMode === "online") {
            try {
                let { data: { key } } = await axios.get(`${Api.url}/payment/getkeyid`, {
                    headers: {
                        Authorization: `${localStorage.getItem("menzee_authToken")}`,
                    },
                })

                const { data: { order } } = await axios.post(`${Api.url}/payment/checkout`, { amount: context.finalPayment },
                    {
                        headers: {
                            Authorization: `${localStorage.getItem("menzee_authToken")}`,
                        },
                    })

                const options = {
                    key,
                    amount: order.amount,
                    currency: "INR",
                    name: "MenZee Retail",
                    description: "Test Transaction",
                    image: BrandLogo,
                    order_id: order.id,
                    handler: async (response) => {
                        let orderValues = {
                            items: context.cartData,
                            total_amount: context.finalPayment,
                            payment_mode: "online",
                            payment_done: true,
                            address: [userAddress],
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                        }
                        let { data } = await axios.post(`${Api.url}/payment/verifypayment`, orderValues, {
                            headers: {
                                Authorization: `${localStorage.getItem("menzee_authToken")}`,
                            },
                        })
                        if (data.orderSuccess === true) {
                            navigate('/dashboard/orderplaced/:orderplaced')
                        } else if (data.orderSuccess === false) {
                            toast({
                                title: data.message,
                                status: 'error',
                                position: "top-right",
                                duration: 3500,
                                isClosable: true,
                            })
                        }
                    },
                    prefill: {
                        name: "Test user",
                        email: "testuser@example.com",
                        contact: "9999999999"
                    },
                    notes: {
                        "address": "Razorpay Corporate Office"
                    },
                    theme: {
                        "color": "#ff914d"
                    }
                };
                var razorPopup = new window.Razorpay(options);
                razorPopup.open();

            } catch (error) {
                console.log(error);
            }
        }
    }

    return (
        <Box display='flex'
            alignItems='center'
            justifyContent='center'
            h='85vh'
        >
            <Box display='flex'
                alignItems='center'
                flexDir='column'
                justifyContent='center'
                bg="white"
                boxShadow='rgba(0, 0, 0, 0.24) 0px 3px 8px'
                w={{ base: '90vw', md: 'auto' }}>
                <Box bg='#ff914d'
                    w='100%'
                    textAlign='center'
                    py={2} mb={5}>
                    <Text fontSize='3xl'>Payment type</Text>
                </Box>
                <Box px={{ base: '40px', md: "70px" }}
                    display='flex'
                    gap={5}
                    flexDir='column'
                    alignItems='center'
                    justifyContent='center'
                >
                    <Box display='flex'
                        gap={5}
                        alignItems='center'
                        fontSize='20px'>
                        <input type="radio" name='payment_option' id='online'
                            onChange={(e) => setPayMode(e.target.value)}
                            value='online' />
                        <label htmlFor="online">Online Payment</label>
                    </Box>
                    <Box display='flex'
                        gap={5}
                        alignItems='center'
                        fontSize='20px'>
                        <input type="radio" name='payment_option' id='cashOnDelivery'
                            onChange={(e) => setPayMode(e.target.value)}
                            value='cash' />
                        <label htmlFor="cashOnDelivery">Cash on delivery</label>
                    </Box>
                    <Box mb={5} mt={3}>
                        <Button type='submit'
                            bg='#ff914d'
                            _hover={{ bg: '#ff914d' }}
                            borderRadius="3px"
                            onClick={handlePaymentOption}>
                            CONTINUE
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default Payment