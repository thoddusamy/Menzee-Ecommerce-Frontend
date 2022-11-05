import { Box, Image, Text, Tooltip, useToast } from '@chakra-ui/react'
import React, { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BsSuitHeart, BsBagPlus, BsSuitHeartFill } from 'react-icons/bs'
import axios from 'axios'
import { Api } from '../Config/Api'
import { ContextApi } from '../ContextApi'

const Tracks = () => {

    const context = useContext(ContextApi)
    const toast = useToast()
    const [wishlistItems, setWishlistItems] = useState()

    const fetchProductsData = async () => {
        let { data } = await axios.get(`${Api.url}/products/getproducts`, {
            headers: {
                Authorization: `${localStorage.getItem("menzee_authToken")}`,
            },
        })
        context.setProductsData(data)
    }

    // --------------- fetch wishlist items ------------------
    const fetchWishlistItems = async () => {
        try {
            let { data } = await axios.get(`${Api.url}/wishlist/getwishlistitems`, {
                headers: {
                    Authorization: `${localStorage.getItem("menzee_authToken")}`,
                },
            })
            setWishlistItems(data);
            context.setWishlistLength(data)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchProductsData()
        fetchWishlistItems()
    }, [])

    // -------------- split productId from wishlist items ------------
    const splitProdId = wishlistItems?.map((wishlist) => wishlist.productId)


    // --------------- Add & Remove Wishlist -----------------
    const handleAddAndRemoveWishlist = async (id) => {
        try {
            if (splitProdId.includes(id)) {
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
            } else {
                let { data } = await axios.post(`${Api.url}/wishlist/add`, { id }, {
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
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        context.productsData && <Box
            display='grid'
            gridTemplateColumns={{ base: "auto", xl: "auto auto auto auto", lg: "auto auto auto", md: "auto auto" }}
            gridColumnGap="35px"
            gridRowGap="25px"
        >
            {
                context.productsData?.map((track) => {
                    return (
                        track.prod_category === "tracks" ? <Box w='auto'
                            maxW='250px'
                            h='auto'
                            maxH='350px'
                            bg='#fcf6f2'
                            boxShadow="rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px"
                            cursor='pointer'
                            key={track._id}>
                            <Box>
                                <Link to={`/dashboard/details/${track._id}`}>
                                    <Image w='250px' h='250px' src={track.prod_img_url1} />
                                </Link>
                                <Box display='flex'
                                    alignItems='center'
                                    justifyContent='center'
                                    overflow='hidden'
                                    w='auto'
                                    maxW='250px'
                                    px={5}
                                    pt={3}
                                >
                                    <Text overflow='hidden'
                                        textOverflow='ellipsis'
                                        whiteSpace='nowrap'
                                        fontWeight='bold'
                                        fontSize='17px'>{track.prod_name}</Text>
                                </Box>
                                <Box display='flex'
                                    alignItems='center'
                                    justifyContent='space-between'
                                    px={6}
                                >
                                    <Text fontWeight='bold'
                                        fontSize='22px'
                                        py={4}
                                    >₹ {track.prod_price}</Text>
                                    <Box display='flex'
                                        alignItems='center'
                                        justifyContent='center'
                                        gap='20px'
                                    >
                                        <Tooltip hasArrow
                                            label={splitProdId?.includes(track._id) ? "Added" : "Add to wishlist"}
                                            mt={2}>
                                            <Box onClick={() => handleAddAndRemoveWishlist(track._id)}>
                                                {
                                                    splitProdId?.includes(track._id) ? <BsSuitHeartFill
                                                        color={"red"}
                                                        fontSize='20px' style={{ marginTop: "3px" }} /> :
                                                        <BsSuitHeart fontSize='20px' style={{ marginTop: "3px" }} />
                                                }

                                            </Box>
                                        </Tooltip>
                                    </Box>
                                </Box>
                            </Box>
                        </Box> : <></>
                    )
                })
            }
        </Box>
    )
}

export default Tracks