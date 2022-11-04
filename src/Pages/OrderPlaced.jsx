import { Box, Button, Text } from '@chakra-ui/react'
import React from 'react'
import Lottie from 'lottie-react'
import OrderPlacedLottie from '../assets/order-placed.json'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import axios from 'axios'
import { Api } from '../Config/Api'

const OrderPlaced = () => {

    const removeAllCartItemsByUserId = async () => {
        try {
            let { data } = await axios.delete(`${Api.url}/cart/cleancart`, {
                headers: {
                    Authorization: `${localStorage.getItem("menzee_authToken")}`,
                },
            })
            console.log(data.message);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        removeAllCartItemsByUserId()
    }, [])

    return (
        <Box display='flex'
            flexDir='column'
            alignItems='center'
            justifyContent='center'
            h='85vh'>
            <Text textAlign='center' fontSize='5xl'>Order Placed</Text>
            <Lottie style={{ marginTop: "-80px" }} animationData={OrderPlacedLottie} loop={false}></Lottie>
            <Button as={Link} to='/dashboard/tshirts/:tshirts'
                bg='#ff914d'
                _hover={{ bg: "#ff914d" }}
            >Continue shopping</Button>
        </Box>
    )
}

export default OrderPlaced