import { Box, Button, Image, Text } from '@chakra-ui/react'
import axios from 'axios'
import React, { useContext, useEffect } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Api } from '../Config/Api'
import { ContextApi } from '../ContextApi'

const OrderSummary = () => {

    const [addressData, setAddressData] = useState()
    const [cartItemsData, setCartItemsData] = useState()

    const navigate = useNavigate()
    const context = useContext(ContextApi)

    // --------------- fetch address by user id ------------------
    const fetchAddressByUserId = async () => {
        try {
            let { data } = await axios.get(`${Api.url}/address`, {
                headers: {
                    Authorization: `${localStorage.getItem("menzee_authToken")}`,
                },
            })
            setAddressData(data)
        } catch (error) {
            console.log(error);
        }
    }

    // --------------- fetch cart details by user id ------------------
    const fetchCartItemsByUserId = async () => {
        try {
            let { data } = await axios.get(`${Api.url}/cart/cartitems`, {
                headers: {
                    Authorization: `${localStorage.getItem("menzee_authToken")}`,
                },
            })
            setCartItemsData(data)
            context.setCartData(data)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchAddressByUserId()
        fetchCartItemsByUserId()
    }, [])


    return (
        <Box display='flex'
            gap={{ base: 0, md: 5 }}
            flexDir='column'
            // alignItems='center'
            // justifyContent='center'
            h='85vh'
            w={{ base: "90vw", md: 'auto' }}
            overflowY='auto'
            bg='white'
            boxShadow='rgba(0, 0, 0, 0.24) 0px 3px 8px'
            position='relative'
        >
            <Box w='100%'
                bg='#ff914d'
                textAlign='center'
                py={2}
                position="sticky"
                top={0}
                left={0}
                zIndex={100}>
                <Text fontSize='2xl'>ORDER SUMMARY</Text>
            </Box>
            <Box px={{ base: 3, md: 10 }} py={5}>
                {/* ----------- delivery Address summary ---------- */}
                <Box bg='white'
                    boxShadow='rgba(0, 0, 0, 0.24) 0px 3px 8px'>
                    <Box w='100%'
                        bg='#d3d3d3'
                        textAlign='center'
                        py={2} px={5}
                        display='flex'
                        flexDir={{ base: 'column', sm: 'row' }}
                        gap={{ base: 3, md: 0 }}
                        alignItems='center'
                        justifyContent='space-between'>
                        <Text fontWeight='bold'>Delivery Address</Text>
                        <Button as={Link} to="/dashboard/updateaddress/:updateaddress"
                            bg="#ff914d"
                            size='xs'
                            borderRadius='3px'
                            _hover={{ bg: '#ff914d' }}>change address</Button>
                    </Box>
                    <Box
                        display='flex'
                        flexDir='column'
                        gap={1}
                        px={10} py={4}
                    >
                        <Text>{addressData?.name}</Text>
                        <Text><span>{addressData?.house_no}</span>, <span>{addressData?.street_name}</span>,</Text>
                        <Text><span>{addressData?.city}</span>, <span>{addressData?.state}</span>, <span>{addressData?.pincode}</span></Text>
                        <Text>{addressData?.landmark}</Text>
                        <Text><span>{addressData?.mob_no}</span>, <span>{addressData?.alter_mob_no}</span></Text>
                    </Box>
                </Box>
                {/* ----------- cart items summary ---------- */}
                <Box bg='white'
                    display='flex'
                    flexDir='column'
                    gap={2}
                    py={5} mt={2}
                    overflowY='auto'
                    boxShadow='rgba(0, 0, 0, 0.24) 0px 3px 8px'
                >
                    {
                        cartItemsData?.map((item) => {
                            return (
                                <Box bg='#e9e9e9'
                                    display='flex'
                                    gap={{ base: 0, md: 10 }}
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
                                    </Box>
                                </Box>
                            )
                        })
                    }
                </Box>
                <Box bg='white'
                    boxShadow='rgba(0, 0, 0, 0.24) 0px 3px 8px'
                    mt={2} px={7} py={3}
                    display="flex"
                    flexDir={{ base: "column-reverse", sm: 'row' }}
                    gap={{ base: 3, md: 0 }}
                    alignItems="center"
                    justifyContent='space-between'>
                    <Button bg="#ff914d"
                        borderRadius='3px'
                        _hover={{ bg: '#ff914d' }}
                        onClick={() => navigate('/dashboard/payment/:payment')}>CONTINUE</Button>
                    <Text fontWeight='bold' fontSize='2xl'>Total: {context.finalPayment}</Text>
                </Box>
            </Box>
        </Box>
    )
}

export default OrderSummary