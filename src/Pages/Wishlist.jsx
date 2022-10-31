import { Box, Image, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useState } from 'react'
import { useContext } from 'react';
import { useEffect } from 'react';
import { BsSuitHeartFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { Api } from '../Config/Api';
import { ContextApi } from '../ContextApi';

const Wishlist = () => {

    const [wishlistData, setWishlistData] = useState()
    const toast = useToast()
    const context = useContext(ContextApi)

    const fetchWishlistItems = async () => {
        try {
            let { data } = await axios.get(`${Api.url}/wishlist/getwishlistitems`, {
                headers: {
                    Authorization: `${localStorage.getItem("menzee_authToken")}`,
                },
            })
            setWishlistData(data);
            context.setWishlistLength(data)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchWishlistItems()
    }, [])

    // ----------------- remove from wishlist -----------------
    const handleRemoveFromWishlist = async (id) => {
        try {
            let { data } = await axios.delete(`${Api.url}/wishlist/remove/${id}`, {
                headers: {
                    Authorization: `${localStorage.getItem("menzee_authToken")}`,
                },
            })
            toast({
                title: data.message,
                status: 'success',
                position: "bottom",
                duration: 3500,
                isClosable: true,
            })
            fetchWishlistItems()
        } catch (error) {
            console.log(error);
        }
    }

    return (
        wishlistData?.length !== 0 ? <Box
            display='grid'
            gridTemplateColumns={{
                base: "auto",
                sm: "auto auto",
                xl: "auto auto auto auto auto auto",
                lg: "auto auto auto auto",
                md: "auto auto auto"
            }}
            gridColumnGap="35px"
            gridRowGap="25px"
        >
            {
                wishlistData?.map((wishItem) => {
                    return (
                        wishItem?.items.map((W_listItem) => {
                            return (
                                <Box w='auto'
                                    maxW='250px'
                                    h='auto'
                                    maxH='250px'
                                    bg='#ff914d'
                                    boxShadow="rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px"
                                    cursor='pointer'
                                    key={W_listItem._id}
                                >
                                    <Box>
                                        <Link to={`/dashboard/details/${W_listItem._id}`}>
                                            <Image w='150px' h='150px' src={W_listItem.prod_img_url1} />
                                        </Link>
                                        <Box display='flex'
                                            alignItems='center'
                                            justifyContent='center'
                                            overflow='hidden'
                                            w='auto'
                                            maxW='150px'
                                            px={5}
                                            pt={3}
                                        >
                                            <Text overflow='hidden'
                                                textOverflow='ellipsis'
                                                whiteSpace='nowrap'
                                                fontWeight='bold'
                                                fontSize='17px'>{W_listItem.prod_name}</Text>
                                        </Box>
                                        <Box display='flex'
                                            alignItems='center'
                                            justifyContent='space-between'
                                            px={6}
                                        >
                                            <Text fontWeight='bold'
                                                fontSize='22px'
                                                py={4}
                                            >₹ {W_listItem.prod_price}</Text>
                                            <Box display='flex'
                                                alignItems='center'
                                                justifyContent='center'
                                                gap='20px'
                                            >
                                                <Box
                                                    onClick={() => handleRemoveFromWishlist(wishItem.productId)}>
                                                    <BsSuitHeartFill color='red' fontSize='20px' style={{ marginTop: "3px" }} />
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            )
                        })
                    )
                })
            }
        </Box> : <Box display='flex'
            alignItems='center'
            justifyContent='center'
            h='80vh'
        >
            <Box display='flex'
                flexDir='column'
                alignItems='center'
            >
                <Text fontSize={{ base: '3xl', md: '4xl' }}>No Wishlist Found !</Text>
            </Box>
        </Box>
    )
}

export default Wishlist