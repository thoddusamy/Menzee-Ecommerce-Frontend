import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, Image, Text } from '@chakra-ui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Api } from '../Config/Api'

const MyOrders = () => {

    const [cashOrdersData, setCashOrdersData] = useState()
    const [paidOrdersData, setPaidOrdersData] = useState()

    const fetchAllorders = async () => {
        try {
            let { data } = await axios.get(`${Api.url}/orders/getorders`, {
                headers: {
                    Authorization: `${localStorage.getItem("menzee_authToken")}`,
                },
            })
            // console.log(data);
            setCashOrdersData(data.cashOrder)
            setPaidOrdersData(data.paidOrder)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchAllorders()
    }, [])

    return (
        <Box display='flex'
            flexDir='column'
            alignItems='center'
            justifyContent='flex-start'
            bg="white"
            h='85vh'
            w={{ base: '95vw', md: "85vw" }}
            overflowY='auto'>
            <Box w="100%">
                <Accordion allowMultiple>
                    {/* ------ cash orders ------- */}
                    <AccordionItem>
                        <h2>
                            <AccordionButton bg='#ff914d' _hover={{ bg: '#ff914d' }} >
                                <Box flex='1' textAlign='left'>
                                    <Text fontSize='2xl'>Cash on delivery Orders</Text>
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                            {
                                cashOrdersData?.length !== 0 ? <Box>
                                    {
                                        cashOrdersData?.map((orders) => {
                                            return (
                                                <Accordion allowMultiple>
                                                    <AccordionItem>
                                                        <h2>
                                                            <AccordionButton _expanded={{ bg: '#ff914d' }}>
                                                                <Box flex='1' textAlign='left'>
                                                                    Order ID : {orders._id}
                                                                </Box>
                                                                <AccordionIcon />
                                                            </AccordionButton>
                                                        </h2>
                                                        <AccordionPanel>
                                                            {
                                                                orders?.items.map((item) => {
                                                                    return (
                                                                        <>
                                                                            <Box bg='#e9e9e9'
                                                                                display='flex'
                                                                                flexDir={{ base: "column", sm: 'row', md: "row" }}
                                                                                alignItems='flex-start'
                                                                                px={{ base: 1, md: 7 }}
                                                                                py={2} key={item._id}
                                                                            >
                                                                                <Box display='flex'
                                                                                    flexDir={{ base: "column", sm: 'row', md: "row" }}
                                                                                    alignItems={{ base: 'flex-start', md: 'flex-start' }}
                                                                                    justifyContent='center'
                                                                                    w='60%'
                                                                                    gap={{ base: 2, md: 5 }}
                                                                                >
                                                                                    <Box>
                                                                                        <Image w='125px' h="125px" src={item.prod_img_url1} />
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
                                                                                        <Text fontSize='18px'>₹{item.prod_price}</Text>
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
                                                                                        flexDir='column'
                                                                                        gap={{ base: 1, md: 5 }}
                                                                                        mt={{ base: 3, sm: 0, md: 0 }}
                                                                                    >
                                                                                        <Text fontSize='17px'>Quantity</Text>
                                                                                        <Text fontSize={{ base: '17px', md: '20px' }}>x {item.quantity}</Text>
                                                                                    </Box>
                                                                                    <Box display='flex'
                                                                                        alignItems='center'
                                                                                        flexDir='column'
                                                                                        gap={{ base: 1, md: 5 }}
                                                                                        mt={{ base: 3, sm: 0, md: 0 }}
                                                                                    >
                                                                                        <Text fontSize='17px'>Size</Text>
                                                                                        <Text fontSize={{ base: '17px', md: '20px' }}
                                                                                            whiteSpace="wrap">{item.prod_sizes}</Text>
                                                                                    </Box>
                                                                                    <Box display='flex'
                                                                                        alignItems='center'
                                                                                        flexDir='column'
                                                                                        gap={{ base: 1, md: 5 }}
                                                                                        mt={{ base: 3, sm: 0, md: 0 }}
                                                                                    >
                                                                                        <Text fontSize='17px'>Amount</Text>
                                                                                        <Text fontSize={{ base: '17px', md: '20px' }}>₹{item.quantity * item.prod_price}</Text>
                                                                                    </Box>
                                                                                </Box>
                                                                            </Box>

                                                                        </>
                                                                    )
                                                                })
                                                            }
                                                            <Accordion allowMultiple>
                                                                <AccordionItem>
                                                                    <h2>
                                                                        <AccordionButton _expanded={{ bg: '#fcd9d9' }}>
                                                                            <Box flex='1' textAlign='left'>
                                                                                Other Details
                                                                            </Box>
                                                                            <AccordionIcon />
                                                                        </AccordionButton>
                                                                    </h2>
                                                                    <AccordionPanel pb={4}>
                                                                        {
                                                                            orders.address.map((adrs) => {
                                                                                return (
                                                                                    <Box display='flex'
                                                                                        flexDir={{ base: 'column', md: "row" }}
                                                                                        alignItems='flex-start'
                                                                                        gap={10}>
                                                                                        <Box>
                                                                                            <Text textDecoration='underline'>Total Amount</Text>
                                                                                            <Text>{orders.total_amount}</Text>
                                                                                        </Box>
                                                                                        <Box>
                                                                                            <Text textDecoration='underline'>Pay Mode</Text>
                                                                                            <Text>Cash on Delivery</Text>
                                                                                        </Box>
                                                                                        <Box>
                                                                                            <Text textDecoration='underline'>Paid</Text>
                                                                                            <Text>{orders.payment_done ? "Yes" : "No"}</Text>
                                                                                        </Box>
                                                                                        <Box>
                                                                                            <Text textDecoration='underline'>Delivery Address</Text>
                                                                                            <p>{adrs.name}</p>
                                                                                            <p>{adrs.house_no}, {adrs.street_name},</p>
                                                                                            <p>{adrs.city}, {adrs.state}, {adrs.pincode}</p>
                                                                                            <p>{adrs.country}</p>
                                                                                            <p>{adrs.landmark}</p>
                                                                                            <p>{adrs.mob_no}, {adrs.alter_mob_no}</p>
                                                                                        </Box>
                                                                                    </Box>
                                                                                )
                                                                            })
                                                                        }
                                                                    </AccordionPanel>
                                                                </AccordionItem>
                                                            </Accordion>
                                                        </AccordionPanel>
                                                    </AccordionItem>
                                                </Accordion>
                                            )
                                        })
                                    }
                                </Box> : <Box display='flex'
                                    alignItems='center'
                                    justifyContent='center'>
                                    <Text>No Orders Found</Text>
                                </Box>
                            }
                        </AccordionPanel>
                    </AccordionItem>
                    {/* ------- paid orders -------- */}
                    <AccordionItem>
                        <h2>
                            <AccordionButton bg='#ff914d' _hover={{ bg: '#ff914d' }} >
                                <Box flex='1' textAlign='left'>
                                    <Text fontSize='2xl'>Paid Orders</Text>
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                            {
                                paidOrdersData?.length !== 0 ? <Box>
                                    {
                                        paidOrdersData?.map((orders) => {
                                            return (
                                                <Accordion allowMultiple>
                                                    <AccordionItem>
                                                        <h2>
                                                            <AccordionButton _expanded={{ bg: '#ff914d' }}>
                                                                <Box flex='1' textAlign='left'>
                                                                    Order ID : {orders._id}
                                                                </Box>
                                                                <AccordionIcon />
                                                            </AccordionButton>
                                                        </h2>
                                                        <AccordionPanel>
                                                            {
                                                                orders?.items.map((item) => {
                                                                    return (
                                                                        <>
                                                                            <Box bg='#e9e9e9'
                                                                                display='flex'
                                                                                flexDir={{ base: "column", sm: 'row', md: "row" }}
                                                                                alignItems='flex-start'
                                                                                px={{ base: 1, md: 7 }}
                                                                                py={2} key={item._id}
                                                                            >
                                                                                <Box display='flex'
                                                                                    flexDir={{ base: "column", sm: 'row', md: "row" }}
                                                                                    alignItems={{ base: 'flex-start', md: 'flex-start' }}
                                                                                    justifyContent='center'
                                                                                    w='60%'
                                                                                    gap={{ base: 2, md: 5 }}
                                                                                >
                                                                                    <Box>
                                                                                        <Image w='125px' h="125px" src={item.prod_img_url1} />
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
                                                                                        <Text fontSize='18px'>₹{item.prod_price}</Text>
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
                                                                                        flexDir='column'
                                                                                        gap={{ base: 1, md: 5 }}
                                                                                        mt={{ base: 3, sm: 0, md: 0 }}
                                                                                    >
                                                                                        <Text fontSize='17px'>Quantity</Text>
                                                                                        <Text fontSize={{ base: '17px', md: '20px' }}>x {item.quantity}</Text>
                                                                                    </Box>
                                                                                    <Box display='flex'
                                                                                        alignItems='center'
                                                                                        flexDir='column'
                                                                                        gap={{ base: 1, md: 5 }}
                                                                                        mt={{ base: 3, sm: 0, md: 0 }}
                                                                                    >
                                                                                        <Text fontSize='17px'>Size</Text>
                                                                                        <Text fontSize={{ base: '17px', md: '20px' }}
                                                                                            whiteSpace="wrap">{item.prod_sizes}</Text>
                                                                                    </Box>
                                                                                    <Box display='flex'
                                                                                        alignItems='center'
                                                                                        flexDir='column'
                                                                                        gap={{ base: 1, md: 5 }}
                                                                                        mt={{ base: 3, sm: 0, md: 0 }}
                                                                                    >
                                                                                        <Text fontSize='17px'>Amount</Text>
                                                                                        <Text fontSize={{ base: '17px', md: '20px' }}>₹{item.quantity * item.prod_price}</Text>
                                                                                    </Box>
                                                                                </Box>
                                                                            </Box>

                                                                        </>
                                                                    )
                                                                })
                                                            }
                                                            <Accordion allowMultiple>
                                                                <AccordionItem>
                                                                    <h2>
                                                                        <AccordionButton _expanded={{ bg: '#fcd9d9' }}>
                                                                            <Box flex='1' textAlign='left'>
                                                                                Other Details
                                                                            </Box>
                                                                            <AccordionIcon />
                                                                        </AccordionButton>
                                                                    </h2>
                                                                    <AccordionPanel pb={4}>
                                                                        {
                                                                            orders.address.map((adrs) => {
                                                                                return (
                                                                                    <Box display='flex'
                                                                                        flexDir={{ base: 'column', md: "row" }}
                                                                                        alignItems='flex-start'
                                                                                        gap={10}>
                                                                                        <Box>
                                                                                            <Text textDecoration='underline'>Total Amount</Text>
                                                                                            <Text>{orders.total_amount}</Text>
                                                                                        </Box>
                                                                                        <Box>
                                                                                            <Text textDecoration='underline'>Pay Mode</Text>
                                                                                            <Text>Online</Text>
                                                                                        </Box>
                                                                                        <Box>
                                                                                            <Text textDecoration='underline'>Paid</Text>
                                                                                            <Text>{orders.payment_done ? "Yes" : "No"}</Text>
                                                                                        </Box>
                                                                                        <Box>
                                                                                            <Text textDecoration='underline'>Payment ID</Text>
                                                                                            <Text>{orders.razorpay_payment_id}</Text>
                                                                                        </Box>
                                                                                        <Box>
                                                                                            <Text textDecoration='underline'>Delivery Address</Text>
                                                                                            <p>{adrs.name}</p>
                                                                                            <p>{adrs.house_no}, {adrs.street_name},</p>
                                                                                            <p>{adrs.city}, {adrs.state}, {adrs.pincode}</p>
                                                                                            <p>{adrs.country}</p>
                                                                                            <p>{adrs.landmark}</p>
                                                                                            <p>{adrs.mob_no}, {adrs.alter_mob_no}</p>
                                                                                        </Box>
                                                                                    </Box>
                                                                                )
                                                                            })
                                                                        }
                                                                    </AccordionPanel>
                                                                </AccordionItem>
                                                            </Accordion>
                                                        </AccordionPanel>
                                                    </AccordionItem>
                                                </Accordion>
                                            )
                                        })
                                    }
                                </Box> : <Box display='flex'
                                    alignItems='center'
                                    justifyContent='center'>
                                    <Text>No Orders Found</Text>
                                </Box>
                            }
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>
            </Box>
        </Box>
    )
}

export default MyOrders