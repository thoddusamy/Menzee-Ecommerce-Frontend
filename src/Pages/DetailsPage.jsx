import React, { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { Api } from '../Config/Api'
import {
    Box,
    Button,
    Divider,
    Image,
    List,
    ListIcon,
    ListItem,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Select,
    Text,
    useToast,
} from '@chakra-ui/react'
import { MdCheckCircle } from 'react-icons/md'
import { BsSuitHeart } from 'react-icons/bs'
import { useFormik } from 'formik'
import { useContext } from 'react'
import { ContextApi } from '../ContextApi'

const DetailsPage = () => {

    const { id } = useParams()
    const toast = useToast()
    const navigate = useNavigate()
    const context = useContext(ContextApi)

    const [productDetail, setProductDetail] = useState()
    const [previewImg, setPreviewImg] = useState()
    const [getProdSize, setGetProdSize] = useState('')
    const [getProdQuantity, setGetProdQuantity] = useState('')
    const [cartData, setCartData] = useState()

    const fetchProductDataById = async () => {
        try {
            let { data } = await axios.get(`${Api.url}/products/getproduct/${id}`, {
                headers: {
                    Authorization: `${localStorage.getItem("menzee_authToken")}`,
                },
            })
            setProductDetail(data);
            setPreviewImg(data.prod_img_url1)
        } catch (error) {
            console.log(error);
        }
    }

    //--------------- fetch cart items data --------------------
    const fetchCartItems = async () => {
        try {
            let { data } = await axios.get(`${Api.url}/cart/cartitems`, {
                headers: {
                    Authorization: `${localStorage.getItem("menzee_authToken")}`,
                },
            })
            setCartData(data)
            context.setCartLength(data)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchProductDataById()
        fetchCartItems()
    }, [])

    //--------------- identify cart productId (vs) detail page productId ------------------ 
    const findCartProdId = cartData?.map((cartItem) => cartItem.productId)


    const formik = useFormik({
        initialValues: {
            prod_img_url1: '',
            prod_img_url2: '',
            prod_name: '',
            prod_style_no: '',
            prod_sizes: '',
            prod_price: '',
            quantity: '',
            prod_category: '',
            productId: ''
        },

        onSubmit: async (values) => {
            try {
                values.prod_img_url1 = productDetail.prod_img_url1
                values.prod_img_url2 = productDetail.prod_img_url2
                values.prod_name = productDetail.prod_name
                values.prod_style_no = productDetail.prod_style_no
                values.prod_price = productDetail.prod_price
                values.prod_sizes = +getProdSize
                values.quantity = +getProdQuantity
                values.prod_category = productDetail.prod_category
                values.productId = productDetail._id
                let { data } = await axios.post(`${Api.url}/cart`, values, {
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
                navigate('/dashboard/cart/:cart')
            } catch (error) {
                console.log(error);
                toast({
                    title: error.response.data.message,
                    status: 'error',
                    position: "bottom",
                    duration: 3500,
                    isClosable: true,
                })
            }
        }
    })

    return (
        productDetail && <Box display='flex'
            flexDir={{ base: "column", md: "row" }}
            alignItems={{ base: 'center', md: "flex-start" }}
            justifyContent='center'
            gap={12}
            mt={12}
        >
            {/* ----------- Image preview start ----------- */}
            <Box display='flex' alignItems='center'
                flexDir='column'
                justifyContent='center' gap={5}
            >
                <Box>
                    <Image w="439px" h="377px" border="3px solid #d3d3d3" src={previewImg} />
                </Box>
                <Box display='flex'
                    alignItems='center'
                    gap={5}
                >
                    <Box display='flex' alignItems='center'
                        flexDir='column'
                        justifyContent='center'>
                        <Image w="100px"
                            h="100px"
                            border="3px solid #d3d3d3"
                            src={productDetail.prod_img_url1}
                            cursor='pointer'
                            onClick={() => setPreviewImg(productDetail.prod_img_url1)} />
                        <Text fontWeight='bold' mt={1}>Front view</Text>
                    </Box>
                    <Box display='flex' alignItems='center'
                        flexDir='column'
                        justifyContent='center'>
                        <Image w="100px"
                            h="100px"
                            border="3px solid #d3d3d3"
                            src={productDetail.prod_img_url2}
                            cursor='pointer'
                            onClick={() => setPreviewImg(productDetail.prod_img_url2)} />
                        <Text fontWeight='bold' mt={1}>Back view</Text>
                    </Box>
                </Box>
            </Box>
            {/* ----------- Image preview end ----------- */}

            {/* ----------- Details start ----------- */}
            <form onSubmit={formik.handleSubmit}>
                <Box display='flex'
                    flexDir="column"
                    gap={3}
                >
                    <Text fontSize={{ base: "3xl", md: '4xl' }} textAlign={{ base: "center", md: "start" }}>{productDetail.prod_name}</Text>
                    <Text fontSize='3xl' textAlign={{ base: "center", md: "start" }}>₹ {productDetail.prod_price}</Text>
                    <Divider />
                    <Text textAlign={{ base: "center", md: "start" }}>Style No: {productDetail.prod_style_no}</Text>
                    <Text textAlign={{ base: "center", md: "start" }} fontSize='18px'>Available sizes</Text>
                    <Box alignSelf={{ base: "center", md: "self-start" }} display='flex' gap={4}>
                        {
                            productDetail.prod_sizes.map((size) => {
                                return (
                                    <List key={size}>
                                        <ListItem display='flex' alignItems='center'>
                                            <ListIcon as={MdCheckCircle} color='green.500' />
                                            {size}
                                        </ListItem>
                                    </List>
                                )
                            })
                        }
                    </Box>
                    <Divider />
                    <Box mt={2} display='flex'
                        flexDir="column"
                        alignItems={{ base: "center", md: "flex-start" }}
                        justifyContent='center'
                    >
                        <Text textAlign={{ base: "center", md: "start" }} mb={1}>Select Size</Text>
                        <Select placeholder='---- select size ----' isRequired w={{ base: "80vw", md: "100%" }}
                            onChange={(e) => setGetProdSize(e.target.value)}>
                            {
                                productDetail.prod_sizes.map((size) => {
                                    return <option key={size} value={size}>{size}</option>
                                })
                            }
                        </Select>
                    </Box>
                    <Box>
                        <Text textAlign={{ base: "center", md: "start" }} mb={1}>Quantity</Text>
                        <Box display='flex'
                            flexDir={{ base: 'column', md: 'row' }}
                            alignItems={{ base: 'center', md: 'flex-start' }}
                            gap={5}
                        >
                            <NumberInput min={1} max={50} w="100px" isRequired
                                onChange={(e) => setGetProdQuantity(e)}>
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                            <Button mb={{ base: 5, md: 0 }}
                                isDisabled={findCartProdId?.includes(id)}
                                type='submit' borderRadius={0}
                                _hover={{ bg: "#ff914d" }}
                                bg='#ff914d'
                                px={10}
                                color="white"
                                w={{ base: "80vw", md: 'auto' }}>ADD TO BAG</Button>
                        </Box>
                    </Box>
                </Box>
            </form>
            {/* ----------- Details start ----------- */}
        </Box >
    )
}

export default DetailsPage